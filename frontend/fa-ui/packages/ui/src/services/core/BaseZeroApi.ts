import { requestDelete, requestDownload, requestGet, requestPost, requestPut } from '@ui/utils/request';
import { AxiosRequestConfig } from 'axios';

export default class BaseZeroApi {
  public apiPrefix: string;

  public apiModal: string;

  constructor(apiPrefix: string, apiModal: string) {
    this.apiPrefix = apiPrefix;
    this.apiModal = apiModal;
  }

  protected get = <E>(api: string, params?: any, config?: AxiosRequestConfig) =>
    requestGet<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, { ...config, params })
      // .catch(e => {console.log('get', e)});

  protected delete = <E>(api: string, config?: AxiosRequestConfig) =>
    requestDelete<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, config)
      // .catch(e => {console.log('delete', e)});

  protected post = <E>(api: string, body: object, config?: AxiosRequestConfig) =>
    requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config)
      // .catch(e => {console.log('post', e)});

  protected postFile = <E>(api: string, file: any, config?: AxiosRequestConfig) => {
    const formData = new FormData();
    formData.append('file', file);
    return requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, formData, {
      timeout: -1,
      ...config,
      headers: { 'Content-type': 'multipart/form-data' },
    })
      //.catch(e => {console.log('postFile', e)});
  };

  protected postForm = <E>(api: string, formData: any, config?: AxiosRequestConfig) => {
    return requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, formData, {
      ...config,
      headers: { 'Content-type': 'multipart/form-data' },
    })
      //.catch(e => {console.log('postForm', e)});
  };

  protected put = <E>(api: string, body: object, config?: AxiosRequestConfig) =>
    requestPut<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config)
      //.catch(e => {console.log('put', e)});

  protected download = (api: string, body: object, config?: AxiosRequestConfig) =>
    requestDownload(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config)
      //.catch(e => {console.log('download', e)});

  getUrl = (api: string) => `${this.apiPrefix}/${this.apiModal}/${api}`;
}
