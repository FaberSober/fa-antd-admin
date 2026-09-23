import { useState } from 'react';
import { getDownloadFileUrl } from '../api/appDownload';
import styles from '../styles/DownloadPages.module.css';

interface AppIconProps {
  fileId: string;
  name: string;
}

export function AppIcon({ fileId, name }: AppIconProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={styles.appIcon}>
      {failed ? <span>{name.trim().charAt(0) || 'A'}</span> : <img src={getDownloadFileUrl(fileId)} alt={`${name} 图标`} onError={() => setFailed(true)} />}
    </div>
  );
}
