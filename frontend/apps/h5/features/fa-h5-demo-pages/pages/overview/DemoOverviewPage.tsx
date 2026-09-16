import { ProgressBar, Steps } from 'antd-mobile';
import { useH5Registry } from '@/platform/feature';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import styles from './DemoOverviewPage.module.css';

const { Step } = Steps;

export default function DemoOverviewPage() {
  const registry = useH5Registry();
  useDocumentTitle('装配示例');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span>FA-H5-DEMO-PAGES</span>
        <h1>Feature 已由项目预设启用</h1>
        <p>本页只存在于 demo 项目的 Registry；default 项目不会注册 `/app/demo`。</p>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <span>COMPOSITION</span>
            <h2>{registry.project.title}</h2>
          </div>
          <strong>{registry.featureIds.length} Features</strong>
        </div>
        <ProgressBar percent={100} />
        <Steps direction="vertical">
          <Step title="静态导入" description="项目预设只导入启用的 Feature 公共出口。" />
          <Step title="契约校验" description="Composer 验证依赖、路由、权限和入口。" />
          <Step title="按路由加载" description="页面组件继续通过 route.lazy 拆分。" />
        </Steps>
      </section>
    </div>
  );
}
