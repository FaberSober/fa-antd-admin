import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const desktopDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePaths = {
  package: path.join(desktopDir, "package.json"),
  tauri: path.join(desktopDir, "src-tauri", "tauri.conf.json"),
  cargo: path.join(desktopDir, "src-tauri", "Cargo.toml"),
  version: path.join(desktopDir, "version.json"),
};

const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeIfChanged(filePath, content) {
  if (fs.readFileSync(filePath, "utf8") !== content) {
    fs.writeFileSync(filePath, content);
  }
}

function writeJsonIfChanged(filePath, value) {
  writeIfChanged(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readCargoPackageVersion(cargoContent) {
  const packageSection = cargoContent.match(/\[package\][\s\S]*?(?=\n\[|$)/)?.[0];
  const version = packageSection?.match(/^version[ \t]*=[ \t]*"([^"]+)"[ \t]*(?:\r)?$/m)?.[1];
  if (!version) {
    throw new Error("src-tauri/Cargo.toml 缺少 [package].version");
  }
  return version;
}

function replaceCargoPackageVersion(cargoContent, version) {
  const packageMatch = cargoContent.match(/\[package\][\s\S]*?(?=\n\[|$)/);
  if (!packageMatch) {
    throw new Error("src-tauri/Cargo.toml 缺少 [package] 段");
  }

  const packageSection = packageMatch[0];
  const updatedSection = packageSection.replace(
    /^version[ \t]*=[ \t]*"[^"]+"[ \t]*(?:\r)?$/m,
    `version = "${version}"`,
  );
  if (updatedSection === packageSection) {
    throw new Error("src-tauri/Cargo.toml 缺少 [package].version");
  }
  return cargoContent.replace(packageSection, updatedSection);
}

function replaceTauriVersion(tauriContent, version) {
  const match = tauriContent.match(/("version"[ \t]*:[ \t]*)"[^"]+"/);
  if (!match) {
    throw new Error("src-tauri/tauri.conf.json 缺少 version");
  }
  return tauriContent.replace(match[0], `${match[1]}"${version}"`);
}

function validateVersion(version) {
  if (!semverPattern.test(version)) {
    throw new Error(`无效的版本号：${version}，格式应为 MAJOR.MINOR.PATCH`);
  }
}

function validateVersionCode(versionCode) {
  if (!Number.isInteger(versionCode) || versionCode < 1) {
    throw new Error(`无效的 versionCode：${versionCode}，必须是正整数`);
  }
}

function readReleaseMetadata() {
  const tauriConfig = readJson(filePaths.tauri);
  const versionMetadata = readJson(filePaths.version);
  validateVersion(tauriConfig.version);
  validateVersionCode(versionMetadata.versionCode);
  return { version: tauriConfig.version, versionCode: versionMetadata.versionCode };
}

function syncPackageAndCargo(version) {
  const packageJson = readJson(filePaths.package);
  if (packageJson.version !== version) {
    packageJson.version = version;
    writeJsonIfChanged(filePaths.package, packageJson);
  }

  const cargoContent = fs.readFileSync(filePaths.cargo, "utf8");
  const cargoVersion = readCargoPackageVersion(cargoContent);
  if (cargoVersion !== version) {
    writeIfChanged(filePaths.cargo, replaceCargoPackageVersion(cargoContent, version));
  }
}

function setVersion(version, versionCode) {
  validateVersion(version);
  validateVersionCode(versionCode);

  const current = readReleaseMetadata();
  if (version !== current.version && versionCode <= current.versionCode) {
    throw new Error(`新版本的 versionCode 必须大于当前值 ${current.versionCode}`);
  }

  const tauriContent = fs.readFileSync(filePaths.tauri, "utf8");
  writeIfChanged(filePaths.tauri, replaceTauriVersion(tauriContent, version));
  writeJsonIfChanged(filePaths.version, { versionCode });
  syncPackageAndCargo(version);
  console.log(`Desktop version updated: ${version} (code ${versionCode})`);
}

function syncVersion() {
  const current = readReleaseMetadata();
  syncPackageAndCargo(current.version);
  console.log(`Desktop version synchronized: ${current.version} (code ${current.versionCode})`);
}

function checkVersion() {
  const current = readReleaseMetadata();
  const packageVersion = readJson(filePaths.package).version;
  const cargoVersion = readCargoPackageVersion(fs.readFileSync(filePaths.cargo, "utf8"));
  const mismatches = [
    ["package.json", packageVersion],
    ["src-tauri/Cargo.toml", cargoVersion],
  ].filter(([, version]) => version !== current.version);

  if (mismatches.length > 0) {
    throw new Error(
      `版本不一致：Tauri=${current.version}，${mismatches.map(([name, version]) => `${name}=${version}`).join("，")}`,
    );
  }

  console.log(`Desktop version check passed: ${current.version} (code ${current.versionCode})`);
}

const [command, version, versionCodeArgument] = process.argv.slice(2);

try {
  if (command === "set") {
    if (!version || !versionCodeArgument) {
      throw new Error("用法：pnpm version:set -- <versionName> <versionCode>");
    }
    const versionCode = Number(versionCodeArgument);
    setVersion(version, versionCode);
  } else if (command === "sync") {
    syncVersion();
  } else if (command === "check") {
    checkVersion();
  } else {
    throw new Error("用法：pnpm version:set|version:sync|version:check");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
