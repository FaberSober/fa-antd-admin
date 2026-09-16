import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertBuildExists, clientDirectory, deploymentDirectory, portalOutputDirectory } from './build-utils';

assertBuildExists();

const deployedPortalDirectory = resolve(deploymentDirectory, 'portal');
rmSync(deploymentDirectory, { recursive: true, force: true });
mkdirSync(deployedPortalDirectory, { recursive: true });

cpSync(portalOutputDirectory, deployedPortalDirectory, { recursive: true });
cpSync(resolve(clientDirectory, 'assets'), resolve(deployedPortalDirectory, 'assets'), { recursive: true });
cpSync(resolve(clientDirectory, 'favicon.svg'), resolve(deployedPortalDirectory, 'favicon.svg'));
cpSync(resolve(clientDirectory, 'index.html'), resolve(deployedPortalDirectory, '__spa-fallback.html'));
cpSync(resolve(clientDirectory, 'robots.txt'), resolve(deploymentDirectory, 'robots.txt'));

console.log('Portal deployment output prepared: dist/static (prerender, SPA fallback, assets, sitemap, robots)');
