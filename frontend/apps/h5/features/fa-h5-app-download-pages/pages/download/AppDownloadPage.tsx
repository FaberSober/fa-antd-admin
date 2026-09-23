import { Link, useParams } from 'react-router-dom';
import { PageLoading } from '@/shared/components/PageLoading';
import { appDownloadApi, getDownloadFileUrl } from '../../api/appDownload';
import { AppIcon } from '../../components/AppIcon';
import { DownloadState } from '../../components/DownloadState';
import { useAppDownload } from '../../hooks/useAppDownload';
import styles from '../../styles/DownloadPages.module.css';

export default function AppDownloadPage() {
  const { shortCode } = useParams();
  const { app, versions, appLoading, appError, retry } = useAppDownload(shortCode);

  function handleDownload() {
    if (!app) return;

    window.open(getDownloadFileUrl(app.fileId), '_blank', 'noopener,noreferrer');
    // 保持旧页统计口径：当前安装包记到版本列表返回的最后一条记录。
    const currentVersion = versions[versions.length - 1];
    if (currentVersion) void appDownloadApi.addDownloadNum(currentVersion.id).catch(() => undefined);
  }

  if (appLoading) return <PageLoading label="正在加载下载信息" />;
  if (appError || !app) {
    return <DownloadState title="无法打开下载页面" description={appError || '未找到 APP 信息，请检查下载链接。'} onRetry={retry} />;
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.brandRow}>
          <span className={styles.brandMark}>APP</span>
          <span className={styles.brandLabel}>应用下载</span>
        </header>

        <section className={styles.heroCard} aria-labelledby="app-name">
          <AppIcon key={app.iconId} fileId={app.iconId} name={app.name} />
          <h1 id="app-name" className={styles.appName}>
            {app.name}
          </h1>
          <p className={styles.versionSummary}>
            <span>版本 {app.versionName}</span>
            {app.versionCode ? <span className={styles.versionCode}>版本号 {app.versionCode}</span> : null}
          </p>
          {app.remark ? <p className={styles.appRemark}>{app.remark}</p> : null}
          <button className={styles.downloadButton} type="button" onClick={handleDownload}>
            下载最新版本
          </button>
          <p className={styles.downloadHint}>点击后将下载应用安装包</p>
        </section>

        <Link className={styles.historyLink} to={`/app/${encodeURIComponent(shortCode || '')}/versions`}>
          <span>
            <strong>历史版本</strong>
            <small>查看并下载旧版本</small>
          </span>
          <span className={styles.historyCount}>
            {versions.length > 0 ? `${versions.length} 个版本` : '查看'} <span aria-hidden="true">›</span>
          </span>
        </Link>
      </div>
    </main>
  );
}
