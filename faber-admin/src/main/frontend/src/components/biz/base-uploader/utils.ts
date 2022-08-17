import { v1 as uuidv1 } from 'uuid';
import { message } from 'antd';
import { get } from 'lodash';
import fileService from '@/services/admin/file';
import { SITE_INFO, RES_CODE } from '@/configs/server.config';
import ApiQiniuLoader from '@/utils/api-loaders/ApiQiniuLoader';
import dayjs from 'dayjs';

/**
 * 上传文件到七牛云
 * @param {*} file
 * @param {*} prefix
 * @param {*} fileName
 * @param {*} onFinish
 * @param {*} onProgress
 * @param {*} onError
 */
export async function fetchUploadImgQiniu(
	file: any,
	prefix: string,
	fileName: string,
	onFinish = (path: string, res: any) => {},
	onProgress = (res: any) => {},
	onError = (res: any) => {},
) {
	await new ApiQiniuLoader().load();
	const response = await fileService.getUploadToken();
	if (!response || response.status !== RES_CODE.OK) {
		message.error('上传文件失败，获取上传token失败，请联系管理员！');
		return;
	}
	const { token, host } = response.data;
  const day = dayjs().format('YYYYMM');
	const time = dayjs().format('YYYYMMDDHHmmss');

	let fName = fileName;
	if (fileName.indexOf(".") > -1) {
	  const dotIndex = fileName.lastIndexOf(".");
    fName = fileName.substr(0, dotIndex) + "_" + time + fileName.substr(dotIndex);
  } else {
    fName = fileName + "_" + time
  }

	const key = `${prefix}/${day}/${fName}`;
	const putExtra = { fname: file.name, params: {}, mimeType: null };
	const config = {
		useCdnDomain: true,
		region: get(window.qiniu.region, SITE_INFO.QINIU_ZONE),
	};
	const observable = window.qiniu.upload(file, key, token, putExtra, config);
	observable.subscribe(
		(res: any) => {
			// console.log('next', res);
			onProgress(res);
		},
		(res: any) => {
			// console.log('error', res);
			onError(res);
		},
		(res: any) => {
			// console.log('complete', res);
			const path = `${host}/${res.key}`;
			if (onFinish) onFinish(path, res);
		},
	);
}
