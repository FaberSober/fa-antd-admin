<script setup lang="ts">
import { onError, onLaunch, onUnhandledRejection } from '@dcloudio/uni-app';
import { hasToken } from './features/fa-base-mobile/common/session';
import { telemetry } from './features/fa-core-mobile/telemetry';

const HOME_ROUTE = '/features/fa-base-mobile/pages/main/index';

function getUnhandledReason(event: unknown): unknown {
  if (event && typeof event === 'object' && 'reason' in event) {
    return (event as { reason?: unknown }).reason || event;
  }
  return event;
}

onLaunch(() => {
  telemetry.track('mobile.app.launch', {
    eventType: 'ACTION',
    module: 'app',
  });

  if (hasToken()) {
    setTimeout(() => {
      uni.reLaunch({ url: HOME_ROUTE });
    }, 0);
  }
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
