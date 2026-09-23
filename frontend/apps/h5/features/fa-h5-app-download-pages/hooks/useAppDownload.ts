import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/platform/http';
import { appDownloadApi } from '../api/appDownload';
import type { DownloadApp, DownloadAppVersion } from '../types/appDownload';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.message ? error.message : fallback;
}

export function useAppDownload(shortCode: string | undefined) {
  const [app, setApp] = useState<DownloadApp | null>(null);
  const [versions, setVersions] = useState<DownloadAppVersion[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [versionsError, setVersionsError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setApp(null);
    setVersions([]);
    setAppError('');
    setVersionsError('');
    setAppLoading(true);
    setVersionsLoading(false);

    if (!shortCode) {
      setAppError('下载链接无效，请检查短链地址。');
      setAppLoading(false);
      return () => controller.abort();
    }

    appDownloadApi
      .getByShortCode(shortCode, controller.signal)
      .then(async (response) => {
        if (!response.data) {
          setAppError('未找到 APP 信息，请检查下载链接。');
          return;
        }

        setApp(response.data);
        setVersionsLoading(true);
        try {
          const versionsResponse = await appDownloadApi.listVersions(response.data.id, controller.signal);
          setVersions(versionsResponse.data ?? []);
        } catch (error) {
          if (!controller.signal.aborted) {
            setVersionsError(getErrorMessage(error, '历史版本暂时无法加载。'));
          }
        } finally {
          if (!controller.signal.aborted) setVersionsLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setAppError(getErrorMessage(error, '下载信息加载失败，请稍后重试。'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setAppLoading(false);
      });

    return () => controller.abort();
  }, [shortCode, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { app, versions, appLoading, versionsLoading, appError, versionsError, retry };
}
