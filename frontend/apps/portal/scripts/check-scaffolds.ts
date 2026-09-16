import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import ts from 'typescript';
import { createFeatureScaffold } from './create-feature';
import { createProfileScaffold } from './create-profile';
import { discoverFeatures, parseArguments } from './engineering-utils';

const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'fa-pages-scaffold-'));

const separatedArguments = parseArguments(['--', '--id', 'fixture', '--dry-run'], ['id'], ['dry-run']);
assert.equal(separatedArguments.values.get('id'), 'fixture');
assert(separatedArguments.flags.has('dry-run'));

function assertTypescriptSyntax(file: string): void {
  const result = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: file,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  assert.equal(
    errors.length,
    0,
    errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'),
  );
}

try {
  const featureOutput = resolve(fixtureRoot, 'features');
  const featureResult = createFeatureScaffold({
    id: 'fa-pricing-pages',
    route: 'pricing',
    label: '产品定价',
    description: '查看产品版本和定价。',
    dependsOn: ['fa-admin-pages'],
    outputDirectory: featureOutput,
  });
  assert(existsSync(resolve(featureResult.targetDirectory, 'feature.ts')));
  assert(existsSync(resolve(featureResult.targetDirectory, 'routes.ts')));
  assert(existsSync(resolve(featureResult.targetDirectory, 'pages/pricing.tsx')));
  assert.match(readFileSync(resolve(featureResult.targetDirectory, 'feature.ts'), 'utf8'), /dependsOn: \['fa-admin-pages'\]/);
  assertTypescriptSyntax(resolve(featureResult.targetDirectory, 'feature.ts'));
  assertTypescriptSyntax(resolve(featureResult.targetDirectory, 'routes.ts'));
  assertTypescriptSyntax(resolve(featureResult.targetDirectory, 'pages/pricing.tsx'));
  assert.throws(
    () =>
      createFeatureScaffold({
        id: 'fa-pricing-pages',
        route: 'pricing',
        label: '重复',
        outputDirectory: featureOutput,
      }),
    /拒绝覆盖/,
  );

  const availableFeatures = (await discoverFeatures()).map(({ feature }) => feature);
  const profileResult = createProfileScaffold(
    {
      id: 'customer-fixture',
      name: 'Customer Fixture',
      shortName: 'CF',
      featureIds: ['fa-admin-pages', 'fa-ai-pages'],
      outputDirectory: resolve(fixtureRoot, 'profiles'),
    },
    availableFeatures,
  );
  assert(existsSync(profileResult.targetFile));
  assert.match(profileResult.source, /import faAdminPagesFeature from '\.\.\/features\/fa-admin-pages\/feature';/);
  assert.doesNotMatch(profileResult.source, /import\.meta\.glob/);
  assertTypescriptSyntax(profileResult.targetFile);

  assert.throws(
    () =>
      createProfileScaffold(
        {
          id: 'missing-dependency',
          name: 'Missing Dependency',
          shortName: 'MD',
          featureIds: ['fa-ai-pages'],
          outputDirectory: resolve(fixtureRoot, 'profiles'),
        },
        availableFeatures,
      ),
    /需要 "fa-admin-pages"/,
  );
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log('Portal scaffold validation passed: feature, profile, no-overwrite, dependencies');
