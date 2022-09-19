import { requestDelete, requestDownload, requestGet, requestPost, requestPut } from '@/utils/request';
import { AxiosRequestConfig } from 'axios';

export default class BaseZeroApi<T, KeyType, PageT = T> {
	public apiPrefix: string;

	public apiModal: string;

	constructor(apiPrefix: string, apiModal: string) {
		this.apiPrefix = apiPrefix;
		this.apiModal = apiModal;
	}

	get = <E>(api: string, config?: AxiosRequestConfig) => requestGet<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, config);

	delete = <E>(api: string, config?: AxiosRequestConfig) => requestDelete<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, config);

	post = <E>(api: string, body: object, config?: AxiosRequestConfig) => requestPost<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config);

	put = <E>(api: string, body: object, config?: AxiosRequestConfig) => requestPut<E>(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config);

	download = (api: string, body: object, config?: AxiosRequestConfig) => requestDownload(`${this.apiPrefix}/${this.apiModal}/${api}`, body, config);

	getUrl = (api: string) => `${this.apiPrefix}/${this.apiModal}/${api}`;
}
