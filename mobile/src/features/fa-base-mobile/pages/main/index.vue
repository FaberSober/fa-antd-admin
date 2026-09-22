<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { provide, ref } from 'vue';
import { MOBILE_PAGE_ROUTES, MOBILE_TAB_NAVIGATION_KEY, type MobileTabKey } from '../../feature';
import { useAuthStore } from '../../stores/auth';
import HomePage from '../home/index.vue';
import MessagesPage from '../messages/index.vue';
import ContactsPage from '../contacts/index.vue';
import MinePage from '../mine/index.vue';

const TAB_COMPONENTS = {
  messages: MessagesPage,
  workbench: HomePage,
  contacts: ContactsPage,
  mine: MinePage,
} as const;

const authStore = useAuthStore();
const activeTab = ref<MobileTabKey>('workbench');

function selectTab(tab: MobileTabKey): void {
  activeTab.value = tab;
}

provide(MOBILE_TAB_NAVIGATION_KEY, selectTab);

onLoad((query) => {
  const tab = query?.tab;
  if (typeof tab === 'string' && tab in TAB_COMPONENTS) {
    activeTab.value = tab as MobileTabKey;
  }
});

onShow(() => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: MOBILE_PAGE_ROUTES.login });
  }
});
</script>

<template>
  <view class="mobile-main-page">
    <!-- #ifdef H5 -->
    <KeepAlive>
      <MessagesPage v-if="activeTab === 'messages'" />
      <HomePage v-else-if="activeTab === 'workbench'" />
      <ContactsPage v-else-if="activeTab === 'contacts'" />
      <MinePage v-else />
    </KeepAlive>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <MessagesPage v-if="activeTab === 'messages'" />
    <HomePage v-else-if="activeTab === 'workbench'" />
    <ContactsPage v-else-if="activeTab === 'contacts'" />
    <MinePage v-else />
    <!-- #endif -->
  </view>
</template>

<style scoped>
.mobile-main-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}
</style>
