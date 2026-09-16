import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  useDocumentTitle('登录');

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <span>FA H5</span>
          <strong>移动管理平台</strong>
        </div>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>M1 LOGIN SHELL</span>
          <h1>登录界面基础壳</h1>
          <p>本页用于验证公开路由、移动端布局和首屏依赖边界。账号密码登录与会话恢复将在 M3 接入。</p>
        </div>

        <Button block color="primary" size="large" onClick={() => navigate('/app')}>
          进入平台预览
        </Button>
        <p className={styles.hint}>当前按钮不执行真实鉴权，不可用于生产业务访问。</p>
      </section>
    </main>
  );
}
