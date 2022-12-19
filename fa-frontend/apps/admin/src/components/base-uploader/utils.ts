import { message } from 'antd';
import { get } from 'lodash';
import fileService from '@/services/admin/fileSave';
import { RES_CODE, SITE_INFO } from '@/configs/server.config';
import ApiQiniuLoader from '@/utils/api-loaders/ApiQiniuLoader';
import dayjs from 'dayjs';

const filePrefix = import.meta.env.VITE_APP_FILE_PREFIX;

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
  onFinish?: (path: string, res: any) => void,
  onProgress?: (res: any) => void,
  onError?: (res: any) => void,
) {
  await new ApiQiniuLoader().load();
  const response = await fileService.getQiniuUploadToken();
  if (!response || response.status !== RES_CODE.OK) {
    message.error('上传文件失败，获取上传token失败，请联系管理员！');
    return;
  }
  const { token, host } = response.data;
  const day = dayjs().format('YYYY-MM-DD');
  const time = dayjs().format('YYYYMMDDHHmmss');

  let fName = fileName;
  if (fileName.indexOf('.') > -1) {
    const dotIndex = fileName.lastIndexOf('.');
    fName = fileName.substr(0, dotIndex) + '_' + time + fileName.substr(dotIndex);
  } else {
    fName = fileName + '_' + time;
  }

  const key = `${filePrefix}/${prefix}/${day}/${fName}`;
  const putExtra = { fname: file.name, params: {}, mimeType: null };
  const config = {
    useCdnDomain: true,
    region: get(window.qiniu.region, SITE_INFO.QINIU_ZONE),
  };
  const observable = window.qiniu.upload(file, key, token, putExtra, config);
  observable.subscribe(
    (res: any) => {
      // console.log('next', res);
      if (onProgress) onProgress(res);
    },
    (res: any) => {
      // console.log('error', res);
      if (onError) onError(res);
    },
    (res: any) => {
      // console.log('complete', res);
      const path = `${host}/${res.key}`;
      if (onFinish) onFinish(path, res);
    },
  );
}
