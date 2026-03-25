import React, { useState } from "react"
import {
  initDataState as _initDataState,
  useSignal,
} from "@telegram-apps/sdk-react"

import { Button } from "@components/ui/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/shadcn/dropdown-menu"

import { EllipsisVertical, Pencil, Trash2, Share2 } from "lucide-react"
import { DeleteButton } from "@components/ui/deleteButton"
import { DrawerTrigger } from "@components/ui/shadcn/drawer"
import { useTaskListsStore } from "@context/taskListsStore"
import { createBrowserClient } from "@lib/supabase/client"

export default function TaskListItem({ taskList }: { taskList: TaskLists }) {
  const [isOpenDeleteAlarm, setOpenDeleteAlarm] = useState(false)
  const { setEditItem, taskListsModel } = useTaskListsStore()
  const telegramData = useSignal(_initDataState)

  const shareList = async (taskList: TaskLists) => {
    const token = crypto.randomUUID()
    const link = `https://t.me/xapipTaskManagerBot?startapp=invite_${token}`
    try {
      const { data, error } = await createBrowserClient()
        .from("task_list_invites")
        .insert({
          list_id: taskList.id,
          telegram_user_id: telegramData?.user?.id,
          token,
          role: "editor",
          is_used: false,
          invited_by: taskList.user_id,
        })
      console.log("task_list_invites error", error)
      console.log("task_list_invites data", data)
      //t.me/xapipTaskManagerBot?start=invite_3d8212f6-603d-4eb8-a473-33c54e4252ed
      https: navigator.clipboard.writeText(link)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <li className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 relative overflow-hidden rounded-md border px-2 shadow-xs">
      <div className="flex items-center gap-1.5">
        <Button variant={"ghost"} size={"sm"} className="p-0">
          {taskList.list_name}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => shareList(taskList)}>
              <Share2 />
              Поделиться
            </DropdownMenuItem>
            <DrawerTrigger>
              <DropdownMenuItem onSelect={() => setEditItem(taskList)}>
                <Pencil />
                Изменить
              </DropdownMenuItem>
            </DrawerTrigger>
            <DropdownMenuItem onSelect={() => setOpenDeleteAlarm(true)}>
              <Trash2 />
              удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <span
        className="absolute right-0 bottom-0 left-0 h-[2px]"
        style={{
          backgroundColor: taskList.list_color,
        }}
      />
      <DeleteButton
        onDelete={() => taskListsModel.delete(taskList.id)}
        isOpen={isOpenDeleteAlarm}
        onOpenChange={setOpenDeleteAlarm}
      />
    </li>
  )
}
