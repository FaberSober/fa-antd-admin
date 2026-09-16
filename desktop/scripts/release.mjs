import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const desktopDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundleDir = path.join(desktopDir, "src-tauri", "target", "release", "bundle");
const updaterArtifactSuffixes = [
  ".AppImage",
  ".AppImage.tar.gz",
  ".app.tar.gz",
  ".exe",
  ".msi",
  ".nsis.zip",
  ".msi.zip",
];

function fail(message) {
  throw new Error(message);
}

function listFiles(directory) {
  if (!fs.existsSync(directory)) {
    fail(`未找到构建产物目录：${directory}`);
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function requireReleaseEnvironment() {
  const privateKey = process.env.TAURI_SIGNING_PRIVATE_KEY?.trim();
  const publicKey = process.env.TAURI_UPDATER_PUBLIC_KEY?.trim();
  const endpoint = process.env.TAURI_UPDATER_ENDPOINT?.trim();

  if (!privateKey) {
    fail("缺少 TAURI_SIGNING_PRIVATE_KEY，发布构建需要由 CI 环境提供");
  }
  if (!publicKey || publicKey === "__TAURI_UPDATER_PUBLIC_KEY__") {
    fail("缺少有效的 TAURI_UPDATER_PUBLIC_KEY");
  }
  if (!endpoint || endpoint.includes("api.example.com")) {
    fail("缺少有效的 TAURI_UPDATER_ENDPOINT");
  }

  let parsedEndpoint;
  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    fail("TAURI_UPDATER_ENDPOINT 不是有效 URL");
  }
  if (parsedEndpoint.protocol !== "https:") {
    fail("TAURI_UPDATER_ENDPOINT 必须使用 HTTPS");
  }

  return { publicKey, endpoint };
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: desktopDir,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    fail(`命令执行失败：${command} ${args.join(" ")}`);
  }
}

function verifyArtifacts(directory = process.env.TAURI_BUNDLE_DIR || bundleDir) {
  const files = listFiles(directory);
  const updaterArtifacts = files.filter(
    (filePath) =>
      !filePath.endsWith(".sig") && updaterArtifactSuffixes.some((suffix) => filePath.endsWith(suffix)),
  );

  if (updaterArtifacts.length === 0) {
    fail(`未找到 Tauri 更新产物：${directory}`);
  }

  const missingSignatures = updaterArtifacts.filter((filePath) => !fs.existsSync(`${filePath}.sig`));
  if (missingSignatures.length > 0) {
    fail(`以下更新产物缺少 .sig：\n${missingSignatures.map((filePath) => `- ${path.relative(directory, filePath)}`).join("\n")}`);
  }

  const invalidSignatures = files.filter((filePath) => {
    if (!filePath.endsWith(".sig")) {
      return false;
    }
    const signature = fs.readFileSync(filePath, "utf8").trim();
    return !signature || !fs.existsSync(filePath.slice(0, -4));
  });
  if (invalidSignatures.length > 0) {
    fail(`以下签名文件为空或没有对应产物：\n${invalidSignatures.map((filePath) => `- ${path.relative(directory, filePath)}`).join("\n")}`);
  }

  console.log(`Desktop updater artifacts verified: ${updaterArtifacts.length}`);
  updaterArtifacts.forEach((filePath) => console.log(`- ${path.relative(directory, filePath)} + .sig`));
}

function buildRelease(extraArgs) {
  const { publicKey, endpoint } = requireReleaseEnvironment();
  if (extraArgs.includes("--no-sign") || extraArgs.includes("--no-bundle")) {
    fail("发布构建不允许使用 --no-sign 或 --no-bundle");
  }

  const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  run(pnpmCommand, ["version:check"]);

  const configDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "fa-desktop-release-"));
  const configPath = path.join(configDirectory, "tauri.release.conf.json");
  fs.writeFileSync(
    configPath,
    `${JSON.stringify({ plugins: { updater: { pubkey: publicKey, endpoints: [endpoint] } } }, null, 2)}\n`,
  );

  try {
    run(pnpmCommand, ["tauri", "build", "--ci", ...extraArgs, "--config", configPath]);
  } finally {
    fs.rmSync(configDirectory, { recursive: true, force: true });
  }
}

function printUsage() {
  console.log(`用法：
  pnpm release:build [-- --target <target>]
  pnpm release:verify

发布构建需要：TAURI_SIGNING_PRIVATE_KEY、TAURI_UPDATER_PUBLIC_KEY、TAURI_UPDATER_ENDPOINT。
校验时可通过 TAURI_BUNDLE_DIR 指定构建产物目录。`);
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "build") {
    buildRelease(args);
  } else if (command === "verify") {
    verifyArtifacts();
  } else {
    printUsage();
    if (command) {
      process.exitCode = 1;
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
