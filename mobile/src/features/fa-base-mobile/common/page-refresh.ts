import { computed, ref } from 'vue';

export type PageRefreshState = 'initial-loading' | 'ready' | 'refreshing' | 'error';

type RefreshLoader = (isCurrent: () => boolean) => Promise<void>;
type ErrorMessage = (error: unknown) => string;

export function createPageRefresh() {
  const state = ref<PageRefreshState>('initial-loading');
  const errorMessage = ref('');
  const initialLoading = computed(() => state.value === 'initial-loading');
  const refreshing = computed(() => state.value === 'refreshing');
  const busy = computed(() => initialLoading.value || refreshing.value);
  let version = 0;
  let inFlight: Promise<void> | null = null;
  let inFlightToken = 0;

  function run(load: RefreshLoader, hasData: () => boolean, getErrorMessage: ErrorMessage): Promise<void> {
    if (inFlight) return inFlight;

    const currentVersion = ++version;
    const currentRequestToken = ++inFlightToken;
    const hasCachedData = hasData();
    state.value = hasCachedData ? 'refreshing' : 'initial-loading';
    errorMessage.value = '';

    const request = (async () => {
      try {
        await load(() => currentVersion === version);
        if (currentVersion !== version) return;
        state.value = 'ready';
      } catch (error) {
        if (currentVersion !== version) return;

        const message = getErrorMessage(error);
        if (hasCachedData) {
          state.value = 'ready';
          uni.showToast({ title: message, icon: 'none' });
        } else {
          state.value = 'error';
          errorMessage.value = message;
        }
      } finally {
        if (inFlightToken === currentRequestToken) inFlight = null;
      }
    })();
    inFlight = request;
    return request;
  }

  function invalidate(): void {
    version += 1;
    inFlight = null;
    inFlightToken += 1;
  }

  return {
    state,
    errorMessage,
    initialLoading,
    refreshing,
    busy,
    run,
    invalidate,
    isRunning: () => Boolean(inFlight),
  };
}
