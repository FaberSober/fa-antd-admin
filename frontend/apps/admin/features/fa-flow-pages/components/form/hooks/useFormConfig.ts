import { Flow } from "@/types";
import { useMemo } from "react";

export default function useFormConfig(config: Flow.FlowFormConfig) {
    const layout = useMemo(() => {
      return config?.layout || [];
    }, [config]);
    const formItemMap = useMemo(() => {
      return config?.formItemMap || {};
    }, [config]);

    return { layout, formItemMap };
}
