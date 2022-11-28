import {GATE_APP} from '@/configs/server.config';
import {BaseTreeApi} from '@/services/base';
import Article from '@/props/article';
import Fa from '@/props/base/Fa';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Outline extends BaseTreeApi<Article.Outline, number> {
	allBookIdTree = (bookId: number): Promise<Fa.Ret<Fa.TreeNode[]>> => this.get(`${bookId}/allTree`);

	findDetail = (id: number): Promise<Fa.Ret<Article.OutlineDetailVo>> => this.get(`findDetail/${id}`);
}

export default new Outline(GATE_APP.article, 'outline');
