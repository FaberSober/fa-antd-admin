import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { buttonDemoRoute } from '../../routes';
import styles from './DemoOverviewPage.module.css';

const demoItems = [
  {
    id: 'button',
    index: '01',
    title: 'Button',
    description: '基础颜色、填充方式、尺寸和常见状态。',
  },
] as const;

export default function DemoOverviewPage() {
  const navigate = useNavigate();
  useDocumentTitle('Demo');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>COMPONENT DEMOS</span>
          <strong>{String(demoItems.length).padStart(2, '0')} ITEMS</strong>
        </div>
        <h1>Demo</h1>
        <p>查看 H5 组件在移动端的基础用法与交互表现。</p>
      </section>

      <section className={styles.listSection} aria-label="Demo 功能列表">
        <div className={styles.sectionHeading}>
          <span>DEMO LIST</span>
          <h2>功能列表</h2>
        </div>
        <div className={styles.demoList}>
          {demoItems.map((item) => (
            <button className={styles.demoItem} key={item.id} onClick={() => navigate(buttonDemoRoute.path)} type="button">
              <span className={styles.itemIndex}>{item.index}</span>
              <span className={styles.itemCopy}>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <span aria-hidden="true" className={styles.itemArrow}>
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      <Button block fill="none" onClick={() => navigate('/app/home')}>
        返回工作台
      </Button>
    </div>
  );
}
