import { useEffect, useState } from 'react';
import { dictApi } from '@ui/services/base';
import { Admin, Fa } from '@ui/types';


export function useDict(
  code: string,
  transValue?: (v: any) => any,
): {
  options: Fa.Option[];
} {
  const [dict, setDict] = useState<Admin.Dict>();

  useEffect(() => {
    dictApi.getByCode(code).then((res) => setDict(res.data));
  }, [code]);

  const options = dict
    ? dict.options.map((v) => ({
        value: transValue ? transValue(v.value) : v.value,
        label: v.label,
      }))
    : [];

  return { options };
}

export function useEnum(
  enumName: string,
  transValue?: (v: any) => any,
): {
  options: Fa.Option[];
} {
  const [list, setList] = useState<Fa.Dict[]>([]);

  useEffect(() => {
    fetchData();
  }, [enumName]);

  function fetchData() {
    dictApi.listEnum(enumName).then((res) => setList(res.data));
  }

  const options = list.map((v) => ({
    value: transValue ? transValue(v.value) : v.value,
    label: v.label,
  }));

  return { options };
}
