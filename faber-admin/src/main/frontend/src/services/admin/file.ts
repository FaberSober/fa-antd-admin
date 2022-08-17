import Ajax from '@/props/base/Ajax';
import Admin from '@/props/admin';
import { requestGet, requestPost } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import { trim } from 'lodash';

interface UploadToken {
	token: string;
	host: string;
}

const serviceModule = 'file';

class File extends BaseApi<Admin.File, string> {
	/** 获取唯一实体 */
	getUploadToken = (): Promise<Ajax.Response<UploadToken>> => requestGet(`${GATE_APP.admin}/${serviceModule}/getUploadToken`);

	/** 获取实体List-用户创建 */
	getMine = (): Promise<Ajax.Response<Admin.File[]>> => requestGet(`${GATE_APP.admin}/${serviceModule}/getMine`);

	/** 获取实体 分页 */
	deleteMine = (params: { ids: string[] }): Promise<Ajax.Response> => requestPost(`${GATE_APP.admin}/${serviceModule}/deleteMine`, params);

	localUploadApi = `${GATE_APP.admin}/${serviceModule}/local/uploadFile`;

	genLocalGetFile = (fileId: string) => {
		if (fileId === undefined || fileId == null) return '';
		if (trim(fileId) === '') return '';
		return `${GATE_APP.admin}/${serviceModule}/local/getFile/${fileId}`;
	};

	genLocalGetFilePath = (filePath: string) => {
		if (filePath === undefined || filePath == null) return '';
		if (trim(filePath) === '') return '';
		return window.open(`${GATE_APP.admin}/${serviceModule}/local/getLocalFile?filePath=${filePath}`, '_blank');
	};
}

export default new File(GATE_APP.admin, serviceModule);
