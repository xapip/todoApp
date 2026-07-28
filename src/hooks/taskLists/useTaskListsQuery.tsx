import { useQuery } from "@tanstack/react-query"
import { tqKey } from "@src/lib/tanstackQuery/helpers"
import { useTaskListsStore } from "@src/context/taskListsStore"

const useTaskListsQuery = () => {
  const { taskListsModel } = useTaskListsStore()
  return useQuery({
    queryKey: tqKey.taskLists,
    queryFn: async () =>
      await taskListsModel.getAll({
        sort: { column: "created_at", order: "desc" },
      }),
  })
}

export default useTaskListsQuery
