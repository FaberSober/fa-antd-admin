const smokeUrl = process.env.H5_PROXY_SMOKE_URL || 'http://127.0.0.1:9002/api/base/admin/user/getLoginUser';
const allowedStatuses = new Set([200, 401, 403]);
const timeoutMs = 8_000;
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);

try {
  const response = await fetch(smokeUrl, {
    headers: {
      Accept: 'application/json',
    },
    redirect: 'manual',
    signal: controller.signal,
  });
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();

  if (!allowedStatuses.has(response.status)) {
    throw new Error(`unexpected status ${response.status}; expected 200, 401, or 403`);
  }
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`unexpected content-type "${contentType || 'missing'}"; the response may come from Vite instead of Spring`);
  }

  JSON.parse(body);
  console.log(`H5 API proxy smoke passed: ${response.status} ${contentType}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`H5 API proxy smoke failed for ${smokeUrl}: ${message}`);
  console.error('Confirm that the H5 dev server and configured Spring backend are both running.');
  process.exitCode = 1;
} finally {
  clearTimeout(timer);
}
