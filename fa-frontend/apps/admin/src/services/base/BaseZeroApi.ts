import {requestDelete, requestDownload, requestGet, requestPost, requestPut} from '@/utils/request';
import {AxiosRequestConfig} from 'axios';
import queryString from "querystring";

export default class BaseZeroApi {
	public apiPrefix: string;

	public apiModal: string;

	constructor(apiPrefix: string, apiModal: string) {
		this.apiPrefix = apiPrefix;
		this.apiModal = apiModal;
	}

	get = <E>(api: string, params?: any, config?: AxiosRequestConfig) => requestGet<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, { ...config, params });

	delete = <E>(api: string, config?: AxiosRequestConfig) => requestDelete<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, config);

	post = <E>(api: string, body: object, config?: AxiosRequestConfig) => requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config);

  postFile = <E>(api: string, file: any, config?: AxiosRequestConfig) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, formData, { ...config, headers: { 'Content-type' : 'multipart/form-data' } });
  }

  postForm = <E>(api: string, formData: any, config?: AxiosRequestConfig) => {
    return requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, formData, { ...config, headers: { 'Content-type' : 'multipart/form-data' } });
  }

	put = <E>(api: string, body: object, config?: AxiosRequestConfig) => requestPut<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config);

	download = (api: string, body: object, config?: AxiosRequestConfig) => requestDownload(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config);

	getUrl = (api: string) => `${this.apiPrefix}/${this.apiModal}/${api}`;

}
