package com.faber.core.vo.msg;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.faber.core.vo.utils.DictOption;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 基本的Table Response返回父类
 */
@Slf4j
public class TableRet<T> extends BaseRet {

    TableData<T> data;

    @Deprecated
    public TableRet(long total, List<T> rows) {
        this.data = new TableData<T>(total, rows);
    }

    public TableRet(Pagination pagination, List<T> rows) {
        this.data = new TableData<T>(pagination, rows);
    }

    public TableRet(Page<T> result) {
        this.data = new TableData<T>(result);
    }

    public TableRet(PageInfo<T> pageInfo) {
        this.data = new TableData<T>(pageInfo);
    }

    public TableRet() {
        this.data = new TableData<T>();
    }

    TableRet<T> total(int total) {
        this.data.setTotal(total);
        return this;
    }

    TableRet<T> total(List<T> rows) {
        this.data.setRows(rows);
        return this;
    }

    public TableData<T> getData() {
        return data;
    }

    public void setData(TableData<T> data) {
        this.data = data;
    }

    public TableRet<T> addDict(String column, List<DictOption<Serializable>> dictOptions) {
        this.getData().addDict(column, dictOptions);
        return this;
    }

    public static class TableData<T> {
        Pagination pagination;
        long total;
        List<T> rows;
        Map<String, List<DictOption<Serializable>>> dicts = new HashMap<>();

        @Deprecated
        public TableData(long total, List<T> rows) {
            this.total = total;
            this.rows = rows;
        }

        public TableData(Pagination pagination, List<T> rows) {
            this.total = pagination.getTotal();
            this.pagination = pagination;
            this.rows = rows;
        }

        public TableData(Page<T> result) {
            Pagination pagination = new Pagination();
            pagination.setTotal(result.getTotal());
            pagination.setPageSize(result.getSize());
            pagination.setCurrent(result.getCurrent());

            try {
                pagination.setPages(result.getPages());
                pagination.setHasPreviousPage(result.getCurrent() > 1);
                pagination.setHasNextPage(result.getCurrent() < result.getPages());
                pagination.setStartRow((result.getCurrent() - 1) * result.getSize() + 1);
                pagination.setEndRow((result.getCurrent() - 1) * result.getSize() + result.getRecords().size());
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }

            this.total = result.getTotal();
            this.rows = result.getRecords();
            this.pagination = pagination;
        }

        public TableData(PageInfo<T> pageInfo) {
            Pagination pagination = new Pagination();
            pagination.setTotal(pageInfo.getTotal());
            pagination.setPageSize(pageInfo.getPageSize());
            pagination.setCurrent(pageInfo.getPageNum());

            pagination.setPages(pageInfo.getPages());
            pagination.setHasNextPage(pageInfo.isHasNextPage());
            pagination.setHasPreviousPage(pageInfo.isHasPreviousPage());
            pagination.setStartRow(pageInfo.getStartRow());
            pagination.setEndRow(pageInfo.getEndRow());

            this.total = pageInfo.getTotal();
            this.rows = pageInfo.getList();
            this.pagination = pagination;
        }

        public TableData() {
        }

        public TableData<T> addDict(String column, List<DictOption<Serializable>> dictOptions) {
            if (dicts == null) dicts = new HashMap<>();
            dicts.put(column, dictOptions);
            return this;
        }

        // FIXME 这里的范型不知道怎么修改。。。
//        public TableData<T> addDictByClass(String column, Class<? extends IEnum<Y>> iEnumClass) {
//            return this.addDict(column, FaEnumUtils.toOptions(iEnumClass));
//        }

        public long getTotal() {
            return total;
        }

        public TableData<T> setTotal(long total) {
            this.total = total;
            return this;
        }

        public List<T> getRows() {
            return rows;
        }

        public TableData<T> setRows(List<T> rows) {
            this.rows = rows;
            return this;
        }

        public Map<String, List<DictOption<Serializable>>> getDicts() {
            return dicts;
        }

        public TableData<T> setDicts(Map<String, List<DictOption<Serializable>>> dicts) {
            this.dicts = dicts;
            return this;
        }

        public Pagination getPagination() {
            return pagination;
        }

        public TableData<T> setPagination(Pagination pagination) {
            this.pagination = pagination;
            return this;
        }
    }


    public static class Pagination {
        private long total;
        private long pageSize;
        private long current;

        /**
         * 由于startRow和endRow不常用，这里说个具体的用法
         * 可以在页面中"显示startRow到endRow 共size条数据"
         * 当前页面第一个元素在数据库中的行号
         */
        private long startRow = 0;
        /**
         * 当前页面最后一个元素在数据库中的行号
         */
        private long endRow = 0;
        /**
         * 总页数
         */
        private long pages = 0;
        /**
         * 是否有前一页
         */
        private boolean hasPreviousPage = false;
        /**
         * 是否有下一页
         */
        private boolean hasNextPage = false;

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public long getPageSize() {
            return pageSize;
        }

        public void setPageSize(long pageSize) {
            this.pageSize = pageSize;
        }

        public long getCurrent() {
            return current;
        }

        public void setCurrent(long current) {
            this.current = current;
        }

        public long getStartRow() {
            return startRow;
        }

        public void setStartRow(long startRow) {
            this.startRow = startRow;
        }

        public long getEndRow() {
            return endRow;
        }

        public void setEndRow(long endRow) {
            this.endRow = endRow;
        }

        public long getPages() {
            return pages;
        }

        public void setPages(long pages) {
            this.pages = pages;
        }

        public boolean isHasPreviousPage() {
            return hasPreviousPage;
        }

        public void setHasPreviousPage(boolean hasPreviousPage) {
            this.hasPreviousPage = hasPreviousPage;
        }

        public boolean isHasNextPage() {
            return hasNextPage;
        }

        public void setHasNextPage(boolean hasNextPage) {
            this.hasNextPage = hasNextPage;
        }
    }
}
