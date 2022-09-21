import { Outlet } from 'react-router-dom'
import ApiEffectLayout from "@/layout/ApiEffectLayout";

export default function App() {
  return (
    <ApiEffectLayout>
      <Outlet />
    </ApiEffectLayout>
  )
}
