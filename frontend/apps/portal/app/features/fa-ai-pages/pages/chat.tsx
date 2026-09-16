import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, type MetaFunction, useParams } from 'react-router-dom';
import { logoutPortal, ProtectedRoute, useAuth } from '../../../kernel/auth';
import { createPortalMeta } from '../../../kernel/seo';
import { PortalLoading } from '../../../shared/ui/PortalLoading';
import { resolveChatMessageContent } from '../components/chatMessageContent';
import ExecutionDetailDialog from '../components/ExecutionDetailDialog';
import ImagePreviewGroup, { ImageLightbox } from '../components/ImagePreviewGroup';
import MarkdownMessage from '../components/MarkdownMessage';
import Nl2SqlResultBlock, { findNl2SqlOutput } from '../components/Nl2SqlResultBlock';
import {
  type ChatStreamEvent,
  deleteChatConversation,
  type FormResumeRequest,
  fetchChatConversations,
  fetchPortalAgent,
  recordChatConversation,
  streamAgentChat,
  uploadPortalChatFile,
} from '../services/agent-chat';
import type {
  ChatConversation,
  ChatMessage,
  ChatSession,
  PortalAgent,
  PortalBaseUserInputField,
  PortalChatVariables,
  PortalInputValue,
  Nl2SqlWorkflowOutput,
  PortalUploadedFile,
} from '../types';
import styles from './chat.module.css';

export const handle = Object.freeze({ portalLayout: 'immersive' });

export const meta: MetaFunction = () =>
  createPortalMeta({
    title: '智能体对话｜FA Portal',
    description: '与已发布的 FA AI 智能体进行流式对话。',
    path: '/chat',
    noIndex: true,
  });

type ChatIconName =
  | 'chevronLeft'
  | 'chevronRight'
  | 'copy'
  | 'dislike'
  | 'external'
  | 'attachment'
  | 'like'
  | 'logout'
  | 'message'
  | 'microphone'
  | 'plus'
  | 'refresh'
  | 'robot'
  | 'send'
  | 'settings'
  | 'share'
  | 'sparkle'
  | 'stop'
  | 'trash'
  | 'user'
  | 'volume';

function ChatIcon({ name, size = 18 }: { name: ChatIconName; size?: number }) {
  let content: ReactNode;
  switch (name) {
    case 'robot':
      content = (
        <>
          <rect height="15" rx="3" width="17" x="3.5" y="5.5" />
          <path d="M9 2.5h6M12 2.5v3M7.5 10h.01M16.5 10h.01M8 16h8" />
        </>
      );
      break;
    case 'plus':
      content = (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </>
      );
      break;
    case 'trash':
      content = <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />;
      break;
    case 'chevronRight':
      content = <path d="m9 18 6-6-6-6" />;
      break;
    case 'message':
      content = <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.3-.7L4 20l1.7-4.1A7.5 7.5 0 1 1 20 11.5Z" />;
      break;
    case 'share':
      content = (
        <>
          <circle cx="18" cy="5" r="2.2" />
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="18" cy="19" r="2.2" />
          <path d="m8 11 8-5M8 13l8 5" />
        </>
      );
      break;
    case 'external':
      content = <path d="M14 4h6v6M20 4l-9 9M19 13v6H5V5h6" />;
      break;
    case 'attachment':
      content = <path d="m9 12.5 5.4-5.4a3 3 0 0 1 4.2 4.2l-7.1 7.1a5 5 0 0 1-7.1-7.1l7.2-7.2M7.2 13.8l7-7" />;
      break;
    case 'user':
      content = (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </>
      );
      break;
    case 'logout':
      content = <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />;
      break;
    case 'send':
      content = <path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" />;
      break;
    case 'settings':
      content = (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6v.2H10V21a1.8 1.8 0 0 0-1.1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1L4 17.1l.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 3 13.9h-.2V10H3a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.4-2l-.1-.1L6.9 4l.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 10.1 3v-.2H14V3a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1L20 6.9l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1.1h.2V14h-.2a1.8 1.8 0 0 0-1.7 1Z" />
        </>
      );
      break;
    case 'microphone':
      content = (
        <>
          <rect height="11" rx="3.5" width="7" x="8.5" y="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
        </>
      );
      break;
    case 'volume':
      content = <path d="M4 10v4h4l5 4V6l-5 4H4Zm12.5-.5a4 4 0 0 1 0 5M19 7a7 7 0 0 1 0 10" />;
      break;
    case 'stop':
      content = <rect fill="currentColor" height="9" rx="1.5" stroke="none" width="9" x="7.5" y="7.5" />;
      break;
    case 'sparkle':
      content = (
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8L6 14Z" />
      );
      break;
    case 'copy':
      content = (
        <>
          <rect height="12" rx="2" width="12" x="8" y="8" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </>
      );
      break;
    case 'refresh':
      content = <path d="M20 7v5h-5M4 17v-5h5M6.1 8a7 7 0 0 1 11.7-1L20 12M4 12l2.2 5a7 7 0 0 0 11.7-1" />;
      break;
    case 'like':
      content = <path d="M7 10v10H3V10h4Zm0 9h9.2a2 2 0 0 0 1.9-1.4l2-6A2 2 0 0 0 18.2 9H14l.7-3.4A2.1 2.1 0 0 0 12.7 3L7 10Z" />;
      break;
    case 'dislike':
      content = <path d="M7 14V4H3v10h4Zm0-9h9.2a2 2 0 0 1 1.9 1.4l2 6a2 2 0 0 1-1.9 2.6H14l.7 3.4a2.1 2.1 0 0 1-2 2.6L7 14Z" />;
      break;
    default:
      content = <path d="m15 18-6-6 6-6" />;
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {content}
    </svg>
  );
}

function createSession(): ChatSession {
  return { id: crypto.randomUUID(), title: '新对话', messages: [], feedback: 0 };
}

function parseMessages(value?: string | null): ChatMessage[] {
  if (!value) return [];
  try {
    const messages: unknown = JSON.parse(value);
    if (!Array.isArray(messages)) return [];

    const seenIds = new Set<string>();
    return messages.flatMap((message, index) => {
      if (!message || typeof message !== 'object') return [];
      const rawMessage = message as Partial<ChatMessage>;
      const rawId = typeof rawMessage.id === 'string' && rawMessage.id ? rawMessage.id : '';
      const id = rawId && !seenIds.has(rawId) ? rawId : crypto.randomUUID();
      seenIds.add(id);
      const executionDetails = rawMessage.executionDetails && typeof rawMessage.executionDetails === 'object' ? rawMessage.executionDetails : undefined;
      const resolvedContent = resolveChatMessageContent(rawMessage.content, executionDetails, rawMessage.audioUrl);

      return [
        {
          ...rawMessage,
          id,
          role: rawMessage.role === 'user' ? 'user' : 'assistant',
          content: resolvedContent.content,
          audioUrl: resolvedContent.audioUrl,
          imageUrls: resolvedContent.imageUrls,
          videoUrls: resolvedContent.videoUrls,
          createdAt: typeof rawMessage.createdAt === 'number' ? rawMessage.createdAt : Date.now() + index,
          executionDetails,
          nl2sql: normalizeNl2SqlOutput(rawMessage.nl2sql, executionDetails),
        } satisfies ChatMessage,
      ];
    });
  } catch {
    return [];
  }
}

function normalizeNl2SqlOutput(value: unknown, executionDetails?: Record<string, unknown>): Nl2SqlWorkflowOutput[] {
  const detailsOutputs = findNl2SqlOutput(executionDetails);
  if (detailsOutputs.length) return detailsOutputs;
  if (Array.isArray(value)) return value.filter((item): item is Nl2SqlWorkflowOutput => Boolean(item && typeof item === 'object'));
  return value && typeof value === 'object' ? [value as Nl2SqlWorkflowOutput] : [];
}

function toSession(conversation: ChatConversation): ChatSession {
  return {
    conversationId: conversation.id,
    id: conversation.sessionId,
    title: conversation.summary || '历史对话',
    messages: parseMessages(conversation.messagesJson),
    feedback: conversation.feedback === 1 || conversation.feedback === 2 ? conversation.feedback : 0,
  };
}

function eventObject(data: unknown): Record<string, unknown> {
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
}

function pickFinishAnswer(data: Record<string, unknown>): string {
  const answerTextList = data.answerTextList;
  if (!answerTextList || typeof answerTextList !== 'object') return '';
  const values = Object.values(answerTextList).filter(Boolean);
  return values.length ? String(values.at(-1)) : '';
}

type FormExecutionOutput = {
  form_data?: Record<string, PortalInputValue>;
  form_field_list?: PortalBaseUserInputField[];
  form_content_format?: string;
  form_context?: Record<string, unknown>;
  is_submit?: boolean;
};

function findFormOutput(message: ChatMessage): { nodeId: string; title: string; output: FormExecutionOutput } | null {
  for (const value of Object.values(message.executionDetails ?? {})) {
    if (!value || typeof value !== 'object') continue;
    const detail = value as Record<string, unknown>;
    if (detail.type !== 'form-node' || typeof detail.id !== 'string' || !detail.output || typeof detail.output !== 'object') continue;
    const output = detail.output as FormExecutionOutput;
    if (!output.is_submit || Boolean((output as Record<string, unknown>).display_form)) {
      return { nodeId: detail.id, title: typeof detail.title === 'string' ? detail.title : '', output };
    }
  }
  return null;
}

function formConditionNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value == null) return null;
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function evalFormVisibilityCondition(
  condition: { field?: string[]; compare?: string; value?: string } | undefined,
  values: Record<string, unknown>,
  context: Record<string, unknown>,
  ownTitle: string,
): boolean {
  if (!condition?.field || condition.field.length < 2 || !condition.compare) return true;
  const [group, key] = condition.field;
  const left = group === ownTitle ? values[key] : context[key];
  const right = condition.value ?? '';
  const leftText = left == null ? '' : String(left);
  switch (condition.compare) {
    case 'contain':
      return leftText.includes(right);
    case 'not_contain':
      return !leftText.includes(right);
    case 'eq': {
      const leftNumber = formConditionNumber(left);
      const rightNumber = formConditionNumber(right);
      return leftNumber != null && rightNumber != null ? leftNumber === rightNumber : leftText === right;
    }
    case 'ne': {
      const leftNumber = formConditionNumber(left);
      const rightNumber = formConditionNumber(right);
      return leftNumber != null && rightNumber != null ? leftNumber !== rightNumber : leftText !== right;
    }
    case 'gt':
    case 'ge':
    case 'lt':
    case 'le': {
      const leftNumber = formConditionNumber(left);
      const rightNumber = formConditionNumber(right);
      if (leftNumber == null || rightNumber == null) return false;
      if (condition.compare === 'gt') return leftNumber > rightNumber;
      if (condition.compare === 'ge') return leftNumber >= rightNumber;
      if (condition.compare === 'lt') return leftNumber < rightNumber;
      return leftNumber <= rightNumber;
    }
    default:
      return true;
  }
}

function isFormFieldVisible(field: PortalBaseUserInputField, values: Record<string, unknown>, context: Record<string, unknown>, ownTitle: string): boolean {
  const rules = field.visibility_rules;
  const conditions = rules?.conditions ?? [];
  if (!rules || conditions.length === 0) return true;
  const results = conditions.map((condition) => evalFormVisibilityCondition(condition, values, context, ownTitle));
  const matched = rules.condition === 'or' ? results.some(Boolean) : results.every(Boolean);
  return rules.action === 'hide' ? !matched : matched;
}

function markFormSubmitted(message: ChatMessage, nodeId: string, formData: Record<string, unknown>): ChatMessage {
  const details = Object.fromEntries(
    Object.entries(message.executionDetails ?? {}).map(([key, value]) => {
      if (!value || typeof value !== 'object') return [key, value];
      const detail = value as Record<string, unknown>;
      if (detail.id !== nodeId || detail.type !== 'form-node' || !detail.output || typeof detail.output !== 'object') return [key, value];
      return [
        key,
        {
          ...detail,
          interrupt: false,
          output: {
            ...(detail.output as Record<string, unknown>),
            ...formData,
            form_data: formData,
            is_submit: true,
            display_form: true,
          },
        },
      ];
    }),
  );
  return { ...message, executionDetails: details };
}

function FormMessageBlock({
  message,
  disabled,
  onSubmit,
}: {
  message: ChatMessage;
  disabled: boolean;
  onSubmit: (request: FormResumeRequest) => Promise<void>;
}) {
  const form = findFormOutput(message);
  const fields = form?.output.form_field_list ?? [];
  const [prefix, suffix = ''] = (form?.output.form_content_format ?? '').split(/\{\{\s*form\s*}}/, 2);
  const [values, setValues] = useState<Record<string, PortalInputValue>>(() => ({ ...(form?.output.form_data ?? {}) }));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  if (!form || fields.length === 0 || message.runRecordId == null) return null;
  const submitted = Boolean(form.output.is_submit);
  const formNodeId = form.nodeId;
  const runRecordId = message.runRecordId;
  const context = (form.output.form_context ?? {}) as Record<string, unknown>;
  const visibleFields = fields.filter((field) => isFormFieldVisible(field, values, context, form.title));

  function setValue(field: string, value: PortalInputValue) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError('');
  }

  async function submit() {
    for (const field of visibleFields) {
      const value = values[field.field];
      const missing = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
      const label = userInputLabel(field);
      if (field.required && missing) {
        setFormError(`请填写${label}`);
        return;
      }
      if (typeof value === 'string' && value) {
        const min = field.attrs?.minlength ?? 0;
        const max = field.attrs?.maxlength ?? 10000;
        if (value.length < min || value.length > max) {
          setFormError(`${label}长度需在 ${min} 到 ${max} 个字符之间`);
          return;
        }
      }
    }
    setSubmitting(true);
    try {
      await onSubmit({ runRecordId, nodeId: formNodeId, formData: values });
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : '表单提交失败');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.formMessage}>
      {prefix.trim() ? <p>{prefix.trim()}</p> : null}
      {visibleFields.map((field) => {
        const label = userInputLabel(field);
        const value = values[field.field];
        const controlId = `workflow-form-${message.id}-${field.field}`;
        let control: ReactNode;
        if (field.input_type === 'TextareaInput') {
          control = (
            <textarea
              disabled={submitted || disabled || submitting}
              id={controlId}
              maxLength={field.attrs?.maxlength}
              onChange={(event) => setValue(field.field, event.target.value)}
              rows={3}
              value={typeof value === 'string' ? value : ''}
            />
          );
        } else if (field.input_type === 'SingleSelect' || field.input_type === 'MultiSelect') {
          control = (
            <select
              disabled={submitted || disabled || submitting}
              id={controlId}
              multiple={field.input_type === 'MultiSelect'}
              onChange={(event) =>
                setValue(field.field, field.input_type === 'MultiSelect' ? [...event.target.selectedOptions].map((option) => option.value) : event.target.value)
              }
              value={field.input_type === 'MultiSelect' ? (Array.isArray(value) ? value : []) : typeof value === 'string' ? value : ''}
            >
              {field.input_type === 'SingleSelect' ? <option value="">请选择</option> : null}
              {(field.option_list ?? []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        } else if (field.input_type === 'SwitchInput') {
          control = (
            <input
              checked={Boolean(value)}
              disabled={submitted || disabled || submitting}
              id={controlId}
              onChange={(event) => setValue(field.field, event.target.checked)}
              type="checkbox"
            />
          );
        } else {
          control = (
            <input
              disabled={submitted || disabled || submitting}
              id={controlId}
              maxLength={field.attrs?.maxlength}
              onChange={(event) => setValue(field.field, event.target.value)}
              type={field.input_type === 'PasswordInput' ? 'password' : field.input_type === 'DatePicker' ? 'datetime-local' : 'text'}
              value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            />
          );
        }
        return (
          <label htmlFor={controlId} key={field.field}>
            <span>
              {label}
              {field.required ? <b>*</b> : null}
            </span>
            {control}
          </label>
        );
      })}
      {formError ? <div className={styles.formError}>{formError}</div> : null}
      <button disabled={submitted || disabled || submitting} onClick={() => void submit()} type="button">
        {submitted ? '已提交' : submitting ? '提交中…' : '提交'}
      </button>
      {suffix.trim() ? <p>{suffix.trim()}</p> : null}
    </div>
  );
}

function formatMessageTime(value: number): string {
  return new Date(value).toLocaleString('zh-CN', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatDuration(value?: number): string {
  return `${((value ?? 0) / 1000).toFixed(2)} s`;
}

function resolveAvatarUrl(value?: string | null): string | undefined {
  const avatar = value?.trim();
  if (!avatar) return undefined;
  if (avatar.startsWith('/') || /^(?:https?:)?\/\//i.test(avatar) || /^(?:data|blob):/i.test(avatar)) return avatar;
  return `/api/base/admin/fileSave/getFilePreview/${encodeURIComponent(avatar)}`;
}

function filePreviewUrl(fileId: string): string {
  return `/api/base/admin/fileSave/getFilePreview/${encodeURIComponent(fileId)}`;
}

function fileOriginalUrl(fileId: string): string {
  return `/api/base/admin/fileSave/getFile/${encodeURIComponent(fileId)}`;
}

function createConversationBody(session: ChatSession, messages: ChatMessage[], feedback = session.feedback ?? 0) {
  return {
    sessionId: session.id,
    summary: session.title,
    questionCount: messages.filter((message) => message.role === 'user').length,
    tokenCount: messages.reduce((total, message) => total + (message.tokenCount ?? 0), 0),
    durationMs: messages.reduce((total, message) => total + (message.durationMs ?? 0), 0),
    feedback,
    messages,
  };
}

function userInputLabel(field: PortalBaseUserInputField): string {
  return typeof field.label === 'string' ? field.label : field.label?.label || field.field;
}

function userInputTooltip(field: PortalBaseUserInputField): string | undefined {
  return typeof field.label === 'string' ? undefined : field.label?.attrs?.tooltip;
}

function createDefaultVariables(agent: PortalAgent | null): PortalChatVariables {
  const result: PortalChatVariables = {};
  for (const field of agent?.baseConfig?.user_input_field_list ?? []) {
    if (field.default_value !== undefined) result[field.field] = field.default_value;
  }
  for (const field of agent?.baseConfig?.api_input_field_list ?? []) {
    if (field.default_value !== undefined && field.default_value !== '') result[field.variable] = field.default_value;
  }
  return result;
}

function createHistoryContext(messages: ChatMessage[]): string {
  return messages
    .slice(-20)
    .map((message) => `${message.role === 'user' ? '用户' : '助手'}：${message.content}`)
    .join('\n')
    .slice(-20000);
}

const fileExtensions = {
  document: new Set(['txt', 'md', 'doc', 'docx', 'html', 'csv', 'xlsx', 'xls', 'pdf', 'ppt', 'pptx']),
  image: new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']),
  audio: new Set(['mp3', 'wav', 'm4a', 'aac', 'ogg']),
  video: new Set(['mp4', 'mov', 'avi', 'mkv', 'webm']),
};

function fileCategory(file: File, agent: PortalAgent): PortalUploadedFile['category'] | null {
  const settings = agent.baseConfig?.node_data?.file_upload_setting;
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  for (const category of ['document', 'image', 'audio', 'video'] as const) {
    if (settings?.[category] && fileExtensions[category].has(extension)) return category;
  }
  const otherExtensions = new Set((settings?.otherExtensions ?? []).map((item) => item.toLowerCase().replace(/^\./, '')));
  if (settings?.other && (otherExtensions.size === 0 || otherExtensions.has(extension))) return 'other';
  return null;
}

function fileAccept(agent: PortalAgent): string | undefined {
  const settings = agent.baseConfig?.node_data?.file_upload_setting;
  const extensions: string[] = [];
  for (const category of ['document', 'image', 'audio', 'video'] as const) {
    if (settings?.[category]) extensions.push(...fileExtensions[category]);
  }
  if (settings?.other) extensions.push(...(settings.otherExtensions ?? []).map((item) => item.toLowerCase().replace(/^\./, '')));
  const unique = [...new Set(extensions)].filter(Boolean);
  return unique.length ? unique.map((item) => `.${item}`).join(',') : undefined;
}

function UserMessageBody({ message, onPreviewImage }: { message: ChatMessage; onPreviewImage: (index: number) => void }) {
  const attachments = message.attachments ?? [];
  const imageFiles = attachments.filter((file) => file.category === 'image');
  const otherNames = attachments.filter((file) => file.category !== 'image').map((file) => file.name);
  return (
    <p>
      {imageFiles.length ? (
        <span className={styles.userAttachmentImages}>
          {imageFiles.map((file, index) => (
            <button
              aria-label={`查看${file.name}大图`}
              className={styles.userAttachmentThumb}
              key={file.id}
              onClick={() => onPreviewImage(index)}
              title={file.name}
              type="button"
            >
              <img alt={file.name} loading="lazy" src={filePreviewUrl(file.id)} />
            </button>
          ))}
        </span>
      ) : null}
      {message.content}
      {otherNames.length ? <span className={styles.userAttachments}>{otherNames.join('、')}</span> : null}
    </p>
  );
}

export default function AgentChatPage() {
  return (
    <ProtectedRoute>
      <AgentChatContent />
    </ProtectedRoute>
  );
}

function AgentChatContent() {
  const { accessToken = '' } = useParams();
  const auth = useAuth();
  const initialSession = useMemo(createSession, []);
  const [agent, setAgent] = useState<PortalAgent | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([initialSession]);
  const [activeSessionId, setActiveSessionId] = useState(initialSession.id);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [executionMessage, setExecutionMessage] = useState<ChatMessage | null>(null);
  const [parameterPanelOpen, setParameterPanelOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionVariables, setSessionVariables] = useState<Record<string, PortalChatVariables>>({
    [initialSession.id]: {},
  });
  const [sessionFiles, setSessionFiles] = useState<Record<string, PortalUploadedFile[]>>({
    [initialSession.id]: [],
  });
  const [previewFileIndex, setPreviewFileIndex] = useState<number | null>(null);
  const [messageImagePreview, setMessageImagePreview] = useState<{ urls: string[]; index: number } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<{ stop?: () => void } | null>(null);

  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [];
  const questionCount = messages.filter((message) => message.role === 'user').length;
  const portalUser = auth.status === 'authenticated' ? auth.user : null;
  const userName = portalUser?.name || portalUser?.username || 'Portal 用户';
  const userInitial = userName.slice(0, 1).toUpperCase();
  const avatarUrl = resolveAvatarUrl(portalUser?.avatar);
  const activeVariables = sessionVariables[activeSessionId] ?? createDefaultVariables(agent);
  const activeFiles = sessionFiles[activeSessionId] ?? [];
  const imageFiles = activeFiles.filter((file) => file.category === 'image');
  const previewImageUrls = imageFiles.map((file) => fileOriginalUrl(file.id));
  const previewIndex = previewFileIndex !== null && previewFileIndex < previewImageUrls.length ? previewFileIndex : null;
  const userFields = agent?.baseConfig?.user_input_field_list ?? [];
  const chatFields = agent?.baseConfig?.chat_input_field_list ?? [];
  const exposedFieldNames = agent?.baseConfig?.user_input_config?.exposed_fields ?? [];
  const exposedFields = userFields.filter((field) => exposedFieldNames.includes(field.field));
  const hasParameterPanel = userFields.length > 0 || chatFields.length > 0;
  const fileUploadEnabled = Boolean(agent?.baseConfig?.node_data?.file_upload_enable);
  const voiceInputEnabled = Boolean(agent?.baseConfig?.node_data?.stt_model_enable);
  const voiceOutputEnabled = Boolean(agent?.baseConfig?.node_data?.tts_model_enable);

  useEffect(() => {
    setPreviewFileIndex(null);
    setMessageImagePreview(null);
  }, [activeSessionId]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const agentValue = await fetchPortalAgent(accessToken);
        if (!active) return;
        setAgent(agentValue);
        setSessionVariables((current) => ({
          ...current,
          [initialSession.id]: {
            ...createDefaultVariables(agentValue),
            ...(current[initialSession.id] ?? {}),
          },
        }));
        try {
          const history = await fetchChatConversations(accessToken);
          if (!active) return;
          setSessions([initialSession, ...history.map(toSession)]);
          setActiveSessionId(initialSession.id);
        } catch (reason) {
          if (active) setError(reason instanceof Error ? reason.message : '历史会话加载失败，新对话仍可使用。');
        }
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : '智能体暂时无法访问');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      abortRef.current?.abort();
      recognitionRef.current?.stop?.();
      window.speechSynthesis?.cancel();
    };
  }, [accessToken, initialSession]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    if (!userMenuOpen) return undefined;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setUserMenuOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [userMenuOpen]);

  function updateSession(sessionId: string, updater: (session: ChatSession) => ChatSession) {
    setSessions((current) => current.map((session) => (session.id === sessionId ? updater(session) : session)));
  }

  function startNewConversation() {
    if (running) stop();
    const existingEmpty = sessions.find((session) => !session.conversationId && session.messages.length === 0);
    if (existingEmpty) {
      setActiveSessionId(existingEmpty.id);
    } else {
      const session = createSession();
      setSessions((current) => [session, ...current]);
      setActiveSessionId(session.id);
      setSessionVariables((current) => ({ ...current, [session.id]: createDefaultVariables(agent) }));
      setSessionFiles((current) => ({ ...current, [session.id]: [] }));
    }
    setQuestion('');
    setError('');
    setParameterPanelOpen(false);
    setMobileSidebarOpen(false);
  }

  function switchConversation(sessionId: string) {
    if (sessionId === activeSessionId) {
      setMobileSidebarOpen(false);
      return;
    }
    if (running) stop();
    setActiveSessionId(sessionId);
    setQuestion('');
    setError('');
    setParameterPanelOpen(false);
    setSessionVariables((current) => (current[sessionId] ? current : { ...current, [sessionId]: createDefaultVariables(agent) }));
    setSessionFiles((current) => (current[sessionId] ? current : { ...current, [sessionId]: [] }));
    setMobileSidebarOpen(false);
  }

  async function clearHistory() {
    if (clearing || !window.confirm('确定清空当前智能体的全部会话记录吗？')) return;
    if (running) stop();
    setClearing(true);
    setError('');
    try {
      await Promise.all(
        sessions
          .filter((session): session is ChatSession & { conversationId: number } => session.conversationId !== undefined)
          .map((session) => deleteChatConversation(accessToken, session.conversationId)),
      );
      const session = createSession();
      setSessions([session]);
      setActiveSessionId(session.id);
      setSessionVariables({ [session.id]: createDefaultVariables(agent) });
      setSessionFiles({ [session.id]: [] });
      setNotice('历史记录已清空');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '清空历史记录失败，请稍后重试。');
    } finally {
      setClearing(false);
    }
  }

  async function send(value?: string) {
    const content = (value ?? question).trim();
    if ((!content && activeFiles.length === 0) || running || !activeSession) return;
    const validationError = validateVariables();
    if (validationError) {
      setError(validationError);
      setParameterPanelOpen(true);
      return;
    }

    const sessionId = activeSession.id;
    const sessionTitle = activeSession.title === '新对话' ? (content || activeFiles[0]?.name || '新对话').slice(0, 32) : activeSession.title;
    const now = Date.now();
    const assistantId = `assistant-${now}`;
    const userMessage: ChatMessage = {
      id: `user-${now}`,
      role: 'user',
      content,
      attachments: activeFiles.length ? activeFiles.map((file) => ({ id: file.id, name: file.name, category: file.category })) : undefined,
      createdAt: now,
    };
    const assistantMessage: ChatMessage = { id: assistantId, role: 'assistant', content: '', createdAt: now };
    const previousMessages = activeSession.messages;
    updateSession(sessionId, (session) => ({
      ...session,
      title: sessionTitle,
      messages: [...session.messages, userMessage, assistantMessage],
    }));
    setQuestion('');
    setError('');
    setNotice('');
    setRunning(true);
    const variables: PortalChatVariables = { ...activeVariables };
    for (const category of ['document', 'image', 'audio', 'video', 'other'] as const) {
      const ids = activeFiles.filter((file) => file.category === category).map((file) => file.id);
      if (ids.length) variables[category] = ids;
    }
    setSessionFiles((current) => ({ ...current, [sessionId]: [] }));

    const controller = new AbortController();
    abortRef.current = controller;
    let answer = '';
    let finishData: Record<string, unknown> = {};
    let nl2sqlResult: NonNullable<ChatMessage['nl2sql']> = [];
    const onEvent = (event: ChatStreamEvent) => {
      const payload = eventObject(event.data);
      if (event.event === 'message') {
        answer += typeof payload.data === 'string' ? payload.data : '';
        const resolvedContent = resolveChatMessageContent(answer);
        updateSession(sessionId, (session) => ({
          ...session,
          messages: session.messages.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: resolvedContent.content,
                  audioUrl: resolvedContent.audioUrl,
                  imageUrls: resolvedContent.imageUrls,
                  videoUrls: resolvedContent.videoUrls,
                }
              : message,
          ),
        }));
      }
      if (event.event === 'nl2sql' && payload.event === 'stage' && typeof payload.label === 'string') {
        updateSession(sessionId, (session) => ({
          ...session,
          messages: session.messages.map((message) => (message.id === assistantId && !answer ? { ...message, content: payload.label as string } : message)),
        }));
      }
      if (event.event === 'finish') finishData = payload;
      if (event.event === 'nl2sqlResult') {
        if (payload.data && typeof payload.data === 'object') {
          const next = {
            ...(payload.data as Nl2SqlWorkflowOutput),
            node_id: typeof payload.nodeId === 'string' ? payload.nodeId : undefined,
            node_title: typeof payload.nodeTitle === 'string' ? payload.nodeTitle : undefined,
          };
          nl2sqlResult = [...nl2sqlResult.filter((item) => item.node_id !== next.node_id), next];
        }
        updateSession(sessionId, (session) => ({
          ...session,
          messages: session.messages.map((message) => (message.id === assistantId ? { ...message, nl2sql: nl2sqlResult } : message)),
        }));
      }
      if (event.event === 'error') throw new Error(String(payload.errorMsg ?? payload.message ?? '智能体运行失败'));
    };

    try {
      await streamAgentChat(accessToken, content, sessionId, variables, createHistoryContext(previousMessages), onEvent, controller.signal);
      const tokenCount = Number(finishData.messageTokens ?? 0) + Number(finishData.answerTokens ?? 0);
      const durationMs = Math.max(0, Math.round(Number(finishData.runTime ?? 0) * 1000));
      const executionDetails =
        finishData.executionDetails && typeof finishData.executionDetails === 'object' ? (finishData.executionDetails as Record<string, unknown>) : undefined;
      const resolvedContent = resolveChatMessageContent(answer || pickFinishAnswer(finishData), executionDetails);
      const finalMessage: ChatMessage = {
        ...assistantMessage,
        content:
          resolvedContent.content ||
          (resolvedContent.audioUrl || resolvedContent.imageUrls.length > 0 || resolvedContent.videoUrls.length > 0 ? '' : '本次运行没有返回内容。'),
        audioUrl: resolvedContent.audioUrl,
        imageUrls: resolvedContent.imageUrls,
        videoUrls: resolvedContent.videoUrls,
        tokenCount,
        durationMs,
        executionDetails,
        nl2sql: nl2sqlResult.length ? nl2sqlResult : findNl2SqlOutput(executionDetails),
        runRecordId: Number.isFinite(Number(finishData.id)) ? Number(finishData.id) : undefined,
      };
      const finalMessages = [...previousMessages, userMessage, finalMessage];
      updateSession(sessionId, (session) => ({
        ...session,
        title: sessionTitle,
        messages: session.messages.map((message) => (message.id === assistantId ? finalMessage : message)),
      }));
      if (agent?.baseConfig?.node_data?.tts_autoplay && finalMessage.content) speak(finalMessage.content);
      const sessionForRecord = { ...activeSession, title: sessionTitle };
      await recordChatConversation(accessToken, createConversationBody(sessionForRecord, finalMessages));
      const history = await fetchChatConversations(accessToken);
      const saved = history.find((conversation) => conversation.sessionId === sessionId);
      if (saved) {
        updateSession(sessionId, (session) => ({
          ...session,
          conversationId: saved.id,
          feedback: saved.feedback === 1 || saved.feedback === 2 ? saved.feedback : 0,
        }));
      }
    } catch (reason) {
      if (!controller.signal.aborted) {
        const errorMessage = reason instanceof Error ? reason.message : '对话失败，请稍后重试。';
        setError(errorMessage);
        updateSession(sessionId, (session) => ({
          ...session,
          messages: session.messages.map((message) => (message.id === assistantId ? { ...message, content: answer || errorMessage } : message)),
        }));
      }
    } finally {
      abortRef.current = null;
      setRunning(false);
    }
  }

  async function submitForm(sourceMessage: ChatMessage, request: FormResumeRequest) {
    if (running || !activeSession) return;
    const sessionId = activeSession.id;
    const now = Date.now();
    const assistantId = `assistant-${now}`;
    const assistantMessage: ChatMessage = { id: assistantId, role: 'assistant', content: '', createdAt: now };
    const previousMessages = activeSession.messages;
    updateSession(sessionId, (session) => ({ ...session, messages: [...session.messages, assistantMessage] }));
    setError('');
    setRunning(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let answer = '';
    let finishData: Record<string, unknown> = {};
    const onEvent = (event: ChatStreamEvent) => {
      const payload = eventObject(event.data);
      if (event.event === 'message') {
        answer += typeof payload.data === 'string' ? payload.data : '';
        updateSession(sessionId, (session) => ({
          ...session,
          messages: session.messages.map((message) => (message.id === assistantId ? { ...message, content: answer } : message)),
        }));
      }
      if (event.event === 'finish') finishData = payload;
      if (event.event === 'error') throw new Error(String(payload.errorMsg ?? payload.message ?? '表单提交失败'));
    };

    try {
      await streamAgentChat(accessToken, '', sessionId, activeVariables, createHistoryContext(previousMessages), onEvent, controller.signal, request);
      const tokenCount = Number(finishData.messageTokens ?? 0) + Number(finishData.answerTokens ?? 0);
      const durationMs = Math.max(0, Math.round(Number(finishData.runTime ?? 0) * 1000));
      const executionDetails =
        finishData.executionDetails && typeof finishData.executionDetails === 'object' ? (finishData.executionDetails as Record<string, unknown>) : undefined;
      const resolvedContent = resolveChatMessageContent(answer || pickFinishAnswer(finishData), executionDetails);
      const finalMessage: ChatMessage = {
        ...assistantMessage,
        content: resolvedContent.content || '表单已提交。',
        audioUrl: resolvedContent.audioUrl,
        imageUrls: resolvedContent.imageUrls,
        videoUrls: resolvedContent.videoUrls,
        tokenCount,
        durationMs,
        executionDetails,
        nl2sql: findNl2SqlOutput(executionDetails),
        runRecordId: Number.isFinite(Number(finishData.id)) ? Number(finishData.id) : undefined,
      };
      const submittedMessages = previousMessages.map((message) =>
        message.id === sourceMessage.id ? markFormSubmitted(message, request.nodeId, request.formData) : message,
      );
      const finalMessages = [...submittedMessages, finalMessage];
      updateSession(sessionId, (session) => ({ ...session, messages: finalMessages }));
      await recordChatConversation(accessToken, createConversationBody(activeSession, finalMessages));
    } catch (reason) {
      if (!controller.signal.aborted) {
        const errorMessage = reason instanceof Error ? reason.message : '表单提交失败';
        setError(errorMessage);
        updateSession(sessionId, (session) => ({
          ...session,
          messages: session.messages.map((message) => (message.id === assistantId ? { ...message, content: errorMessage } : message)),
        }));
        throw reason;
      }
    } finally {
      abortRef.current = null;
      setRunning(false);
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    updateSession(activeSessionId, (session) => ({
      ...session,
      messages: session.messages.map((message, index) =>
        index === session.messages.length - 1 && message.role === 'assistant' && !message.content ? { ...message, content: '已停止生成。' } : message,
      ),
    }));
    setRunning(false);
  }

  async function copyText(value: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(successMessage);
    } catch {
      setNotice('复制失败，请手动复制。');
    }
  }

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logoutPortal();
    } finally {
      auth.signOut();
      setSigningOut(false);
    }
  }

  function retry(messageId: string) {
    const messageIndex = messages.findIndex((message) => message.id === messageId);
    const previousQuestion = messages
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === 'user');
    if (previousQuestion) void send(previousQuestion.content);
  }

  async function setFeedback(messageId: string, feedback: 1 | 2) {
    if (!activeSession) return;
    const message = messages.find((item) => item.id === messageId);
    const nextFeedback: 0 | 1 | 2 = message?.feedback === feedback ? 0 : feedback;
    const nextMessages = messages.map((item) => (item.id === messageId ? { ...item, feedback: nextFeedback } : item));
    updateSession(activeSession.id, (session) => ({ ...session, feedback: nextFeedback, messages: nextMessages }));
    try {
      await recordChatConversation(accessToken, createConversationBody(activeSession, nextMessages, nextFeedback));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '反馈保存失败，请稍后重试。');
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  function setVariable(field: string, value: PortalInputValue | undefined) {
    setSessionVariables((current) => ({
      ...current,
      [activeSessionId]: {
        ...createDefaultVariables(agent),
        ...(current[activeSessionId] ?? {}),
        [field]: value,
      },
    }));
    setError('');
  }

  function validateVariables(): string | null {
    for (const field of userFields) {
      const value = activeVariables[field.field];
      const missing = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
      if (field.required && missing) return `请填写${userInputLabel(field)}`;
      if (typeof value === 'string' && value) {
        const min = field.attrs?.minlength ?? 0;
        const max = field.attrs?.maxlength ?? 10000;
        if (value.length < min || value.length > max) {
          return `${userInputLabel(field)}长度需在 ${min} 到 ${max} 个字符之间`;
        }
      }
    }
    return null;
  }

  function renderUserField(field: PortalBaseUserInputField, compact = false) {
    const label = userInputLabel(field);
    const tooltip = userInputTooltip(field);
    const value = activeVariables[field.field];
    const commonProps = {
      'aria-label': label,
      id: `chat-param-${field.field}`,
      title: tooltip,
    };
    let control: ReactNode;
    switch (field.input_type) {
      case 'TextareaInput':
        control = (
          <textarea
            {...commonProps}
            maxLength={field.attrs?.maxlength}
            onChange={(event) => setVariable(field.field, event.target.value)}
            rows={compact ? 1 : 3}
            value={typeof value === 'string' ? value : ''}
          />
        );
        break;
      case 'PasswordInput':
        control = (
          <input
            {...commonProps}
            maxLength={field.attrs?.maxlength}
            onChange={(event) => setVariable(field.field, event.target.value)}
            type="password"
            value={typeof value === 'string' ? value : ''}
          />
        );
        break;
      case 'SingleSelect':
        control = (
          <select {...commonProps} onChange={(event) => setVariable(field.field, event.target.value)} value={typeof value === 'string' ? value : ''}>
            <option value="">请选择</option>
            {(field.option_list ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'MultiSelect':
        control = (
          <select
            {...commonProps}
            multiple
            onChange={(event) =>
              setVariable(
                field.field,
                [...event.target.selectedOptions].map((option) => option.value),
              )
            }
            value={Array.isArray(value) ? value : []}
          >
            {(field.option_list ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'DatePicker':
        control = (
          <input
            {...commonProps}
            onChange={(event) => setVariable(field.field, event.target.value)}
            type="datetime-local"
            value={typeof value === 'string' ? value : ''}
          />
        );
        break;
      case 'SwitchInput':
        control = (
          <button
            {...commonProps}
            aria-pressed={Boolean(value)}
            className={styles.parameterSwitch}
            data-checked={Boolean(value)}
            onClick={() => setVariable(field.field, !value)}
            type="button"
          >
            <span />
          </button>
        );
        break;
      default:
        control = (
          <input
            {...commonProps}
            maxLength={field.attrs?.maxlength}
            onChange={(event) => setVariable(field.field, event.target.value)}
            type="text"
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
          />
        );
    }
    return (
      <div className={compact ? styles.quickField : styles.parameterField} key={field.field}>
        <span title={tooltip}>
          {label}
          {field.required ? <b>*</b> : null}
        </span>
        {control}
      </div>
    );
  }

  function removeFile(fileId: string) {
    setSessionFiles((current) => ({
      ...current,
      [activeSessionId]: (current[activeSessionId] ?? []).filter((item) => item.id !== fileId),
    }));
  }

  function openMessageImagePreview(message: ChatMessage, index: number) {
    const urls = (message.attachments ?? []).filter((file) => file.category === 'image').map((file) => fileOriginalUrl(file.id));
    if (urls[index]) setMessageImagePreview({ urls, index });
  }

  async function selectFiles(files: FileList | null) {
    if (!files?.length || !agent || uploading) return;
    const settings = agent.baseConfig?.node_data?.file_upload_setting;
    const maxFiles = Math.max(1, settings?.maxFiles ?? 3);
    const maxBytes = Math.max(1, settings?.fileLimit ?? 50) * 1024 * 1024;
    const candidates = [...files].slice(0, Math.max(0, maxFiles - activeFiles.length));
    if (candidates.length === 0) {
      setError(`最多上传 ${maxFiles} 个文件`);
      return;
    }
    setUploading(true);
    setError('');
    try {
      const uploaded: PortalUploadedFile[] = [];
      for (const file of candidates) {
        const category = fileCategory(file, agent);
        if (!category) throw new Error(`不支持的文件类型：${file.name}`);
        if (file.size > maxBytes) throw new Error(`${file.name} 超过 ${settings?.fileLimit ?? 50} MB`);
        uploaded.push(await uploadPortalChatFile(file, category));
      }
      setSessionFiles((current) => ({
        ...current,
        [activeSessionId]: [...(current[activeSessionId] ?? []), ...uploaded].slice(0, maxFiles),
      }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '文件上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function startVoiceInput() {
    if (recording) {
      recognitionRef.current?.stop?.();
      return;
    }
    const Recognition = Reflect.get(window, 'SpeechRecognition') ?? Reflect.get(window, 'webkitSpeechRecognition');
    if (typeof Recognition !== 'function') {
      setError('当前浏览器不支持语音输入，请使用 Chrome 或 Edge。');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event: { results?: ArrayLike<{ 0?: { transcript?: string } }> }) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
      if (!transcript) return;
      setQuestion((current) => `${current}${current ? ' ' : ''}${transcript}`);
      if (agent?.baseConfig?.node_data?.stt_autosend) void send(transcript);
    };
    recognition.onerror = () => {
      setRecording(false);
      setError('语音识别失败，请重试。');
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    setRecording(true);
    recognition.start();
  }

  function speak(text: string) {
    if (!text || !window.speechSynthesis) {
      setNotice('当前浏览器不支持语音播放。');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = Math.min(2, Math.max(0.5, agent?.baseConfig?.node_data?.tts_model_params_setting?.speed ?? 1));
    window.speechSynthesis.speak(utterance);
  }

  if (loading) return <PortalLoading label="正在加载智能体…" />;
  if (error && !agent) {
    return (
      <div className={styles.fatalState}>
        <span className={styles.fatalIcon}>
          <ChatIcon name="robot" size={30} />
        </span>
        <h1>暂时无法访问</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (!agent || !activeSession) return <div className={styles.fatalState}>智能体暂时无法访问。</div>;

  return (
    <div className={styles.page} data-mobile-sidebar-open={mobileSidebarOpen} data-sidebar-collapsed={sidebarCollapsed} data-testid="agent-chat-page">
      <button aria-label="关闭会话侧栏" className={styles.mobileBackdrop} onClick={() => setMobileSidebarOpen(false)} type="button" />

      <aside aria-label="会话列表" className={styles.sidebar} id="chat-session-sidebar">
        <div className={styles.agentBrand}>
          <span className={styles.agentIcon}>
            <ChatIcon name="robot" size={20} />
          </span>
          <strong title={agent.name}>{agent.name}</strong>
        </div>

        <button className={styles.newChat} onClick={startNewConversation} type="button">
          <ChatIcon name="plus" size={18} />
          <span>新建对话</span>
        </button>

        <div className={styles.historyHeader}>
          <strong>历史记录</strong>
          <button aria-label="清空历史记录" disabled={clearing} onClick={() => void clearHistory()} title="清空历史记录" type="button">
            <ChatIcon name="trash" size={17} />
          </button>
        </div>
        <div className={styles.historyGroup} title={agent.name}>
          {agent.name}
        </div>
        <nav aria-label="历史会话" className={styles.historyList}>
          {sessions.map((session) => (
            <button
              aria-current={session.id === activeSession.id ? 'page' : undefined}
              data-active={session.id === activeSession.id}
              key={session.id}
              onClick={() => switchConversation(session.id)}
              title={session.title}
              type="button"
            >
              {session.title}
            </button>
          ))}
        </nav>

        <div className={styles.userMenu} ref={userMenuRef}>
          {userMenuOpen ? (
            <div aria-label="用户菜单" className={styles.userPopover} id="chat-user-menu" role="menu">
              <div className={styles.userSummary}>
                <span className={styles.menuAvatar}>{avatarUrl ? <img alt="" src={avatarUrl} /> : <span>{userInitial}</span>}</span>
                <div>
                  <strong>{userName}</strong>
                  <span>@{portalUser?.username || 'portal'}</span>
                </div>
              </div>
              <div className={styles.userMenuDivider} />
              <Link className={styles.userMenuItem} onClick={() => setUserMenuOpen(false)} role="menuitem" to="/account">
                <ChatIcon name="user" size={17} />
                <span>账户信息</span>
              </Link>
              <button
                className={`${styles.userMenuItem} ${styles.logoutItem}`}
                disabled={signingOut}
                onClick={() => void signOut()}
                role="menuitem"
                type="button"
              >
                <ChatIcon name="logout" size={17} />
                <span>{signingOut ? '退出中…' : '退出登录'}</span>
              </button>
            </div>
          ) : null}
          <button
            aria-controls="chat-user-menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            aria-label={`${userName}，打开用户菜单`}
            className={styles.userBadge}
            onClick={() => setUserMenuOpen((value) => !value)}
            title={userName}
            type="button"
          >
            {avatarUrl ? <img alt="" src={avatarUrl} /> : <span>{userInitial}</span>}
          </button>
        </div>
      </aside>

      <section aria-label={`${agent.name} 对话工作台`} className={styles.workspace}>
        <header className={styles.toolbar}>
          <button
            aria-controls="chat-session-sidebar"
            aria-label="切换会话侧栏"
            className={styles.collapseButton}
            onClick={() => {
              if (window.matchMedia('(max-width: 720px)').matches) setMobileSidebarOpen((value) => !value);
              else setSidebarCollapsed((value) => !value);
            }}
            title="切换会话侧栏"
            type="button"
          >
            <ChatIcon name={sidebarCollapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
          </button>
          <strong title={activeSession.title}>{activeSession.title}</strong>
          <div className={styles.toolbarActions}>
            <span className={styles.questionCount}>
              <ChatIcon name="message" size={17} />
              {questionCount} 条提问
            </span>
            <button aria-label="复制访问链接" onClick={() => void copyText(window.location.href, '访问链接已复制')} title="复制访问链接" type="button">
              <ChatIcon name="share" size={18} />
            </button>
            <button
              aria-label="在新窗口打开"
              onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
              title="在新窗口打开"
              type="button"
            >
              <ChatIcon name="external" size={18} />
            </button>
          </div>
        </header>

        <div className={styles.conversationViewport}>
          <div className={styles.conversation}>
            <section aria-label="智能体欢迎语" className={styles.welcome}>
              <span className={styles.assistantAvatar}>
                <ChatIcon name="robot" size={17} />
              </span>
              <div className={styles.welcomeCard}>
                <p>{agent.openingMessage || agent.description || '你好，我是你的智能助手。有什么可以帮你？'}</p>
                {agent.suggestedQuestions.length ? (
                  <div className={styles.suggestions}>
                    {agent.suggestedQuestions.map((suggestion, index) => (
                      <button key={`${suggestion}-${index}`} onClick={() => void send(suggestion)} type="button">
                        <ChatIcon name="sparkle" size={17} />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            {messages.length ? (
              <div aria-live="polite" className={styles.messages} role="log">
                {messages.map((message) =>
                  message.role === 'user' ? (
                    <article className={styles.userMessage} key={message.id}>
                      <div className={styles.userMessageBody}>
                        <UserMessageBody message={message} onPreviewImage={(index) => openMessageImagePreview(message, index)} />
                        {message.content ? (
                          <div className={styles.userMessageActions}>
                            <button aria-label="复制问题" onClick={() => void copyText(message.content, '问题已复制')} title="复制问题" type="button">
                              <ChatIcon name="copy" size={15} />
                              <span>复制</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <span className={styles.userAvatar}>
                        <ChatIcon name="user" size={17} />
                      </span>
                    </article>
                  ) : (
                    <article className={styles.assistantMessage} key={message.id}>
                      <span className={styles.assistantAvatar}>
                        <ChatIcon name="robot" size={17} />
                      </span>
                      <div className={styles.assistantBody}>
                        {findFormOutput(message) ? null : message.content ? (
                          <MarkdownMessage className={styles.markdownMessage} content={message.content} />
                        ) : message.audioUrl || message.imageUrls?.length || message.videoUrls?.length ? null : (
                          <p>正在思考…</p>
                        )}
                        <FormMessageBlock message={message} disabled={running} onSubmit={(request) => submitForm(message, request)} />
                        {message.audioUrl ? <audio className={styles.audioPlayer} controls src={message.audioUrl} /> : null}
                        {message.imageUrls?.length ? <ImagePreviewGroup className={styles.generatedImages} images={message.imageUrls} /> : null}
                        {message.videoUrls?.length ? (
                          <div className={styles.generatedVideos}>
                            {message.videoUrls.map((url, index) => (
                              <video key={url} src={url} aria-label={`生成视频 ${index + 1}`} controls preload="metadata" />
                            ))}
                          </div>
                        ) : null}
                        {message.nl2sql?.length ? <Nl2SqlResultBlock values={message.nl2sql} /> : null}
                        {message.content || message.audioUrl || message.imageUrls?.length || message.videoUrls?.length ? (
                          <>
                            {message.tokenCount !== undefined || message.durationMs !== undefined || message.executionDetails ? (
                              <div className={styles.messageStats}>
                                <span>
                                  消耗 tokens：{message.tokenCount ?? 0}　耗时：{formatDuration(message.durationMs)}
                                </span>
                                {message.executionDetails ? (
                                  <button onClick={() => setExecutionMessage(message)} type="button">
                                    <ChatIcon name="message" size={15} />
                                    执行详情
                                  </button>
                                ) : null}
                              </div>
                            ) : null}
                            <div className={styles.messageMeta}>
                              <time>{formatMessageTime(message.createdAt)}</time>
                              <div className={styles.messageActions}>
                                <button
                                  aria-label="复制回答"
                                  onClick={() =>
                                    void copyText(
                                      message.content || message.audioUrl || message.imageUrls?.join('\n') || message.videoUrls?.join('\n') || '',
                                      '回答已复制',
                                    )
                                  }
                                  title="复制"
                                  type="button"
                                >
                                  <ChatIcon name="copy" size={16} />
                                </button>
                                <button aria-label="重新生成" disabled={running} onClick={() => retry(message.id)} title="重新生成" type="button">
                                  <ChatIcon name="refresh" size={16} />
                                </button>
                                {voiceOutputEnabled && message.content ? (
                                  <button aria-label="播放回答" onClick={() => speak(message.content)} title="语音播放" type="button">
                                    <ChatIcon name="volume" size={16} />
                                  </button>
                                ) : null}
                                <button
                                  aria-label="回答有帮助"
                                  data-active={message.feedback === 1}
                                  onClick={() => void setFeedback(message.id, 1)}
                                  title="有帮助"
                                  type="button"
                                >
                                  <ChatIcon name="like" size={16} />
                                </button>
                                <button
                                  aria-label="回答需要改进"
                                  data-active={message.feedback === 2}
                                  onClick={() => void setFeedback(message.id, 2)}
                                  title="需要改进"
                                  type="button"
                                >
                                  <ChatIcon name="dislike" size={16} />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </article>
                  ),
                )}
                <div ref={endRef} />
              </div>
            ) : null}

            {error ? (
              <div className={styles.errorBanner} role="alert">
                <span>{error}</span>
                {messages.some((message) => message.role === 'user') && !running ? (
                  <button
                    onClick={() => {
                      const lastQuestion = [...messages].reverse().find((message) => message.role === 'user');
                      if (lastQuestion) void send(lastQuestion.content);
                    }}
                    type="button"
                  >
                    重试上一问
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <footer className={styles.composerFooter}>
          {parameterPanelOpen && hasParameterPanel ? (
            <section aria-label="对话参数" className={styles.parameterPanel}>
              <header>
                <div>
                  <strong>{agent.baseConfig?.user_input_config?.title || '用户输入'}</strong>
                  <span>参数将在本次会话中持续生效</span>
                </div>
                <button aria-label="关闭参数设置" onClick={() => setParameterPanelOpen(false)} type="button">
                  ×
                </button>
              </header>
              {userFields.length ? <div className={styles.parameterGrid}>{userFields.map((field) => renderUserField(field))}</div> : null}
              {chatFields.length ? (
                <>
                  <h3>会话变量</h3>
                  <div className={styles.parameterGrid}>
                    {chatFields.map((field) => (
                      <label className={styles.parameterField} key={field.field}>
                        <span>{field.label}</span>
                        <input
                          aria-label={field.label}
                          onChange={(event) => setVariable(field.field, event.target.value)}
                          type="text"
                          value={
                            typeof activeVariables[field.field] === 'string' || typeof activeVariables[field.field] === 'number'
                              ? String(activeVariables[field.field])
                              : ''
                          }
                        />
                      </label>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ) : null}
          <div className={styles.composer}>
            <div className={styles.composerContent}>
              {exposedFields.length ? <div className={styles.quickFields}>{exposedFields.map((field) => renderUserField(field, true))}</div> : null}
              {activeFiles.length ? (
                <div className={styles.fileChips}>
                  {activeFiles.map((file) =>
                    file.category === 'image' ? (
                      <span className={styles.fileThumb} key={file.id}>
                        <button
                          aria-label={`查看${file.name}大图`}
                          className={styles.fileThumbButton}
                          onClick={() => setPreviewFileIndex(imageFiles.indexOf(file))}
                          title={file.name}
                          type="button"
                        >
                          <img alt={file.name} src={filePreviewUrl(file.id)} />
                        </button>
                        <button aria-label={`移除${file.name}`} className={styles.fileThumbRemove} onClick={() => removeFile(file.id)} type="button">
                          ×
                        </button>
                      </span>
                    ) : (
                      <span key={file.id}>
                        <ChatIcon name="attachment" size={14} />
                        <span title={file.name}>{file.name}</span>
                        <button aria-label={`移除${file.name}`} onClick={() => removeFile(file.id)} type="button">
                          ×
                        </button>
                      </span>
                    ),
                  )}
                </div>
              ) : null}
              <textarea
                aria-label="输入问题"
                disabled={running}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="请输入问题，Enter 发送，Shift + Enter 换行"
                rows={2}
                value={question}
              />
              <div className={styles.composerTools}>
                {hasParameterPanel ? (
                  <button
                    aria-label={agent.baseConfig?.user_input_config?.menu_title || '更多设置'}
                    data-active={parameterPanelOpen}
                    onClick={() => setParameterPanelOpen((value) => !value)}
                    title={agent.baseConfig?.user_input_config?.menu_title || '更多设置'}
                    type="button"
                  >
                    <ChatIcon name="settings" size={18} />
                  </button>
                ) : null}
                {fileUploadEnabled ? (
                  <>
                    <input
                      accept={fileAccept(agent)}
                      hidden
                      multiple
                      onChange={(event) => void selectFiles(event.target.files)}
                      ref={fileInputRef}
                      type="file"
                    />
                    <button
                      aria-label="上传文件"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      title={uploading ? '上传中…' : '上传文件'}
                      type="button"
                    >
                      <ChatIcon name="attachment" size={18} />
                    </button>
                  </>
                ) : null}
                {voiceInputEnabled ? (
                  <button
                    aria-label={recording ? '停止语音输入' : '语音输入'}
                    data-active={recording}
                    onClick={startVoiceInput}
                    title={recording ? '正在聆听，点击停止' : '语音输入'}
                    type="button"
                  >
                    <ChatIcon name="microphone" size={18} />
                  </button>
                ) : null}
              </div>
            </div>
            {running ? (
              <button aria-label="停止生成" className={styles.stopButton} onClick={stop} title="停止生成" type="button">
                <ChatIcon name="stop" size={18} />
              </button>
            ) : (
              <button
                aria-label="发送"
                className={styles.sendButton}
                disabled={!question.trim() && activeFiles.length === 0}
                onClick={() => void send()}
                title="发送"
                type="button"
              >
                <ChatIcon name="send" size={20} />
              </button>
            )}
          </div>
        </footer>
      </section>

      <span aria-live="polite" className={styles.liveRegion}>
        {notice}
      </span>
      <ExecutionDetailDialog message={executionMessage} onClose={() => setExecutionMessage(null)} />
      {previewIndex !== null ? (
        <ImageLightbox
          activeIndex={previewIndex}
          images={previewImageUrls}
          label="上传图片"
          onClose={() => setPreviewFileIndex(null)}
          onActiveIndexChange={setPreviewFileIndex}
        />
      ) : null}
      {messageImagePreview ? (
        <ImageLightbox
          activeIndex={messageImagePreview.index}
          images={messageImagePreview.urls}
          label="上传图片"
          onClose={() => setMessageImagePreview(null)}
          onActiveIndexChange={(index) => setMessageImagePreview((current) => (current ? { ...current, index } : current))}
        />
      ) : null}
    </div>
  );
}
