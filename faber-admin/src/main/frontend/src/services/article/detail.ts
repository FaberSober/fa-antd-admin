import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import Article from '@/props/article';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class BookApi extends BaseApi<Article.Detail, number> {}

export default new BookApi(GATE_APP.article, 'detail');
