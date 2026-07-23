import { Button } from "@src/components/ui/shadcn/button"
import { Label } from "@src/components/ui/shadcn/label"
import { Checkbox } from "@src/components/ui/shadcn/checkbox"
import { Pencil } from "lucide-react"
import { DeleteButton } from "@src/components/ui/deleteButton"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"
import { cn } from "@src/lib/utils"
import useTasksUpdate from "@src/hooks/tasks/useTasksUpdate"
import useTasksDelete from "@src/hooks/tasks/useTasksDelete"
import { useTasksStore } from "@src/context/tasksStore"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

export default function TaskItem({ item }: { item: TaskWithRelation }) {
  const updateTask = useTasksUpdate()
  const deleteTask = useTasksDelete()
  const { setInitialFormValues, setIsOpenFormDrawer } = useTasksStore()
  const nowDate = new Date()
  const dueDate = item.due_date ? new Date(item.due_date) : null
  const isOverdue = dueDate ? dueDate < nowDate : false
  return (
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
              updateTask.mutate({
                id: item.id,
                payload: {
                  ...item,
                  is_completed: checked ? true : false,
                },
              })
            }
          />
          {item.title}
        </Label>
        <div className="flex flex-row items-center gap-2">
          <Button
            aria-label="update task"
            onClick={() => {
              setInitialFormValues(item)
              setIsOpenFormDrawer(true)
            }}
          >
            <Pencil />
          </Button>
          <DeleteButton onDelete={() => deleteTask.mutate({ id: item.id })} />
        </div>
      </div>
      {item.due_date && (
        <span
          className={cn(
            "text-text-color/70 text-sm",
            isOverdue && "text-red-500"
          )}
        >
          {dueDate?.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
      <p className="px-1">{item?.content}</p>
    </li>
  )
}
