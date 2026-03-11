// stores/useApiLoadingStore.ts  ← 推荐文件名
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LoadingState {
  /** 使用 Map 记录每个 URL 的请求计数 */
  loadings: Map<string, number>;

  isLoading: (key: string) => boolean;
  start: (key: string) => void;
  end: (key: string) => void;
  count: () => number;
  clear: () => void; // 可选：清空所有 loading（页面卸载时用）
}

export const useApiLoadingStore = create<LoadingState>()(
  devtools<LoadingState>((set, get) => ({
    loadings: new Map(),

    isLoading: (key) => (get().loadings.get(key) ?? 0) > 0,

    start: (key) =>
      set((state) => {
        const newMap = new Map(state.loadings);
        newMap.set(key, (newMap.get(key) ?? 0) + 1);
        return { loadings: newMap };
      }),

    end: (key) =>
      set((state) => {
        const newMap = new Map(state.loadings);
        const count = (newMap.get(key) ?? 0) - 1;
        if (count <= 0) {
          newMap.delete(key);
        } else {
          newMap.set(key, count);
        }
        return { loadings: newMap };
      }),

    count: () => {
      let total = 0;
      for (const count of get().loadings.values()) {
        total += count;
      }
      return total;
    },

    clear: () => set({ loadings: new Map() }),
  }), { name: 'API Loading Store' })
);
