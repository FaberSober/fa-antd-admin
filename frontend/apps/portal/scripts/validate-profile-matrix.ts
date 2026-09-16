import assert from 'node:assert/strict';
import { composePortalProfile } from '../app/kernel/feature';
import { portalKernelNavigation, portalKernelRoutes } from '../app/kernel/portalKernel';
import { discoverProfiles, profileFileName } from './engineering-utils';

const profiles = await discoverProfiles();
assert(profiles.length > 0, '至少需要一个 Portal Profile');
const profileIds = new Set<string>();
const rows = profiles.map((discovered) => {
  assert.equal(profileFileName(discovered), discovered.profile.id, `Profile 文件名必须等于 ID：${discovered.file}`);
  assert(!profileIds.has(discovered.profile.id), `Profile ID 重复：${discovered.profile.id}`);
  profileIds.add(discovered.profile.id);

  const composition = composePortalProfile(discovered.profile, {
    kernelRoutes: portalKernelRoutes,
    kernelNavigation: portalKernelNavigation,
  });
  return {
    Profile: composition.profile.id,
    Features: composition.featureIds.length,
    Routes: composition.routes.length,
    Navigation: composition.navigation.length,
    Prerender: composition.prerenderPaths.length,
    Warnings: composition.warnings.length,
  };
});

for (const requiredProfile of ['default', 'minimal']) {
  assert(profileIds.has(requiredProfile), `典型 Profile "${requiredProfile}" 不存在`);
}

console.table(rows);
console.log(`Portal profile matrix passed: ${[...profileIds].sort().join(', ')}`);
