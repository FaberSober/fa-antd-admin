pipeline {
    agent none

    options {
        disableConcurrentBuilds()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    }

    parameters {
        string(name: 'APP_ID', defaultValue: '1', description: 'Existing fa-app application record ID')
        string(name: 'CHANNEL', defaultValue: 'stable', description: 'Client update channel')
        string(name: 'MIN_SUPPORTED_APK_VERSION_CODE', defaultValue: '', description: 'Optional minimum compatible APK version code')
        text(name: 'RELEASE_NOTES', defaultValue: '', description: 'WGT update notes')
        string(name: 'API_BASE_URL', defaultValue: '', description: 'fa-app base URL; set the intended test or production environment explicitly')
    }

    stages {
        stage('Build WGT and create draft') {
            agent { label 'linux-android' }
            steps {
                checkout scm

                sh '''
set -euo pipefail

[[ "$APP_ID" =~ ^[1-9][0-9]*$ ]] || { echo 'APP_ID must be a positive integer.' >&2; exit 1; }
[[ -n "${CHANNEL//[[:space:]]/}" ]] || { echo 'CHANNEL is required.' >&2; exit 1; }
[[ "$CHANNEL" != *$'\n'* && "$CHANNEL" != *$'\r'* && "$CHANNEL" != *$'\t'* ]] || { echo 'CHANNEL must be a single line.' >&2; exit 1; }
[[ -n "${RELEASE_NOTES//[[:space:]]/}" ]] || { echo 'RELEASE_NOTES is required.' >&2; exit 1; }
[[ "$API_BASE_URL" == https://* || "$API_BASE_URL" == http://* ]] || { echo 'API_BASE_URL must start with http:// or https://.' >&2; exit 1; }
if [[ -n "$MIN_SUPPORTED_APK_VERSION_CODE" && ! "$MIN_SUPPORTED_APK_VERSION_CODE" =~ ^[1-9][0-9]*$ ]]; then
    echo 'MIN_SUPPORTED_APK_VERSION_CODE must be a positive integer when provided.' >&2
    exit 1
fi

command -v node >/dev/null
command -v pnpm >/dev/null
pnpm --dir mobile install --frozen-lockfile
pnpm --dir mobile run build:wgt
'''

                script {
                    env.WGT_VERSION = sh(
                        returnStdout: true,
                        script: '''
node - <<'NODE'
const fs = require('node:fs');
const manifest = JSON.parse(fs.readFileSync('mobile/src/manifest.json', 'utf8'));
process.stdout.write(`${manifest.versionName} (${manifest.versionCode})`);
NODE
'''
                    ).trim()
                }
                archiveArtifacts artifacts: 'mobile/dist/wgt/*.wgt', fingerprint: true

                withCredentials([string(credentialsId: 'fa-api-token', variable: 'FA_API_TOKEN')]) {
                    script {
                        env.WGT_RELEASE_ID = sh(
                            label: 'Upload WGT and create release draft',
                            returnStdout: true,
                            script: '''
set -euo pipefail

[[ "$FA_API_TOKEN" != *$'\n'* && "$FA_API_TOKEN" != *$'\r'* && "$FA_API_TOKEN" != *'"'* ]] || {
    echo 'FA_API_TOKEN contains unsupported characters.' >&2
    exit 1
}
api_base=${API_BASE_URL%/}
api_base=${api_base%/api}
[[ "$api_base" == https://* || "$api_base" == http://* ]] || {
    echo 'API_BASE_URL must start with http:// or https://.' >&2
    exit 1
}

wgt_path=$(find mobile/dist/wgt -maxdepth 1 -type f -name '*.wgt' -print -quit)
[[ -f "$wgt_path" ]] || { echo 'WGT artifact is missing.' >&2; exit 1; }
response_file=$(mktemp)
trap 'rm -f "$response_file"' EXIT
form_args=(
    --form "file=@$wgt_path;type=application/octet-stream"
    --form-string "appId=$APP_ID"
    --form-string "channel=$CHANNEL"
    --form-string "releaseNote=$RELEASE_NOTES"
)
if [[ -n "$MIN_SUPPORTED_APK_VERSION_CODE" ]]; then
    form_args+=(--form-string "minSupportedVersionCode=$MIN_SUPPORTED_APK_VERSION_CODE")
fi

if ! http_status=$(printf 'header = "FaApiToken: %s"\\n' "$FA_API_TOKEN" |
    curl --silent --show-error --config - --connect-timeout 15 --max-time 1800 \\
        --output "$response_file" --write-out '%{http_code}' \\
        "${form_args[@]}" \\
        "$api_base/api/app/app/release/createWgtDraft"); then
    echo 'WGT draft upload request failed.' >&2
    exit 1
fi
[[ "$http_status" =~ ^2[0-9][0-9]$ ]] || {
    echo "WGT draft upload returned HTTP $http_status." >&2
    exit 1
}

node - "$response_file" <<'NODE'
const fs = require('node:fs');
const response = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (!response || Number(response.code) !== 200 || !response.data || !/^[1-9][0-9]*$/.test(String(response.data.id))) {
  console.error('WGT draft creation failed: ' + String(response && response.message || 'invalid response'));
  process.exit(1);
}
process.stdout.write(String(response.data.id));
NODE
'''
                        ).trim()
                        if (!env.WGT_RELEASE_ID) {
                            error('WGT draft response did not include a release ID.')
                        }
                        echo "WGT draft created: release ID ${env.WGT_RELEASE_ID}, version ${env.WGT_VERSION}."
                    }
                }
            }
        }

        stage('Approve WGT publication') {
            steps {
                script {
                    env.WGT_PUBLISH_DECISION = input(
                        message: "WGT 草稿 ${env.WGT_RELEASE_ID}（版本 ${env.WGT_VERSION}）已创建。发布前请检查目标渠道和设备范围；未配置灰度或白名单时，默认会面向该渠道全部兼容客户端。",
                        ok: '确认',
                        parameters: [choice(
                            name: 'DECISION',
                            choices: '仅保留草稿\n发布',
                            description: '发布后会向匹配渠道、最低 APK 版本和灰度范围的客户端下发。'
                        )]
                    ).toString()
                }
            }
        }

        stage('Publish WGT') {
            when {
                expression { env.WGT_PUBLISH_DECISION == '发布' }
            }
            agent { label 'linux-android' }
            steps {
                withCredentials([string(credentialsId: 'fa-api-token', variable: 'FA_API_TOKEN')]) {
                    sh '''
set -euo pipefail

[[ "$FA_API_TOKEN" != *$'\n'* && "$FA_API_TOKEN" != *$'\r'* && "$FA_API_TOKEN" != *'"'* ]] || {
    echo 'FA_API_TOKEN contains unsupported characters.' >&2
    exit 1
}
api_base=${API_BASE_URL%/}
api_base=${api_base%/api}
[[ "$api_base" == https://* || "$api_base" == http://* ]] || {
    echo 'API_BASE_URL must start with http:// or https://.' >&2
    exit 1
}

response_file=$(mktemp)
trap 'rm -f "$response_file"' EXIT
if ! http_status=$(printf 'header = "FaApiToken: %s"\\n' "$FA_API_TOKEN" |
    curl --silent --show-error --config - --connect-timeout 15 --max-time 60 \\
        --output "$response_file" --write-out '%{http_code}' \\
        --request POST --header 'Content-Type: application/json' --data '{}' \\
        "$api_base/api/app/app/release/publish/$WGT_RELEASE_ID"); then
    echo 'WGT publication request failed.' >&2
    exit 1
fi
[[ "$http_status" =~ ^2[0-9][0-9]$ ]] || {
    echo "WGT publish returned HTTP $http_status." >&2
    exit 1
}

node - "$response_file" "$WGT_RELEASE_ID" <<'NODE'
const fs = require('node:fs');
const response = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (!response || Number(response.code) !== 200 || !response.data ||
    String(response.data.id) !== process.argv[3] || response.data.status !== 'PUBLISHED') {
  console.error('WGT publication failed: ' + String(response && response.message || 'invalid response'));
  process.exit(1);
}
NODE
echo "Published WGT release ${WGT_RELEASE_ID}."
'''
                }
            }
        }
    }
}
