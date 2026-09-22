<script setup lang="ts">
import { onError, onLaunch, onShow, onUnhandledRejection } from '@dcloudio/uni-app';
import { hasToken } from './features/fa-base-mobile/common/session';
import { checkAndPromptUpdate } from './features/fa-base-mobile/common/update';
import { telemetry } from './features/fa-core-mobile/telemetry';

const HOME_ROUTE = '/features/fa-base-mobile/pages/main/index';

function getUnhandledReason(event: unknown): unknown {
  if (event && typeof event === 'object' && 'reason' in event) {
    return (event as { reason?: unknown }).reason || event;
  }
  return event;
}

function initializePush() {
  // #ifdef APP-PLUS && APP-ANDROID
  plus.android.requestPermissions(['android.permission.POST_NOTIFICATIONS']);
  // #endif

  // #ifdef APP-PLUS
  uni.getPushClientId({
    success: ({ cid }) => {
      console.info('[UniPush] clientId:', cid);
    },
    fail: (error) => {
      telemetry.captureException(error, { source: 'uni.getPushClientId' });
    },
  });
  uni.onPushMessage((message) => {
    console.info('[UniPush] message received:', message);
  });
  // #endif
}

onLaunch(() => {
  telemetry.track('mobile.app.launch', {
    eventType: 'ACTION',
    module: 'app',
  });

  initializePush();

  if (hasToken()) {
    setTimeout(() => {
      uni.reLaunch({ url: HOME_ROUTE });
    }, 0);
  }
});

onShow(() => {
  if (!hasToken()) return;
  void checkAndPromptUpdate();
});

onError((error) => {
  telemetry.captureException(error, { source: 'uni.onError' });
});

onUnhandledRejection((event) => {
  telemetry.captureException(getUnhandledReason(event), { source: 'uni.onUnhandledRejection' });
});
</script>

<style>
@import './styles/global.css';
</style>
