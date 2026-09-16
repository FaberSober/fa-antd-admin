export interface PortalProduct {
  slug: string;
  name: string;
  label: string;
  summary: string;
  description: string;
  capabilities: readonly string[];
  scenarios: readonly string[];
}

export const portalProducts = [
  {
    slug: 'agent-platform',
    name: '智能体平台',
    label: 'AGENT',
    summary: '把模型、知识和流程组织成可发布、可运营的智能应用。',
    description: '从角色设定、工作流编排到公开发布和会话分析，为不同业务快速交付专属智能体。',
    capabilities: ['可视化工作流编排', '多模型与企业知识连接', '流式对话与发布版本管理', '会话数据与效果反馈'],
    scenarios: ['客户服务', '内部知识助手', '业务流程协同', '专业领域咨询'],
  },
  {
    slug: 'knowledge-base',
    name: '企业知识库',
    label: 'KNOWLEDGE',
    summary: '让分散的文档成为可信、可检索、可持续治理的业务知识。',
    description: '支持文档导入、分段规则、检索测试与引用追踪，为生成式 AI 提供可解释的知识基础。',
    capabilities: ['多来源文档接入', '结构化分段与向量检索', '命中测试与内容治理', '细粒度知识范围配置'],
    scenarios: ['制度查询', '产品资料检索', '项目经验复用', '培训与学习'],
  },
  {
    slug: 'data-copilot',
    name: '数据问答助手',
    label: 'DATA',
    summary: '用自然语言提出业务问题，获得受控、可追溯的数据答案。',
    description: '通过语义数据集、SQL 安全守卫和查询审计，把数据分析能力带给更多业务用户。',
    capabilities: ['自然语言转查询', '业务口径与术语管理', 'SQL 风险校验', '结果解释与查询审计'],
    scenarios: ['经营分析', '运营复盘', '指标查询', '自助取数'],
  },
] as const satisfies readonly PortalProduct[];

export function findPortalProduct(slug?: string): PortalProduct | undefined {
  return portalProducts.find((product) => product.slug === slug);
}
