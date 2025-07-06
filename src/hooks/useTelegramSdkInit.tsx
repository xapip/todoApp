'use client'

import { useEffect, useState } from 'react'
import {
    init as initSDK,
    viewport,
    backButton,
    swipeBehavior,
    initData,
    setDebug,
} from '@telegram-apps/sdk-react'

export function useTelegramSDKInit(debug = false) {
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const init = async () => {
        try {
            initSDK()
            setDebug(debug)

            if (backButton.isSupported()) backButton.mount()
            swipeBehavior.mount()
            initData.restore()

            void viewport
            .mount()
            .then(() => {
                viewport.bindCssVars();
            })
            .catch((e) => {
                console.error('Something went wrong mounting the viewport', e);
            });

            setIsReady(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
        }

        void init()
    }, [debug])

    return { isReady, error }
}
