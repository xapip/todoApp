'use client'

import { type PropsWithChildren } from 'react'

import { TelegramMock } from '@lib/telegram/TelegramMok'
import { useTelegramSDKInit } from '@src/hooks/useTelegramSdkInit'

export function TelegramSDKInitProvider({ children }: PropsWithChildren) {
  TelegramMock()
  const { isReady, error } = useTelegramSDKInit(false)
  
  // TODO - сделать норм отображение загрузки
  if (error) return <div>SDK init error: {error}</div>
  if (!isReady) return <div>Инициализация Telegram SDK...</div>

  return <>{children}</>
}