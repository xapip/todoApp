import { useEffect, useState } from "react"
import { Button } from "@components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@components/ui/drawer"
import { TaskForm } from "@components/forms/TaskForm"
import { useTasks } from "@src/hooks/useTasks"
import { Label } from "@components/ui/label"
import { Checkbox } from "@components/ui/checkbox"
import { Pencil, Trash2 } from "lucide-react"
// import { useTelegramViewport } from "@src/hooks/useTelegramViewport"

type FormSchema = {
    title: string
    content?: string
    listId: number
    isCompleted?: boolean
}

// TODO - в случае успеха, окно закрывается из-за useEffect ниже, но если будет ошибка и что-то пойдет не так?
// TODO - добавить стилей для задач(застилить каждый айтем, добавить иконки для кнопок, застилить drawer)

export default function Tasks({ taskLists }: { taskLists: TaskLists[] }) {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [defaultValues, setDefaultValues] = useState<
        (FormSchema & { id?: number | undefined }) | undefined
    >(undefined)
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
                title: task?.title ?? "",
                content: task?.content,
                listId: task?.listId ?? 0,
                id: task?.id,
            })
        } else {
            setDefaultValues(undefined)
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
                            className="space-y-1.5 rounded-xl border px-2 py-1"
                        >
                            <div className="flex flex-row items-center justify-between gap-2">
                                <Label className="flex items-center gap-1">
                                    <Checkbox
                                        id="toggle-complete-task"
                                        checked={item.isCompleted}
                                        onCheckedChange={(checked) =>
                                            checked
                                                ? onSubmit(
                                                      {
                                                          isCompleted: true,
                                                          title: item.title,
                                                          listId: item.listId,
                                                      },
                                                      item.id
                                                  )
                                                : onSubmit(
                                                      {
                                                          isCompleted: false,
                                                          title: item.title,
                                                          listId: item.listId,
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
                                    <Button
                                        id="toggle-delete-task"
                                        onClick={() =>
                                            item.id && deleteTask(item.id)
                                        }
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                            <p className="px-1">{item?.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <DrawerTrigger asChild>
                <div className="fixed right-0 bottom-0 flex justify-end p-4">
                    <Button
                        size={"icon"}
                        rounded={"full"}
                        onClick={() => handleDrawer()}
                    >
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
                <TaskForm
                    taskLists={taskLists}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                />
                <DrawerFooter>
                    <DrawerClose>Закрыть</DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
