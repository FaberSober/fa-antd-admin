import React, {useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {find} from 'lodash';
import {Dropdown, Menu} from 'antd';
import {DownOutlined, SettingOutlined} from '@ant-design/icons';
import SceneManageModal from '@/components/condition-query/SceneManageModal';
import Admin from '@/props/admin';
import {FaberTable} from '@/components/base-table';
import configService from '@/services/admin/config';
import {RES_CODE} from '@/configs/server.config';
import FaEnums from "@/props/base/FaEnums";
import {FaHref} from "@/components/decorator";

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

  function handleMenuClick(e: any) {
    const { key } = e;

    if (key === 'setting') {
      setManageModalVisible(true);
      if (manageModalRef) manageModalRef.current.fetchRemoteConfig();
      return;
    }

    let newLabel;
    if (key === '0') {
      newLabel = allSceneLabel;
    } else {
      const config = find(configList, (c) => `${c.id}` === key);
      newLabel = config?.name;
    }
    setLabel(newLabel);
    setValue(`${key}`);
    if (onChange) onChange(`${key}`, newLabel);
  }

  const items = useMemo(() => {
    const items:any[] = [{ key: '0', label: allSceneLabel }];
    items.push(...configList
      .filter((n) => !n.hide)
      .map((i) => ({ label: i.name, key: i.id  })))
    items.push({ type: 'divider' })
    items.push({ key: 'setting', label: '管理', icon: <SettingOutlined /> })
    return items;
  }, [configList])

  return (
    <div>
      <Dropdown menu={{ items, onClick: handleMenuClick, selectedKeys: [value] }} trigger={['click']}>
        <a style={{ color: '#666', minWidth: 70, display: 'inline-block' }} onClick={(e) => e.preventDefault()}>
          {label} <DownOutlined />
        </a>
      </Dropdown>
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
