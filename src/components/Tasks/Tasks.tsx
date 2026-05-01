import { useEffect, useState } from "react"
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
import { TaskForm } from "@src/components/Tasks/TaskForm"
import { Label } from "@src/components/ui/shadcn/label"
import { Checkbox } from "@src/components/ui/shadcn/checkbox"
import { Pencil } from "lucide-react"
import { DeleteButton } from "@src/components/ui/deleteButton"
import { TablesRow } from "@src/lib/supabase/helpers.types"
import { TablesInsert } from "@db-types"
import { useTasksStore } from "@src/context/tasksStore"

type FormSchema = TablesInsert<"tasks"> | null

// TODO - в случае успеха, окно закрывается из-за useEffect ниже, но если будет ошибка и что-то пойдет не так?
// TODO - добавить стилей для задач(застилить каждый айтем, добавить иконки для кнопок, застилить drawer)

export default function Tasks() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [defaultValues, setDefaultValues] = useState<FormSchema>(null)
  const { tasks, getTasks, tasksModel } = useTasksStore()

  useEffect(() => {
    getTasks()
  }, [getTasks])

  async function onSubmit(values: FormSchema, currentId: string | undefined) {
    if (values) {
      if (currentId) {
        await tasksModel.update(currentId, { ...values })
      } else {
        await tasksModel.create({ ...values })
      }
    }
  }

  const handleDrawer = async (task: TablesRow<"tasks"> | undefined) => {
    if (task) {
      setDefaultValues({ ...task })
    } else {
      setDefaultValues(null)
    }
    setOpenDrawer(true)
  }

  const deleteTask = async (id: string) => {
    await tasksModel.delete(id)
  }

  useEffect(() => {
    setOpenDrawer(false)
  }, [tasks])

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
      repositionInputs={false}
    >
      <div className="relative overflow-y-scroll">
        <ul className="grow space-y-2">
          {tasks?.map((item) => (
            <li
              key={item.id}
              className="relative overflow-hidden rounded-xl border py-1 pr-2 pl-2.5"
            >
              <div
                className="absolute top-0 bottom-0 left-0 w-1.5"
                style={
                  item.list_id.list_color
                    ? { backgroundColor: item.list_id.list_color }
                    : {}
                }
              />
              <div className="flex flex-row items-center justify-between gap-2">
                <Label className="flex items-center gap-1">
                  <Checkbox
                    id="toggle-complete-task"
                    checked={item.is_completed}
                    onCheckedChange={(checked) =>
                      checked
                        ? onSubmit(
                            {
                              ...item,
                              list_id: item.list_id.id,
                              is_completed: true,
                            },
                            item.id
                          )
                        : onSubmit(
                            {
                              ...item,
                              list_id: item.list_id.id,
                              is_completed: false,
                            },
                            item.id
                          )
                    }
                  />
                  {item?.title}
                </Label>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    id="toggle-delete-task"
                    onClick={() =>
                      handleDrawer({ ...item, list_id: item.list_id.id })
                    }
                  >
                    <Pencil />
                  </Button>
                  <DeleteButton onDelete={() => deleteTask(item.id)} />
                </div>
              </div>
              <p className="px-1">{item?.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <DrawerTrigger asChild>
        <div className="fixed right-0 bottom-0 flex justify-end p-4">
          <Button size={"icon"} onClick={() => handleDrawer(undefined)}>
            +
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {defaultValues && !!defaultValues.id
              ? "Обновить задачу"
              : "Добавить задачу"}
          </DrawerTitle>
        </DrawerHeader>
        <TaskForm defaultValues={defaultValues} onSubmit={onSubmit} />
        <DrawerFooter>
          <DrawerClose>Закрыть</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
