import { List } from 'antd-mobile';
import { useH5Registry } from '@/platform/feature';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import styles from './MePage.module.css';

export default function MePage() {
  const registry = useH5Registry();
  useDocumentTitle('我的');

  return (
    <div className={styles.page}>
      <section className={styles.profile}>
        <span className={styles.avatar}>FA</span>
        <div>
          <span className={styles.eyebrow}>M2 PREVIEW</span>
          <h1>移动管理用户</h1>
          <p>真实会话、租户与权限数据将在 M3 接入。</p>
        </div>
      </section>

      <List header="当前装配">
        <List.Item description={registry.project.title}>项目：{registry.project.id}</List.Item>
        <List.Item description={registry.featureIds.join('、')}>Feature：{registry.featureIds.length} 个</List.Item>
        <List.Item description={`${registry.routes.length} 条已注册路由`}>Registry</List.Item>
      </List>
    </div>
  );
}
