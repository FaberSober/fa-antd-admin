import { useEffect, useState } from 'react';

/**
 * 动态加载外部脚本 Hook
 * @param src 外部脚本的 URL
 * @param options 可选项：是否开启缓存、是否跨域
 */
export default function useLoadScript(
  src: string,
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
    if (!src) {
      setError('脚本地址为空');
      return;
    }

    // 检查是否已存在（避免重复加载）
    const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    if (existingScript && cache) {
      if ((window as any).__loadedScripts?.[src]) {
        setLoaded(true);
        return;
      }
    }

    // 创建 script 标签
    const script = document.createElement('script');
    if (id) script.id = id;
    script.src = src;
    script.crossOrigin = crossOrigin;
    script.async = true;

    // 处理加载成功
    const handleLoad = () => {
      (window as any).__loadedScripts = (window as any).__loadedScripts || {};
      (window as any).__loadedScripts[src] = true;
      setLoaded(true);
    };

    // 处理加载失败
    const handleError = () => {
      setError(`脚本加载失败: ${src}`);
      setLoaded(false);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.head.appendChild(script);

    // 清理函数（卸载组件时移除监听器）
    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [src]);

  return { loaded, error };
}
