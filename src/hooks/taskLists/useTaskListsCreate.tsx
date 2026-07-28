import { useMutation } from "@tanstack/react-query"
import { TablesRow } from "@src/lib/supabase/helpers.types"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { tqKey } from "@src/lib/tanstackQuery/helpers"

type TaskLists = TablesRow<"task_lists">
type InitialValues = Pick<TaskLists, "list_name" | "list_color">

const QUERY_KEY = tqKey.taskLists

const useTaskListsCreate = () => {
  const { taskListsModel } = useTaskListsStore()
  return useMutation({
    mutationFn: ({ payload }: { payload: InitialValues }) =>
      taskListsModel.create({ ...payload }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERY_KEY })
      const previuosData = context.client.getQueryData(tqKey.tasks)
      context.client.setQueryData(tqKey.tasks, (old: InitialValues[]) => {
        return [...old, variables.payload]
      })
      return { previuosData }
    },
    onError(error, variables, onMutateResult, context) {
      context.client.setQueryData(tqKey.tasks, onMutateResult?.previuosData)
    },
    onSettled(data, error, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export default useTaskListsCreate
