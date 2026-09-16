import { useNavigate } from 'react-router-dom';
import { useH5Registry } from '@/platform/feature';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const registry = useH5Registry();
  useDocumentTitle('工作台');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroMark}>FA</span>
        <div>
          <span className={styles.eyebrow}>FA H5 WORKSPACE</span>
          <h1>工作台</h1>
          <p>选择一个功能开始使用。</p>
        </div>
      </section>

      <section className={styles.entries} aria-label="功能入口">
        <div className={styles.sectionTitle}>
          <span>QUICK ACCESS</span>
          <h2>功能入口</h2>
        </div>
        {registry.homeEntries.length > 0 ? (
          <div className={styles.entryGrid}>
            {registry.homeEntries.map((entry) => {
              const route = registry.routeMap.get(entry.routeId);
              return (
                <button className={styles.entry} key={entry.id} onClick={() => route && navigate(route.path)} type="button">
                  <span className={styles.entryTopline}>
                    <span className={styles.entryIndex}>{entry.icon ?? 'app'}</span>
                    <span aria-hidden="true" className={styles.entryArrow}>
                      →
                    </span>
                  </span>
                  <strong>{entry.title}</strong>
                  <small>{entry.description ?? route?.title}</small>
                </button>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty}>暂无可用功能</p>
        )}
      </section>
    </div>
  );
}
