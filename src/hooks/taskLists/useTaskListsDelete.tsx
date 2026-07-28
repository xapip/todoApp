import { useMutation } from "@tanstack/react-query"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { tqKey } from "@src/lib/tanstackQuery/helpers"
import { TablesRow } from "@src/lib/supabase/helpers.types"

type TaskLists = TablesRow<"task_lists">

const QUERY_KEY = tqKey.taskLists

const useTaskListsDelete = () => {
  const { taskListsModel } = useTaskListsStore()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => taskListsModel.delete(id),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERY_KEY })
      const previousData: TaskLists[] | undefined =
        context.client.getQueryData(QUERY_KEY)
      context.client.setQueryData(QUERY_KEY, (old: TaskLists[]) => {
        return old.filter((item) => {
          return item.id !== variables.id
        })
      })
      return { previousData }
    },
    onError(error, variables, onMutateResult, context) {
      context.client.setQueryData(QUERY_KEY, onMutateResult?.previousData)
    },
    onSettled(data, error, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export default useTaskListsDelete
