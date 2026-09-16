import { portalFetch, portalRequest } from '../../../kernel/http';
import type { ChatConversation, PortalAgent, PortalChatVariables, PortalUploadedFile } from '../types';

interface ApiEnvelope<T> {
  data?: T;
}

function unwrap<T>(payload: T | ApiEnvelope<T>): T {
  return payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined ? payload.data : (payload as T);
}

export async function fetchPortalAgent(accessToken: string): Promise<PortalAgent> {
  const payload = await portalRequest<PortalAgent | ApiEnvelope<PortalAgent>>(`/portal/ai/agents/${accessToken}`);
  return unwrap(payload);
}

export async function fetchChatConversations(accessToken: string): Promise<ChatConversation[]> {
  const payload = await portalRequest<ChatConversation[] | ApiEnvelope<ChatConversation[]>>(`/portal/ai/agents/${accessToken}/conversations`);
  return unwrap(payload) ?? [];
}

export async function recordChatConversation(accessToken: string, body: Record<string, unknown>): Promise<void> {
  await portalRequest(`/portal/ai/agents/${accessToken}/conversations`, { method: 'POST', body });
}

export async function deleteChatConversation(accessToken: string, conversationId: number): Promise<void> {
  await portalRequest(`/portal/ai/agents/${accessToken}/conversations/${conversationId}`, { method: 'DELETE' });
}

export interface ChatStreamEvent {
  event: string;
  data: unknown;
}

export interface FormResumeRequest {
  runRecordId: number;
  nodeId: string;
  formData: Record<string, unknown>;
}

function parseData(value: string): unknown {
  if (!value) return {};
  let parsed: unknown = value;
  for (let index = 0; index < 3 && typeof parsed === 'string'; index += 1) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return parsed;
    }
  }
  return parsed;
}

function parseEvent(block: string): ChatStreamEvent | null {
  let event = 'message';
  const data: string[] = [];
  for (const rawLine of block.split(/\r?\n/)) {
    if (rawLine.startsWith('event:')) event = rawLine.slice(6).trim();
    if (rawLine.startsWith('data:')) data.push(rawLine.slice(5).trimStart());
  }
  if (!data.length) return null;
  return { event, data: parseData(data.join('\n')) };
}

export async function streamAgentChat(
  accessToken: string,
  question: string,
  sessionId: string,
  variables: PortalChatVariables,
  historyContext: string,
  onEvent: (event: ChatStreamEvent) => void,
  signal: AbortSignal,
  resume?: FormResumeRequest,
): Promise<void> {
  const response = await portalFetch(`/portal/ai/agents/${accessToken}/chat`, {
    method: 'POST',
    body: {
      question,
      sessionId,
      variables,
      historyContext,
      ...(resume
        ? {
            resumeRunRecordId: resume.runRecordId,
            resumeNodeId: resume.nodeId,
            formData: resume.formData,
          }
        : {}),
    },
    headers: { Accept: 'text/event-stream' },
    signal,
    timeoutMs: 0,
  });
  if (!response.body) throw new Error('当前浏览器无法读取流式响应');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const event = parseEvent(block);
      if (event) onEvent(event);
    }
    if (done) break;
  }
  const finalEvent = parseEvent(buffer);
  if (finalEvent) onEvent(finalEvent);
}

interface PortalFileRecord {
  id: string;
  originalFilename?: string;
  size?: number | string;
}

export async function uploadPortalChatFile(file: File, category: PortalUploadedFile['category']): Promise<PortalUploadedFile> {
  const formData = new FormData();
  formData.append('file', file);
  const payload = await portalRequest<PortalFileRecord | ApiEnvelope<PortalFileRecord>>('/base/admin/fileSave/upload', {
    method: 'POST',
    body: formData,
  });
  const record = unwrap(payload);
  return {
    id: record.id,
    name: record.originalFilename || file.name,
    size: Number(record.size ?? file.size),
    category,
  };
}
