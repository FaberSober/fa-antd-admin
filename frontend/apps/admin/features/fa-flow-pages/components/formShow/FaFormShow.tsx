import { FaGridLayout } from '@/components';
import { Flow } from '@/types';
import { FaUtils } from '@fa/ui';
import { Form, FormProps } from 'antd';
import FaFormEditorItem from '../form/cube/FaFormEditorItem';
import useFormConfig from '../form/hooks/useFormConfig';
import './index.scss';

export interface FaFormShowProps extends FormProps<any> {
  config: Flow.FlowFormConfig;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 11:10:21
 */
export default function FaFormShow({ config, ...props }: FaFormShowProps) {

  const {layout, formItemMap} = useFormConfig(config);

  return (
    <div>
      <Form {...props}>
        {/* Render form items based on config */}
        <FaGridLayout
          containerStyle={{ width: '100%', height: '100%', position: 'relative', background: 'var(--fa-bg-color)' }}
          style={{height: '100%'}}
          layout={layout.map(i => ({ ...i, isDraggable: false }))}
          renderItem={(i) => {
            const formItem = formItemMap[i.i];
            if (formItem) {
              return (
                <div
                  className='fa-form-show-item'
                  style={{ width: '100%' }}
                  onClick={(e) => {
                    FaUtils.preventEvent(e);
                  }}
                >
                  <FaFormEditorItem formItem={formItem} />
                </div>
              );
            }
            return (
              <div className='fa-form-show-item'>
                {i.i} Not Found
              </div>
            );
          }}
          gridConfig={{
            cols: 24,
            rowHeight: 50,
            margin: [6, 6],
            containerPadding: [12, 12],
          }}
          isDraggable={false}
          isResizable={false}
        />
      </Form>
    </div>
  );
}
