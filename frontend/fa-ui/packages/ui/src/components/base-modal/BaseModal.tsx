import React, {ReactNode, useState} from 'react';
import DragModal, {DragModalProps} from './DragModal';


/**
 * 通用entity新增、编辑弹框的属性
 */
export interface CommonModalProps<T> extends DragModalProps {
  title?: string;
  record?: T;
  fetchFinish?: () => void;
  addBtn?: boolean; // 是否展示新增按钮
  editBtn?: boolean; // 是否展示编辑按钮
  onOpen?: () => void;
}

/**
 * 通用entity新增、编辑弹框的属性
 */
export interface CommonViewIdModalProps<T> extends DragModalProps {
  id: T;
}

export interface BaseModalProps<T> extends CommonModalProps<T> {
  triggerDom?: ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2022/12/28 15:30
 */
export default function BaseModal<T>({onOpen, triggerDom, children, ...props}: BaseModalProps<T>) {
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
    if (onOpen) onOpen();
  }

  return (
    <span>
      <span onClick={showModal}>
        {triggerDom}
      </span>
      <DragModal
        open={open}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        {children}
      </DragModal>
    </span>
  );
}