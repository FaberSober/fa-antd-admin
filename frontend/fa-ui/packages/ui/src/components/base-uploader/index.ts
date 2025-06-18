import UploadFileLocal, {UploadFileLocalProps} from './UploadFileLocal';
import UploadFileLocalMultiple, {UploadFileLocalMultipleProps} from './UploadFileLocalMultiple';
import UploadFileQiniu, {UploadFileQiniuProps} from './UploadFileQiniu';
import UploadImgLocal, {UploadImgLocalProps} from './UploadImgLocal';
import UploadImgQiniu, {UploadImgQiniuProps} from './UploadImgQiniu';
import { fetchUploadImgQiniu } from './utils';
import UploadFileModal from "./UploadFileModal";

export {
  fetchUploadImgQiniu,
  UploadImgLocal,
  UploadFileLocal,
  UploadFileQiniu,
  UploadImgQiniu,
  UploadFileLocalMultiple,
  UploadFileModal,
};

export type { UploadFileLocalProps, UploadFileLocalMultipleProps, UploadFileQiniuProps, UploadImgLocalProps, UploadImgQiniuProps }
