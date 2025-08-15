import { useEffect, useState } from 'react';
import { dictApi, dictDataApi, } from '@ui/services/base';
import { Admin, Fa, FaEnums } from '@ui/types';


export function useDict(
  code: string,
  transValue?: (v: any) => any,
): {
  dict?: Admin.Dict;
  options: Fa.Option[];
} {
  const [dict, setDict] = useState<Admin.Dict>();
  const [options, setOptions] = useState<Fa.Option[]>([]);

  useEffect(() => {
    dictApi.getByCode(code).then((res) => {
      const { data } = res;
      setDict(data)
      if (data.type === FaEnums.DictTypeEnum.OPTIONS) {
        setOptions(
          data.options
            .filter(v => !v.deleted)
            .map((v) => ({
              value: transValue ? transValue(v.value) : v.value,
              label: v.label,
            }))
        )
      }
      if (data.type === FaEnums.DictTypeEnum.LINK_OPTIONS) {
        dictDataApi.list({ query: {dictId: data.id, valid: true}, sorter: 'sort_id ASC'}).then(res2 => {
          setOptions(res2.data.map(v => ({
            value: transValue ? transValue(v.value) : v.value,
            label: v.label,
          })))
        })
      }
    });
  }, [code]);

  return { dict, options };
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
