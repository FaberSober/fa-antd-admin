import { resolve } from 'node:path';
import type { PortalFeature } from '../app/kernel/feature';
import {
  commaSeparated,
  discoverFeatures,
  featureVariableName,
  isDirectExecution,
  parseArguments,
  profileIdPattern,
  profileRoot,
  requiredArgument,
  toTsString,
  writeFileWithoutOverwrite,
} from './engineering-utils';

export interface CreateProfileOptions {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  baseUrl?: string;
  featureIds: readonly string[];
  outputDirectory?: string;
  dryRun?: boolean;
}

export interface ProfileScaffoldResult {
  targetFile: string;
  source: string;
}

function validateFeatures(selectedFeatureIds: readonly string[], availableFeatures: readonly PortalFeature[]): readonly PortalFeature[] {
  const featureById = new Map(availableFeatures.map((feature) => [feature.id, feature]));
  const selected = selectedFeatureIds.map((featureId) => {
    const feature = featureById.get(featureId);
    if (!feature) throw new Error(`Feature "${featureId}" 不存在`);
    return feature;
  });
  const selectedIds = new Set(selectedFeatureIds);

  for (const feature of selected) {
    for (const dependency of feature.dependsOn || []) {
      if (!selectedIds.has(dependency)) {
        throw new Error(`Profile 缺少依赖：Feature "${feature.id}" 需要 "${dependency}"`);
      }
    }
    if (feature.lifecycle?.status === 'deprecated') {
      throw new Error(`Feature "${feature.id}" 已废弃；新 Profile 不允许直接启用，请按 migrationGuide 迁移`);
    }
  }
  return selected;
}

function renderProfile(options: CreateProfileOptions, features: readonly PortalFeature[]): string {
  const imports = features
    .map((feature) => `import ${featureVariableName(feature.id)} from '../features/${feature.id}/feature';`)
    .join('\n');
  const featureList = features.length <= 3
    ? `[${features.map((feature) => featureVariableName(feature.id)).join(', ')}]`
    : `[\n${features.map((feature) => `    ${featureVariableName(feature.id)},`).join('\n')}\n  ]`;

  return `${imports}
import { definePortalProfile } from '../kernel/feature';

export default definePortalProfile({
  id: ${toTsString(options.id)},
  site: {
    name: ${toTsString(options.name)},
    shortName: ${toTsString(options.shortName)},
    description: ${toTsString(options.description || `${options.name} Portal。`)},
    baseUrl: ${toTsString(options.baseUrl || '/portal/')},
  },
  features: ${featureList},
});
`;
}

export function createProfileScaffold(
  options: CreateProfileOptions,
  availableFeatures: readonly PortalFeature[],
): ProfileScaffoldResult {
  if (!profileIdPattern.test(options.id)) throw new Error(`Profile ID "${options.id}" 必须使用 kebab-case`);
  if (!options.name.trim() || !options.shortName.trim()) throw new Error('Profile name 和 short-name 不能为空');
  const baseUrl = options.baseUrl || '/portal/';
  if (!baseUrl.startsWith('/') || !baseUrl.endsWith('/')) throw new Error('base-url 必须以 / 开头和结尾');

  const featureIds = [...new Set(options.featureIds)];
  if (!featureIds.length) throw new Error('Profile 至少需要一个 Feature');
  if (featureIds.length !== options.featureIds.length) throw new Error('Profile features 存在重复项');
  const selectedFeatures = validateFeatures(featureIds, availableFeatures);
  const normalizedOptions = {
    ...options,
    name: options.name.trim(),
    shortName: options.shortName.trim(),
    description: options.description?.trim(),
    baseUrl,
    featureIds,
  };
  const source = renderProfile(normalizedOptions, selectedFeatures);
  const targetFile = resolve(options.outputDirectory || profileRoot, `${options.id}.ts`);
  if (!options.dryRun) writeFileWithoutOverwrite(targetFile, source);
  return { targetFile, source };
}

async function main(): Promise<void> {
  const arguments_ = parseArguments(
    process.argv.slice(2),
    ['id', 'name', 'short-name', 'description', 'base-url', 'features', 'output'],
    ['dry-run'],
  );
  const availableFeatures = (await discoverFeatures()).map(({ feature }) => feature);
  const result = createProfileScaffold(
    {
      id: requiredArgument(arguments_, 'id'),
      name: requiredArgument(arguments_, 'name'),
      shortName: requiredArgument(arguments_, 'short-name'),
      description: arguments_.values.get('description'),
      baseUrl: arguments_.values.get('base-url'),
      featureIds: commaSeparated(requiredArgument(arguments_, 'features')),
      outputDirectory: arguments_.values.get('output'),
      dryRun: arguments_.flags.has('dry-run'),
    },
    availableFeatures,
  );

  console.log(`${arguments_.flags.has('dry-run') ? 'Profile scaffold preview' : 'Profile created'}: ${result.targetFile}`);
  console.log(`下一步：PORTAL_PROFILE=${arguments_.values.get('id')} pnpm --filter @fa/portal check`);
}

if (isDirectExecution(import.meta.url)) await main();
