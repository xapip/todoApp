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
import useTaskListsQuery from "@src/hooks/taskLists/useTaskListsQuery"
import { cn } from "@src/lib/utils"

export default function TaskLists() {
  const {
    editableItem,
    setEditableItem,
    selectedItem,
    setSelectedItem,
    isOpenFormDrawer,
    setIsOpenFormDrawer,
  } = useTaskListsStore()

  const handleAddNewTaskList = () => {
    setEditableItem(undefined)
  }

  const { data: taskLists, isLoading } = useTaskListsQuery()

  return (
    <Drawer
      open={isOpenFormDrawer}
      onOpenChange={setIsOpenFormDrawer}
      repositionInputs={false}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-0.5">
          <div className="flex items-center gap-2 overflow-x-auto pr-2">
            <ul className="flex items-center gap-1.5 px-0.5 py-1">
              {taskLists && taskLists.length > 0 && (
                <>
                  <li>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className={cn(
                        "relative overflow-hidden whitespace-nowrap",
                        !selectedItem &&
                          "border-accent-foreground/60 shadow-accent-foreground"
                      )}
                      onClick={() => setSelectedItem(undefined)}
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
          </div>
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
              {!!editableItem ? "Изменить список" : "Добавить список"}
            </DrawerTitle>
          </DrawerHeader>
          <TaskListsForm />
          <DrawerFooter>
            <DrawerClose>Закрыть</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </div>
    </Drawer>
  )
}
