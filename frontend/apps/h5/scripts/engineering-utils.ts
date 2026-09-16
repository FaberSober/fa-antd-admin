import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { H5Feature, H5Project } from '../src/platform/feature/types';

export const h5Root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const featureRoot = path.join(h5Root, 'features');
export const projectRoot = path.join(h5Root, 'src/projects');
export const generatedRoot = path.join(h5Root, '.h5');

const projectIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function discoverFeatureIds(): Promise<string[]> {
  const entries = await readdir(featureRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('fa-'))
    .map((entry) => entry.name)
    .sort();
}

export async function discoverProjectIds(): Promise<string[]> {
  const entries = await readdir(projectRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => entry.name.slice(0, -3))
    .sort();
}

export function resolveProjectId(rawProjectId: string | undefined): string {
  const projectId = rawProjectId?.trim() || 'default';
  if (!projectIdPattern.test(projectId)) {
    throw new Error(`VITE_APP_PROJECT "${projectId}" 只允许小写字母、数字和连字符`);
  }

  const projectFile = path.join(projectRoot, `${projectId}.ts`);
  if (!existsSync(projectFile)) {
    throw new Error(`VITE_APP_PROJECT "${projectId}" 不存在，对应文件应为 ${projectFile}`);
  }
  return projectId;
}

export function getProjectFile(projectId: string): string {
  return path.join(projectRoot, `${projectId}.ts`);
}

export async function loadProject(projectId: string): Promise<H5Project> {
  const projectFile = getProjectFile(resolveProjectId(projectId));
  const projectModule = (await import(pathToFileURL(projectFile).href)) as {
    default?: H5Project;
  };
  if (!projectModule.default) {
    throw new Error(`Project "${projectId}" 必须提供 default export`);
  }
  return projectModule.default;
}

export async function loadFeature(featureId: string): Promise<H5Feature> {
  const featureFile = path.join(featureRoot, featureId, 'index.ts');
  if (!existsSync(featureFile)) {
    throw new Error(`Feature "${featureId}" 缺少公共出口 ${featureFile}`);
  }
  const featureModule = (await import(pathToFileURL(featureFile).href)) as {
    default?: H5Feature;
  };
  if (!featureModule.default) {
    throw new Error(`Feature "${featureId}" 必须从 index.ts 提供 default export`);
  }
  return featureModule.default;
}

export async function listSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries
      .filter((entry) => !['dist', 'node_modules', 'coverage', 'build', 'logs'].includes(entry.name))
      .map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          return listSourceFiles(entryPath);
        }
        return /\.(?:ts|tsx|js|jsx|mjs)$/.test(entry.name) ? [entryPath] : [];
      }),
  );
  return nestedFiles.flat().sort();
}

export function toH5Relative(filePath: string): string {
  return path.relative(h5Root, filePath).split(path.sep).join('/');
}
