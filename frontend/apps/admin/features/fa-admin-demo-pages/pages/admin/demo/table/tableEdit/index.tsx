import React, { useEffect, useState } from 'react';
import { ListTable, register } from '@visactor/react-vtable';
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
import type { Demo } from "@features/fa-admin-demo-pages/types";
import { studentApi } from "@features/fa-admin-demo-pages/services";


const inputEditor = new InputEditor();
const numberEditor = new InputEditor();
const textAreaEditor = new TextAreaEditor();
const dateInputEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['0', '1', '2'] });

// 注册编辑器到VTable
register.editor('input-editor', inputEditor);
register.editor('number-editor', numberEditor);
register.editor('textArea-editor', textAreaEditor);
register.editor('date-editor', dateInputEditor);
register.editor('list-editor', listEditor);

/**
 * edit table demo
 * @author xu.pengfei
 * @date 2025/4/25 16:11
 */
export default function DemoTableTableEdit() {
  const [array, setArray] = useState<Demo.Student[]>([])

  useEffect(() => {
    studentApi.list({ sorter: 'id ASC' }).then(res => {
      setArray(res.data)
    })
  }, [])

  function handleChangeCellValue(arg:any) {
    // console.log('onChangeCellValue', arg);
    const col = columns[arg.col]
    const data = array[arg.row - 1]
    // console.log('data', data, 'col', col)
    const params = { id: data.id, [col.field]: arg.changedValue }
    // console.log('params', params);
    studentApi.update(data.id, params)
      // .then(res => FaUtils.showResponse(res, '更新数据'))
  }

  const columns = [
    {
      field: 'id',
      title: '序号',
      width: 100,
      editor: 'input-editor',
      sort: true,
    },
    {
      field: 'name',
      title: '姓名',
      width: 200,
      editor: 'input-editor',
      sort: true,
    },
    {
      field: 'age',
      title: '年龄',
      width: 200,
      editor: 'number-editor',
      sort: true,
    },
    {
      field: 'sex',
      title: '性别',
      width: 200,
      editor: 'list-editor',
      sort: true,
    },
    {
      field: 'email',
      title: '邮箱',
      width: 200,
      editor: 'input-editor',
      sort: true,
    }
  ]

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <ListTable
        option={{
          editCellTrigger: 'click',
          columns,
          // records: [
          //   ['John', 18, '男', 'john@123.com'],
          //   ['Mick', 17, '男', 'mick@123.com'],
          // ],
          records: array,
          excelOptions: {
            fillHandle: true
          },
        }}
        // height={'500px'}
        // editCellTrigger='click' // not working
        onChangeCellValue={handleChangeCellValue}
        widthMode="adaptive"
        // theme={}
      />
    </div>
  )
}
