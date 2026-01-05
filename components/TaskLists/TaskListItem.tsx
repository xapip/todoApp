import React, { useState } from "react"

import { Button } from "@components/ui/shadcn/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/shadcn/dropdown-menu"

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import { DeleteButton } from "@components/ui/deleteButton"
import { DrawerTrigger } from "@components/ui/shadcn/drawer"
import { useTaskListsStore } from "@context/store"

export default function TaskListItem({ taskList }: { taskList: TaskLists }) {
    const [isOpenDeleteAlarm, setOpenDeleteAlarm] = useState(false)
    const { setEditItem, taskListsModel } = useTaskListsStore()
    return (
        <li className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 relative overflow-hidden rounded-md border px-2 shadow-xs">
            <div className="flex items-center gap-1.5">
                <Button variant={"ghost"} size={"sm"} className="p-0">
                    {taskList.listName}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DrawerTrigger>
                            <DropdownMenuItem
                                onSelect={() => setEditItem(taskList)}
                            >
                                <Pencil />
                                Изменить
                            </DropdownMenuItem>
                        </DrawerTrigger>
                        <DropdownMenuItem
                            onSelect={() => setOpenDeleteAlarm(true)}
                        >
                            <Trash2 />
                            удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <span
                className="absolute right-0 bottom-0 left-0 h-[2px]"
                style={{
                    backgroundColor: taskList.listColor,
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
