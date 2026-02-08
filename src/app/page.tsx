"use client"

import eruda from "eruda"

import TaskLists from "@components/TaskLists/TaskLists"
import Tasks from "@components/Tasks/Tasks"
import Header from "@components/Header"

import { DraggableCalendar } from "@components/ui/DraggableCalendar"

export default function Home() {
  eruda.init()

  return (
    <div className="flex h-full w-full flex-col space-y-3 overflow-hidden px-1">
      <Header />
      <TaskLists />
      <DraggableCalendar />
      <Tasks />
    </div>
  )
}
