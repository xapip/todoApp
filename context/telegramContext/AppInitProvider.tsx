'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

import { initDataState as _initDataState, useSignal, initDataRaw as _initDataRaw } from '@telegram-apps/sdk-react'

const AppInitProvider = ({ children }: PropsWithChildren) => {
    const [isAppReady, setIsAppReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const initDataState = useSignal(_initDataState)
    const initDataRaw = useSignal(_initDataRaw)
    const userId = initDataState?.user?.id

    const logError = useCallback((message: string) => {
        console.error(message)
        setError(message)
    }, [])

    const authenticateUser = useCallback(async (rawData: string) => {
        try {
            const response = await fetch('/api/authUser', {
                method: 'POST',
                headers: {
                    Authorization: `tma ${rawData}`
                },
            });
            const authData = await response.json()
            if (!authData) {
                console.error('Что-то пошло не так')
                logError('Что-то пошло не так')
            }
            setIsAppReady(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : JSON.stringify(err, null, 2)
            logError(`Authentication failed: ${message}`)
        }
    }, [logError])

    useEffect(() => {
        if (!userId) {
            logError('Telegram user ID is absent.')
            return
        }

        if (!initDataRaw) {
            logError('Telegram raw data is undefined.')
            return
        }

        authenticateUser(initDataRaw)
    }, [userId, initDataRaw, authenticateUser, logError])

    // TODO - тут еще один лоадинг(другой в провайдере телеграмма), с ними нужно что-то будет сделать
    if (error) return <div>{error}</div>
    if (!isAppReady) return <div>Loading...</div>

    return <>{children}</>
}

export default AppInitProvider