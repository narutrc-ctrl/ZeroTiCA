#!/usr/bin/env python3
"""Deploy ZeroTiCA contact inquiry Lambda + wire existing HTTP API.

Infrastructure contract (customer account):
  - Amplify Hosting rewrite /api/contact → API Gateway (manual Console)
  - Existing HTTP API only (no CreateApi): fbuj6xkrab
  - Lambda: zerotica-contact (Node.js 22, nodemailer)
  - Role: zerotica-contact-lambda-role + PermissionsBoundary
  - SMTP secrets: SSM /zerotica-contact/* (not Lambda environment)

Does NOT:
  - Create a new API Gateway
  - Modify CloudFront / Amplify customRules
  - Put SMTP secrets in Lambda Environment
  - Attach IAM inline policies or VPC access role
  - Print secrets

Usage:
  npm run build:contact-lambda
  python3 scripts/deploy-contact-aws.py --dry-run
  python3 scripts/deploy-contact-aws.py

Flags:
  --dry-run               print plan only; no AWS API calls
  --skip-test             skip POST smoke test after deploy
  --send-test-mail        include a live SMTP test via API (sends one email)
  --test-email ADDRESS    email field for live/smoke payloads (no default secret)
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKAGE_DIR = ROOT / "dist-lambda" / "contact"
ZIP_PATH = ROOT / "dist-lambda" / "zerotica-contact.zip"

AWS_REGION = "ap-northeast-2"
ACCOUNT_HINT = "093816283595"

LAMBDA_FUNCTION_NAME = "zerotica-contact"
LAMBDA_ROLE_NAME = "zerotica-contact-lambda-role"
PERMISSIONS_BOUNDARY_ARN = (
    f"arn:aws:iam::{ACCOUNT_HINT}:policy/zerotica-contact-boundary"
)
BASIC_EXECUTION_POLICY_ARN = (
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
)

# Existing API — do not create a new one
HTTP_API_ID = "fbuj6xkrab"
HTTP_API_BASE = f"https://{HTTP_API_ID}.execute-api.{AWS_REGION}.amazonaws.com"
ROUTE_KEY = "POST /api/contact"
STAGE_NAME = "$default"
RESERVED_CONCURRENCY = 5

SSM_PARAM_PATHS = (
    "/zerotica-contact/smtp-host",
    "/zerotica-contact/smtp-user",
    "/zerotica-contact/smtp-password",
    "/zerotica-contact/mail-to",
)

# Never write these into Lambda Environment
FORBIDDEN_ENV_KEYS = frozenset(
    {
        "EMAIL_HOST_USER",
        "EMAIL_HOST_PASSWORD",
        "CONTACT_INQUIRY_TO",
        "EMAIL_HOST",
        "EMAIL_PORT",
        "EMAIL_USE_SSL",
        "EMAIL_USE_TLS",
        "DEFAULT_FROM_EMAIL",
    }
)


def ensure_zip() -> Path:
    if not PACKAGE_DIR.is_dir():
        raise SystemExit("Run: npm run build:contact-lambda")
    required = [
        PACKAGE_DIR / "handler.mjs",
        PACKAGE_DIR / "ssmMailConfig.mjs",
        PACKAGE_DIR / "_lib" / "sendMail.js",
        PACKAGE_DIR / "node_modules" / "nodemailer" / "package.json",
        PACKAGE_DIR / "node_modules" / "@aws-sdk" / "client-ssm" / "package.json",
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


def print_plan() -> None:
    print("=== deploy-contact-aws dry-run (no AWS calls) ===")
    print(f"Region:              {AWS_REGION}")
    print(f"Lambda:              {LAMBDA_FUNCTION_NAME}")
    print(f"Role:                {LAMBDA_ROLE_NAME}")
    print(f"PermissionsBoundary: {PERMISSIONS_BOUNDARY_ARN}")
    print(f"Managed policy:      AWSLambdaBasicExecutionRole only (no VPC)")
    print(f"HTTP API (existing): {HTTP_API_ID}")
    print(f"Route:               {ROUTE_KEY}")
    print(f"Stage:               {STAGE_NAME} (AutoDeploy=true)")
    print(f"Reserved concurrency:{RESERVED_CONCURRENCY} (best-effort)")
    print("SMTP:                SSM parameters (not Lambda env):")
    for name in SSM_PARAM_PATHS:
        print(f"  - {name}")
    print("Skipped: CreateApi, CloudFront, Amplify customRules, inline IAM")
    zip_path = ensure_zip()
    print(f"Package zip:         {zip_path} ({zip_path.stat().st_size} bytes)")
    print("=== dry-run complete ===")


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


def get_or_create_role(iam) -> str:
    try:
        role = iam.get_role(RoleName=LAMBDA_ROLE_NAME)["Role"]
        boundary = (role.get("PermissionsBoundary") or {}).get("PermissionsBoundaryArn")
        if boundary != PERMISSIONS_BOUNDARY_ARN:
            print(
                f"WARNING: existing role PermissionsBoundary={boundary!r}; "
                f"expected {PERMISSIONS_BOUNDARY_ARN}. Not modifying boundary "
                "(배포 단계에서 인프라 확인 필요)."
            )
        else:
            print(f"Using existing role: {LAMBDA_ROLE_NAME}")
        role_arn = role["Arn"]
    except Exception as exc:
        code = getattr(exc, "response", {}).get("Error", {}).get("Code", "")
        if code != "NoSuchEntity":
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
            RoleName=LAMBDA_ROLE_NAME,
            AssumeRolePolicyDocument=json.dumps(assume),
            Description="ZeroTiCA contact inquiry Lambda",
            PermissionsBoundary=PERMISSIONS_BOUNDARY_ARN,
        )["Role"]
        role_arn = role["Arn"]
        print(f"Created role: {LAMBDA_ROLE_NAME} (with PermissionsBoundary)")
        time.sleep(8)

    attached = iam.list_attached_role_policies(RoleName=LAMBDA_ROLE_NAME).get(
        "AttachedPolicies", []
    )
    if not any(p.get("PolicyArn") == BASIC_EXECUTION_POLICY_ARN for p in attached):
        iam.attach_role_policy(
            RoleName=LAMBDA_ROLE_NAME,
            PolicyArn=BASIC_EXECUTION_POLICY_ARN,
        )
        print("Attached AWSLambdaBasicExecutionRole")
        time.sleep(5)
    else:
        print("AWSLambdaBasicExecutionRole already attached")

    return role_arn


def sanitize_existing_env(existing: dict[str, str] | None) -> dict[str, str]:
    """Drop forbidden SMTP secrets; keep unrelated keys if any."""
    if not existing:
        return {}
    cleaned = {k: v for k, v in existing.items() if k not in FORBIDDEN_ENV_KEYS}
    removed = sorted(set(existing) - set(cleaned))
    if removed:
        print("Removing forbidden keys from Lambda Environment:", ", ".join(removed))
    return cleaned


def upsert_lambda(client, role_arn: str) -> str:
    name = LAMBDA_FUNCTION_NAME
    zip_bytes = ensure_zip().read_bytes()
    base_config = {
        "Runtime": "nodejs22.x",
        "Role": role_arn,
        "Handler": "handler.handler",
        "Architectures": ["arm64"],
        "Timeout": 20,
        "MemorySize": 256,
    }

    try:
        current = client.get_function(FunctionName=name)
        existing_env = (
            current["Configuration"].get("Environment", {}).get("Variables") or {}
        )
        env_vars = sanitize_existing_env(existing_env)
        client.update_function_code(FunctionName=name, ZipFile=zip_bytes, Publish=True)
        wait_lambda_active(client, name)
        update_kwargs = {
            "FunctionName": name,
            **base_config,
            "Environment": {"Variables": env_vars},
        }
        client.update_function_configuration(**update_kwargs)
        wait_lambda_active(client, name)
        print(f"Updated Lambda: {name} (SMTP secrets not written to Environment)")
    except Exception as exc:
        code = getattr(exc, "response", {}).get("Error", {}).get("Code", "")
        if code != "ResourceNotFoundException":
            raise
        client.create_function(
            FunctionName=name,
            Code={"ZipFile": zip_bytes},
            Environment={"Variables": {}},
            **base_config,
        )
        wait_lambda_active(client, name)
        print(f"Created Lambda: {name}")

    try:
        client.put_function_concurrency(
            FunctionName=name,
            ReservedConcurrentExecutions=RESERVED_CONCURRENCY,
        )
        print(f"Reserved concurrency set to {RESERVED_CONCURRENCY}")
    except Exception as exc:
        err = getattr(exc, "response", {}).get("Error", {})
        print(
            f"WARNING: could not set reserved concurrency "
            f"({err.get('Code', type(exc).__name__)}): 배포 단계에서 권한/쿼터 확인 필요"
        )

    return name


def ensure_http_api(apigw, lambda_arn: str, fn_name: str, region: str, account: str) -> str:
    try:
        api = apigw.get_api(ApiId=HTTP_API_ID)
    except Exception as exc:
        raise SystemExit(
            f"HTTP API {HTTP_API_ID} not found or inaccessible: {exc}. "
            "신규 API 생성은 허용되지 않습니다."
        ) from exc

    print(f"Using existing HTTP API: {api.get('Name', HTTP_API_ID)} ({HTTP_API_ID})")

    integrations = apigw.get_integrations(ApiId=HTTP_API_ID).get("Items", [])
    integration_id = None
    for item in integrations:
        uri = item.get("IntegrationUri", "")
        if fn_name in uri or lambda_arn == uri:
            integration_id = item["IntegrationId"]
            break
    if not integration_id:
        created = apigw.create_integration(
            ApiId=HTTP_API_ID,
            IntegrationType="AWS_PROXY",
            IntegrationUri=lambda_arn,
            PayloadFormatVersion="2.0",
        )
        integration_id = created["IntegrationId"]
        print(f"Created Lambda integration: {integration_id}")
    else:
        print(f"Integration exists: {integration_id}")

    routes = apigw.get_routes(ApiId=HTTP_API_ID).get("Items", [])
    if not any(r.get("RouteKey") == ROUTE_KEY for r in routes):
        apigw.create_route(
            ApiId=HTTP_API_ID,
            RouteKey=ROUTE_KEY,
            Target=f"integrations/{integration_id}",
        )
        print(f"Created route: {ROUTE_KEY}")
    else:
        print(f"Route exists: {ROUTE_KEY}")

    stages = apigw.get_stages(ApiId=HTTP_API_ID).get("Items", [])
    default_stage = next((s for s in stages if s.get("StageName") == STAGE_NAME), None)
    if not default_stage:
        apigw.create_stage(
            ApiId=HTTP_API_ID,
            StageName=STAGE_NAME,
            AutoDeploy=True,
        )
        print(f"Created stage {STAGE_NAME} (AutoDeploy=true)")
    elif not default_stage.get("AutoDeploy"):
        apigw.update_stage(
            ApiId=HTTP_API_ID,
            StageName=STAGE_NAME,
            AutoDeploy=True,
        )
        print(f"Enabled AutoDeploy on stage {STAGE_NAME}")
    else:
        print(f"Stage {STAGE_NAME} exists (AutoDeploy=true)")

    source_arn = (
        f"arn:aws:execute-api:{region}:{account}:{HTTP_API_ID}/*/POST/api/contact"
    )
    statement_id = f"apigw-{HTTP_API_ID}-post-api-contact"
    lambda_client = __import__("boto3").client("lambda", region_name=region)
    try:
        lambda_client.add_permission(
            FunctionName=fn_name,
            StatementId=statement_id,
            Action="lambda:InvokeFunction",
            Principal="apigateway.amazonaws.com",
            SourceArn=source_arn,
        )
        print(f"Added Lambda invoke permission: {statement_id}")
    except Exception as exc:
        code = getattr(exc, "response", {}).get("Error", {}).get("Code", "")
        if code != "ResourceConflictException":
            raise
        print(f"Lambda invoke permission already present: {statement_id}")

    return f"{HTTP_API_BASE}/api/contact"


def smoke_tests(invoke_url: str, send_live: bool, test_email: str | None) -> None:
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
    base = {
        "company": "",
        "name": "test",
        "email": "not-an-email",
        "phone": "",
        "message": "x",
        "privacyAgreed": True,
    }
    post({**base, "privacyAgreed": False}, 400, "privacyAgreed false")
    post({**base, "email": "bad"}, 400, "invalid email")
    post({**base, "message": ""}, 400, "message empty")
    post("{not-json", 400, "malformed JSON")

    if send_live:
        if not test_email:
            raise SystemExit("--send-test-mail requires --test-email ADDRESS")
        post(
            {
                "company": "",
                "name": "test",
                "email": test_email,
                "phone": "",
                "message": "ZeroTiCA inquiry API test",
                "privacyAgreed": True,
            },
            200,
            "live POST (check SSM mail-to inbox)",
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Deploy contact Lambda + wire existing HTTP API fbuj6xkrab"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate local package and print plan; no AWS API calls",
    )
    parser.add_argument("--skip-test", action="store_true")
    parser.add_argument("--send-test-mail", action="store_true")
    parser.add_argument(
        "--test-email",
        default=os.environ.get("CONTACT_TEST_EMAIL"),
        help="Email used in live smoke payload (or CONTACT_TEST_EMAIL)",
    )
    args = parser.parse_args()

    if args.dry_run:
        print_plan()
        return

    try:
        import boto3
        from botocore.exceptions import ClientError  # noqa: F401
    except ImportError:
        sys.stderr.write("boto3 required: pip install boto3\n")
        sys.exit(1)

    region = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or AWS_REGION
    if region != AWS_REGION:
        print(f"WARNING: using region {region} (infra guide expects {AWS_REGION})")

    session = boto3.Session(region_name=region)
    if not session.get_credentials():
        raise SystemExit(
            "No AWS credentials. Configure programmatic access per company policy.\n"
            "Do not put SMTP secrets in Lambda Environment; use SSM parameters."
        )

    sts = session.client("sts")
    ident = sts.get_caller_identity()
    print(f"AWS account: {ident['Account']}")
    print(f"Region: {region}")
    print(f"SSM parameters expected (values not printed): {', '.join(SSM_PARAM_PATHS)}")

    iam = session.client("iam")
    role_arn = get_or_create_role(iam)

    lam = session.client("lambda")
    fn_name = upsert_lambda(lam, role_arn)
    fn = lam.get_function(FunctionName=fn_name)
    lambda_arn = fn["Configuration"]["FunctionArn"]

    apigw = session.client("apigatewayv2")
    invoke_url = ensure_http_api(
        apigw, lambda_arn, fn_name, region, ident["Account"]
    )

    print("\n--- Deploy complete ---")
    print(f"Lambda: {fn_name}")
    print(f"HTTP API ID: {HTTP_API_ID}")
    print(f"POST URL: {invoke_url}")
    print(
        "Amplify Rewrite (manual Console): /api/contact → "
        f"{invoke_url} (200 Rewrite, above SPA fallback)"
    )
    print("CloudFront / Amplify customRules were NOT modified by this script.")

    if not args.skip_test:
        smoke_tests(invoke_url, send_live=args.send_test_mail, test_email=args.test_email)


if __name__ == "__main__":
    main()
