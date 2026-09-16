import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { assertBuildExists, deploymentDirectory, portalBaseUrl } from './build-utils';

const mimeTypes: Readonly<Record<string, string>> = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};
const staticResourcePattern = /\.(?:avif|css|data|gif|ico|jpe?g|js|json|map|png|svg|txt|webp|woff2?|xml)$/i;

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function isFile(file: string): boolean {
  return existsSync(file) && statSync(file).isFile();
}

function safeResolve(root: string, path: string): string | undefined {
  const file = resolve(root, path);
  return file === root || file.startsWith(`${root}${sep}`) ? file : undefined;
}

function sendFile(response: ServerResponse, file: string, method: string): void {
  response.statusCode = 200;
  response.setHeader('Content-Type', mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream');
  response.setHeader('Cache-Control', 'no-cache');
  if (method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(file).pipe(response);
}

function sendStatus(response: ServerResponse, status: number, message: string): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end(message);
}

assertBuildExists();
if (!isFile(resolve(deploymentDirectory, 'portal', '__spa-fallback.html'))) {
  throw new Error('Portal 部署产物不存在，请先执行 pnpm --filter @fa/portal build');
}

const host = readArgument('--host') || process.env.PORTAL_PREVIEW_HOST || '127.0.0.1';
const port = Number(readArgument('--port') || process.env.PORTAL_PREVIEW_PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Portal preview port 无效：${port}`);

const server = createServer((request, response) => {
  const method = request.method || 'GET';
  if (!['GET', 'HEAD'].includes(method)) {
    response.setHeader('Allow', 'GET, HEAD');
    sendStatus(response, 405, 'Method Not Allowed');
    return;
  }

  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(request.url || '/', `http://${host}:${port}`).pathname);
  } catch {
    sendStatus(response, 400, 'Bad Request');
    return;
  }

  if (pathname === portalBaseUrl.slice(0, -1)) {
    response.statusCode = 308;
    response.setHeader('Location', portalBaseUrl);
    response.end();
    return;
  }

  if (pathname === '/robots.txt') {
    const robotsFile = resolve(deploymentDirectory, 'robots.txt');
    if (isFile(robotsFile)) sendFile(response, robotsFile, method);
    else sendStatus(response, 404, 'Not Found');
    return;
  }

  if (!pathname.startsWith(portalBaseUrl)) {
    sendStatus(response, 404, 'Not Found');
    return;
  }

  const portalPath = pathname.slice(portalBaseUrl.length);
  const deployedPortalDirectory = resolve(deploymentDirectory, 'portal');
  const publicFile = safeResolve(deployedPortalDirectory, portalPath);
  if (publicFile && isFile(publicFile)) {
    sendFile(response, publicFile, method);
    return;
  }

  const prerenderedFile = safeResolve(deployedPortalDirectory, `${portalPath}/index.html`);
  if (prerenderedFile && isFile(prerenderedFile)) {
    sendFile(response, prerenderedFile, method);
    return;
  }

  if (staticResourcePattern.test(pathname)) {
    sendStatus(response, 404, 'Not Found');
    return;
  }

  const fallbackFile = resolve(deployedPortalDirectory, '__spa-fallback.html');
  if (isFile(fallbackFile)) sendFile(response, fallbackFile, method);
  else sendStatus(response, 404, 'Not Found');
});

server.listen(port, host, () => {
  console.log(`Portal preview: http://${host}:${port}${portalBaseUrl}`);
});
