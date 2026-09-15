<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { hasToken } from './features/fa-base-mobile/common/session';

const HOME_ROUTE = '/features/fa-base-mobile/pages/home/index';

onLaunch(() => {
  if (hasToken()) {
    setTimeout(() => {
      uni.reLaunch({ url: HOME_ROUTE });
    }, 0);
  }
});
</script>

<style>
@import './styles/global.css';
</style>
