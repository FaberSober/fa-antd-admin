import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import styles from './ButtonDemoPage.module.css';

export default function ButtonDemoPage() {
  const navigate = useNavigate();
  useDocumentTitle('Button Demo');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <button className={styles.backLink} onClick={() => navigate('/app/demo')} type="button">
          ← Demo 列表
        </button>
        <span className={styles.eyebrow}>BUTTON / BASIC</span>
        <h1>Button</h1>
        <p>保留常用的按钮颜色、填充、尺寸和状态，作为移动端页面的基础参考。</p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>COLOR</span>
          <h2>颜色</h2>
        </div>
        <div className={styles.buttonGrid}>
          <Button block color="primary">
            Primary
          </Button>
          <Button block color="success">
            Success
          </Button>
          <Button block color="warning">
            Warning
          </Button>
          <Button block color="danger">
            Danger
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>FILL</span>
          <h2>填充方式</h2>
        </div>
        <div className={styles.buttonStack}>
          <Button block color="primary" fill="solid">
            Solid
          </Button>
          <Button block color="primary" fill="outline">
            Outline
          </Button>
          <Button block color="primary" fill="none">
            None
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>SIZE</span>
          <h2>尺寸</h2>
        </div>
        <div className={styles.sizeGrid}>
          <Button block color="primary" size="small">
            Small
          </Button>
          <Button block color="primary" size="middle">
            Middle
          </Button>
          <Button block color="primary" size="large">
            Large
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>STATE</span>
          <h2>状态</h2>
        </div>
        <div className={styles.buttonGrid}>
          <Button block color="primary" loading>
            Loading
          </Button>
          <Button block disabled>
            Disabled
          </Button>
        </div>
      </section>

      <Button block fill="none" onClick={() => navigate('/app/demo')}>
        返回 Demo 列表
      </Button>
    </div>
  );
}
