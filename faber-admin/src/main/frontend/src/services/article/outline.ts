import { GATE_APP } from '@/configs/server.config';
import { BaseTreeApi } from '@/services/base';
import Ajax from '@/props/base/Ajax';
import Article from '@/props/article';
import FaberBase from '@/props/base/FaberBase';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Outline extends BaseTreeApi<Article.Outline, number> {
	allBookIdTree = (bookId: number): Promise<Ajax.Response<FaberBase.TreeNode[]>> => this.get(`${bookId}/allTree`);

	findDetail = (id: number): Promise<Ajax.Response<Article.OutlineDetailVo>> => this.get(`findDetail/${id}`);
}

export default new Outline(GATE_APP.article, 'outline');
