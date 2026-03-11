import {Fa} from "@ui/types";
import {showResponse} from "@ui/utils/utils";
import { Modal } from "antd";

/**
 * 删除单个Item(带确认弹窗)
 * @param deleteApi
 * @param refreshList
 * @param serviceName
 */
export default function useDeleteConfirm<T>(deleteApi: (id: T) => Promise<Fa.Ret>, refreshList: (id: T) => void, serviceName = ''): [(id: T) => void] {
  function handleDelete(id: T) {
    Modal.confirm({
      title: '全部删除',
      content: '确认删除该数据？',
      onOk: () => {
        return deleteApi(id).then((res) => {
          showResponse(res, `删除${serviceName}信息`);
          refreshList(id);
        });
      },
      okText: '删除',
      okButtonProps: { danger: true },
    })
  }
  return [handleDelete];
}
