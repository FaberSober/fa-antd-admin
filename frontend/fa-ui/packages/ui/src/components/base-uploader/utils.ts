import { get, isNil } from 'lodash';
import dayjs from 'dayjs';
import { fileSaveApi } from '@ui/services/base';
import { ApiQiniuLoader } from '@ui/utils';


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
  const response = await fileSaveApi.getQiniuUploadToken();
  // if (!response || response.status !== Fa.RES_CODE.OK) {
  //   message.error('上传文件失败，获取上传token失败，请联系管理员！');
  //   return;
  // }
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

  const key = `${prefix}/${day}/${fName}`;
  const putExtra = { fname: file.name, params: {}, mimeType: null };

  if (isNil(window.FA_QINIU_ZONE)) {
    console.error('需要设置 window.FA_QINIU_ZONE')
  }
  const config = {
    useCdnDomain: true,
    region: get(window.qiniu.region, window.FA_QINIU_ZONE),
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
