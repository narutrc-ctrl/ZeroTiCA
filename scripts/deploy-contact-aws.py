#!/usr/bin/env python3
"""Deploy ZeroTiCA contact inquiry Lambda + HTTP API (no CloudFront).

Requires AWS credentials (env, ~/.aws, or IAM role). Does not print SMTP secrets.

Usage:
  npm run build:contact-lambda
  python3 scripts/deploy-contact-aws.py

Optional env:
  AWS_REGION              default ap-northeast-2
  LAMBDA_FUNCTION_NAME    default zerotica-contact
  HTTP_API_NAME           default zerotica-contact-api
  LAMBDA_ENV_FILE         path to KEY=VALUE lines (gitignored), e.g. ~/.zerotica-contact-lambda.env

Flags:
  --skip-test             skip POST smoke test after deploy
  --send-test-mail        include a live SMTP test via API (sends one email)
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import zipfile
from pathlib import Path

try:
    import boto3
    from botocore.exceptions import ClientError
except ImportError:
    sys.stderr.write("boto3 required: pip install boto3\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
PACKAGE_DIR = ROOT / "dist-lambda" / "contact"
ZIP_PATH = ROOT / "dist-lambda" / "zerotica-contact.zip"

LAMBDA_ENV_KEYS = (
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USE_SSL",
    "EMAIL_USE_TLS",
    "EMAIL_HOST_USER",
    "EMAIL_HOST_PASSWORD",
    "DEFAULT_FROM_EMAIL",
    "CONTACT_INQUIRY_TO",
)

REQUIRED_LAMBDA_ENV = ("EMAIL_HOST_USER", "EMAIL_HOST_PASSWORD", "CONTACT_INQUIRY_TO")


def load_lambda_env() -> dict[str, str]:
    env: dict[str, str] = {}
    env_file = os.environ.get("LAMBDA_ENV_FILE")
    if env_file:
        path = Path(env_file).expanduser()
        if not path.is_file():
            raise SystemExit(f"LAMBDA_ENV_FILE not found: {path}")
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip()
    for key in LAMBDA_ENV_KEYS:
        if key in os.environ and os.environ[key]:
            env[key] = os.environ[key]
    missing = [k for k in REQUIRED_LAMBDA_ENV if not env.get(k)]
    if missing:
        raise SystemExit(
            "Missing Lambda SMTP env. Set LAMBDA_ENV_FILE or export: "
            + ", ".join(missing)
            + "\n(Do not commit credentials; use Console or a gitignored env file.)"
        )
    return {k: env[k] for k in LAMBDA_ENV_KEYS if k in env and env[k]}


def ensure_zip() -> Path:
    if not PACKAGE_DIR.is_dir():
        raise SystemExit("Run: npm run build:contact-lambda")
    required = [
        PACKAGE_DIR / "handler.mjs",
        PACKAGE_DIR / "_lib" / "sendMail.js",
        PACKAGE_DIR / "node_modules" / "nodemailer" / "package.json",
    ]
    for path in required:
        if not path.is_file():
            raise SystemExit(f"Missing packaged file: {path.relative_to(ROOT)}")

    ZIP_PATH.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in PACKAGE_DIR.rglob("*"):
            if file_path.is_file():
                zf.write(file_path, file_path.relative_to(PACKAGE_DIR).as_posix())
    return ZIP_PATH


def wait_lambda_active(client, name: str) -> None:
    for _ in range(60):
        resp = client.get_function(FunctionName=name)
        state = resp["Configuration"].get("State", "")
        if state == "Active":
            return
        if state == "Failed":
            reason = resp["Configuration"].get("StateReason", "unknown")
            raise SystemExit(f"Lambda {name} failed: {reason}")
        time.sleep(2)
    raise SystemExit(f"Lambda {name} did not become Active in time")


def get_or_create_role(iam):
    role_name = "zerotica-contact-lambda-role"
    try:
        role = iam.get_role(RoleName=role_name)["Role"]
        return role["Arn"]
    except ClientError as exc:
        if exc.response["Error"]["Code"] != "NoSuchEntity":
            raise

    assume = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole",
            }
        ],
    }
    role = iam.create_role(
        RoleName=role_name,
        AssumeRolePolicyDocument=json.dumps(assume),
        Description="ZeroTiCA contact inquiry Lambda (CloudWatch Logs only)",
    )["Role"]
    iam.attach_role_policy(
        RoleName=role_name,
        PolicyArn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    )
    time.sleep(10)
    return role["Arn"]


def upsert_lambda(client, role_arn: str, env_vars: dict[str, str]) -> str:
    name = os.environ.get("LAMBDA_FUNCTION_NAME", "zerotica-contact")
    zip_bytes = ensure_zip().read_bytes()
    config = {
        "FunctionName": name,
        "Runtime": "nodejs22.x",
        "Role": role_arn,
        "Handler": "handler.handler",
        "Architectures": ["arm64"],
        "Timeout": 20,
        "MemorySize": 256,
        "Environment": {"Variables": env_vars},
    }
    try:
        client.get_function(FunctionName=name)
        client.update_function_code(FunctionName=name, ZipFile=zip_bytes, Publish=True)
        wait_lambda_active(client, name)
        client.update_function_configuration(**config)
        wait_lambda_active(client, name)
        print(f"Updated Lambda: {name}")
    except ClientError as exc:
        if exc.response["Error"]["Code"] != "ResourceNotFoundException":
            raise
        client.create_function(Code={"ZipFile": zip_bytes}, **config)
        wait_lambda_active(client, name)
        print(f"Created Lambda: {name}")
    return name


def find_http_api(apigw, api_name: str) -> str | None:
    token = None
    while True:
        kwargs = {}
        if token:
            kwargs["NextToken"] = token
        resp = apigw.get_apis(**kwargs)
        for item in resp.get("Items", []):
            if item.get("Name") == api_name:
                return item["ApiId"]
        token = resp.get("NextToken")
        if not token:
            return None


def upsert_http_api(apigw, lambda_arn: str, fn_name: str, region: str) -> tuple[str, str]:
    api_name = os.environ.get("HTTP_API_NAME", "zerotica-contact-api")
    api_id = find_http_api(apigw, api_name)
    if not api_id:
        created = apigw.create_api(Name=api_name, ProtocolType="HTTP")
        api_id = created["ApiId"]
        print(f"Created HTTP API: {api_name} ({api_id})")
    else:
        print(f"Using existing HTTP API: {api_name} ({api_id})")

    integrations = apigw.get_integrations(ApiId=api_id).get("Items", [])
    integration_id = None
    for item in integrations:
        uri = item.get("IntegrationUri", "")
        if fn_name in uri:
            integration_id = item["IntegrationId"]
            break
    if not integration_id:
        created = apigw.create_integration(
            ApiId=api_id,
            IntegrationType="AWS_PROXY",
            IntegrationUri=lambda_arn,
            PayloadFormatVersion="2.0",
        )
        integration_id = created["IntegrationId"]
        print(f"Created Lambda integration: {integration_id}")

    route_key = "POST /api/contact"
    routes = apigw.get_routes(ApiId=api_id).get("Items", [])
    if not any(r.get("RouteKey") == route_key for r in routes):
        apigw.create_route(
            ApiId=api_id,
            RouteKey=route_key,
            Target=f"integrations/{integration_id}",
        )
        print(f"Created route: {route_key}")
    else:
        print(f"Route exists: {route_key}")

    account = boto3.client("sts").get_caller_identity()["Account"]
    source_arn = f"arn:aws:execute-api:{region}:{account}:{api_id}/*/*"
    lambda_client = boto3.client("lambda", region_name=region)
    try:
        lambda_client.add_permission(
            FunctionName=fn_name,
            StatementId=f"apigw-{api_id}",
            Action="lambda:InvokeFunction",
            Principal="apigateway.amazonaws.com",
            SourceArn=source_arn,
        )
        print("Added Lambda invoke permission for API Gateway")
    except ClientError as exc:
        if exc.response["Error"]["Code"] != "ResourceConflictException":
            raise

    invoke_url = f"https://{api_id}.execute-api.{region}.amazonaws.com/api/contact"
    return api_id, invoke_url


def smoke_tests(invoke_url: str, send_live: bool) -> None:
    import urllib.error
    import urllib.request

    def post(body: dict | str, expect: int, label: str) -> None:
        raw = body if isinstance(body, str) else json.dumps(body, ensure_ascii=False)
        req = urllib.request.Request(
            invoke_url,
            data=raw.encode("utf-8"),
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                status = resp.status
        except urllib.error.HTTPError as exc:
            status = exc.code
        if status != expect:
            raise SystemExit(f"{label}: expected HTTP {expect}, got {status}")
        print(f"  OK {label} → {status}")

    print("Validation smoke tests:")
    smoke_tests_payload = {
        "company": "테스트",
        "name": "테스트",
        "email": "not-an-email",
        "phone": "010-0000-0000",
        "message": "x",
        "privacyAgreed": True,
    }
    post({**smoke_tests_payload, "privacyAgreed": False}, 400, "privacyAgreed false")
    post({**smoke_tests_payload, "email": "bad"}, 400, "invalid email")
    post({**smoke_tests_payload, "message": ""}, 400, "message empty")
    post("{not-json", 400, "malformed JSON")

    if send_live:
        post(
            {
                "company": "테스트 회사",
                "name": "테스트 담당자",
                "email": "test@example.com",
                "phone": "010-0000-0000",
                "message": "API Gateway 운영 연결 테스트입니다.",
                "privacyAgreed": True,
            },
            200,
            "live POST (check CONTACT_INQUIRY_TO inbox)",
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Deploy contact Lambda + HTTP API")
    parser.add_argument("--skip-test", action="store_true")
    parser.add_argument("--send-test-mail", action="store_true")
    args = parser.parse_args()

    region = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "ap-northeast-2"
    session = boto3.Session(region_name=region)
    if not session.get_credentials():
        raise SystemExit(
            "No AWS credentials. Configure env vars, ~/.aws/credentials, or IAM role.\n"
            "Do not commit SMTP secrets; use LAMBDA_ENV_FILE with a gitignored file."
        )

    sts = session.client("sts")
    ident = sts.get_caller_identity()
    print(f"AWS account: {ident['Account']}")
    print(f"Region: {region}")

    env_vars = load_lambda_env()
    print("Lambda env keys set:", ", ".join(sorted(env_vars.keys())))

    iam = session.client("iam")
    role_arn = get_or_create_role(iam)

    lam = session.client("lambda")
    fn_name = upsert_lambda(lam, role_arn, env_vars)
    fn = lam.get_function(FunctionName=fn_name)
    lambda_arn = fn["Configuration"]["FunctionArn"]

    apigw = session.client("apigatewayv2")
    api_id, invoke_url = upsert_http_api(apigw, lambda_arn, fn_name, region)

    print("\n--- Deploy complete (CloudFront not modified) ---")
    print(f"Lambda: {fn_name}")
    print(f"HTTP API ID: {api_id}")
    print(f"POST URL: {invoke_url}")

    if not args.skip_test:
        smoke_tests(invoke_url, send_live=args.send_test_mail)


if __name__ == "__main__":
    main()
