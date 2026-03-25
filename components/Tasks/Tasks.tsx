import { useEffect, useState } from "react"
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
import { TaskForm } from "@components/Tasks/TaskForm"
import { useTasks } from "@src/hooks/useTasks"
import { Label } from "@components/ui/shadcn/label"
import { Checkbox } from "@components/ui/shadcn/checkbox"
import { Pencil } from "lucide-react"
import { DeleteButton } from "@components/ui/deleteButton"

type FormSchema = {
  title: string
  content: string
  list_id: number
  is_completed?: boolean
}

// TODO - в случае успеха, окно закрывается из-за useEffect ниже, но если будет ошибка и что-то пойдет не так?
// TODO - добавить стилей для задач(застилить каждый айтем, добавить иконки для кнопок, застилить drawer)

export default function Tasks() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [defaultValues, setDefaultValues] = useState<
    FormSchema & { id?: number | undefined }
  >({
    title: "",
    content: "",
    list_id: NaN,
  })
  const { tasks, taskModel } = useTasks()

  async function onSubmit(values: FormSchema, currentId: number | undefined) {
    if (currentId) {
      await taskModel.update(currentId, { ...values })
    } else {
      await taskModel.create({ ...values })
    }
  }

  const handleDrawer = async (task?: Task | undefined) => {
    if (task) {
      setDefaultValues({
        title: task.title ?? "",
        content: task.content ?? "",
        list_id: task.list_id ?? 0,
        id: task?.id,
      })
    } else {
      setDefaultValues({
        title: "",
        content: "",
        list_id: 0,
      })
    }
    setOpenDrawer(true)
  }

  const deleteTask = async (id: number) => {
    await taskModel.delete(id)
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
                style={{ backgroundColor: item.list_id.list_color }}
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
                              is_completed: true,
                              title: item.title,
                              content: item.content,
                              list_id: item.list_id,
                            },
                            item.id
                          )
                        : onSubmit(
                            {
                              is_completed: false,
                              title: item.title,
                              content: item.content,
                              list_id: item.list_id,
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
                    onClick={() => handleDrawer(item)}
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
          <Button size={"icon"} onClick={() => handleDrawer()}>
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
