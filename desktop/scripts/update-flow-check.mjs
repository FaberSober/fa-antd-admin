import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const desktopDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtures = {
  "windows-x86_64": {
    version: "0.2.0",
    signature: "test-signature-windows",
    content: Buffer.from("windows-update-bundle"),
  },
  "darwin-aarch64": {
    version: "0.2.0",
    signature: "test-signature-darwin",
    content: Buffer.from("darwin-update-bundle"),
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveUpdaterEndpoint(template, currentVersion, target, arch) {
  return template
    .replaceAll("{{current_version}}", currentVersion)
    .replaceAll("{{target}}", target)
    .replaceAll("{{arch}}", arch);
}

function createMockServer() {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url || "/", "http://localhost");

    if (requestUrl.pathname === "/api/app/client/update/faber-desktop") {
      const target = requestUrl.searchParams.get("target");
      const currentVersion = requestUrl.searchParams.get("current_version");
      const fixture = target ? fixtures[target] : undefined;

      if (!fixture || currentVersion === fixture.version) {
        response.writeHead(204).end();
        return;
      }

      const manifest = {
        version: fixture.version,
        notes: "更新链路验收测试版本",
        pub_date: "2026-09-16T10:00:00Z",
        url: `http://${request.headers.host}/download/${target}`,
        signature: fixture.signature,
      };
      response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(manifest));
      return;
    }

    if (requestUrl.pathname.startsWith("/download/")) {
      const target = requestUrl.pathname.slice("/download/".length);
      const fixture = fixtures[target];
      if (!fixture) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, {
        "content-length": fixture.content.length,
        "content-type": "application/octet-stream",
      }).end(fixture.content);
      return;
    }

    response.writeHead(404).end();
  });
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object", "mock server 未成功监听");
  return `http://127.0.0.1:${address.port}`;
}

async function close(server) {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

async function checkUpdate(baseUrl, currentVersion, target) {
  return fetch(`${baseUrl}/api/app/client/update/faber-desktop?current_version=${currentVersion}&target=${target}&channel=stable`);
}

async function verifyManifestAndDownload(baseUrl, target) {
  const fixture = fixtures[target];
  const response = await checkUpdate(baseUrl, "0.1.0", target);
  assert.equal(response.status, 200, `${target} 应返回更新清单`);

  const manifest = await response.json();
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/, `${target} 版本格式异常`);
  assert.equal(manifest.signature, fixture.signature, `${target} 签名内容不匹配`);

  const download = await fetch(manifest.url);
  assert.equal(download.status, 200, `${target} 安装包下载失败`);
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), fixture.content, `${target} 安装包内容不匹配`);
}

function verifyStaticWiring() {
  const config = readJson(path.join(desktopDir, "src-tauri", "tauri.conf.json"));
  const capability = readJson(path.join(desktopDir, "src-tauri", "capabilities", "default.json"));
  const packageJson = readJson(path.join(desktopDir, "package.json"));
  const updaterSource = fs.readFileSync(path.join(desktopDir, "src", "runtime", "updater.ts"), "utf8");
  const updateCardSource = fs.readFileSync(path.join(desktopDir, "src", "app", "UpdateCard.tsx"), "utf8");
  const rustSource = fs.readFileSync(path.join(desktopDir, "src-tauri", "src", "lib.rs"), "utf8");

  assert.equal(config.bundle.createUpdaterArtifacts, true, "未开启更新产物生成");
  const endpoint = config.plugins?.updater?.endpoints?.[0];
  assert.ok(endpoint, "未配置更新接口");
  const resolvedEndpoint = new URL(resolveUpdaterEndpoint(endpoint, "0.1.0", "windows", "x86_64"));
  assert.equal(resolvedEndpoint.searchParams.get("target"), "windows-x86_64", "更新目标拼接错误");
  assert.equal(resolvedEndpoint.searchParams.get("current_version"), "0.1.0", "当前版本替换错误");
  assert.equal(resolvedEndpoint.searchParams.get("channel"), "stable", "更新渠道配置错误");

  assert.ok(capability.permissions.includes("updater:default"), "缺少 updater 权限");
  assert.ok(capability.permissions.includes("process:default"), "缺少 process 权限");
  assert.match(rustSource, /tauri_plugin_updater::Builder/, "未注册 updater Rust 插件");
  assert.match(rustSource, /tauri_plugin_process::init/, "未注册 process Rust 插件");
  assert.match(updaterSource, /await update\.download\(/, "未接入下载流程");
  assert.match(updaterSource, /await update\.install\(\)/, "未接入安装流程");
  assert.match(updateCardSource, /window\.confirm\(/, "未接入安装确认");
  for (const eventCode of ["update.check", "update.available", "update.download", "update.install"]) {
    assert.match(updateCardSource, new RegExp(`telemetry\.track\\(\\"${eventCode}\\"`), `缺少 ${eventCode} 事件`);
  }
  assert.equal(packageJson.scripts["release:verify"], "node scripts/release.mjs verify", "签名校验命令未配置");
}

function verifyReleaseSignatureCheck() {
  const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "fa-desktop-update-flow-"));
  const artifactPath = path.join(fixtureDirectory, "Faber.AppImage");
  fs.writeFileSync(artifactPath, "test-artifact");
  fs.writeFileSync(`${artifactPath}.sig`, "test-signature");

  try {
    const result = spawnSync(process.execPath, [path.join(desktopDir, "scripts", "release.mjs"), "verify"], {
      cwd: desktopDir,
      env: { ...process.env, TAURI_BUNDLE_DIR: fixtureDirectory },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout || "签名产物校验失败");
  } finally {
    fs.rmSync(fixtureDirectory, { recursive: true, force: true });
  }
}

async function main() {
  verifyStaticWiring();
  verifyReleaseSignatureCheck();

  const server = createMockServer();
  const baseUrl = await listen(server);
  try {
    const noUpdate = await checkUpdate(baseUrl, "0.2.0", "windows-x86_64");
    assert.equal(noUpdate.status, 204, "当前版本已是最新时应返回 204");
    assert.equal(await noUpdate.text(), "", "204 响应不应包含正文");

    await verifyManifestAndDownload(baseUrl, "windows-x86_64");
    await verifyManifestAndDownload(baseUrl, "darwin-aarch64");
  } finally {
    await close(server);
  }

  console.log("Desktop update flow check passed: no-update, target matching, manifest, signature, download, install wiring");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
