import { Link, type MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '解决方案｜FA Portal',
    description: '面向客户服务、知识协同、经营分析和流程自动化的 AI 解决方案。',
    path: '/solutions',
  });

const solutions = [
  ['智能客户服务', '连接产品知识和服务流程，为客户提供快速、统一、可追踪的回答。'],
  ['企业知识协同', '让制度、项目资料和专家经验以自然语言方式被团队发现与复用。'],
  ['经营数据助手', '在权限和 SQL 安全边界内，让业务用户更快获得指标和分析结果。'],
  ['流程智能化', '把判断、检索、生成和系统动作编排成可观察的智能工作流。'],
];

export default function SolutionsPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '解决方案' }]} />
          <p className={styles.eyebrow}>SOLUTIONS</p>
          <h1>从业务目标出发，而不是从模型出发</h1>
          <p className={styles.lead}>围绕使用者、数据和流程设计完整闭环，让每个 AI 场景都能被验证和持续改进。</p>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.featureGrid}>
          {solutions.map(([title, description], index) => (
            <article className={styles.featureCard} key={title}>
              <span className={styles.tag}>S{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.cta}>
          <div>
            <h2>需要一个更贴近行业的方案？</h2>
            <p>我们可以从业务流程、数据条件和上线范围一起梳理。</p>
          </div>
          <Link className={styles.primaryAction} to="/contact">
            联系方案顾问
          </Link>
        </div>
      </section>
    </>
  );
}
