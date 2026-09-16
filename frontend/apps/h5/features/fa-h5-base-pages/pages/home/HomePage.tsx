import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useH5Registry } from '@/platform/feature';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import styles from './HomePage.module.css';

const platformCapabilities = [
  {
    title: '静态装配',
    description: '项目预设通过静态 import 选择 Feature，未启用模块不会进入运行时路由。',
  },
  {
    title: '冲突前置',
    description: '依赖、路由、权限和入口冲突在开发或构建开始前统一失败。',
  },
  {
    title: '移动边界',
    description: 'Feature 禁止引用 Admin、桌面 Ant Design 和 @fa/ui 页面组件。',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const registry = useH5Registry();
  useDocumentTitle('移动工作台');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>MODULE COMPOSITION BETA</span>
        <h1>{registry.project.title}</h1>
        <p>
          当前项目预设为 <strong>{registry.project.id}</strong>，已静态装配 <strong>{registry.featureIds.length}</strong> 个 Feature。
        </p>
        <ul className={styles.featureTags} aria-label="已启用 Feature">
          {registry.featureIds.map((featureId) => (
            <li key={featureId}>{featureId}</li>
          ))}
        </ul>
      </section>

      {registry.homeEntries.length > 0 ? (
        <section className={styles.entries} aria-label="项目入口">
          <div className={styles.sectionTitle}>
            <span>PROJECT ENTRIES</span>
            <h2>项目功能</h2>
          </div>
          <div className={styles.entryGrid}>
            {registry.homeEntries.map((entry) => {
              const route = registry.routeMap.get(entry.routeId);
              return (
                <button className={styles.entry} key={entry.id} onClick={() => route && navigate(route.path)} type="button">
                  <span className={styles.entryIndex}>{entry.icon ?? 'app'}</span>
                  <strong>{entry.title}</strong>
                  <small>{entry.description ?? route?.title}</small>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className={styles.capabilities} aria-label="M2 模块装配能力">
        {platformCapabilities.map((item, index) => (
          <article className={styles.capability} key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <Button block fill="outline" onClick={() => navigate('/network-error')}>
        查看平台异常状态
      </Button>
    </div>
  );
}
