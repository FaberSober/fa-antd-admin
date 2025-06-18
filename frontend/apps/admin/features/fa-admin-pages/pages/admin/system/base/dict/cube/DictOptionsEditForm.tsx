import React, { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { PageLoading } from '@fa/ui';
import type { Admin } from '@/types';
import { dictApi } from '@features/fa-admin-pages/services';
import DictOptionsEdit from './DictOptionsEdit';

export interface DictOptionsEditFormProps {
  dictCode: string;
}

/**
 * @author xu.pengfei
 * @date 2023/7/14 15:53
 */
export default function DictOptionsEditForm({ dictCode }: DictOptionsEditFormProps) {
  const [dict, setDict] = useState<Admin.Dict>();

  useEffect(() => {
    dictApi.getByCode(dictCode).then((res) => setDict(res.data));
  }, [dictCode]);

  if (isNil(dict)) return <PageLoading />;
  return <DictOptionsEdit dict={dict} />;
}
