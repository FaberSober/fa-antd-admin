import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { fileURLToPath, URL } from 'node:url';

function resolveUniPlugin(value: unknown): typeof uni {
  if (typeof value === 'function') return value as typeof uni;
  if (value && typeof value === 'object' && 'default' in value) {
    return resolveUniPlugin(value.default);
  }
  throw new TypeError('@dcloudio/vite-plugin-uni did not expose a plugin factory');
}

const uniPlugin = resolveUniPlugin(uni);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const srcDir = fileURLToPath(new URL('./src', import.meta.url));

  return {
    plugins: [uniPlugin()],
    resolve: {
      alias: {
        '@': srcDir,
        '@features': `${srcDir}/features`,
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9100,
      proxy: {
        '/api': {
          target: env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
