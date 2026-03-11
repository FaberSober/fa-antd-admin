import { useEffect, useState } from 'react';

/**
 * 动态加载外部 CSS 样式 Hook
 * @param href 外部样式的 URL
 * @param options 可选项：是否开启缓存、是否跨域、是否设置id
 */
export default function useLoadStyle(
  href: string,
  options: {
    crossOrigin?: string;
    cache?: boolean;
    id?: string;
  } = {}
) {
  const { crossOrigin = 'anonymous', cache = true, id } = options;

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!href) {
      setError('样式 href 为空');
      return;
    }

    // 检查是否已存在（避免重复加载）
    const existingLink = document.querySelector(
      `link[rel="stylesheet"][href="${href}"]`
    ) as HTMLLinkElement | null;

    if (existingLink && cache) {
      if ((window as any).__loadedStyles?.[href]) {
        setLoaded(true);
        return;
      }
    }

    // 创建 link 标签
    const link = document.createElement('link');
    if (id) link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;

    // 加载成功
    const handleLoad = () => {
      (window as any).__loadedStyles = (window as any).__loadedStyles || {};
      (window as any).__loadedStyles[href] = true;
      setLoaded(true);
    };

    // 加载失败
    const handleError = () => {
      setError(`样式加载失败: ${href}`);
      setLoaded(false);
    };

    link.addEventListener('load', handleLoad);
    link.addEventListener('error', handleError);

    document.head.appendChild(link);

    // 清理 — 移除监听器即可，不删除 link（与 useLoadScript 行为保持一致）
    return () => {
      link.removeEventListener('load', handleLoad);
      link.removeEventListener('error', handleError);
    };
  }, [href]);

  return { loaded, error };
}
