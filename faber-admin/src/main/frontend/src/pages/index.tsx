import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import {PageLoading} from "@/components/antd-pro";


export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login')
  }, [])

  return (
    <PageLoading />
  )
}
