import { Flow } from "@/types";

/**
 * 通用表单组件列表
 */
export const FaFormItems: Flow.FaFormItem[] = [
  {
    type: 'input',
    name: '输入框',
    icon: <div className="i-streamline-sharp:input-box fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'inputnumber',
    name: '数字输入',
    icon: <div className="i-fluent:keyboard-123-24-regular fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'textarea',
    name: '文本域',
    icon: <div className="i-streamline-sharp:align-text-center fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'switch',
    name: '开关',
    icon: <div className="i-material-symbols:toggle-on-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'radio',
    name: '单选框',
    icon: <div className="i-material-symbols:radio-button-checked fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'checkbox',
    name: '复选框',
    icon: <div className="i-material-symbols:check-box-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'select',
    name: '下拉选择',
    icon: <div className="i-tabler:select fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'cascader',
    name: '级联选择',
    icon: <div className="i-material-symbols:account-tree-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'datepicker',
    name: '日期选择',
    icon: <div className="i-streamline-sharp:calendar-mark fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'timepicker',
    name: '时间选择',
    icon: <div className="i-fluent:clock-16-regular fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'fileupload',
    name: '文件上传',
    icon: <div className="i-material-symbols:drive-folder-upload-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'imageupload',
    name: '图片上传',
    icon: <div className="i-material-symbols:image-arrow-up-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'colorpicker',
    name: '颜色选择',
    icon: <div className="i-material-symbols:palette-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'rating',
    name: '评分',
    icon: <div className="i-material-symbols:star-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'slider',
    name: '滑块',
    icon: <div className="i-streamline-sharp:horizontal-slider-2 fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'richtext',
    name: '富文本',
    icon: <div className="i-material-symbols:inbox-text-asterisk-outline-sharp fa-form-item-icon"/>,
    group: 'formitem'
  },
  {
    type: 'link',
    name: '链接',
    icon: <div className="i-material-symbols:link fa-form-item-icon"/>,
    group: 'formitem'
  },
]

/**
 * 业务表单组件列表
 */
export const FaFormItemsBiz: Flow.FaFormItem[] = [
  {
    type: 'biz_user_select',
    name: '用户选择',
    icon: <div className="i-material-symbols:person fa-form-item-icon"/>,
    group: 'formitem'
  },
    {
    type: 'biz_dept_select',
    name: '部门选择',
    icon: <div className="i-material-symbols:article-person-outline fa-form-item-icon"/>,
    group: 'formitem'
  },
];
