import { useQuery } from "@tanstack/react-query"
import { useTasksStore } from "@src/context/tasksStore"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"
import { tqKey } from "@src/lib/tanstackQuery/helpers"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

const useTasksQuery = () => {
  const { tasksModel } = useTasksStore()
  return useQuery({
    queryKey: tqKey.tasks,
    queryFn: async () =>
      (await tasksModel.getAll({
        select: "*, list_id (id, list_name, list_color)",
        sort: [
          { column: "due_date", order: "asc", nullsFirst: false },
          { column: "created_at", order: "asc" },
        ],
      })) as unknown as TaskWithRelation[],
  })
}

export default useTasksQuery
