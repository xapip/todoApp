"use client"

import React from "react"
import {
    initDataState as _initDataState,
    useSignal,
} from "@telegram-apps/sdk-react"
import eruda from "eruda"

export default function Home() {
    eruda.init()

    const telegramData = useSignal(_initDataState)

    return (
        <>
            <h1>{telegramData?.user?.first_name}</h1>
        </>
    )
}
