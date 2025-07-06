'use client'

import { initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-react'

export default function Home() {
  const telegramData = useSignal(_initDataState)
  
  return (
    <>
      <h1>{telegramData?.user?.first_name}</h1>
    </>
  )
}
