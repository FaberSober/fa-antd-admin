import { Outlet } from 'react-router-dom'
import ApiEffectLayout from "@/layout/ApiEffectLayout";

export default function Admin() {
  return (
    <ApiEffectLayout>
      <Outlet />
    </ApiEffectLayout>
  )
}
