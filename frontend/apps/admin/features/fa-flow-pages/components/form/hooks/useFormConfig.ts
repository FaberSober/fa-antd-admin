import { Flow } from "@/types";
import { useMemo } from "react";

export default function useFormConfig(config: Flow.FlowFormConfig) {
    const layout = useMemo(() => {
      return config?.layout || [];
    }, [config?.layout]);
    const formItemMap = useMemo(() => {
      return config?.formItemMap || {};
    }, [config?.formItemMap]);
    const formConfig = useMemo(() => {
      return config?.formConfig || {
        name: '',
        description: '',
        labelWidth: 80,
        layout: 'horizontal',
      };
    }, [config?.formConfig]);
    const items = useMemo(() => {
      return config?.items || [];
    }, [config?.items]);

    return { layout, formItemMap, formConfig, items };
}
