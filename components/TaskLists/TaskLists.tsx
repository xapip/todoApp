import { Button } from "@components/ui/shadcn/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@components/ui/shadcn/drawer"
import { TaskListsForm } from "@components/TaskLists/TaskListsForm"
import TaskListItem from "./TaskListItem"
import { useTaskListsStore } from "@context/store"
import { useState } from "react"

export default function TaskLists({
    children,
    taskLists,
    isLoading,
}: {
    taskLists: TaskLists[]
    isLoading: boolean
    children: React.ReactNode
}) {
    const [openDrawer, setOpenDrawer] = useState(false)
    const { setEditItem, editItem } = useTaskListsStore()
    const handleAddNewTaskList = () => {
        setEditItem(undefined)
    }
    return (
        <Drawer
            open={openDrawer}
            onOpenChange={setOpenDrawer}
            repositionInputs={false}
        >
            <div className="space-y-5">
                <div className="mx-4 -mt-4 flex items-center justify-between gap-2 overflow-x-auto">
                    <ul className="flex items-center gap-1.5 px-0.5 py-1">
                        {taskLists && taskLists.length > 0 && (
                            <>
                                <li>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        className="relative overflow-hidden whitespace-nowrap"
                                    >
                                        Все
                                    </Button>
                                </li>
                                {taskLists?.map((item) => (
                                    <TaskListItem
                                        key={item.id}
                                        taskList={item}
                                    />
                                ))}
                            </>
                        )}
                    </ul>
                    <DrawerTrigger asChild>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            onClick={handleAddNewTaskList}
                        >
                            +
                        </Button>
                    </DrawerTrigger>
                </div>
                {children}
                {!isLoading && taskLists && taskLists?.length <= 0 && (
                    <DrawerTrigger asChild>
                        <div className="mt-10 flex flex-col items-center">
                            <div>
                                У тебя нет списков с задачами. Создай новый.
                            </div>
                            <Button onClick={handleAddNewTaskList}>
                                Создать список
                            </Button>
                        </div>
                    </DrawerTrigger>
                )}
                <DrawerContent className="px-5">
                    <DrawerHeader>
                        <DrawerTitle>
                            {!!editItem ? "Изменить список" : "Добавить список"}
                        </DrawerTitle>
                    </DrawerHeader>
                    <TaskListsForm closeDrawer={() => setOpenDrawer(false)} />
                    <DrawerFooter>
                        <DrawerClose>Закрыть</DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </div>
        </Drawer>
    )
}
