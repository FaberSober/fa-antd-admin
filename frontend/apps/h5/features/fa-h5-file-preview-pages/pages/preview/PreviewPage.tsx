import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiError } from '@/platform/http';
import { PageLoading } from '@/shared/components/PageLoading';
import { exchangePreviewTicket, type FilePreviewResource } from '../../api/filePreview';
import styles from './PreviewPage.module.css';

const OfficeViewer = lazy(() => import('./OfficeViewer'));

type PreviewKind = 'image' | 'video' | 'audio' | 'text' | 'office' | 'unsupported';

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v', 'avi']);
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac']);
const TEXT_EXTENSIONS = new Set(['txt', 'log', 'json', 'xml', 'csv', 'md', 'yaml', 'yml']);
const OFFICE_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'ofd']);

interface TextPreviewProps {
  url: string;
}

function TextPreview({ url }: TextPreviewProps) {
  const [text, setText] = useState('正在加载文本…');

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(setText)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setText(error instanceof Error ? `文本加载失败：${error.message}` : '文本加载失败');
        }
      });

    return () => controller.abort();
  }, [url]);

  return <pre className={styles.text}>{text}</pre>;
}

function getExtension(resource: FilePreviewResource): string {
  const source = resource.ext || resource.filename.split('.').pop() || '';
  return source.replace(/^\./, '').toLowerCase();
}

function getPreviewKind(resource: FilePreviewResource): PreviewKind {
  const extension = getExtension(resource);
  const contentType = resource.contentType?.toLowerCase() || '';
  if (contentType.startsWith('image/') || IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (contentType.startsWith('video/') || VIDEO_EXTENSIONS.has(extension)) return 'video';
  if (contentType.startsWith('audio/') || AUDIO_EXTENSIONS.has(extension)) return 'audio';
  if (contentType.startsWith('text/') || TEXT_EXTENSIONS.has(extension)) return 'text';
  if (OFFICE_EXTENSIONS.has(extension) || contentType === 'application/pdf') return 'office';
  return 'unsupported';
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className={styles.state} role="alert">
      <p className={styles.stateTitle}>文件预览失败</p>
      <p className={styles.stateMessage}>{message}</p>
    </div>
  );
}

function PreviewContent({ resource }: { resource: FilePreviewResource }) {
  const kind = useMemo(() => getPreviewKind(resource), [resource]);

  switch (kind) {
    case 'image':
      return <img className={styles.media} src={resource.previewUrl} alt={resource.filename} />;
    case 'video':
      return <video className={`${styles.media} ${styles.video}`} src={resource.previewUrl} controls playsInline />;
    case 'audio':
      return <audio className={`${styles.media} ${styles.audio}`} src={resource.previewUrl} controls />;
    case 'text':
      return <TextPreview url={resource.previewUrl} />;
    case 'office':
      return (
        <div className={styles.viewer}>
          <Suspense fallback={<PageLoading label="正在加载文件渲染器" />}>
            <OfficeViewer resource={resource} />
          </Suspense>
        </div>
      );
    default:
      return <ErrorState message="当前文件格式暂不支持在线预览。" />;
  }
}

export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const [resource, setResource] = useState<FilePreviewResource | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const exchangeStartedRef = useRef(false);

  useEffect(() => {
    if (exchangeStartedRef.current) return;
    exchangeStartedRef.current = true;

    const ticket = searchParams.get('ticket')?.trim();
    if (!ticket) {
      setErrorMessage('缺少预览凭证，请从文件列表重新打开。');
      return;
    }

    exchangePreviewTicket(ticket)
      .then((response) => {
        setResource(response.data);
        window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.hash}`);
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof ApiError ? error.message : '预览凭证无效或已过期，请重新打开。');
      });
  }, [searchParams]);

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign('/h5/');
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.toolbar}>
        <button className={styles.backButton} type="button" aria-label="返回" onClick={goBack}>
          ←
        </button>
        <span className={styles.filename}>{resource?.filename || '文件预览'}</span>
        {resource?.downloadAllowed && resource.downloadUrl ? (
          <a className={styles.downloadButton} href={resource.downloadUrl} download={resource.filename}>
            下载
          </a>
        ) : null}
      </header>
      <section className={styles.content}>
        {errorMessage ? <ErrorState message={errorMessage} /> : resource ? <PreviewContent resource={resource} /> : <PageLoading label="正在准备预览" />}
      </section>
    </main>
  );
}
