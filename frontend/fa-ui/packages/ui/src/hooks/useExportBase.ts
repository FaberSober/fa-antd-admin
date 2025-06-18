import {useState} from "react";
import {BaseTableUtils} from "@ui/components/base-table";
import {Fa} from "@ui/types";
import {Modal} from "antd";


/**
 * 导出Excel
 * @param exportApi 导出API
 * @param queryParams 表格查询参数
 */
export default function useExportBase(
  exportApi: (params: any) => Promise<undefined>,
  params: Fa.BasePageProps,
): [exporting: boolean, fetchExportExcel: () => void] {
  const [exporting, setExporting] = useState(false);

  /** 导出Excel文件 */
  function fetchExportExcel() {
    Modal.confirm({
      title: '确认导出？',
      onOk: () => {
        setExporting(true);
        return exportApi(params)
          .then(() => setExporting(false))
          .catch(() => setExporting(false));
      }
    })
  }

  return [exporting, fetchExportExcel];
}
