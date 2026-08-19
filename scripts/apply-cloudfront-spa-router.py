#!/usr/bin/env python3
"""Publish the ZeroTiCA SPA router CloudFront Function and attach it to the distribution.

Generate infra/cloudfront/spa-router.js first with: npm run build

CloudFront API is us-east-1. Requires credentials with cloudfront:Get*, cloudfront:CreateFunction,
cloudfront:UpdateFunction, cloudfront:PublishFunction, cloudfront:UpdateDistribution.

Optional env:
  CLOUDFRONT_DISTRIBUTION_ID  skip alias lookup
  SITE_ALIAS                  default zerotica.narusec.com
  FUNCTION_NAME               default zerotica-spa-router
  SKIP_SYNC                   1 to attach the Function without uploading dist/
  S3_BUCKET                   override origin bucket
"""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

try:
    import boto3
    from botocore.exceptions import ClientError
except ImportError:
    sys.stderr.write("boto3 is required: pip install boto3\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
FUNCTION_FILE = ROOT / "infra/cloudfront/spa-router.js"
FUNCTION_NAME = os.environ.get("FUNCTION_NAME", "zerotica-spa-router")
SITE_ALIAS = os.environ.get("SITE_ALIAS", "zerotica.narusec.com")
COMMENT = "ZeroTiCA SPA deep-link router (viewer-request)"


def cf_client():
    return boto3.client("cloudfront", region_name="us-east-1")


def find_distribution(client):
    dist_id = os.environ.get("CLOUDFRONT_DISTRIBUTION_ID")
    marker = None
    while True:
        kwargs = {}
        if marker:
            kwargs["Marker"] = marker
        resp = client.list_distributions(**kwargs)
        listing = resp.get("DistributionList") or {}
        for item in listing.get("Items") or []:
            if dist_id and item["Id"] == dist_id:
                return item
            aliases = (item.get("Aliases") or {}).get("Items") or []
            if SITE_ALIAS in aliases:
                return item
            if item.get("DomainName", "").startswith("d1a08g3pipirid"):
                return item
        if not listing.get("IsTruncated"):
            break
        marker = listing.get("NextMarker")
    raise SystemExit(f"CloudFront distribution for {SITE_ALIAS} not found")


def upsert_function(client, code: bytes):
    try:
        current = client.describe_function(Name=FUNCTION_NAME, Stage="DEVELOPMENT")
        etag = current["ETag"]
        client.update_function(
            Name=FUNCTION_NAME,
            IfMatch=etag,
            FunctionConfig={"Comment": COMMENT, "Runtime": "cloudfront-js-1.0"},
            FunctionCode=code,
        )
        print(f"Updated function {FUNCTION_NAME}")
    except ClientError as exc:
        if exc.response["Error"]["Code"] != "NoSuchFunctionExists":
            raise
        client.create_function(
            Name=FUNCTION_NAME,
            FunctionConfig={"Comment": COMMENT, "Runtime": "cloudfront-js-1.0"},
            FunctionCode=code,
        )
        print(f"Created function {FUNCTION_NAME}")

    described = client.describe_function(Name=FUNCTION_NAME, Stage="DEVELOPMENT")
    published = client.publish_function(Name=FUNCTION_NAME, IfMatch=described["ETag"])
    arn = published["FunctionSummary"]["FunctionMetadata"]["FunctionARN"]
    print(f"Published {arn}")
    return arn


def associate_function(client, dist_summary, function_arn):
    dist_id = dist_summary["Id"]
    cfg_resp = client.get_distribution_config(Id=dist_id)
    etag = cfg_resp["ETag"]
    config = cfg_resp["DistributionConfig"]
    behavior = config["DefaultCacheBehavior"]
    associations = behavior.get("FunctionAssociations") or {"Quantity": 0, "Items": []}
    items = list(associations.get("Items") or [])
    replaced = False
    for item in items:
        if item.get("EventType") == "viewer-request":
            item["FunctionARN"] = function_arn
            replaced = True
            break
    if not replaced:
        items.append({"FunctionARN": function_arn, "EventType": "viewer-request"})
    behavior["FunctionAssociations"] = {"Quantity": len(items), "Items": items}
    client.update_distribution(Id=dist_id, IfMatch=etag, DistributionConfig=config)
    print(f"Associated viewer-request function on {dist_id}")
    return dist_id, config


def origin_bucket(config) -> str | None:
    override = os.environ.get("S3_BUCKET")
    if override:
        return override
    items = (config.get("Origins") or {}).get("Items") or []
    if not items:
        return None
    domain = items[0].get("DomainName") or ""
    # bucket.s3.amazonaws.com / bucket.s3.ap-northeast-2.amazonaws.com / bucket.s3-website-...
    if ".s3" in domain:
        return domain.split(".s3")[0]
    return None


def content_type_for(path: Path) -> str:
    ext = path.suffix.lower()
    if ext == "":
        return "text/html; charset=utf-8"
    return {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".xml": "text/xml; charset=utf-8",
        ".txt": "text/plain; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".ico": "image/x-icon",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
        ".map": "application/json",
        ".pdf": "application/pdf",
    }.get(ext, "application/octet-stream")


def sync_dist(bucket: str):
    dist = ROOT / "dist"
    if not (dist / "index.html").exists():
        raise SystemExit("dist/index.html missing — run npm run build first")
    s3 = boto3.client("s3")
    uploaded = 0
    for path in dist.rglob("*"):
        if not path.is_file():
            continue
        key = path.relative_to(dist).as_posix()
        extra = {"ContentType": content_type_for(path)}
        if path.suffix.lower() in {".html", ".xml", ".txt", ""}:
            extra["CacheControl"] = "public, max-age=0, s-maxage=31536000"
        elif key.startswith("assets/"):
            extra["CacheControl"] = "public, max-age=31536000, immutable"
        s3.upload_file(str(path), bucket, key, ExtraArgs=extra)
        uploaded += 1
    print(f"Uploaded {uploaded} files to s3://{bucket}")


def invalidate(client, dist_id: str):
    client.create_invalidation(
        DistributionId=dist_id,
        InvalidationBatch={
            "CallerReference": str(time.time()),
            "Paths": {"Quantity": 1, "Items": ["/*"]},
        },
    )
    print(f"Invalidated /* on {dist_id}")


def main():
    if not FUNCTION_FILE.exists():
        raise SystemExit(f"missing {FUNCTION_FILE} — run npm run build")
    code = FUNCTION_FILE.read_bytes()
    client = cf_client()
    dist = find_distribution(client)
    print(f"Distribution {dist['Id']} {dist.get('DomainName')}")
    arn = upsert_function(client, code)
    dist_id, config = associate_function(client, dist, arn)
    bucket = origin_bucket(config)
    if os.environ.get("SKIP_SYNC") == "1":
        print("SKIP_SYNC=1 — not uploading dist/. Function rewrites need /legal/privacy.html etc. on S3.")
    else:
        if not bucket:
            raise SystemExit("Could not determine S3 origin bucket; set S3_BUCKET")
        sync_dist(bucket)
    invalidate(client, dist_id)


if __name__ == "__main__":
    main()
