import React, { useState } from "react"
import {
  initDataState as _initDataState,
  useSignal,
} from "@telegram-apps/sdk-react"

import { Button } from "@src/components/ui/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/shadcn/dropdown-menu"

import { EllipsisVertical, Pencil, Trash2, Share2 } from "lucide-react"
import { DeleteButton } from "@src/components/ui/deleteButton"
import { DrawerTrigger } from "@src/components/ui/shadcn/drawer"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { createBrowserClient } from "@src/lib/supabase/client"
import { TablesRow } from "@src/lib/supabase/helpers.types"

export default function TaskListItem({
  taskList,
}: {
  taskList: TablesRow<"task_lists">
}) {
  const [isOpenDeleteAlarm, setOpenDeleteAlarm] = useState(false)
  const { setEditableItem, taskListsModel, setSelectedItem } =
    useTaskListsStore()
  const telegramData = useSignal(_initDataState)

  const shareList = async (taskList: TablesRow<"task_lists">) => {
    const token = crypto.randomUUID()
    const link = `https://t.me/xapipTaskManagerBot?startapp=invite_${token}`
    try {
      await createBrowserClient().from("task_list_invites").insert({
        list_id: taskList.id,
        telegram_user_id: telegramData?.user?.id,
        token,
        role: "editor",
        is_used: false,
        invited_by: taskList.user_id,
      })
      https: navigator.clipboard.writeText(link)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <li className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 relative overflow-hidden rounded-md border px-2 shadow-xs">
      <div className="flex items-center gap-1.5">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="p-0"
          onClick={() => setSelectedItem({ ...taskList })}
        >
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
              <DropdownMenuItem onSelect={() => setEditableItem(taskList)}>
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
        style={
          taskList.list_color
            ? {
                backgroundColor: taskList.list_color,
              }
            : {}
        }
      />
      <DeleteButton
        onDelete={() => taskListsModel.delete(taskList.id)}
        isOpen={isOpenDeleteAlarm}
        onOpenChange={setOpenDeleteAlarm}
      />
    </li>
  )
}
