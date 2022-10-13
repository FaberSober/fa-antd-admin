import Admin from '@/props/admin';
import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import {trim} from 'lodash';
import {Fa} from "@/props/base";

interface UploadToken {
	token: string;
	host: string;
}

const serviceModule = 'fileSave';

class FileSaveApi extends BaseApi<Admin.FileSave, string> {

	/** 获取七牛云上传token */
	getQiniuUploadToken = (): Promise<Fa.Response<UploadToken>> => this.get(`getQiniuUploadToken`);

	uploadApi = this.getUrl(`uploadFile`);

	genLocalGetFile = (fileId: string) => {
		if (fileId === undefined || fileId == null) return '';
		if (trim(fileId) === '') return '';
		return this.getUrl(`local/getFile/${fileId}`);
	};

}

export default new FileSaveApi(GATE_APP.admin, serviceModule);
