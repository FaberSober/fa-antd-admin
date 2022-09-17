package com.faber.article.biz;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.faber.admin.biz.FileSaveBiz;
import com.faber.admin.entity.FileSave;
import com.faber.article.entity.Book;
import com.faber.article.entity.Detail;
import com.faber.article.entity.Outline;
import com.faber.article.mapper.BookMapper;
import com.faber.article.vo.BookDetail;
import com.faber.article.vo.BookOutlineDetail;
import com.faber.article.vo.UploadStdExcelParams;
import com.faber.article.vo.UploadStdExcelLineVo;
import com.faber.common.biz.BaseBiz;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 文章-书本
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@Service
public class BookBiz extends BaseBiz<BookMapper, Book> {

    @Resource
    private OutlineBiz outlineBiz;

    @Resource
    private DetailBiz detailBiz;

    @Resource
    private FileSaveBiz fileSaveBiz;

    public BookDetail getDetail(Integer id) {
        Book book = getById(id);
        checkBeanValid(book);

        List<BookOutlineDetail> detailList = detailBiz.getBaseMapper().getByBook(id);

        BookDetail bd = new BookDetail();
        bd.setBook(book);
        bd.setDetailList(detailList);

        return bd;
    }

    public Book uploadStdExcel(UploadStdExcelParams params) throws IOException {
        FileSave fileSaveEntity = fileSaveBiz.getById(params.getFileId());
        java.io.File file = fileSaveBiz.getLocalFileByFile(fileSaveEntity);

        Book book = new Book();
        book.setNo(fileSaveEntity.getName());
        book.setName(params.getName());
        book.setDescription(params.getRemark());
        book.setBizType(params.getBizType());
        book.setBizId(params.getBizId());

        this.save(book);

        // 解析Excel内容，保存章节、文章内容

        EasyExcel.read(file, new ReadListener() {
            private List<UploadStdExcelLineVo> list = new ArrayList<>();

            public void onException(Exception e, AnalysisContext analysisContext) throws Exception {
                _logger.error("onException:\t" + e.getMessage());
            }

            @Override
            public void invokeHead(Map map, AnalysisContext analysisContext) {
                _logger.info("invokeHead:\t" + map);
            }

            @Override
            public void invoke(Object o, AnalysisContext analysisContext) {
                _logger.info("invoke:\t" + o);
                if (o instanceof LinkedHashMap) {
                    LinkedHashMap map = (LinkedHashMap) o;

                    UploadStdExcelLineVo vo = new UploadStdExcelLineVo();
                    vo.setNo(MapUtil.getStr(map, 0));
                    vo.setName(MapUtil.getStr(map, 1));
                    vo.setDetail(MapUtil.getStr(map, 2));

                    list.add(vo);
                }
            }

            @Override
            public void doAfterAllAnalysed(AnalysisContext analysisContext) {
                // 读取结束，导入数据
                for (int i = 0; i < list.size(); i++) {
                    UploadStdExcelLineVo lineVo = list.get(i);

                    // 插入章节
                    Outline outline = new Outline();
                    outline.setBookId(book.getId());
                    outline.setSort(i);
                    outline.setNo(lineVo.getNo());
                    outline.setTitle(lineVo.getNo() + " " + StringUtils.defaultString(lineVo.getName(), ""));

                    Integer parentOutlineId = findParentOutlineId(lineVo.getNo());
                    outline.setParentId(parentOutlineId);

                    outline.setCrtTime(book.getCrtTime());
                    outline.setCrtUser(book.getCrtUser());
                    outline.setCrtName(book.getCrtName());
                    outline.setCrtHost(book.getCrtHost());

                    outlineBiz.save(outline);
                    lineVo.setOutlineId(outline.getId());

                    // 插入详情
                    Detail detail = new Detail();
                    detail.setDetail(lineVo.getDetail());
                    detail.setOutlineId(outline.getId());
                    detailBiz.save(detail);

                    // 更新章节detailId
                    outline.setDetailId(detail.getId());
                    outlineBiz.updateById(outline);
                }
            }

            @Override
            public boolean hasNext(AnalysisContext analysisContext) {
                return true;
            }

            /**
             * 查找父节点的outlineId
             * @param no 章节号，如1.1.1的父章节为1.1，如果没有1.1，则继续向上递归，如果最后还是没找到，给默认值-1
             * @return
             */
            private Integer findParentOutlineId(String no) {
                if (no == null) return -1;
                if (!no.contains(".")) return -1;

                Integer tryFindId = null;
                String matchParentNo = no.substring(0, no.lastIndexOf("."));
                for (UploadStdExcelLineVo lineVo : list) {
                    if (ObjectUtil.equal(matchParentNo, lineVo.getNo())) {
                        tryFindId = lineVo.getOutlineId();
                        continue;
                    }
                }
                if (tryFindId != null) {
                    return tryFindId;
                }
                // 还可以继续向上递归查找
                if (no.contains(".")) {
                    return findParentOutlineId(matchParentNo);
                }
                return -1;
            }

        }).sheet().doRead();

        return book;
    }

}