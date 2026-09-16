import { Link, type MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: 'FA Portal｜轻量门户应用',
    description: '独立构建、快速加载，并可按业务 Feature 自由组合的门户应用。',
    path: '/',
  });

export default function HomePage() {
  return (
    <>
      <div className={styles.heroPage}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>FA AI · DIGITAL WORKFORCE</p>
          <h1>让智能能力，更快进入真实业务</h1>
          <p className={styles.lead}>从知识、流程到智能体，用轻量门户连接每一位用户，让 AI 能力即开即用、持续进化。</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/products">
              探索产品
            </Link>
            <Link className={styles.secondaryAction} to="/contact">
              预约交流
            </Link>
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>CORE CAPABILITIES</p>
            <h2>一套可组合的智能业务底座</h2>
            <p>按业务选择所需模块，保持入口轻量，同时为复杂场景保留足够的扩展空间。</p>
          </div>
        </div>
        <div className={styles.featureGrid}>
          {[
            ['智能体平台', '连接模型、知识库与工作流，快速发布面向客户或员工的智能助手。'],
            ['企业知识', '把分散文档变成可治理、可检索、可追溯的业务知识。'],
            ['数据问答', '用自然语言理解数据口径，在安全边界内完成查询与洞察。'],
          ].map(([title, description], index) => (
            <article className={styles.featureCard} key={title}>
              <span className={styles.tag}>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.sectionMuted}>
        <section className={styles.section}>
          <div className={styles.metricGrid}>
            {[
              ['独立构建', '不加载 Admin 重型运行时'],
              ['按需组合', 'Feature 随项目自由选择'],
              ['统一身份', '一套账号连接 Portal 与 Admin'],
              ['流式体验', '智能体回答实时呈现'],
            ].map(([value, label]) => (
              <div className={styles.metric} key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.cta}>
          <div>
            <h2>从一个清晰的业务问题开始</h2>
            <p>告诉我们你的场景，一起设计可上线、可衡量的智能化方案。</p>
          </div>
          <Link className={styles.primaryAction} to="/contact">
            开始沟通
          </Link>
        </div>
      </section>
    </>
  );
}
