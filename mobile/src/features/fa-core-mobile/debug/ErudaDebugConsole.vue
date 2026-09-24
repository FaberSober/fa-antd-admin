<template>
  <!-- @vue-ignore -->
  <view
    class="eruda-debug-bridge"
    :debug-config="debugConfig"
    :change:debug-config="eruda.onDebugConfigChange"
  />
</template>

<script lang="ts">
import erudaScriptUrl from 'eruda/eruda.js?url';

export default {
  props: {
    enabled: {
      type: Boolean,
      default: false,
    },
    logs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const localPath = plus.io.convertLocalFileSystemURL(`_www${erudaScriptUrl}`);
    return { erudaScriptUrl: `file://${localPath}` };
  },
  computed: {
    debugConfig() {
      return { enabled: this.enabled, scriptUrl: this.erudaScriptUrl, logs: this.logs };
    },
  },
  methods: {
    reportErudaError(message: string) {
      this.$emit('error', message);
    },
  },
};
</script>

<script module="eruda" lang="renderjs">
let initialized = false;
let enabled = false;
let operation = 0;
let loadPromise;
let lastRenderedLogSequence = 0;

function loadEruda(scriptUrl) {
  if (window.eruda) return Promise.resolve(window.eruda);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => resolve(window.eruda);
    script.onerror = () => {
      loadPromise = undefined;
      reject(new Error(`Eruda script failed to load: ${script.src}`));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

function renderLogs(logs) {
  for (const entry of logs) {
    if (entry.sequence <= lastRenderedLogSequence) continue;
    window.console.log(entry.message);
    lastRenderedLogSequence = entry.sequence;
  }
}

export default {
  methods: {
    async onDebugConfigChange(config) {
      const currentOperation = ++operation;
      enabled = config.enabled;

      if (!enabled) {
        if (initialized && window.eruda) window.eruda.destroy();
        initialized = false;
        lastRenderedLogSequence = 0;
        return;
      }

      try {
        const eruda = await loadEruda(config.scriptUrl);
        if (!enabled || currentOperation !== operation || !eruda) return;

        if (!initialized) {
          eruda.init({ tool: ['console'], useShadowDom: true, autoScale: true });
          eruda.get('console').config.set('jsExecution', false);
          initialized = true;
          eruda.show('console');
        }
        renderLogs(config.logs);
      } catch (error) {
        this.$ownerInstance.callMethod('reportErudaError', String(error));
      }
    },
  },
};
</script>

<style scoped>
.eruda-debug-bridge {
  position: fixed;
  left: -2px;
  top: -2px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>
