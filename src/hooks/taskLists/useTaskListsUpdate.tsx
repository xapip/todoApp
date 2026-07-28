import { useMutation } from "@tanstack/react-query"
import { TablesRow } from "@src/lib/supabase/helpers.types"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { tqKey } from "@lib/tanstackQuery/helpers"

type TaskLists = TablesRow<"task_lists">

const QUERY_KEY = tqKey.taskLists

const useTaskListsUpdate = () => {
  const { taskListsModel } = useTaskListsStore()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TaskLists }) =>
      taskListsModel.update(id, { ...payload }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERY_KEY })
      const previousData = context.client.getQueryData(QUERY_KEY)
      context.client.setQueryData(QUERY_KEY, (old: TaskLists[] | undefined) => {
        return old?.map((item) => {
          if (item.id === variables.payload.id) {
            return { ...variables.payload }
          }
          return item
        })
      })
      return { previousData }
    },
    onError(error, variables, onMutateResult, context) {
      context.client.setQueryData(QUERY_KEY, onMutateResult?.previousData)
      console.error(error)
    },
    onSettled(data, error, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export default useTaskListsUpdate
