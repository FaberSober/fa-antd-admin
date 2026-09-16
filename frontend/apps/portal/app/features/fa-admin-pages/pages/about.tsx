import { Link, type MetaFunction } from 'react-router-dom';
import { createPortalMeta } from '../../../kernel/seo';
import styles from '../../../shared/styles/page.module.css';
import { Breadcrumbs } from '../../../shared/ui/Breadcrumbs';

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '关于我们｜FA Portal',
    description: '了解 FA Portal 的架构目标和工程原则。',
    path: '/about',
  });

export default function AboutPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <Breadcrumbs items={[{ label: '关于我们' }]} />
          <p className={styles.eyebrow}>ABOUT FA AI</p>
          <h1>把复杂技术，变成可靠的业务能力</h1>
          <p className={styles.lead}>我们关注的不只是模型效果，更是智能能力如何安全、清晰地进入团队的日常工作。</p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.split}>
          <div>
            <p className={styles.eyebrow}>OUR MISSION</p>
            <h2>让每个团队都能拥有自己的智能工作方式</h2>
            <p>FA AI 以可组合产品和开放工程体系，帮助企业从单点试验走向长期可运营的 AI 应用。</p>
            <Link className={styles.textLink} to="/contact">
              与我们交流 →
            </Link>
          </div>
          <div className={styles.visualPanel}>
            <span>FA AI / 2026</span>
            <strong>清晰边界，持续创造价值。</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>TEAM & TRUST</p>
            <h2>跨产品、AI 与工程交付的协作团队</h2>
            <p>正式团队介绍和企业资质图片将在业务资料确认后替换；当前页面先固化可扩展的信息结构。</p>
          </div>
        </div>
        <div className={styles.featureGrid}>
          {[
            ['产品与方案', '从业务目标和使用者体验出发，定义可验证的智能化场景。'],
            ['AI 与数据工程', '连接模型、知识和数据，并建立准确性、安全性与可观测边界。'],
            ['平台与交付', '通过统一身份、权限、审计和模块化工程能力支持持续上线。'],
          ].map(([title, description]) => (
            <article className={styles.featureCard} key={title}>
              <span className={styles.tag}>专业能力</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.sectionMuted}>
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>MILESTONES</p>
              <h2>发展历程</h2>
            </div>
          </div>
          <div className={styles.timeline}>
            {[
              ['2023', '平台起步', '完成统一后台、权限与业务开发底座。'],
              ['2024', '连接知识', '建立企业知识库、模型接入与检索增强能力。'],
              ['2025', '走向智能体', '加入可视化工作流、发布与运营分析。'],
              ['2026', '面向真实用户', '独立 Portal 让智能应用更轻、更快、更易组合。'],
            ].map(([year, title, description]) => (
              <article className={styles.timelineItem} key={year}>
                <time>{year}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
