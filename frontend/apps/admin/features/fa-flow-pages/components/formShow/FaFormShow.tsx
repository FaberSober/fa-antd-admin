import { Flow, Flw } from '@/types';
import { Form, FormProps } from 'antd';
import useFormConfig from '../form/hooks/useFormConfig';
import FaFormShowLayout from './FaFormShowLayout';
import './index.scss';

export interface FaFormShowProps extends FormProps<any> {
  config: Flow.FlowFormConfig;
  flowNode?: Flw.Node;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 11:10:21
 */
export default function FaFormShow({ config, flowNode, ...props }: FaFormShowProps) {

  const {items, formConfig} = useFormConfig(config);

  return (
    <div className='fa-full fa-scroll-auto-y fa-relative fa-form-view'>
      <Form layout={formConfig.layout} labelCol={{ style: { width: formConfig.labelWidth } }} wrapperCol={{ style: {}}} {...props}>
        {/* Render form items based on config */}
        <FaFormShowLayout items={items} flowNode={flowNode} disabled={props.disabled} />
      </Form>
    </div>
  );
}
