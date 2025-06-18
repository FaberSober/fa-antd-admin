import React, {useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {find} from 'lodash';
import {Button, Dropdown} from 'antd';
import {DownOutlined, SettingOutlined} from '@ant-design/icons';
import SceneManageModal from '@ui/components/condition-query/SceneManageModal';
import {Admin} from '@ui/types';
import {FaberTable} from '@ui/components/base-table';
import {configSceneApi} from '@ui/services/base';

const allSceneLabel = '全部数据';

export interface SceneDropMenuProps<T> {
  biz: string;
  columns: FaberTable.ColumnsProp<T>[];
  onChange: (key: string, label: string) => void;
}

/**
 * 场景下拉菜单组件
 */
const SceneDropMenu = React.forwardRef<HTMLElement, SceneDropMenuProps<any>>(function SceneDropMenu<T>({ biz, columns, onChange }: SceneDropMenuProps<T>, ref: any) {
  const manageModalRef = useRef<any | null>(null);

  const [configList, setConfigList] = useState<Admin.ConfigScene[]>([]);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [value, setValue] = useState<string>('0');
  const [label, setLabel] = useState<string>(allSceneLabel);

  useImperativeHandle(ref, () => ({
    refreshConfigList: () => {
      refreshConfigList();
    },
  }));

  function refreshConfigList() {
    if (biz) {
      configSceneApi.findAllScene({ biz }).then((res) => {
        setConfigList(res.data);
      });
    }
  }

  useEffect(() => {
    refreshConfigList();
  }, [biz]);

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
    setLabel(newLabel!);
    setValue(`${key}`);
    if (onChange) onChange(`${key}`, newLabel!);
  }

  const items = useMemo(() => {
    const items: any[] = [{ key: '0', label: allSceneLabel }];
    items.push(...configList.filter((n) => !n.hide).map((i) => ({ label: i.name, key: i.id })));
    items.push({ type: 'divider' });
    items.push({ key: 'setting', label: '管理', icon: <SettingOutlined /> });
    return items;
  }, [configList]);

  return (
    <div>
      <Dropdown menu={{ items, onClick: handleMenuClick, selectedKeys: [value] }} trigger={['click']}>
        <Button icon={<DownOutlined />} type="text">{label}</Button>
      </Dropdown>
      <SceneManageModal
        ref={manageModalRef}
        biz={biz}
        columns={columns as any[]}
        open={manageModalVisible}
        onOk={() => {
          refreshConfigList();
          setManageModalVisible(false);
        }}
        onCancel={() => setManageModalVisible(false)}
      />
    </div>
  );
})

export default SceneDropMenu;
