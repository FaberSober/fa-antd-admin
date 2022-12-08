import React, {useCallback, useEffect, useState} from 'react'
import {RES_CODE} from "@/configs/server.config";
import * as BaseTableUtils from "@/components/base-table/utils";
import {TablePaginationConfig} from "antd";
import {get, hasIn, isEqual} from 'lodash';
import ConditionQuery from "@/components/condition-query/interface";
import {showResponse} from '@/utils/utils';
import {useIntl} from 'react-intl';
import queryString from 'querystring';
import Fa from "@/props/base/Fa";


export function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback((node:any) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}

export function useLocationParams() {
  return queryString.parse(location.search);
}

export interface UseTableQueryParamsResProps<T> {
  // // ------------------------------------------ 表格查询参数更新 ------------------------------------------
  queryParams: Fa.QueryParams;
  updateQueryParams: (updateParams: Fa.InitQueryParams) => void;
  setPagination: (pagination: Fa.Pagination) => void;
  setSorter: (sorter: Fa.Sorter) => void;
  setFormValues: (formValues: any) => void;
  setSceneId: (sceneId: string | undefined) => void;
  setConditionList: (conditionList: ConditionQuery.CondGroup[]) => void;
  setExtraParams: (extraParams: any) => void;
  handleTableChange: (paginationArg: TablePaginationConfig, filtersArg: any, sorterArg: any) => void;

  // ------------------------------------------ 表格查询结果更新 ------------------------------------------
  loading: boolean;
  list: T[];
  dicts: Fa.PageDict;
  fetchPageList: () => void;
  //
  // // ------------------------------------------ 表格展示分页数据 ------------------------------------------
  showPagination: Fa.Pagination;
  // setShowPagination: any;
  //
  // ------------------------------------------ 表格展示 ------------------------------------------
  paginationProps: TablePaginationConfig;
}

export function useTableQueryParams<T>(
  api: (params: any) => Promise<Fa.Ret<Fa.Page<T>>>,
  initParams: Fa.InitQueryParams = {},
  serviceName: string
): UseTableQueryParamsResProps<T> {
  const [loading, setLoading] = useState(false);

  const [queryParams, setQueryParams] = useState<Fa.QueryParams>({
    pagination: { current: 1, pageSize: 20, total: 0 }, // 表格分页
    sorter: { field: 'id', order: 'descend' }, // 排序
    formValues: {}, // 查询Form字段
    sceneId: undefined, // 场景ID
    conditionList: [], // 组合查询
    ...initParams, // 自定义字段覆盖
  });

  const [ret, setRet] = useState<{ list: T[], dicts: Fa.PageDict, showPagination: Fa.Pagination }>({
    list: [], // 表格List
    dicts: {}, // 字典
    showPagination: { current: 1, pageSize: 10, total: 0, ...initParams?.pagination }
  })

  useEffect(() => {
    fetchPageList()
  }, [queryParams]);

  // ------------------------------------------ 表格查询参数更新 ------------------------------------------
  function updateQueryParams(updateParams: Fa.InitQueryParams) {
    if (isEqual(queryParams, { ...queryParams, ...updateParams })) return;
    setQueryParams({ ...queryParams, ...updateParams });
  }

  function setPagination(pagination: Fa.Pagination) {
    if (isEqual(queryParams.pagination, pagination)) return;
    setQueryParams({ ...queryParams, pagination: { ...pagination } });
  }

  function setSorter(sorter: Fa.Sorter) {
    if (isEqual(queryParams.sorter, sorter)) return;
    setQueryParams({ ...queryParams, sorter });
  }

  /**
   * 更新表单字段，并设置分页为1
   * @param formValues
   */
  function setFormValues(formValues: any) {
    // if (isEqual(queryParams.formValues, formValues)) return;
    setQueryParams({ ...queryParams, pagination: { ...queryParams.pagination, current: 1 }, formValues });
  }

  function setSceneId(sceneId: string | undefined) {
    if (isEqual(queryParams.sceneId, sceneId)) return;
    setQueryParams({ ...queryParams, pagination: { ...queryParams.pagination, current: 1 }, sceneId });
  }

  function setConditionList(conditionList: ConditionQuery.CondGroup[]) {
    // console.log('setConditionList', conditionList)
    if (isEqual(queryParams.conditionList, conditionList)) return;
    setQueryParams({ ...queryParams, pagination: { ...queryParams.pagination, current: 1 }, conditionList });
  }

  function setExtraParams(extraParams: any) {
    if (isEqual(queryParams.extraParams, extraParams)) return;
    setQueryParams({ ...queryParams, pagination: { ...queryParams.pagination, current: 1 }, extraParams });
  }

  /** 表格事件处理：分页、过滤、排序 */
  function handleTableChange(paginationArg: TablePaginationConfig, filtersArg: any, sorterArg: any) {
    const newPagination: Fa.Pagination = {
      current: paginationArg.current || 1,
      pageSize: paginationArg.pageSize || 10,
      total: queryParams.pagination?.total || 0,
    };

    if (hasIn(sorterArg, 'field')) {
      const newSorter: Fa.Sorter = { field: get(sorterArg, 'field', ''), order: get(sorterArg, 'order')! };
      updateQueryParams({ pagination: newPagination, sorter: newSorter });
    } else {
      setPagination(newPagination);
    }
  }

  // ------------------------------------------ 表格查询结果更新 ------------------------------------------
  /** 获取分页数据 */
  function fetchPageList() {
    setLoading(true);
    const params = {
      current: queryParams.pagination.current,
      pageSize: queryParams.pagination.pageSize,
      sorter: BaseTableUtils.getSorter(queryParams.sorter),
      sceneId: queryParams.sceneId,
      conditionList: queryParams.conditionList,
      queryMap: {
        ...queryParams.formValues,
        // 外部补充查询条件
        ...queryParams.extraParams,
      },
    };
    api(params)
      .then((res) => {
        setLoading(false);
        if (res && res.status === RES_CODE.OK) {
          const { pagination: page } = res.data;
          const pagination: Fa.Pagination = { current: Number(page.current), pageSize: Number(page.pageSize), total: Number(page.total) }
          setRet({ list: res.data.rows, dicts: res.data.dicts, showPagination: pagination })
        }
      })
      .catch(() => setLoading(false));
  }

  // ------------------------------------------ 表格展示 ------------------------------------------
  const paginationProps: TablePaginationConfig = {
    showSizeChanger: true,
    showQuickJumper: true,
    size: 'default',
    showTotal: (total) => (
      <span>
        共<a style={{ fontWeight: 600 }}>{total}</a>个{serviceName}信息
      </span>
    ),
    onChange: (page, pageSize) => {
      setPagination({ current: page, pageSize: pageSize || queryParams.pagination.pageSize });
    },
    pageSizeOptions: ['10', '20', '30', '50', '100', '500', '1000'],
    ...ret.showPagination,
  };

  return {
    queryParams,
    updateQueryParams,
    setPagination,
    setSorter,
    setFormValues,
    setSceneId,
    setConditionList,
    setExtraParams,
    handleTableChange,
    fetchPageList,
    loading,
    list: ret.list,
    dicts: ret.dicts,
    showPagination: ret.showPagination,
    paginationProps,
  }
}



/**
 * 删除单个Item
 * @param deleteApi
 * @param refreshList
 * @param serviceName
 */
export function useDelete<T>(deleteApi: (id: T) => Promise<Fa.Ret>, refreshList: () => void, serviceName: string = ''): [(id: T) => void] {
  function handleDelete(id: T) {
    deleteApi(id).then((res) => {
      showResponse(res, `删除${serviceName}信息`);
      refreshList();
    });
  }
  return [handleDelete];
}

/**
 * 导出Excel
 * @param exportApi 导出API
 * @param queryParams 表格查询参数
 */
export function useExport(exportApi: (params: any) => Promise<undefined>, queryParams: Fa.QueryParams): [exporting: boolean, fetchExportExcel: () => void] {
  const [exporting, setExporting] = useState(false);

  /** 导出Excel文件 */
  function fetchExportExcel() {
    setExporting(true);
    const params = {
      sorter: BaseTableUtils.getSorter(queryParams.sorter),
      sceneId: queryParams.sceneId,
      conditionList: queryParams.conditionList,
      queryMap: {
        ...queryParams.formValues,
        // 外部补充查询条件
        ...queryParams.extraParams,
      },
    };
    exportApi(params)
      .then((res) => {
        setExporting(false);
      })
      .catch(() => setExporting(false));
  }

  return [exporting, fetchExportExcel];
}

/**
 * 重置表格字段
 * @param form
 */
export function clearForm(form: any) {
  if (form === undefined || form == null) return;
  form.resetFields();
  form.submit();
}

/**
 * 国际化网页的helmet title展示
 */
export function useHelmetId(titleId: string) {
  const intl = useIntl();
  return `${intl.formatMessage({ id: titleId })} - ${intl.formatMessage({ id: 'site.title' })}`;
}
