import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { PortalFeature, PortalProfile } from '../app/kernel/feature';

export const portalRoot = resolve(import.meta.dirname, '..');
export const featureRoot = resolve(portalRoot, 'app', 'features');
export const profileRoot = resolve(portalRoot, 'app', 'profiles');
export const featureIdPattern = /^fa-[a-z][a-z0-9-]*-pages$/;
export const profileIdPattern = /^[a-z][a-z0-9-]*$/;
export const routeSegmentPattern = /^[a-z][a-z0-9-]*$/;

export interface ParsedArguments {
  flags: ReadonlySet<string>;
  values: ReadonlyMap<string, string>;
}

export interface DiscoveredFeature {
  directory: string;
  file: string;
  feature: PortalFeature;
}

export interface DiscoveredProfile {
  file: string;
  profile: PortalProfile;
}

export function parseArguments(argv: readonly string[], allowedValues: readonly string[], allowedFlags: readonly string[] = []): ParsedArguments {
  const valueNames = new Set(allowedValues);
  const flagNames = new Set(allowedFlags);
  const values = new Map<string, string>();
  const flags = new Set<string>();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (!argument.startsWith('--')) throw new Error(`无法识别参数 "${argument}"`);
    const name = argument.slice(2);

    if (flagNames.has(name)) {
      if (flags.has(name)) throw new Error(`参数 --${name} 重复`);
      flags.add(name);
      continue;
    }
    if (!valueNames.has(name)) throw new Error(`不支持参数 --${name}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`参数 --${name} 缺少值`);
    if (values.has(name)) throw new Error(`参数 --${name} 重复`);
    values.set(name, value);
    index += 1;
  }

  return { flags, values };
}

export function requiredArgument(arguments_: ParsedArguments, name: string): string {
  const value = arguments_.values.get(name)?.trim();
  if (!value) throw new Error(`缺少必填参数 --${name}`);
  return value;
}

export function commaSeparated(value: string | undefined): readonly string[] {
  if (!value?.trim()) return [];
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
}

export function toCamelCase(value: string): string {
  const [first = '', ...rest] = value.split('-');
  return first + rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

export function toPascalCase(value: string): string {
  const camel = toCamelCase(value);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function toTsString(value: string): string {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\r', '').replaceAll('\n', '\\n')}'`;
}

export function writeDirectoryAtomically(targetDirectory: string, files: Readonly<Record<string, string>>): void {
  if (existsSync(targetDirectory)) throw new Error(`目标目录已存在，拒绝覆盖：${targetDirectory}`);

  const temporaryDirectory = `${targetDirectory}.tmp-${process.pid}`;
  if (existsSync(temporaryDirectory)) throw new Error(`临时目录已存在：${temporaryDirectory}`);

  try {
    for (const [relativeFile, content] of Object.entries(files)) {
      const file = resolve(temporaryDirectory, relativeFile);
      if (!file.startsWith(`${temporaryDirectory}/`)) throw new Error(`脚手架文件路径越界：${relativeFile}`);
      mkdirSync(resolve(file, '..'), { recursive: true });
      writeFileSync(file, content, { encoding: 'utf8', flag: 'wx' });
    }
    mkdirSync(resolve(targetDirectory, '..'), { recursive: true });
    renameSync(temporaryDirectory, targetDirectory);
  } catch (error) {
    rmSync(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }
}

export function writeFileWithoutOverwrite(file: string, content: string): void {
  if (existsSync(file)) throw new Error(`目标文件已存在，拒绝覆盖：${file}`);
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, content, { encoding: 'utf8', flag: 'wx' });
}

export async function discoverFeatures(directory = featureRoot): Promise<readonly DiscoveredFeature[]> {
  const featureDirectories = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(directory, entry.name))
    .sort();

  return Promise.all(
    featureDirectories.map(async (featureDirectory) => {
      const file = resolve(featureDirectory, 'feature.ts');
      if (!existsSync(file)) throw new Error(`Feature 目录缺少 feature.ts：${featureDirectory}`);
      const module = (await import(`${pathToFileURL(file).href}?catalog=${Date.now()}`)) as { default?: PortalFeature };
      if (!module.default) throw new Error(`Feature 缺少 default export：${file}`);
      return { directory: featureDirectory, file, feature: module.default };
    }),
  );
}

export async function discoverProfiles(directory = profileRoot): Promise<readonly DiscoveredProfile[]> {
  const files = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => resolve(directory, entry.name))
    .sort();

  return Promise.all(
    files.map(async (file) => {
      const module = (await import(`${pathToFileURL(file).href}?catalog=${Date.now()}`)) as { default?: PortalProfile };
      if (!module.default) throw new Error(`Profile 缺少 default export：${file}`);
      return { file, profile: module.default };
    }),
  );
}

export function isDirectExecution(metaUrl: string): boolean {
  return Boolean(process.argv[1]) && metaUrl === pathToFileURL(resolve(process.argv[1])).href;
}

export function featureVariableName(featureId: string): string {
  return `${toCamelCase(featureId)}Feature`;
}

export function profileFileName(profile: DiscoveredProfile): string {
  return basename(profile.file, '.ts');
}
