import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {get} from 'lodash';
import {message} from 'antd';
import {TOKEN_KEY} from '@/configs/server.config';
import {getToken} from './cache';
import {dispatch} from 'use-bus'
import Fa from "@/props/base/Fa";

// Set config defaults when creating the instance
const instance = axios.create({
	// baseURL: SERVER,
});

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 60000;

const codeMessage = {
	200: '服务器成功返回请求的数据。',
	201: '新建或修改数据成功。',
	202: '一个请求已经进入后台排队（异步任务）。',
	204: '删除数据成功。',
	400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
	401: '用户没有权限（令牌、用户名、密码错误）。',
	403: '用户得到授权，但是访问是被禁止的。',
	404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
	406: '请求的格式不可得。',
	410: '请求的资源被永久删除，且不会再得到的。',
	422: '当创建一个对象时，发生一个验证错误。',
	500: '服务器发生错误，请检查服务器。',
	502: '网关错误。',
	503: '服务不可用，服务器暂时过载或维护。',
	504: '网关超时。',
};

// 添加请求拦截器
instance.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么
		const token = getToken();
		if (token) {
			// @ts-ignore
      config.headers[TOKEN_KEY] = token;
		}

		// axios 拦截器统一在接口增加时间戳参数，防止走缓存。
		// if (config.method == 'post') {
		// 	if (config.headers['Content-Type'] !== 'application/x-www-form-urlencoded') {
		// 		// @ts-ignore
		// 		config.data = { ...config.data, _t: Date.parse(new Date()) / 1000 };
		// 	}
		// } else
		if (config.method == 'get') {
			// @ts-ignore
			config.params = { ...config.params, _t: Date.parse(new Date()) / 1000 };
		}

		// 通知全局api加载状态
    dispatch({ type: '@@api/CHANGE_URL_LOADING', payload: { url: config.url, loading: true } })

		return config;
	},
	(error) => Promise.reject(error),
);

// 添加响应拦截器
instance.interceptors.response.use(
	(response) => {
    // 通知全局api加载状态
    dispatch({ type: '@@api/CHANGE_URL_LOADING', payload: { url: response.config.url, loading: false } })

	  return response;
  },
	(error) => {
    // 通知全局api加载状态
    dispatch({ type: '@@api/CHANGE_URL_LOADING', payload: { url: error.config.url, loading: false } })

		// 对响应错误做点什么
		console.log('error', error);
		const status: number = get(error, 'response.status', error.name);
		let defaultErrorMsg: string = status + get(codeMessage, status, '未知错误，请联系管理员');
		if (error.response && error.response.data && error.response.data.message) {
			defaultErrorMsg = status + error.response.data.message;
			if (error.config.headers.hideErrorMsg !== '1') {
        message.error(defaultErrorMsg);
      }
		} else if (error.response.data instanceof Blob) {
			const blob = new Blob([error.response.data], {
				type: 'application/json;charset=utf-8',
			});
			// console.log('blob', blob);
			//将Blob 对象转换成字符串
			var reader = new FileReader();
			reader.readAsText(blob, 'utf-8');
			reader.onload = function (e) {
				console.info('reader.result', reader.result);
				// @ts-ignore
				const json = JSON.parse(reader.result);
        if (error.config.headers.hideErrorMsg !== '1') {
          message.error(json.message);
        }
			};
		} else {
      if (error.config.headers.hideErrorMsg !== '1') {
        message.error(defaultErrorMsg);
      }
		}

		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			// console.log(error.response.data);
			// console.log(error.response.status);
			// console.log(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			// console.log(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
		}

		if (status === 401 || status === 40101) {
			message.error(`${status}登录失效，跳转登录`).then(() => {
        // 跳转登录页面
        window.location.href = '/login';
      })
		}
		return Promise.reject(error);
	},
);

export function requestProcess<R>(request: Promise<AxiosResponse<Fa.Ret<R>>>): Promise<Fa.Ret<R>> {
	return request
		.then((res) => res.data)
		.then((data) => {
			if (data) {
				return data;
			}
			throw new Error('您的网络好像不太给力,请稍后再试');
		});
}

export function requestGet<R>(api: string, config?: AxiosRequestConfig): Promise<Fa.Ret<R>> {
	return requestProcess(instance.get(api, config));
}

export function requestDelete<R>(api: string, config?: AxiosRequestConfig): Promise<Fa.Ret<R>> {
	return requestProcess(instance.delete(api, config));
}

export function requestPut<R>(api: string, body: object, config?: AxiosRequestConfig): Promise<Fa.Ret<R>> {
	return requestProcess(instance.put(api, body, config));
}

export function requestPost<R>(api: string, body: object, config?: AxiosRequestConfig): Promise<Fa.Ret<R>> {
	return requestProcess(instance.post(api, body, config));
}

export function requestDownload(api: string, body: object, config?: AxiosRequestConfig): Promise<undefined> {
	return instance.post(api, body, { responseType: 'blob', timeout: 60 * 60000, ...config }).then((res) => {
		const blob = new Blob([res.data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
		});
		const a = document.createElement('a');
		const url1 = window.URL.createObjectURL(blob);
		const filename = res.headers['fa-filename'];
		a.href = url1;
		a.download = decodeURIComponent(filename);
		a.click();
		window.URL.revokeObjectURL(url1);
		return undefined;
	});
}
