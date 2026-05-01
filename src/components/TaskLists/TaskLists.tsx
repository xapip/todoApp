import { Button } from "@src/components/ui/shadcn/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@src/components/ui/shadcn/drawer"
import { TaskListsForm } from "@src/components/TaskLists/TaskListsForm"
import TaskListItem from "./TaskListItem"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { useEffect, useState } from "react"

export default function TaskLists() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const {
    setEditItem,
    editItem,
    taskLists,
    isLoading,
    getTaskLists,
    subscribeToChanges,
  } = useTaskListsStore()

  const handleAddNewTaskList = () => {
    setEditItem(undefined)
  }

  useEffect(() => {
    getTaskLists()
  }, [getTaskLists])

  useEffect(() => {
    const unsubscribe = subscribeToChanges()
    return () => {
      unsubscribe()
    }
  }, [subscribeToChanges])

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
      repositionInputs={false}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
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
                  <TaskListItem key={item.id} taskList={item} />
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
        {!isLoading && taskLists && taskLists?.length <= 0 && (
          <DrawerTrigger asChild>
            <div className="mt-10 flex flex-col items-center">
              <div>У тебя нет списков с задачами. Создай новый.</div>
              <Button onClick={handleAddNewTaskList}>Создать список</Button>
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
