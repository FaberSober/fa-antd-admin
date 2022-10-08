import Admin from '@/props/admin';
import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import {trim} from 'lodash';
import {FaBase} from "@/props/base";

interface UploadToken {
	token: string;
	host: string;
}

const serviceModule = 'fileSave';

class FileSaveApi extends BaseApi<Admin.FileSave, string> {
	/** 获取唯一实体 */
	getUploadToken = (): Promise<FaBase.Response<UploadToken>> => this.get(`getUploadToken`);

	/** 获取实体List-用户创建 */
	getMine = (): Promise<FaBase.Response<Admin.FileSave[]>> => this.get(`getMine`);

	/** 获取实体 分页 */
	deleteMine = (params: { ids: string[] }): Promise<FaBase.Response> => this.post(`deleteMine`, params);

	localUploadApi = `local/uploadFile`;

	genLocalGetFile = (fileId: string) => {
		if (fileId === undefined || fileId == null) return '';
		if (trim(fileId) === '') return '';
		return `local/getFile/${fileId}`;
	};

	genLocalGetFilePath = (filePath: string) => {
		if (filePath === undefined || filePath == null) return '';
		if (trim(filePath) === '') return '';
		return window.open(`local/getLocalFile?filePath=${filePath}`, '_blank');
	};
}

export default new FileSaveApi(GATE_APP.admin, serviceModule);
