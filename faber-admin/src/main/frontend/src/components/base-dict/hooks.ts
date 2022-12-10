import {useEffect, useState} from "react";
import Admin from "@/props/admin";
import dictTypeApi from "@/services/admin/dictType";
import Fa from "@/props/base/Fa";
import dictApi from "@/services/admin/dictType";


export function useDict(code: string, transValue?: (v: any) => any): {
  options: Fa.Option[];
} {
  const [dict, setDict] = useState<Admin.DictType>();

  useEffect(() => {
    dictTypeApi.getByCode(code).then((res) => setDict(res.data));
  }, [code]);

  const options = dict ? dict.dicts.map((v) => ({
    value: transValue ? transValue(v.value) : v.value,
    label: v.label,
  })) : []

  return { options }
}

export function useEnum(enumName: string, transValue?: (v: any) => any): {
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
    label: v.text,
  }));

  return { options }
}
