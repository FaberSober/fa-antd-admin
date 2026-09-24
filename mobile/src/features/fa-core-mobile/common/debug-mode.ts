import { ref } from 'vue';

export const clientDebugModeEnabled = ref(false);
export const clientDebugLogs = ref<Array<{ sequence: number; message: string }>>([]);
let logSequence = 0;

export function isClientDebugModeEnabled(): boolean {
  return clientDebugModeEnabled.value;
}

export function setClientDebugModeEnabled(value: boolean): void {
  clientDebugModeEnabled.value = value;
  if (!value) clientDebugLogs.value = [];
}

export function appendClientDebugLog(message: string): void {
  if (!clientDebugModeEnabled.value) return;
  clientDebugLogs.value = [
    ...clientDebugLogs.value.slice(-99),
    { sequence: ++logSequence, message },
  ];
}
