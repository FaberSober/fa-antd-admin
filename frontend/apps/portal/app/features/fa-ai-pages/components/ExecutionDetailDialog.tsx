import { type ReactNode, useEffect } from 'react';
import type { ChatMessage, Nl2SqlWorkflowOutput } from '../types';
import styles from './ExecutionDetailDialog.module.css';
import ImagePreviewGroup from './ImagePreviewGroup';
import Nl2SqlResultBlock from './Nl2SqlResultBlock';

interface Props {
  message: ChatMessage | null;
  onClose: () => void;
}

interface NodeExecutionDetail {
  id: string;
  type: string;
  title?: string;
  runTime?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  messageTokens?: number;
  answerTokens?: number;
  errorMsg?: string;
}

interface ConditionItem {
  field?: unknown;
  value?: unknown;
  compare?: unknown;
}

interface ConditionBranch {
  id?: unknown;
  type?: unknown;
  condition?: unknown;
  conditions?: unknown;
}

const FIELD_LABELS: Record<string, string> = {
  model_id: '模型 ID',
  model_name: '模型名称',
  prompt: '提示词',
  system: '系统提示词',
  history: '历史聊天记录',
  question: '用户问题',
  input: '输入内容',
  output: '输出内容',
  history_context: '历史聊天记录',
  chat_id: '对话 ID',
  knowledge_id_list: '知识库 ID',
  document_id_list: '文档 ID',
  scope_knowledge_ids: '检索范围知识库 ID',
  scope_document_ids: '检索范围文档 ID',
  search_scope_type: '检索范围类型',
  search_scope_source: '检索范围来源',
  search_mode: '检索模式',
  search_condition_type: '条件关系',
  search_condition_list: '标签条件',
  knowledge_list: '命中知识库 ID',
  document_list: '文档列表',
  knowledge_items: '命中知识库',
  document_items: '命中文档',
  tags: '文档标签',
  reranker_model_id: '重排模型 ID',
  reranker_setting: '重排参数',
  show_knowledge: '显示知识来源',
  result_list: '重排结果列表',
  is_hit_handling_method_list: '满足直接回答的分段',
  knowledge_setting: '检索参数',
  reply_type: '回复类型',
  fields: '引用变量',
  content: '内容',
  is_result: '作为最终结果',
  answer: '回复内容',
  branch: '分支配置',
  branch_id: '命中分支 ID',
  branch_name: '命中分支',
  category: '分类',
  reason: '理由',
  dialogue_number: '历史聊天记录条数',
  dialogue_type: '历史记录范围',
  content_list: '输入变量',
  reasoning_content: '思考过程',
  history_message: '历史消息',
  paragraph_list: '检索结果',
  knowledgeName: '知识库',
  documentName: '文档',
  fileName: '文件',
  score: '相似度',
  dataset_id: '数据集 ID',
  dataset_version: '数据集版本',
  session_id: '会话标识',
  run_id: '问数运行 ID',
  sql: '安全 SQL',
  row_count: '结果行数',
  truncated: '结果已截断',
  chart_hint: '图表建议',
  assumptions: '业务假设',
  clarification_question: '澄清问题',
  execution_time_ms: '查询耗时',
  cache_hit: '命中缓存',
  voice: '音色',
  speed: '语速',
  response_format: '音频格式',
  audio_url: '音频地址',
  image: '图片',
  image_urls: '图片地址',
  image_list: '图片变量',
  image_count: '图片数量',
  video: '视频',
  video_url: '视频地址',
  video_urls: '视频地址',
  video_list: '视频变量',
  video_count: '视频数量',
  task_id: '任务 ID',
  application_id: '子智能体 ID',
  application_name: '子智能体名称',
  application_version: '子智能体版本',
  negative_prompt: '负向提示词',
  model_params_setting: '模型参数',
  first_frame_url: '首帧图片',
  last_frame_url: '尾帧图片',
  file_id: '文件 ID',
  file_name: '文件名',
  variable_list: '变量设置',
  assigned_values: '赋值结果',
  strategy: '聚合策略',
  group_list: '变量分组',
  input_variable: '输入变量',
  source: '输入值',
  loop_type: '循环类型',
  array: '循环数组',
  number: '循环次数',
  index: '当前下标',
  item: '当前元素',
  loop_count: '实际循环次数',
  break_triggered: '已触发 Break',
  iterations: '迭代详情',
  execution_details: '子智能体执行详情',
  answers: '循环回复',
  status: '执行状态',
};

const HIDDEN_FIELDS = new Set(['raw_response']);

const NODE_META: Record<string, { color: string; icon: NodeIconName }> = {
  start: { color: '#c83bd8', icon: 'play' },
  'search-knowledge-node': { color: '#3478f6', icon: 'database' },
  'search-document-node': { color: '#2563eb', icon: 'database' },
  'document-extract-node': { color: '#2563eb', icon: 'database' },
  'form-node': { color: '#22c55e', icon: 'message' },
  'variable-assign-node': { color: '#2563eb', icon: 'grid' },
  'variable-aggregation-node': { color: '#2563eb', icon: 'branch' },
  'variable-splitting-node': { color: '#2563eb', icon: 'grid' },
  'parameter-extraction-node': { color: '#2563eb', icon: 'grid' },
  'reranker-node': { color: '#7c3aed', icon: 'branch' },
  'ai-chat-node': { color: '#6c5ce7', icon: 'sparkle' },
  'question-node': { color: '#22c55e', icon: 'sparkle' },
  'text-to-speech-node': { color: '#f59e0b', icon: 'sound' },
  'speech-to-text-node': { color: '#f97316', icon: 'sound' },
  'image-generate-node': { color: '#0ea5e9', icon: 'sparkle' },
  'image-understand-node': { color: '#0ea5e9', icon: 'sparkle' },
  'text-to-video-node': { color: '#2563eb', icon: 'play' },
  'image-to-video-node': { color: '#2563eb', icon: 'play' },
  'video-understand-node': { color: '#2563eb', icon: 'play' },
  'nl2sql-node': { color: '#0ea5a4', icon: 'database' },
  'application-node': { color: '#6c5cff', icon: 'sparkle' },
  'ai-condition-node': { color: '#13a8a8', icon: 'branch' },
  'intent-classify-node': { color: '#7c3aed', icon: 'grid' },
  'reply-node': { color: '#ff8a00', icon: 'message' },
};

type NodeIconName = 'branch' | 'database' | 'grid' | 'message' | 'play' | 'sound' | 'sparkle';

function NodeIcon({ name }: { name: NodeIconName }) {
  let content: ReactNode;
  switch (name) {
    case 'play':
      content = <path d="m9 7 8 5-8 5V7Z" />;
      break;
    case 'database':
      content = (
        <>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </>
      );
      break;
    case 'branch':
      content = <path d="M7 4v10a4 4 0 0 0 4 4h6M7 9h5a5 5 0 0 1 5 5v6M4 4h6M14 20h6" />;
      break;
    case 'grid':
      content = (
        <>
          <rect height="5" rx="1" width="5" x="4" y="4" />
          <rect height="5" rx="1" width="5" x="15" y="4" />
          <rect height="5" rx="1" width="5" x="4" y="15" />
          <rect height="5" rx="1" width="5" x="15" y="15" />
        </>
      );
      break;
    case 'message':
      content = <path d="M5 5h14v11H9l-4 4V5Zm4 5h6" />;
      break;
    case 'sound':
      content = <path d="M5 10v4h3l4 4V6L8 10H5Zm10-1a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11" />;
      break;
    default:
      content = <path d="m12 3 1.4 5.1L18 10l-4.6 1.9L12 17l-1.4-5.1L6 10l4.6-1.9L12 3Zm6 12 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" />;
  }
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="16"
    >
      {content}
    </svg>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function getNodeDetails(details?: Record<string, unknown>): NodeExecutionDetail[] {
  if (!details) return [];
  return Object.values(details).filter((item): item is NodeExecutionDetail => isRecord(item) && typeof item.id === 'string' && typeof item.type === 'string');
}

function formatDuration(milliseconds?: number) {
  return `${((milliseconds ?? 0) / 1000).toFixed(2)} s`;
}

function formatScalar(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? '是' : '否';
  return String(value);
}

const CONDITION_COMPARE_LABELS: Record<string, string> = {
  is_null: '为空',
  is_not_null: '不为空',
  contain: '包含',
  not_contain: '不包含',
  eq: '等于',
  ne: '不等于',
  ge: '大于等于',
  gt: '大于',
  le: '小于等于',
  lt: '小于',
};

function getConditionBranches(value: unknown): ConditionBranch[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function getConditionItems(value: unknown): ConditionItem[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function formatConditionField(field: unknown) {
  if (Array.isArray(field)) {
    const parts = field.map(formatScalar).filter((part) => part !== '—');
    return parts.length ? parts.join(' · ') : '未选择变量';
  }
  return formatScalar(field);
}

function StructuredValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (!value.length) return <span className={styles.emptyValue}>暂无数据</span>;
    return (
      <ol className={styles.valueList}>
        {value.map((item, index) => (
          <li key={`${index}-${typeof item}`}>
            <StructuredValue value={item} />
          </li>
        ))}
      </ol>
    );
  }

  if (isRecord(value)) {
    const entries = Object.entries(value).filter(([key]) => !HIDDEN_FIELDS.has(key));
    if (!entries.length) return <span className={styles.emptyValue}>暂无数据</span>;
    return (
      <dl className={styles.nestedMap}>
        {entries.map(([key, item]) => (
          <div key={key}>
            <dt>{FIELD_LABELS[key] || key}</dt>
            <dd>
              <StructuredValue value={item} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return <span className={styles.scalarValue}>{formatScalar(value)}</span>;
}

function DetailMap({ data }: { data?: Record<string, unknown> }) {
  const entries = data ? Object.entries(data).filter(([key]) => !HIDDEN_FIELDS.has(key)) : [];
  if (!entries.length) return <div className={styles.emptyValue}>暂无数据</div>;
  return (
    <dl className={styles.detailMap}>
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt>{FIELD_LABELS[key] || key}</dt>
          <dd>
            <StructuredValue value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DetailSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className={styles.detailSection}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ExecutionNodeSummary({ detail }: { detail: NodeExecutionDetail }) {
  const meta = NODE_META[detail.type] ?? { color: '#64748b', icon: 'grid' as NodeIconName };
  return (
    <summary>
      <span className={styles.chevron}>
        <svg aria-hidden="true" fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="15">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </span>
      <span className={styles.nodeIcon} style={{ backgroundColor: meta.color }}>
        <NodeIcon name={meta.icon} />
      </span>
      <strong>{detail.title || detail.id}</strong>
      <span className={styles.nodeTime}>{formatDuration(detail.runTime)}</span>
      <span className={detail.errorMsg ? styles.nodeFailed : styles.nodeSuccess} title={detail.errorMsg ? '执行失败' : '执行成功'}>
        {detail.errorMsg ? '!' : '✓'}
      </span>
    </summary>
  );
}

function ExecutionNodeList({ details, nested = false }: { details: NodeExecutionDetail[]; nested?: boolean }) {
  return (
    <div className={nested ? styles.childAgentNodeList : styles.nodeList}>
      {details.map((detail) => (
        <details className={styles.node} key={detail.id}>
          <ExecutionNodeSummary detail={detail} />
          <NodeDetailContent detail={detail} />
        </details>
      ))}
    </div>
  );
}

function ChildAgentExecutionDetails({ details }: { details?: Record<string, unknown> }) {
  const nodeDetails = getNodeDetails(details);
  const success = Number(details?.status ?? 200) === 200 && !details?.errorMsg;
  const totalTokens = nodeDetails.reduce((total, detail) => total + Number(detail.messageTokens ?? 0) + Number(detail.answerTokens ?? 0), 0);

  return (
    <section className={styles.childAgentExecution}>
      <header>
        <strong>子智能体执行详情（{nodeDetails.length} 个节点）</strong>
        <span className={success ? styles.successTag : styles.errorTag}>{success ? '执行成功' : '执行失败'}</span>
        {details?.runTime !== undefined ? <span>耗时 {formatDuration(Number(details.runTime))}</span> : null}
        {totalTokens > 0 ? <span>Tokens {totalTokens}</span> : null}
      </header>
      {typeof details?.errorMsg === 'string' ? <div className={styles.childAgentError}>{details.errorMsg}</div> : null}
      {nodeDetails.length ? <ExecutionNodeList details={nodeDetails} nested /> : <div className={styles.childAgentEmpty}>暂无子智能体节点执行详情</div>}
    </section>
  );
}

function ConditionNodeDetailContent({ detail }: { detail: NodeExecutionDetail }) {
  const branches = getConditionBranches(detail.input?.branch);
  const hitBranchId = typeof detail.output?.branch_id === 'string' ? detail.output.branch_id : undefined;
  const hitBranchName = typeof detail.output?.branch_name === 'string' ? detail.output.branch_name : undefined;

  return (
    <div className={styles.nodeContent}>
      <section className={styles.conditionSection}>
        <h3>分支配置</h3>
        {branches.length ? (
          <div className={styles.conditionBranchList}>
            {branches.map((branch, branchIndex) => {
              const branchId = typeof branch.id === 'string' ? branch.id : undefined;
              const branchType = typeof branch.type === 'string' ? branch.type : `分支 ${branchIndex + 1}`;
              const isHit = Boolean(branchId && branchId === hitBranchId);
              const isElse = branchType === 'ELSE';
              const relation = branch.condition === 'or' ? '满足任一条件' : '满足全部条件';
              const conditions = getConditionItems(branch.conditions);

              return (
                <article
                  className={`${styles.conditionBranch}${isHit ? ` ${styles.conditionBranchHit}` : ''}`}
                  key={branchId || `${branchType}-${branchIndex}`}
                >
                  <header>
                    <span className={styles.conditionBranchType}>{branchType}</span>
                    {isHit ? <span className={styles.conditionHitTag}>已命中</span> : null}
                  </header>
                  {isElse ? (
                    <p className={styles.conditionElseText}>不满足以上任一分支条件时，进入此分支。</p>
                  ) : (
                    <>
                      <p className={styles.conditionRelation}>{relation}</p>
                      {conditions.length ? (
                        <ol className={styles.conditionList}>
                          {conditions.map((condition, conditionIndex) => {
                            const compare = typeof condition.compare === 'string' ? condition.compare : '';
                            const needsValue = compare !== 'is_null' && compare !== 'is_not_null';
                            return (
                              <li key={conditionIndex}>
                                <span className={styles.conditionField}>{formatConditionField(condition.field)}</span>
                                <span className={styles.conditionCompare}>{CONDITION_COMPARE_LABELS[compare] || formatScalar(compare)}</span>
                                {needsValue ? <span className={styles.conditionValue}>{formatScalar(condition.value)}</span> : null}
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <span className={styles.emptyValue}>未配置条件</span>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyValue}>暂无分支配置</div>
        )}
      </section>
      <DetailSection title="执行结果">
        <DetailMap data={{ branch_name: hitBranchName, branch_id: hitBranchId }} />
      </DetailSection>
    </div>
  );
}

function LoopIterationList({ iterations }: { iterations: unknown }) {
  const items = Array.isArray(iterations) ? iterations.filter(isRecord) : [];
  if (!items.length) return <div className={styles.emptyValue}>暂无迭代记录</div>;

  return (
    <div className={styles.loopIterationList}>
      {items.map((iteration, iterationIndex) => {
        const nodeDetails = getNodeDetails(isRecord(iteration.execution_details) ? iteration.execution_details : undefined);
        return (
          <details className={styles.loopIteration} key={`${iterationIndex}-${String(iteration.index ?? '')}`}>
            <summary>
              <strong>第 {iterationIndex + 1} 次迭代</strong>
              <span>
                下标 {formatScalar(iteration.index)} · 元素 {formatScalar(iteration.item)}
              </span>
              <span className={Number(iteration.status) === 200 ? styles.iterationSuccess : styles.iterationFailed}>
                {Number(iteration.status) === 200 ? '成功' : `状态 ${formatScalar(iteration.status)}`}
              </span>
            </summary>
            <div className={styles.loopIterationContent}>
              <DetailMap data={{ index: iteration.index, item: iteration.item, status: iteration.status, answers: iteration.answers }} />
              {nodeDetails.length ? (
                <div className={styles.loopIterationNodes}>
                  <span>循环体执行节点（{nodeDetails.length}）</span>
                  <ul>
                    {nodeDetails.map((node) => (
                      <li key={node.id}>
                        <strong>{node.title || node.id}</strong>
                        <span>{formatDuration(node.runTime)}</span>
                        <i className={node.errorMsg ? styles.iterationFailed : styles.iterationSuccess}>{node.errorMsg ? '失败' : '成功'}</i>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function LoopNodeDetailContent({ detail }: { detail: NodeExecutionDetail }) {
  const output = detail.output ?? {};
  return (
    <div className={styles.nodeContent}>
      <DetailSection title="输入参数">
        <DetailMap data={detail.input} />
      </DetailSection>
      <DetailSection title="输出参数">
        <DetailMap
          data={{
            index: output.index,
            item: output.item,
            loop_count: output.loop_count,
            break_triggered: output.break_triggered,
            answers: output.answers,
          }}
        />
      </DetailSection>
      <section className={styles.loopIterationsSection}>
        <h3>迭代详情（{Array.isArray(output.iterations) ? output.iterations.length : 0}）</h3>
        <LoopIterationList iterations={output.iterations} />
      </section>
    </div>
  );
}

function ApplicationNodeDetailContent({ detail }: { detail: NodeExecutionDetail }) {
  const output = detail.output ?? {};
  const executionDetails = isRecord(output.execution_details) ? output.execution_details : undefined;
  return (
    <div className={styles.nodeContent}>
      <DetailSection title="输入参数">
        <DetailMap data={detail.input} />
      </DetailSection>
      <DetailSection title="输出参数">
        <DetailMap
          data={{
            result: output.result,
            application_id: output.application_id,
            application_name: output.application_name,
            application_version: output.application_version,
          }}
        />
      </DetailSection>
      {executionDetails ? <ChildAgentExecutionDetails details={executionDetails} /> : null}
      {detail.messageTokens !== undefined || detail.answerTokens !== undefined ? (
        <div className={styles.nodeTokens}>节点 Tokens：{Number(detail.messageTokens ?? 0) + Number(detail.answerTokens ?? 0)}</div>
      ) : null}
    </div>
  );
}

function NodeDetailContent({ detail }: { detail: NodeExecutionDetail }) {
  if (detail.errorMsg) {
    return (
      <div className={styles.nodeError}>
        <strong>节点执行失败</strong>
        <span>{detail.errorMsg}</span>
      </div>
    );
  }

  if (detail.type === 'loop-node') {
    return <LoopNodeDetailContent detail={detail} />;
  }

  if (detail.type === 'application-node') {
    return <ApplicationNodeDetailContent detail={detail} />;
  }

  if (detail.type === 'ai-condition-node') {
    return <ConditionNodeDetailContent detail={detail} />;
  }

  if (detail.type === 'search-document-node') {
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="检索条件">
          <DetailMap data={detail.input} />
        </DetailSection>
        <DetailSection title="匹配结果">
          <DetailMap data={detail.output} />
        </DetailSection>
      </div>
    );
  }

  if (detail.type === 'document-extract-node') {
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="输入文档">
          <StructuredValue value={detail.input?.document_list} />
        </DetailSection>
        <DetailSection title="提取内容">
          <StructuredValue value={detail.output?.content} />
        </DetailSection>
        <DetailSection title="文档列表">
          <StructuredValue value={detail.output?.document_list} />
        </DetailSection>
      </div>
    );
  }

  if (detail.type === 'reranker-node') {
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="重排参数">
          <DetailMap data={detail.input} />
        </DetailSection>
        <DetailSection title="重排结果">
          <DetailMap data={detail.output} />
        </DetailSection>
      </div>
    );
  }

  if (detail.type === 'nl2sql-node') {
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="业务结论">
          <StructuredValue value={detail.output?.answer} />
        </DetailSection>
        <Nl2SqlResultBlock values={detail.output ? [{ ...detail.output, node_id: detail.id, node_title: detail.title } as Nl2SqlWorkflowOutput] : []} />
        <DetailSection title="运行信息">
          <DetailMap
            data={{
              run_id: detail.output?.run_id,
              status: detail.output?.status,
              dataset_id: detail.output?.dataset_id,
              dataset_version: detail.output?.dataset_version,
              execution_time_ms: detail.output?.execution_time_ms,
              cache_hit: detail.output?.cache_hit,
              truncated: detail.output?.truncated,
              assumptions: detail.output?.assumptions,
              sql: detail.output?.sql,
            }}
          />
        </DetailSection>
      </div>
    );
  }

  if (detail.type === 'text-to-speech-node') {
    const audioUrl = typeof detail.output?.audio_url === 'string' ? detail.output.audio_url : undefined;
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="文本内容">
          <StructuredValue value={detail.input?.content} />
        </DetailSection>
        <DetailSection title="语音参数">
          <DetailMap
            data={{
              model_name: detail.input?.model_name,
              voice: detail.input?.voice,
              speed: detail.input?.speed,
              response_format: detail.input?.response_format,
            }}
          />
        </DetailSection>
        <DetailSection title="语音结果">
          {audioUrl ? <audio className={styles.audioPlayer} controls src={audioUrl} /> : <div className={styles.emptyValue}>未生成音频</div>}
          <DetailMap
            data={{
              file_id: detail.output?.file_id,
              file_name: detail.output?.file_name,
              audio_url: audioUrl,
            }}
          />
        </DetailSection>
      </div>
    );
  }

  if (detail.type === 'image-generate-node') {
    const imageUrls = Array.isArray(detail.output?.image_urls) ? detail.output.image_urls.filter((url): url is string => typeof url === 'string') : [];
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="生成参数">
          <DetailMap
            data={{
              prompt: detail.input?.prompt,
              negative_prompt: detail.input?.negative_prompt,
              first_frame_url: detail.input?.first_frame_url,
              last_frame_url: detail.input?.last_frame_url,
              model_id: detail.input?.model_id,
              model_name: detail.input?.model_name,
              model_params_setting: detail.input?.model_params_setting,
            }}
          />
        </DetailSection>
        <DetailSection title="生成图片">
          {imageUrls.length ? <ImagePreviewGroup className={styles.generatedImages} images={imageUrls} /> : <div className={styles.emptyValue}>未生成图片</div>}
        </DetailSection>
      </div>
    );
  }

  if (detail.type === 'image-understand-node' || detail.type === 'video-understand-node') {
    const mediaInput =
      detail.type === 'video-understand-node'
        ? { video_list: detail.input?.video_list, video_count: detail.input?.video_count }
        : { image_list: detail.input?.image_list, image_count: detail.input?.image_count };
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="理解参数">
          <DetailMap
            data={{
              model_id: detail.input?.model_id,
              model_name: detail.input?.model_name,
              system: detail.input?.system,
              prompt: detail.input?.prompt,
              ...mediaInput,
              dialogue_number: detail.input?.dialogue_number,
            }}
          />
        </DetailSection>
        {detail.output?.reasoning_content ? (
          <DetailSection title="思考过程">
            <StructuredValue value={detail.output.reasoning_content} />
          </DetailSection>
        ) : null}
        <DetailSection title="理解结果">
          <StructuredValue value={detail.output?.answer} />
        </DetailSection>
        <div className={styles.nodeTokens}>节点 Tokens：{Number(detail.messageTokens ?? 0) + Number(detail.answerTokens ?? 0)}</div>
      </div>
    );
  }

  if (detail.type === 'text-to-video-node' || detail.type === 'image-to-video-node') {
    const videoUrls = Array.isArray(detail.output?.video_urls)
      ? detail.output.video_urls.filter((url): url is string => typeof url === 'string')
      : typeof detail.output?.video_url === 'string'
        ? [detail.output.video_url]
        : [];
    return (
      <div className={styles.nodeContent}>
        <DetailSection title="生成参数">
          <DetailMap
            data={{
              prompt: detail.input?.prompt,
              negative_prompt: detail.input?.negative_prompt,
              model_id: detail.input?.model_id,
              model_name: detail.input?.model_name,
              model_params_setting: detail.input?.model_params_setting,
            }}
          />
        </DetailSection>
        <DetailSection title="生成视频">
          {videoUrls.length ? (
            <div className={styles.generatedVideos}>
              {videoUrls.map((url, index) => (
                <video key={url} src={url} aria-label={`生成视频 ${index + 1}`} controls preload="metadata" />
              ))}
            </div>
          ) : (
            <div className={styles.emptyValue}>未生成视频</div>
          )}
          <DetailMap data={{ task_id: detail.output?.task_id, video_url: detail.output?.video_url }} />
        </DetailSection>
        <div className={styles.nodeTokens}>节点 Tokens：{Number(detail.messageTokens ?? 0) + Number(detail.answerTokens ?? 0)}</div>
      </div>
    );
  }

  return (
    <div className={styles.nodeContent}>
      <DetailSection title="输入参数">
        <DetailMap data={detail.input} />
      </DetailSection>
      <DetailSection title="输出参数">
        <DetailMap data={detail.output} />
      </DetailSection>
      {detail.messageTokens !== undefined || detail.answerTokens !== undefined ? (
        <div className={styles.nodeTokens}>节点 Tokens：{Number(detail.messageTokens ?? 0) + Number(detail.answerTokens ?? 0)}</div>
      ) : null}
    </div>
  );
}

export default function ExecutionDetailDialog({ message, onClose }: Props) {
  useEffect(() => {
    if (!message) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [message, onClose]);

  if (!message) return null;

  const details = message.executionDetails;
  const nodes = getNodeDetails(details);
  const success = Number(details?.status ?? 200) === 200 && !details?.errorMsg;

  return (
    <div className={styles.backdrop}>
      <section aria-labelledby="execution-dialog-title" aria-modal="true" className={styles.dialog} role="dialog">
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h2 id="execution-dialog-title">执行详情</h2>
            <span className={success ? styles.successTag : styles.errorTag}>{success ? '执行成功' : '执行失败'}</span>
            <span>耗时 {formatDuration(message.durationMs)}</span>
            <span>Tokens {message.tokenCount ?? 0}</span>
          </div>
          <button aria-label="关闭执行详情" onClick={onClose} title="关闭" type="button">
            <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.toolbar}>共执行 {nodes.length} 个节点</div>
          {typeof details?.errorMsg === 'string' ? <div className={styles.globalError}>{details.errorMsg}</div> : null}
          {nodes.length ? <ExecutionNodeList details={nodes} /> : <div className={styles.emptyState}>暂无节点执行详情</div>}
        </div>
      </section>
    </div>
  );
}
