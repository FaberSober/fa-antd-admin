import React, { CSSProperties, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { trim, get } from 'lodash';
import { useClientRect } from '@/utils/myHooks';
import { Spin } from 'antd';

const toolbars = [
  'fullscreen',
  'source',
  // '|',
  // 'undo',
  // 'redo',
  '|',
  'bold',
  'italic',
  'underline',
  'fontborder',
  'strikethrough',
  'superscript',
  'subscript',
  'removeformat',
  'formatmatch',
  'autotypeset',
  'blockquote',
  'pasteplain',
  '|',
  'forecolor',
  'backcolor',
  'insertorderedlist',
  'insertunorderedlist',
  // 'selectall',
  // 'cleardoc',
  '|',
  'rowspacingtop',
  'rowspacingbottom',
  'lineheight',
  '|',
  'customstyle',
  'paragraph',
  'fontfamily',
  'fontsize',
  '|',
  'directionalityltr',
  'directionalityrtl',
  'indent',
  '|',
  'justifyleft',
  'justifycenter',
  'justifyright',
  'justifyjustify',
  // '|',
  // 'touppercase',
  // 'tolowercase',
  '|',
  'link',
  'unlink',
  'anchor',
  '|',
  // "imagenone",
  // "imageleft",
  // "imageright",
  // "imagecenter",
  // "|",
  // "simpleupload",
  'insertimage',
  // 'emotion',
  // "scrawl",
  'insertvideo',
  // "music",
  // "attachment",
  // "map",
  // "gmap",
  // "insertframe",
  // "webapp",
  // "pagebreak",
  // "template",
  'background',
  '|',
  // "insertcode",
  'horizontal',
  // 'date',
  // 'time',
  'spechars',
  // "snapscreen",
  // "wordimage",
  '|',
  'inserttable',
  // 'deletetable',
  // 'insertparagraphbeforetable',
  // 'insertrow',
  // 'deleterow',
  // 'insertcol',
  // 'deletecol',
  // 'mergecells',
  // 'mergeright',
  // 'mergedown',
  // 'splittocells',
  // 'splittorows',
  // 'splittocols',
  // "charts",
  '|',
  'print',
  'preview',
  'searchreplace',
  // "drafts",
  // "help",
];

export interface BaseHtmlNEditorProps {
  initialValue?: string | undefined;
  value?: string | undefined;
  loading?: boolean;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void; // 点击ctrl+s保存
  onUeReady?: (ue: any) => void;
  onBlur?: (v: string) => void;
  style?: CSSProperties;
}

/**
 * NEditor富文本编辑器
 * @author xu.pengfei
 * @date 2020/12/31
 */
function BaseHtmlNEditor({ initialValue, value, loading, onChange, onSubmit, onBlur, onUeReady, style }: BaseHtmlNEditorProps, ref: any) {
  const ueRef = useRef<any | null>();

  const [id] = useState(v4());
  const [ueReady, setUeReady] = useState(false);
  const [rect, refDiv] = useClientRect();
  // const [initial, setInitial] = useState(false)

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (ueRef.current) {
        return ueRef.current.getContent();
      }
      return '';
    },
  }));

  // useEffect(() => {
  //   console.log('BaseHtmlNEditor#initialValue', initialValue);
  //   if (ueRef.current && ueReady) {
  //     ueRef.current.setContent(trim(initialValue));
  //   }
  // }, [ueReady, initialValue]);

  useEffect(() => {
    console.log('BaseHtmlNEditor#useEffect', value);
    if (ueRef.current && ueReady) {
      ueRef.current.setContent(trim(value));
    }
  }, [value]);

  useEffect(() => {
    const editorDom = document.getElementById(id);
    if (editorDom == null) return () => {};

    ueRef.current = window.UE.getEditor(id, { toolbars: [toolbars] });
    ueRef.current.ready(() => {
      setUeReady(true);
      if (initialValue) {
        ueRef.current.setContent(trim(initialValue));
      }
      if (value) {
        ueRef.current.setContent(trim(value));
      }
      if (onUeReady) onUeReady(ueRef.current);
    });
    ueRef.current.addListener('blur', () => {
      // console.log('blur', ue.getContent());
      if (onBlur) {
        onBlur(ueRef.current.getContent());
      }
      debounceSaveContent(ueRef.current.getContent());
    });
    ueRef.current.addListener('contentChange', () => {
      // console.log('contentChange', ue.getContent());
      if (onChange) {
        onChange(ueRef.current.getContent());
      }
    });
    ueRef.current.addListener('saveScene', () => {
      // console.log('saveScene', ue.getContent());
      debounceSaveContent(ueRef.current.getContent());
    });

    return () => {
      if (ueRef.current) {
        window.UE.delEditor(id);
      }
    };
  }, [rect]);

  function debounceSaveContent(content: string) {
    // console.log('debounceSaveContent', content);
    if (onSubmit) {
      onSubmit(content);
    }
  }

  // 计算编辑器内部高度
  let editorInnerHeight: number = 0;
  if (rect !== null) {
    editorInnerHeight = get(rect, 'height') - 130;
    if (get(rect, 'width') > 1110) {
      editorInnerHeight = get(rect, 'height') - 96;
    }
  }

  return (
    <div ref={refDiv} style={{ width: '100%', height: '100%', ...style }}>
      <Spin spinning={loading}>{rect && <script id={id} type="text/plain" style={{ width: '100%', height: editorInnerHeight }} />}</Spin>
    </div>
  );
}

export default React.forwardRef(BaseHtmlNEditor);
