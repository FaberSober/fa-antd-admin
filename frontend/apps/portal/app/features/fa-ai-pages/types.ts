export interface PortalAgent {
  id: number;
  name: string;
  icon?: string | null;
  category?: string | null;
  description?: string | null;
  openingMessage?: string | null;
  suggestedQuestions: string[];
  baseConfig?: PortalBaseNodeConfig | null;
}

export type PortalInputValue = string | number | boolean | string[];

export type PortalBaseInputType = 'TextInput' | 'PasswordInput' | 'SingleSelect' | 'MultiSelect' | 'DatePicker' | 'SwitchInput' | 'TextareaInput';

export interface PortalBaseUserInputField {
  field: string;
  label:
    | string
    | {
        label?: string;
        attrs?: {
          tooltip?: string;
        };
      };
  required?: boolean;
  default_value?: PortalInputValue;
  show_default_value?: boolean;
  input_type?: PortalBaseInputType;
  attrs?: {
    minlength?: number;
    maxlength?: number;
  };
  option_list?: Array<{
    label: string;
    value: string;
  }>;
  visibility_rules?: {
    action?: 'show' | 'hide';
    condition?: 'and' | 'or';
    conditions?: Array<{ field?: string[]; compare?: string; value?: string }>;
  };
}

export interface PortalBaseApiInputField {
  variable: string;
  is_required?: boolean;
  default_value?: string;
  desc?: string;
}

export interface PortalBaseChatInputField {
  field: string;
  label: string;
}

export interface PortalBaseFileUploadSetting {
  maxFiles?: number;
  fileLimit?: number;
  document?: boolean;
  image?: boolean;
  audio?: boolean;
  video?: boolean;
  other?: boolean;
  otherExtensions?: string[];
  local_upload?: boolean;
  url_upload?: boolean;
}

export interface PortalBaseNodeConfig {
  node_data?: {
    name?: string;
    desc?: string;
    prologue?: string;
    long_term_enable?: boolean;
    file_upload_enable?: boolean;
    file_upload_setting?: PortalBaseFileUploadSetting;
    stt_model_enable?: boolean;
    stt_autosend?: boolean;
    tts_model_enable?: boolean;
    tts_autoplay?: boolean;
    tts_type?: 'BROWSER' | 'TTS';
    tts_model_id?: number;
    tts_model_params_setting?: {
      voice?: string;
      speed?: number;
      response_format?: string;
    };
  };
  user_input_config?: {
    title?: string;
    exposed_fields?: string[];
    menu_title?: string;
  };
  user_input_field_list?: PortalBaseUserInputField[];
  api_input_field_list?: PortalBaseApiInputField[];
  chat_input_field_list?: PortalBaseChatInputField[];
}

export interface PortalChatVariables {
  [key: string]: PortalInputValue | undefined;
}

export interface PortalUploadedFile {
  id: string;
  name: string;
  size: number;
  category: 'document' | 'image' | 'audio' | 'video' | 'other';
}

export interface ChatMessageAttachment {
  id: string;
  name: string;
  category: PortalUploadedFile['category'];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatMessageAttachment[];
  audioUrl?: string;
  imageUrls?: string[];
  videoUrls?: string[];
  createdAt: number;
  feedback?: 0 | 1 | 2;
  tokenCount?: number;
  durationMs?: number;
  executionDetails?: Record<string, unknown>;
  nl2sql?: Nl2SqlWorkflowOutput[];
  runRecordId?: number;
}

export interface Nl2SqlResultColumn {
  label: string;
  jdbcType: number;
  typeName: string;
  masked: boolean;
}

export interface Nl2SqlChartHint {
  type: 'table' | 'line' | 'bar' | 'pie';
  x?: string;
  y?: string[];
}

export interface Nl2SqlWorkflowOutput {
  node_id?: string;
  node_title?: string;
  answer?: string;
  status?: string;
  run_id?: number;
  sql?: string;
  columns?: Nl2SqlResultColumn[];
  rows?: Array<Record<string, unknown>>;
  row_count?: number;
  truncated?: boolean;
  chart_hint?: Nl2SqlChartHint;
  clarification_question?: string;
  dataset_version?: number;
}

export interface ChatConversation {
  id: number;
  sessionId: string;
  summary: string;
  questionCount: number;
  feedback: number;
  tokenCount: number;
  durationMs: number;
  messagesJson?: string | null;
  lastConversationTime?: string | null;
}

export interface ChatSession {
  conversationId?: number;
  id: string;
  title: string;
  messages: ChatMessage[];
  feedback?: 0 | 1 | 2;
}
