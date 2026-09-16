import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { portalComposition } from '../app/portal-profile';

const FALLBACK_SITE_URL = 'http://localhost:9001/portal/';

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

export const buildDirectory = resolve(process.cwd(), process.env.PORTAL_BUILD_DIRECTORY || 'dist');
export const clientDirectory = buildDirectory;
export const deploymentDirectory = resolve(buildDirectory, 'static');
export const portalBaseUrl = portalComposition.profile.site.baseUrl;
export const portalOutputDirectory = clientDirectory;

export function resolveSiteUrl(): { value: string; fallback: boolean } {
  const configured = process.env.VITE_PORTAL_SITE_URL?.trim();
  if (!configured) return { value: FALLBACK_SITE_URL, fallback: true };

  const siteUrl = new URL(ensureTrailingSlash(configured));
  if (!['http:', 'https:'].includes(siteUrl.protocol)) {
    throw new Error(`VITE_PORTAL_SITE_URL 只允许 http/https：${configured}`);
  }

  const expectedPath = ensureTrailingSlash(portalBaseUrl);
  if (siteUrl.pathname !== expectedPath) {
    throw new Error(`VITE_PORTAL_SITE_URL 必须包含 Portal basename "${expectedPath}"：${configured}`);
  }

  return { value: siteUrl.toString(), fallback: false };
}

export function assertBuildExists(): void {
  if (!existsSync(clientDirectory)) {
    throw new Error(`Portal 客户端产物不存在：${clientDirectory}`);
  }
}
