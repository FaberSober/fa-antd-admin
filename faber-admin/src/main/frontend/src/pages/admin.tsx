import {Outlet} from 'react-router-dom'
import ApiEffectLayout from "@/layout/ApiEffectLayout";
import UserLayout from "@/layout/UserLayout";
import MenuLayout from "@/layout/menu/MenuLayout";
import LangLayout from "@/layout/LangLayout";

export default function Admin() {
  return (
    <LangLayout>
      <ApiEffectLayout>
        <UserLayout>
          <MenuLayout>
            <Outlet />
          </MenuLayout>
        </UserLayout>
      </ApiEffectLayout>
    </LangLayout>
  )
}
