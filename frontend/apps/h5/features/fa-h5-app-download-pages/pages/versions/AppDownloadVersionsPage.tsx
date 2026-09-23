import { Link, useParams } from 'react-router-dom';
import { PageLoading } from '@/shared/components/PageLoading';
import { appDownloadApi, getDownloadFileUrl } from '../../api/appDownload';
import { DownloadState } from '../../components/DownloadState';
import { useAppDownload } from '../../hooks/useAppDownload';
import styles from '../../styles/DownloadPages.module.css';

export default function AppDownloadVersionsPage() {
  const { shortCode } = useParams();
  const { app, versions, appLoading, versionsLoading, appError, versionsError, retry } = useAppDownload(shortCode);

  function handleDownload(versionId: number, fileId: string) {
    window.open(getDownloadFileUrl(fileId), '_blank', 'noopener,noreferrer');
    void appDownloadApi.addDownloadNum(versionId).catch(() => undefined);
  }

  if (appLoading || (app && versionsLoading)) return <PageLoading label="正在加载版本列表" />;
  if (appError || !app) {
    return <DownloadState title="无法打开版本列表" description={appError || '未找到 APP 信息，请检查下载链接。'} onRetry={retry} />;
  }
  if (versionsError) {
    return <DownloadState title="历史版本加载失败" description={versionsError} onRetry={retry} />;
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <Link className={styles.backLink} to={`/app/${encodeURIComponent(shortCode || '')}`} aria-label="返回下载页面">
            <span aria-hidden="true">‹</span>
          </Link>
          <div>
            <span className={styles.eyebrow}>APP DOWNLOAD</span>
            <h1 className={styles.pageTitle}>历史版本</h1>
          </div>
        </header>

        <div className={styles.appSummary}>
          <span className={styles.appSummaryName}>{app.name}</span>
          <span className={styles.appSummaryVersion}>当前版本 {app.versionName}</span>
        </div>

        {versions.length === 0 ? (
          <section className={styles.emptyState}>
            <span className={styles.emptyMark} aria-hidden="true">
              ↻
            </span>
            <h2>暂无历史版本</h2>
            <p>目前没有可供下载的旧版本。</p>
          </section>
        ) : (
          <section className={styles.versionList} aria-label={`${app.name}历史版本`}>
            {versions.map((version, index) => (
              <article className={styles.versionCard} key={version.id}>
                <div className={styles.versionCardHeader}>
                  <div className={styles.versionDetails}>
                    <h2>{version.versionName || `版本 ${version.versionCode}`}</h2>
                    <p>版本号 {version.versionCode}</p>
                  </div>
                  {index === versions.length - 1 ? <span className={styles.latestBadge}>最新</span> : null}
                </div>
                {version.crtTime ? <p className={styles.releaseTime}>发布时间：{version.crtTime}</p> : null}
                {version.remark ? <p className={styles.versionRemark}>{version.remark}</p> : null}
                <button className={styles.versionDownloadButton} type="button" onClick={() => handleDownload(version.id, version.fileId)}>
                  下载此版本
                </button>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
