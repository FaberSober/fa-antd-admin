[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$mobileProject = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$manifest = Join-Path $mobileProject 'src/manifest.json'
$uniOutput = Join-Path $mobileProject 'dist/build/app'
$wgtOutput = Join-Path $mobileProject 'dist/wgt'

foreach ($toolName in @('node', 'pnpm', 'jar')) {
    if (-not (Get-Command -Name $toolName -ErrorAction SilentlyContinue)) {
        [Console]::Error.WriteLine("Required command was not found in PATH: $toolName")
        exit 1
    }
}

$manifestValidationScript = @'
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
'@

$manifestVersions = $manifestValidationScript | & node - $manifest
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
$versionName, $versionCode = $manifestVersions -split "`t", 2

& pnpm --dir $mobileProject run build:app
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$builtManifest = Join-Path $uniOutput 'manifest.json'
$builtService = Join-Path $uniOutput 'app-service.js'
if (-not (Test-Path -LiteralPath $uniOutput -PathType Container) -or
    -not (Test-Path -LiteralPath $builtManifest -PathType Leaf) -or
    -not (Test-Path -LiteralPath $builtService -PathType Leaf)) {
    [Console]::Error.WriteLine("Uni APP build output is incomplete: $uniOutput")
    exit 1
}

$builtManifestCheckScript = @'
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
'@

$builtManifestCheckScript | & node - $manifest $builtManifest
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

New-Item -ItemType Directory -Path $wgtOutput -Force | Out-Null
Get-ChildItem -LiteralPath $wgtOutput -File -Filter '*.wgt' | Remove-Item -Force

$wgtPath = Join-Path $wgtOutput "fa-mobile-wgt-$versionCode.wgt"
& jar cf $wgtPath -C $uniOutput .
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$archiveEntries = & jar tf $wgtPath
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
if ($archiveEntries -cnotcontains 'manifest.json') {
    [Console]::Error.WriteLine('WGT archive is missing root manifest.json.')
    exit 1
}

Write-Host "WGT package: $wgtPath"
