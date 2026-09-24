#!/usr/bin/env bash
set -euo pipefail

mobile_project=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
manifest="$mobile_project/src/manifest.json"
uni_output="$mobile_project/dist/build/app"
wgt_output="$mobile_project/dist/wgt"
command -v node >/dev/null
command -v pnpm >/dev/null
command -v jar >/dev/null

manifest_versions=$(node - "$manifest" <<'NODE'
const fs = require('node:fs');
const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^\uFEFF/, ''));
const versionName = String(manifest.versionName || '');
const versionCode = String(manifest.versionCode || '');
if (!manifest.appid || !/^[A-Za-z0-9_]+$/.test(manifest.appid)) {
  console.error('src/manifest.json has an invalid appid.');
  process.exit(1);
}
if (!versionName.trim() || /[\r\n\t]/.test(versionName)) {
  console.error('src/manifest.json has an invalid versionName.');
  process.exit(1);
}
if (!/^[1-9][0-9]*$/.test(versionCode)) {
  console.error('src/manifest.json versionCode must be a positive integer.');
  process.exit(1);
}
if (BigInt(versionCode) > 9223372036854775807n) {
  console.error('src/manifest.json versionCode exceeds the supported range.');
  process.exit(1);
}
process.stdout.write(`${versionName}\t${versionCode}`);
NODE
)
IFS=$'\t' read -r version_name version_code <<< "$manifest_versions"

pnpm --dir "$mobile_project" run build:app
[[ -d "$uni_output" && -f "$uni_output/manifest.json" && -f "$uni_output/app-service.js" ]] || {
    echo "Uni APP build output is incomplete: $uni_output" >&2
    exit 1
}

node - "$manifest" "$uni_output/manifest.json" <<'NODE'
const fs = require('node:fs');
const source = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const built = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
if (built.id !== source.appid ||
    !built.version ||
    String(built.version.name) !== String(source.versionName) ||
    String(built.version.code) !== String(source.versionCode)) {
  console.error('Built Uni APP manifest does not match the WGT app id and target version.');
  process.exit(1);
}
NODE

mkdir -p "$wgt_output"
find "$wgt_output" -maxdepth 1 -type f -name '*.wgt' -delete
wgt_path="$wgt_output/fa-mobile-wgt-${version_code}.wgt"
jar cf "$wgt_path" -C "$uni_output" .
jar tf "$wgt_path" | grep -Fxq 'manifest.json' || {
    echo 'WGT archive is missing root manifest.json.' >&2
    exit 1
}
echo "WGT package: $wgt_path"
