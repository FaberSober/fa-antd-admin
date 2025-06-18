import {Fa} from "@ui/types";
import {showResponse} from "@ui/utils/utils";

/**
 * 删除单个Item
 * @param deleteApi
 * @param refreshList
 * @param serviceName
 */
export default function useDelete<T>(deleteApi: (id: T) => Promise<Fa.Ret>, refreshList: (id: T) => void, serviceName = ''): [(id: T) => void] {
  function handleDelete(id: T) {
    deleteApi(id).then((res) => {
      showResponse(res, `删除${serviceName}信息`);
      refreshList(id);
    });
  }
  return [handleDelete];
}
