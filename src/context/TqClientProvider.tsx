"use client"

import { PropsWithChildren } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@lib/tanstackQuery/helpers"

export default function TqClientProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
