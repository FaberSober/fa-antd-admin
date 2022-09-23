import React from "react";
import ApiEffectLayout from "@/layout/ApiEffectLayout";
import UserLayout from "@/layout/UserLayout";
import MenuLayout from "@/layout/menu/MenuLayout";
import LangLayout from "@/layout/LangLayout";
import {Empty} from "antd";


export default function Admin() {
  return (
    <LangLayout>
      <ApiEffectLayout>
        <UserLayout>
          <MenuLayout>
            <Empty description="Page not found" />
          </MenuLayout>
        </UserLayout>
      </ApiEffectLayout>
    </LangLayout>
  )
}
