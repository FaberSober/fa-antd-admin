import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseTreeApi } from '@/services/base';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';

/** ------------------------------------------ 学生 操作接口 ------------------------------------------ */
const serviceModule = 'menu';

class Menu extends BaseTreeApi<Admin.Menu, number> {
	/** 获取所有block下的菜单 */
	blockAllTree = (blockId: number): Promise<Ajax.Response<FaberBase.TreeNode<Admin.Menu, number>[]>> => this.get(`block/allTree/${blockId}`);
}

export default new Menu(GATE_APP.admin, serviceModule);
