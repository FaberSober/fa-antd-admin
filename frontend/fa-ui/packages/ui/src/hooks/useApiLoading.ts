import { useApiLoadingStore } from "@ui/stores";

export function useApiLoading(keyOrKeys: string | string[]): boolean {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

  return useApiLoadingStore((state) =>
    keys.some(key => state.isLoading(key))
  );
}
