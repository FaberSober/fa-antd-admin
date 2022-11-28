import React, {useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {find} from 'lodash';
import {Dropdown, Menu} from 'antd';
import {DownOutlined, SettingOutlined} from '@ant-design/icons';
import SceneManageModal from '@/components/condition-query/SceneManageModal';
import Admin from '@/props/admin';
import {FaberTable} from '@/components/base-table';
import configService from '@/services/admin/config';
import {RES_CODE} from '@/configs/server.config';
import {BaseBizTableContext} from "@/components/base-table/BaseBizTable";
import FaEnums from "@/props/base/FaEnums";

const allSceneLabel = '全部数据';

interface IProps<T> {
  buzzModal: string;
  columns: FaberTable.ColumnsProp<T>[];
  onChange: (key: string, label: string) => void;
}

/**
 * 场景下拉菜单组件
 */
function SceneDropMenu<T>({ buzzModal, columns, onChange }: IProps<T>, ref: any) {
  const { localData } = useContext(BaseBizTableContext)

  const manageModalRef = useRef<any | null>(null);

  const [configList, setConfigList] = useState<Admin.Config[]>([]);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [value, setValue] = useState<string>('0');
  const [label, setLabel] = useState<string>(allSceneLabel);

  useImperativeHandle(ref, () => ({
    refreshConfigList: () => {
      refreshConfigList();
    },
  }));

  function refreshConfigList() {
    if (localData) return;
    if (buzzModal) {
      configService.findAllScene({ buzzModal, type: FaEnums.ConfigTypeEnum.QUERY_CONDITION }).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          setConfigList(res.data);
        }
      });
    }
  }

  useEffect(() => {
    refreshConfigList();
  }, [buzzModal]);

  /** 右侧更多按钮组点击[导入、导出] */
  function handleMenuClick(e: any) {
    const { key } = e;

    if (key === 'manage_scene') {
      setManageModalVisible(true);
      if (manageModalRef) manageModalRef.current.fetchRemoteConfig();
      return;
    }

    let newLabel;
    if (key === '0') {
      newLabel = allSceneLabel;
    } else {
      const config = find(configList, (c) => `${c.id}` === key);
      if (config) {
        newLabel = config.name;
      } else {
        newLabel = '未定义';
      }
    }
    setLabel(newLabel);
    setValue(`${key}`);
    if (onChange) onChange(`${key}`, newLabel);
  }

  const menu = (
    <Menu selectedKeys={[value]} onClick={handleMenuClick}>
      <Menu.Item key="0">{allSceneLabel}</Menu.Item>
      {configList
        .filter((n) => n.hide !== FaEnums.BoolEnum.YES)
        .map((c) => (
          <Menu.Item key={`${c.id}`}>{c.name}</Menu.Item>
        ))}
      <Menu.Divider />
      <Menu.Item key="manage_scene">
        <div style={{ minWidth: 100 }}>
          <a>
            <SettingOutlined />
            &nbsp;管理
          </a>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {!localData && (
        <Dropdown overlay={menu} trigger={['click']}>
          <a style={{ color: '#666', minWidth: 70, display: 'inline-block' }} onClick={(e) => e.preventDefault()}>
            {label} <DownOutlined />
          </a>
        </Dropdown>
      )}
      <SceneManageModal
        ref={manageModalRef}
        buzzModal={buzzModal}
        // @ts-ignore
        columns={columns}
        open={manageModalVisible}
        onOk={() => {
          refreshConfigList();
          setManageModalVisible(false);
        }}
        onCancel={() => setManageModalVisible(false)}
      />
    </div>
  );
}

export default React.forwardRef(SceneDropMenu);
