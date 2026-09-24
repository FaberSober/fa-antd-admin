import { readonly, shallowRef } from 'vue';
import type { UpdateManifest, UpdateStatus } from './types';

type UpdatePromptState = {
  kind: 'confirm';
  title: string;
  description: string;
  versionName: string;
  packageName: string;
  forceUpdate: boolean;
  showCancel: boolean;
  confirmText: string;
  cancelText: string;
} | {
  kind: 'progress';
  versionName: string;
  packageName: string;
  progress: number;
  phase: 'DOWNLOADING' | 'VERIFYING';
};

interface UpdatePromptOptions {
  manifest: UpdateManifest;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  showCancel?: boolean;
}

const activePrompt = shallowRef<UpdatePromptState | null>(null);
let resolveConfirmation: ((confirmed: boolean) => void) | undefined;

export const updatePromptState = readonly(activePrompt);

export function askUpdatePrompt(options: UpdatePromptOptions): Promise<boolean> {
  return new Promise((resolve) => {
    resolveConfirmation = resolve;
    activePrompt.value = {
      kind: 'confirm',
      title: options.title,
      description: options.description,
      versionName: options.manifest.versionName || '',
      packageName: options.manifest.updateType === 'WGT' ? '增量资源包' : '完整安装包',
      forceUpdate: Boolean(options.manifest.forceUpdate),
      showCancel: options.showCancel ?? !options.manifest.forceUpdate,
      confirmText: options.confirmText,
      cancelText: options.cancelText || '稍后更新',
    };
  });
}

export function finishUpdatePrompt(confirmed: boolean): void {
  const resolve = resolveConfirmation;
  resolveConfirmation = undefined;
  activePrompt.value = null;
  resolve?.(confirmed);
}

export function showUpdateProgress(manifest: UpdateManifest): void {
  activePrompt.value = {
    kind: 'progress',
    versionName: manifest.versionName || '',
    packageName: manifest.updateType === 'WGT' ? '增量资源包' : '完整安装包',
    progress: 0,
    phase: 'DOWNLOADING',
  };
}

export function updateProgress(progress: number, status: UpdateStatus): void {
  const prompt = activePrompt.value;
  if (prompt?.kind !== 'progress' || (status !== 'DOWNLOADING' && status !== 'VERIFYING')) return;

  activePrompt.value = {
    ...prompt,
    progress: status === 'VERIFYING'
      ? 100
      : Math.max(0, Math.min(100, Math.round(progress))),
    phase: status,
  };
}

export function closeUpdatePrompt(): void {
  activePrompt.value = null;
}
