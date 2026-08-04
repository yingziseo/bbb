#!/usr/bin/env bash

set -Eeuo pipefail

project_dir=/root/bbb
service_name=yiyuanpack.service
release_base=https://github.com/yingziseo/bbb/releases/download/production-build
artifact_name=yiyuanpack-output.tar.gz
expected_sha=${1:-}
download_dir=$(mktemp -d /tmp/yiyuan-artifact-deploy.XXXXXX)
stage_dir=$(mktemp -d /root/bbb/.artifact-stage.XXXXXX)
previous_output=/root/bbb/.output.previous

cleanup() {
  if [[ "$download_dir" == /tmp/yiyuan-artifact-deploy.* ]]; then
    rm -rf -- "$download_dir"
  fi
  if [[ "$stage_dir" == /root/bbb/.artifact-stage.* ]]; then
    rm -rf -- "$stage_dir"
  fi
}
trap cleanup EXIT

curl -fL --retry 3 --retry-delay 2 \
  "$release_base/$artifact_name" \
  -o "$download_dir/$artifact_name"
curl -fL --retry 3 --retry-delay 2 \
  "$release_base/$artifact_name.sha256" \
  -o "$download_dir/$artifact_name.sha256"

(
  cd "$download_dir"
  sha256sum --check "$artifact_name.sha256"
)

if tar -tzf "$download_dir/$artifact_name" | grep -Eq '(^/|(^|/)\.\.(/|$))'; then
  echo 'Artifact contains an unsafe path.' >&2
  exit 1
fi

tar -xzf "$download_dir/$artifact_name" -C "$stage_dir"
test -f "$stage_dir/.output/server/index.mjs"
test -f "$stage_dir/.output/BUILD_SHA"

artifact_sha=$(tr -d '[:space:]' < "$stage_dir/.output/BUILD_SHA")
if [[ -n "$expected_sha" && "$artifact_sha" != "$expected_sha" ]]; then
  echo "Artifact commit mismatch: expected $expected_sha, got $artifact_sha" >&2
  exit 1
fi

if [[ -e "$previous_output" ]]; then
  rm -rf -- "$previous_output"
fi
mv "$project_dir/.output" "$previous_output"
mv "$stage_dir/.output" "$project_dir/.output"

deployment_ok=false
if systemctl restart "$service_name"; then
  for _ in $(seq 1 20); do
    if curl -fsS --max-time 5 http://127.0.0.1:3000/ >/dev/null; then
      deployment_ok=true
      break
    fi
    sleep 1
  done
fi

if [[ "$deployment_ok" != true ]]; then
  echo 'Deployment health check failed; rolling back the previous artifact.' >&2
  mv "$project_dir/.output" "$stage_dir/.output.failed"
  mv "$previous_output" "$project_dir/.output"
  systemctl restart "$service_name"
  exit 1
fi

rm -rf -- "$previous_output"
echo "Deployed production artifact from commit $artifact_sha"
