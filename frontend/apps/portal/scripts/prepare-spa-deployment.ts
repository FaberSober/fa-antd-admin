import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertBuildExists, clientDirectory, deploymentDirectory } from './build-utils';

assertBuildExists();

const deployedPortalDirectory = resolve(deploymentDirectory, 'portal');
rmSync(deploymentDirectory, { recursive: true, force: true });
mkdirSync(deployedPortalDirectory, { recursive: true });

cpSync(resolve(clientDirectory, 'assets'), resolve(deployedPortalDirectory, 'assets'), { recursive: true });
cpSync(resolve(clientDirectory, 'favicon.svg'), resolve(deployedPortalDirectory, 'favicon.svg'));
cpSync(resolve(clientDirectory, 'index.html'), resolve(deployedPortalDirectory, 'index.html'));
cpSync(resolve(clientDirectory, 'index.html'), resolve(deployedPortalDirectory, '__spa-fallback.html'));
cpSync(resolve(clientDirectory, 'sitemap.xml'), resolve(deployedPortalDirectory, 'sitemap.xml'));
cpSync(resolve(clientDirectory, 'robots.txt'), resolve(deploymentDirectory, 'robots.txt'));

console.log('Portal SPA deployment output prepared: dist/static (SPA fallback, assets, sitemap, robots)');
