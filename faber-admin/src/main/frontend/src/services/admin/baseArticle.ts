import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';
import {FaBase} from "@/props/base";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'article';

class ArticleApi extends BaseApi<Admin.Article, number> {
	/** 获取唯一实体 */
	findOneBuzz = (params: { bizId: string; bizType: string }): Promise<FaBase.Response<Admin.Article>> => this.post(`findOneBuzz`, params);
}

export default new ArticleApi(GATE_APP.admin, serviceModule);
