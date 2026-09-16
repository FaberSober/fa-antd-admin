export interface PortalArticle {
  slug: string;
  type: 'case' | 'news';
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  sections: readonly { title: string; content: string }[];
}

export const portalArticles = [
  {
    slug: 'knowledge-assistant-launch',
    type: 'case',
    category: '企业知识',
    title: '让一线团队更快找到可信答案',
    summary: '通过统一知识治理和智能体入口，减少跨系统查找，让制度与产品资料真正服务业务现场。',
    publishedAt: '2026-06-18',
    readTime: '6 分钟',
    sections: [
      { title: '挑战', content: '资料散落在多个系统，新员工学习周期长，经验丰富的同事承担大量重复答疑。' },
      { title: '方案', content: '建立结构化知识范围和检索验证流程，再通过面向员工的智能体提供统一入口。' },
      { title: '结果', content: '常见问题响应更及时，回答能够展示知识来源，内容负责人也可以持续发现知识缺口。' },
    ],
  },
  {
    slug: 'operations-data-copilot',
    type: 'case',
    category: '数据分析',
    title: '把日常取数变成自然语言对话',
    summary: '使用语义数据集和查询守卫，让运营团队在可控范围内完成常见指标查询。',
    publishedAt: '2026-05-09',
    readTime: '5 分钟',
    sections: [
      { title: '挑战', content: '业务问题变化快，分析师需要频繁响应简单取数，指标口径也容易在沟通中偏移。' },
      { title: '方案', content: '沉淀术语、指标和示例查询，用 SQL 安全校验约束访问范围，并保留完整审计记录。' },
      { title: '结果', content: '运营人员能够自助完成高频查询，分析团队把更多时间投入到复杂洞察和策略设计。' },
    ],
  },
  {
    slug: 'portal-framework-mode',
    type: 'news',
    category: '产品更新',
    title: 'FA Portal 推出轻量 Feature/Profile 架构',
    summary: '官网与普通用户应用独立构建，业务模块可以按项目组合，未启用能力不进入交付产物。',
    publishedAt: '2026-07-23',
    readTime: '4 分钟',
    sections: [
      { title: '为什么独立 Portal', content: '公开页面和用户聊天不再加载后台管理的组件、页面与服务聚合模块，入口更加清晰轻量。' },
      { title: '如何自由组合', content: '每个业务域通过 Feature 契约声明路由、导航和预渲染路径，Profile 静态选择项目所需能力。' },
      { title: '下一步', content: '继续完成预渲染、性能预算和 Spring Boot 静态发布的端到端验收。' },
    ],
  },
  {
    slug: 'agent-user-loop',
    type: 'news',
    category: '工程实践',
    title: '智能体聊天进入统一用户闭环',
    summary: 'Portal 与 Admin 复用一套账号，普通用户会话按真实身份隔离，同时保持后台权限边界。',
    publishedAt: '2026-07-20',
    readTime: '5 分钟',
    sections: [
      { title: '统一身份', content: 'Portal 注册用户使用同一 base_user 身份，不需要维护第二套用户名和密码。' },
      { title: '分层授权', content: '正常账号默认可以使用 Portal，只有明确开通 admin_enabled 后才能进入后台 RBAC 校验。' },
      { title: '会话归属', content: '聊天历史关联真实用户，列表、更新和删除都必须同时校验智能体和用户归属。' },
    ],
  },
] as const satisfies readonly PortalArticle[];

export const portalCases = portalArticles.filter((article) => article.type === 'case');
export const portalNews = portalArticles.filter((article) => article.type === 'news');

export function findPortalArticle(type: PortalArticle['type'], slug?: string): PortalArticle | undefined {
  return portalArticles.find((article) => article.type === type && article.slug === slug);
}
