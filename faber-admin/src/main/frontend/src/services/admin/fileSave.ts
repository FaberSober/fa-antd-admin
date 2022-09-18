import Ajax from '@/props/base/Ajax';
import Admin from '@/props/admin';
import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import { trim } from 'lodash';

interface UploadToken {
	token: string;
	host: string;
}

const serviceModule = 'fileSave';

class FileSaveApi extends BaseApi<Admin.FileSave, string> {
	/** 获取唯一实体 */
	getUploadToken = (): Promise<Ajax.Response<UploadToken>> => super.get(`getUploadToken`);

	/** 获取实体List-用户创建 */
	getMine = (): Promise<Ajax.Response<Admin.FileSave[]>> => super.get(`getMine`);

	/** 获取实体 分页 */
	deleteMine = (params: { ids: string[] }): Promise<Ajax.Response> => super.post(`deleteMine`, params);

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
