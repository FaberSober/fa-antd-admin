import {GATE_APP} from '@ui/configs';
import {BaseApi} from '@ui/services';
import {trim} from 'lodash';
import {Admin, Fa} from '@ui/types';

interface UploadToken {
  token: string;
  host: string;
}

const serviceModule = 'fileSave';

class FileSaveApi extends BaseApi<Admin.FileSave, string> {
  /** 获取七牛云上传token */
  getQiniuUploadToken = (): Promise<Fa.Ret<UploadToken>> => this.get('getQiniuUploadToken');

  uploadFile = (file: any, callback?: (progressEvent: any) => void): Promise<Fa.Ret<Admin.FileSave>> =>
    this.postFile('upload', file, { onUploadProgress: callback });

  uploadFromUrl = (params: {url: string}): Promise<Fa.Ret<Admin.FileSave>> => this.post('uploadFromUrl', params);

  uploadFileForm = (formData: any, callback?: (progressEvent: any) => void): Promise<Fa.Ret<Admin.FileSave>> =>
    this.postForm('upload', formData, { onUploadProgress: callback });

  /** 文件字符获取 */
  getFileStr = (fileId: string): Promise<Fa.Ret<string>> => this.get(`getFileStr/${fileId}`);

  uploadApi = this.getUrl(`upload`);

  getPlainFile = (fileId: string) => {
    if (fileId === undefined || fileId == null) return '';
    if (trim(fileId) === '') return '';
    return this.getUrl(`getPlainFile/${fileId}`);
  };

  genLocalGetFile = (fileId: string) => {
    if (fileId === undefined || fileId == null) return '';
    if (trim(fileId) === '') return '';
    return this.getUrl(`getFile/${fileId}`);
  };

  genLocalGetFilePreview = (fileId: string) => {
    if (fileId === undefined || fileId == null) return '';
    if (trim(fileId) === '') return '';
    return this.getUrl(`getFilePreview/${fileId}`);
  };

}

export default new FileSaveApi(GATE_APP.admin, serviceModule);
