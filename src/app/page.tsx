"use client"

import eruda from "eruda"

import TaskLists from "@src/components/TaskLists/TaskLists"
import Tasks from "@src/components/Tasks/Tasks"
import Header from "@src/components/Header"

import { DraggableCalendar } from "@src/components/ui/DraggableCalendar"

export default function Home() {
  if (process.env.NODE_ENV === "development") eruda.init()

  return (
    <div className="flex h-full w-full flex-col space-y-3 overflow-hidden px-1">
      <Header />
      <TaskLists />
      <DraggableCalendar />
      <Tasks />
    </div>
  )
}
