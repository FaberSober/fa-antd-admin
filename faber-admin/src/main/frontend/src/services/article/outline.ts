import { requestGet } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import { BaseTreeApi } from '@/services/base';
import Ajax from '@/props/base/Ajax';
import Article from '@/props/article';
import FaberBase from '@/props/base/FaberBase';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Outline extends BaseTreeApi<Article.Outline, number> {
	allBookIdTree = (bookId: number): Promise<Ajax.Response<FaberBase.TreeNode[]>> => requestGet(`${this.apiPrefix}/${this.apiModal}/${bookId}/allTree`);

	findDetail = (id: number): Promise<Ajax.Response<Article.OutlineDetailVo>> => requestGet(`${GATE_APP.article}/outline/findDetail/${id}`);
}

export default new Outline(GATE_APP.article, 'outline');
