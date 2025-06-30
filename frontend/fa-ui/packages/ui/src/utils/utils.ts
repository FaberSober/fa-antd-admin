import {message} from 'antd';
import {Fa, FaEnums} from '@ui/types';
import {findIndex, isNil, isUndefined, map, trim} from 'lodash';
import dayjs from "dayjs";
import {filesize} from "filesize";
import { v4 as uuidv4 } from 'uuid';
import {dispatch} from 'use-bus'


/**
 * 展示服务端返回数据提示
 */
export function showResponse(response: Fa.Ret, prefix: string) {
  if (response && response.status === Fa.RES_CODE.OK) {
    message.success(`${prefix}成功`);
  }
}

/**
 * 复制文本到剪贴板
 */
export function copyToClipboard(text: string, successMsg = '') {
  handleClipboard(text, successMsg)
}

/**
 * 复制文本到剪贴板
 */
export function handleClipboard(text: string, successMsg = '') {
  if (trim(text) === '') {
    return;
  }
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  if (!isNil(successMsg)) {
    message.success(`${successMsg} 复制成功, Ctrl + V 使用`);
  } else {
    message.success(`${text} 复制成功, Ctrl + V 使用`);
  }
}

/**
 * 检查是否有权限
 * @param {array} permissions 用户菜单权限列表
 * @param {string} permissionCode 需要鉴定的权限点
 */
export function hasPermission(permissions?: string[], permissionCode?: string | undefined) {
  if (isNil(permissionCode) || permissionCode === '') return true;
  if (isNil(permissions) || permissions.length === 0) return false;
  return findIndex(permissions, (e) => e === permissionCode) > -1;
}

/**
 * get file extension
 * @param name
 */
export function getExtension(name: string): string {
  return name?.slice(name.lastIndexOf('.') + 1).toLowerCase() ?? '';
}
/**
 * 判断连接是否为图片
 * @param url
 */
export function isUrlImg(url: string) {
  if (url === undefined || url === null) return false;
  if (url.indexOf('.') === -1) return false;

  const suffix = url.substr(url.lastIndexOf('.') + 1).toLowerCase();

  return ['png', 'jpg', 'jpeg', 'ico', 'bmp', 'gif'].indexOf(suffix) > -1;
}

/**
 * 判断文件类型是否为图片
 * @param type 文件后缀名
 */
export function isImg(type: string) {
  return ['png', 'jpg', 'jpeg', 'ico', 'bmp', 'gif'].indexOf(type.toLowerCase()) > -1
}

export function isVideo(type: string) {
  return ['mp4', 'webm', 'ogg'].indexOf(type.toLowerCase()) > -1
}

/**
 * 将obj/list中undefined的值，设置为null。解决undefined值丢失的情况
 * @param obj
 */
export function trimObj(obj: any): any {
  if (obj instanceof Array) {
    return obj.map((i) => trimObj(i));
  }

  const newObj: any = {};
  map(obj, (v, k) => {
    newObj[k] = v === undefined ? null : v;
  });
  return newObj;
}

export const COLORS = ['#f5222d', '#fa541c', '#fa8c16', '#faad14', '#fadb14', '#a0d911', '#52c41a', '#13c2c2', '#1677ff', '#2f54eb', '#722ed1', '#eb2f96'];

/**
 * 从颜色数组中按照余数取颜色
 * @param num
 */
export function seqColor(num: number) {
  return COLORS[num % COLORS.length]
}

export function tryHexToRgba(hex: string | undefined) {
  // console.log('hex', hex)
  if (hex === undefined) return '#FFF';
  if (hex === null) return '#FFF';
  let color = hex;
  if (hex.indexOf('#') === 0) {
    const rgb = hexToRgba(hex);
    color = rgb.RGBA;
  }
  return color;
}

// 将hex颜色转成rgb
export function hexToRgba(hex: string, opacity = 1) {
  let hexfull = hex;
  // 如果是#FFF这种缩写模式，转换为完整写法#FFFFFF
  if (hexfull.length === 4) {
    hexfull += hexfull.substring(1, 4);
  }
  // eslint-disable-next-line prefer-template
  const RGBA =
    // eslint-disable-next-line prefer-template
    'rgba(' +
    // eslint-disable-next-line prefer-template
    parseInt('0x' + hexfull.slice(1, 3), 16) +
    ',' +
    // eslint-disable-next-line prefer-template
    parseInt('0x' + hexfull.slice(3, 5), 16) +
    ',' +
    // eslint-disable-next-line prefer-template
    parseInt('0x' + hexfull.slice(5, 7), 16) +
    ',' +
    opacity +
    ')';
  return {
    // eslint-disable-next-line prefer-template
    r: parseInt('0x' + hexfull.slice(1, 3), 16),
    // eslint-disable-next-line prefer-template
    g: parseInt('0x' + hexfull.slice(3, 5), 16),
    // eslint-disable-next-line prefer-template
    b: parseInt('0x' + hexfull.slice(5, 7), 16),
    a: opacity,
    RGBA,
  };
}

/**
 * date('YYYY-MM-DD HH:mm:ss')str
 */
export function getCurDateTime(format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format);
}

/**
 * date('HH:mm:ss')str
 */
export function getCurTime(format = 'HH:mm:ss') {
  return dayjs().format(format);
}

/**
 * date('HH:mm:ss')str
 */
export function getCurDate(format = 'YYYY-MM-DD') {
  return dayjs().format(format);
}

/**
 * get start of today: YYYY-MM-DD HH:mm:ss
 */
export function startOfToday():string {
  return dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
}

/**
 * get end of today: YYYY-MM-DD HH:mm:ss
 */
export function endOfToday():string {
  return dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
}

export function startOfTomorrow():string {
  return dayjs().startOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
}

export function endOfTomorrow():string {
  return dayjs().endOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
}

/**
 * date('YYYY-MM-DD')格式化str
 * @param {*} date
 * @param {*} format
 */
export function getDateStr000(date: string | any | null | undefined, format = 'YYYY-MM-DD 00:00:00') {
  return date === null || date === undefined ? undefined : dayjs(date).format(format);
}


/**
 * date('YYYY-MM-DD')格式化str
 * @param {*} date
 * @param {*} format
 */
export function getDateStrBeginOfDay(date: string | any | null | undefined) {
  return date === null || date === undefined ? undefined : dayjs(date).format('YYYY-MM-DD 00:00:00');
}


/**
 * date('YYYY-MM-DD')格式化str
 * @param {*} date
 * @param {*} format
 */
export function getDateStrEndOfDay(date: string | any | null | undefined) {
  return date === null || date === undefined ? undefined : dayjs(date).format('YYYY-MM-DD 23:59:59');
}

/**
 * date('YYYY-MM-DD')格式化str
 * @param {*} date
 * @param {*} format
 */
export function getDateStr(date: string | any | null | undefined, format?: string) {
  return date === null || date === undefined ? '' : dayjs(date).format(format || 'YYYY-MM-DD');
}

/**
 * date('YYYY-MM-DD HH:mm:ss')格式化str
 * @param {*} date
 */
export function getDateFullStr(date: string | any | null | undefined) {
  return getDateStr(date, 'YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取星期
 * @param date
 */
export function getWeekStr(date: dayjs.Dayjs|string) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const dayIndex = dayjs(date).day();
  return `星期${weekdays[dayIndex]}`;
}

/**
 * 获取时间类型初始值
 * @param {*} date
 * @param {*} defaultValue
 */
export function getInitialTimeValue(date: string | any | null | undefined, defaultValue = undefined): any {
  return date === null || date === undefined ? defaultValue : dayjs(date); // eslint-disable-line
}

export function getInitialKeyTimeValue(record: any, key: string, defaultValue: any = undefined) {
  return record && record[key] ? dayjs(record[key]) : defaultValue; // eslint-disable-line
}

/**
 * 解析antd DateRangerPick选择
 * @param {*} rangeDate
 * @param {*} index
 * @param {*} suffix
 */
export function parseRangeDateSuffix(rangeDate: any, index: number, suffix: string) {
  if (rangeDate && rangeDate[index] !== null && rangeDate[index] !== undefined) {
    const date = rangeDate[index];
    if (date !== null) {
      return `${date.format('YYYY-MM-DD')} ${suffix}`;
    }
  }
  return '';
}

/**
 * 将Select选中的options解析为字符串，用于前段展示
 * @param option
 */
export function optionsToLabel(option: any): string {
  if (option instanceof Array) {
    return (option || []).map((i) => i.label).join();
  }
  return option && option.label;
}


/**
 * 下划线转换驼峰
 * @param {*} name
 */
export function toHump(name: string) {
  return name.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * 驼峰转换下划线
 */
export function toLine(name: string) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function tryToFixed(value: any, num = 6) {
  if (value === undefined) {
    return value;
  }
  if (typeof value === 'number') {
    return value.toFixed(num);
  }
  if (typeof value === 'string') {
    return Number(value).toFixed(num);
  }
  return value;
}

export function tryToFixedNum(value: any, num = 6) {
  const strValue = tryToFixed(value, num);
  if (strValue) return Number(strValue);
  return value;
}


/** * 是否为mac系统（包含iphone手机） * */
export function isMac() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

/** * 是否为windows系统 * */
export function isWindows() {
  return /windows|win32/i.test(navigator.userAgent);
}

/**
 * 判断str是否是json
 * @param input
 */
export function isJson(input: string | undefined): boolean {
  if (input === undefined) return false;

  try {
    // json格式化
    JSON.stringify(JSON.parse(input), null, '\t');

    if (/^[\],:{}\s]*$/.test(
      input
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
    ) {
      //the json is ok
      return true;
    } else {
      //the json is not ok
      return false;
    }

    return true;
  } catch (err) {
    // console.error(err)
  }
  return false;
}

export function tryParseJson(input: string | undefined, defaultValue = {}): any {
  if (input === undefined) return defaultValue;
  try {
    return JSON.parse(input);
  } catch (err) {
    // console.error(err)
  }
  return defaultValue;
}

export function tryFormatJson(input: string | undefined): string {
  if (input === undefined) return '';
  try {
    // json格式化
    return JSON.stringify(JSON.parse(input), null, '\t');
  } catch (err) {
    // console.error(err)
  }
  return input;
}

/**
 * 将canvas转换为文件
 * @param canvas
 * @param quality
 * @param fn
 */
export function canvasResizeToFile(canvas: any, quality: any, fn: any) {
  canvas.toBlob(
    (blob: any) => {
      fn(blob);
    },
    'image/jpeg',
    quality,
  );
}

/**
 * 字符超过省略
 * @param val
 * @param maxLength
 */
export function ellipsis(val: string | undefined, maxLength = 55): string {
  if (isNil(val)) return '';
  if (val.length > maxLength) {
    return `${val.substr(0, maxLength)}...`;
  }
  return val;
}


export function arrayMoveMutable(array: any[], fromIndex: number, toIndex: number) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMoveImmutable(array: any[], fromIndex: number, toIndex: number) {
  const newArray = [...array];
  arrayMoveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

/**
 * 数组移动
 * @param arr
 * @param fromIndex
 * @param toIndex
 */
export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  // 直接使用array-move第三方组件
  return arrayMoveImmutable(arr, fromIndex, toIndex);

  // 老方法，有bug
  //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
  //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
  // if (index > tindex) {
  // 	arr.splice(tindex, 0, arr[index]);
  // 	arr.splice(index + 1, 1);
  // } else {
  // 	//如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
  // 	//这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
  // 	arr.splice(tindex + 1, 0, arr[index]);
  // 	arr.splice(index, 1);
  // }
}

export function judgeGoBack(noHistoryNavigate: () => void) {
  if (window.history.length > 0) {
    window.history.go(-1);
  } else {
    if (noHistoryNavigate) {
      noHistoryNavigate();
    }
  }
}

/**
 * 七牛云的图片预览
 * @param url 七牛云图片url
 * @param width 预览图片宽
 * @param height 预览图片高
 */
export function previewImageQiniu(url: string, width = 200, height?: number) {
  let previewUrl = `${url}?imageView2/3/w/${width}`;
  if (height) {
    previewUrl += `/h/${height}`;
  }
  return previewUrl;
}

/**
 * 文件大小可视化
 * @param size
 */
export function sizeToHuman(size: number, round = 2): string {
  return filesize(size, {round, standard: 'jedec'}) as string;
}

export const REGEX_TEL_NO = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
export const REGEX_CHAR_NUM = /^[0-9a-zA-Z]+$/;
export const formItemFullLayout = {labelCol: {span: 4}, wrapperCol: {span: 20}};
export const formItemFullHalfLayout = {labelCol: {span: 4}, wrapperCol: {span: 8}};
export const formItemHalfLayout = {labelCol: {span: 8}, wrapperCol: {span: 16}};

export const FormRules = {
  PATTERN_WORD: {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/, message: '只能输入中英文字符、数字'},
  PATTERN_CHAR_AND_NUM: {pattern: /^[a-zA-Z]+[a-zA-Z0-9_-]*$/, message: '只能输入英文字符、数字、下划线、中划线'},
  PATTERN_WORD_ZH_ONLY: {pattern: /^[\u4e00-\u9fa5]*$/, message: '只能输入中文字符'},
  PATTERN_CHAR_UPPER_AND_NUM: {pattern: /^[A-Z0-9]*$/, message: '只能输入英文字符、数字'},
  PATTERN_TEL: {pattern: REGEX_TEL_NO, message: '请输入正确格式的手机号'},
};

/**
 * file的accept属性（文件上传的类型）
 * https://blog.csdn.net/weixin_44599143/article/details/107932099
 */
export const FileAccept = {
  EXCEL: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PDF: 'application/pdf',
  IMG: 'image/gif,image/jpeg,image/jpg,image/png,image/svg,image/webp',
};

export const FA_TYPE_WORD = [".doc", ".docx", ".docm",
  ".dot", ".dotx", ".dotm",
  ".odt", ".fodt", ".ott", ".rtf", ".txt",
  ".html", ".htm", ".mht", ".xml",
  ".pdf", ".djvu", ".fb2", ".epub", ".xps", ".oform"];

export const FA_TYPE_EXCEL = [".xls", ".xlsx", ".xlsm", ".xlsb",
  ".xlt", ".xltx", ".xltm",
  ".ods", ".fods", ".ots", ".csv"];

export const FA_TYPE_PPT = [".pps", ".ppsx", ".ppsm",
  ".ppt", ".pptx", ".pptm",
  ".pot", ".potx", ".potm",
  ".odp", ".fodp", ".otp"];

export function getDocumentTypeByExt(ext: string): FaEnums.DocumentType | undefined {
  if (FA_TYPE_WORD.indexOf('.' + ext) > -1) return FaEnums.DocumentType.word;
  if (FA_TYPE_EXCEL.indexOf('.' + ext) > -1) return FaEnums.DocumentType.cell;
  if (FA_TYPE_PPT.indexOf('.' + ext) > -1) return FaEnums.DocumentType.slide;
}

export function getDocumentTypeByName(fileName: string): FaEnums.DocumentType | undefined {
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1)
  if (FA_TYPE_WORD.indexOf('.' + ext) > -1) return FaEnums.DocumentType.word;
  if (FA_TYPE_EXCEL.indexOf('.' + ext) > -1) return FaEnums.DocumentType.cell;
  if (FA_TYPE_PPT.indexOf('.' + ext) > -1) return FaEnums.DocumentType.slide;
}

export function isPdf(fileName: string): boolean {
  return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase() === 'pdf';
}

/**
 * echarts toolbox 配置
 */
export const EchartsToolbox = {
  show: true,
  orient: 'horizontal',
  left: 'right',
  top: 'left',
  feature: {
    mark: {show: true},
    dataView: {show: true, readOnly: false},
    magicType: {show: true, type: ['line', 'bar', 'stack']},
    restore: {show: true},
    saveAsImage: {show: true}
  }
}

/**
 * 获取dom节点的rect大小矩阵
 * @param dom
 */
export function getDomRectById(domId: string): DOMRect|null {
  const dom = document.getElementById(domId) as HTMLElement;
  return dom ? getDomRect(dom) : null;
}

/**
 * 获取dom节点的rect大小矩阵
 * @param dom
 */
export function getDomRect(dom: HTMLElement): DOMRect {
  return dom.getBoundingClientRect();
}

/**
 * 获取dom元素的相对左上角的坐标
 * @param element
 */
export function getElementPosition(element: HTMLElement): { top: number, left: number } {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const clientTop = document.documentElement.clientTop || 0;
  const clientLeft = document.documentElement.clientLeft || 0;

  const top = rect.top + scrollTop - clientTop;
  const left = rect.left + scrollLeft - clientLeft;

  return { top, left };
}

export function scrollToTop(dom: HTMLElement) {
  if (dom === undefined || dom === null) return;
  dom.scrollTo(0, 0)
}

export function scrollToBottom(dom: HTMLElement) {
  if (dom === undefined || dom === null) return;
  dom.scrollTo(0, dom.scrollHeight)
}

export function scrollToBottomById(domId: string, delay = 0) {
  setTimeout(() => {
    const dom = document.getElementById(domId);
    if (dom === undefined || dom === null) return;
    dom.scrollTo(0, dom.scrollHeight)
  }, delay);
}

/**
 * 滚动到元素
 * @param domId
 */
export function scrollToDomById(domId: string) {
  const element = document.getElementById(domId);
  if (element) {
    element.scrollIntoView();
  }
}

/**
 * delay
 * @param time
 */
export function delay(time:number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

/**
 * @returns 随机生产长size位的字母[a-z]
 */
export function generateId(size = 8) {
  let str = "";
  for (let i = 0; i < size; i++) {
    const code = Math.floor(Math.random() * 26);
    str += String.fromCharCode("a".charCodeAt(0) + code);
  }
  return str;
}

/**
 * 判断checkList是否全部在allList中
 * @param allList
 * @param checkList
 */
export function allInList(allList: any[], checkList: any[]) {
  if (isNil(allList) || allList.length === 0) return false;
  if (isNil(checkList) || checkList.length === 0) return false;

  for (let i = 0; i < checkList.length; i++) {
    if (allList.indexOf(checkList[i]) === -1) {
      return false;
    }
  }
  return true;
}

/**
 * 数组生成
 * @param end
 */
export function range(end: number) {
  return Array.from({length: end}, (_, index) => index + 1);
}


/**
 * uuid
 */
export function uuid() {
  return uuidv4();
}

/**
 * antd form number rules
 */
export const formNumberRule:any = {
  type: 'number',
  transform: (value:any) => Number(value),
}

export function preventEvent(e: any) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

// ------------------------------------------ event bus ------------------------------------------
export function refreshTree(refreshBusKey = Fa.Constant.TREE_REFRESH_BUS_KEY, payload = {}) {
  dispatch({ type: refreshBusKey, payload })
}

export function busEmit(key: string, payload = {}) {
  dispatch({ type: key, payload })
}

// ------------------------------------------ image ------------------------------------------
/**
 * download image from url
 * @param url
 */
export function downloadImage(url:string) {
  const suffix = url.slice(url.lastIndexOf('.'));
  const filename = Date.now() + suffix;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(blobUrl);
      link.remove();
    });
}
