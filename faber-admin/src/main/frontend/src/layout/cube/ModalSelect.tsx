import React, { ReactNode, useMemo } from 'react';
import { each } from 'lodash';
import { AppstoreOutlined } from '@ant-design/icons';
import { Popover, Card, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import LayoutProps from '@/props/base/LayoutProps';

// 业务模块
import modalConfig from '@/configs/modal.config';
import {useNavigate} from "react-router-dom";

interface Props {
  /** 顶部菜单模块配置 */
  headerModal: LayoutProps.HeaderModal;
}

const ModalSelectPanel = ({ headerModal }: Props) => {
  const navigate = useNavigate();

  const ModalDoms = useMemo(() => {
    const doms: ReactNode[] = [];
    each(modalConfig, (v, k) => {
      if (v.hide) return;
      doms.push(
        <Col key={k} md={8}>
          <Card
            hoverable
            cover={<img style={{ height: 110, width: '100%', border: '1px solid #eee', borderBottom: 'none' }} alt={v.name} src={v.img} />}
            bodyStyle={{ padding: 6 }}
            onClick={() => {
              if (v.newWindow) {
                window.open(v.link, '_blank');
              } else {
                navigate(v.link);
              }
            }}
          >
            <Card.Meta title={<FormattedMessage id={v.name} />} />
          </Card>
        </Col>
      );
    });
    return doms;
  }, []);

  return (
    <Row style={{ width: 600 }} gutter={12}>
      {ModalDoms}
    </Row>
  );
};

interface IProps extends RouteComponentProps {
  /** 顶部菜单模块配置 */
  headerModal: LayoutProps.HeaderModal;
}

/**
 * Header-大业务模块切换
 */
const ModalSelect = ({ headerModal }: IProps) => (
  <Popover content={<ModalSelectPanel headerModal={headerModal} />} trigger="click" >
    <div style={{ cursor: 'pointer', fontSize: '14px', color: '#eee', margin: '0 12px' }}>
      <AppstoreOutlined style={{ marginRight: 6 }} />
      <FormattedMessage id={headerModal.name} />
    </div>
  </Popover>
);

export default ModalSelect;
