import { Outlet } from 'react-router-dom'
import ApiEffectLayout from "@/layout/ApiEffectLayout";
import UserLayout from "@/layout/UserLayout";

export default function Admin() {
  return (
    <ApiEffectLayout>
      <UserLayout>
        <Outlet />
      </UserLayout>
    </ApiEffectLayout>
  )
}
