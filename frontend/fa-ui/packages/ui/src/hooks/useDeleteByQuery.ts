import {useState} from "react";
import {BaseTableUtils} from "@ui/components/base-table";
import {Fa} from "@ui/types";
import {Modal} from "antd";


/**
 * 根据当前查询条件全量删除
 * @param api API
 * @param queryParams 表格查询参数
 * @param onFinish onFinish
 */
export default function useDeleteByQuery(
  api: (params: any) => Promise<Fa.Ret<boolean>>,
  queryParams: Fa.QueryParams,
  onFinish: () => void,
): [deleting: boolean, deleteByQuery: () => void] {
  const [deleting, setDeleting] = useState(false);

  /** 导出Excel文件 */
  function deleteByQuery() {
    Modal.confirm({
      title: '全部删除',
      content: '确认删除本次查询的所有数据？',
      onOk: () => {
        setDeleting(true);
        const params = BaseTableUtils.getQueryParams(queryParams);
        return api(params)
          .then(() => {
            onFinish()
            setDeleting(false)
          })
          .catch(() => setDeleting(false));
      },
      okText: '删除',
      okButtonProps: { danger: true },
    })
  }

  return [deleting, deleteByQuery];
}
