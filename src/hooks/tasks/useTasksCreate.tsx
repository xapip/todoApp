import { useMutation } from "@tanstack/react-query"
import { TablesRow } from "@src/lib/supabase/helpers.types"
import { useTasksStore } from "@src/context/tasksStore"
import { tqKey } from "@src/lib/tanstackQuery/helpers"

type Task = TablesRow<"tasks">
type InitialValues = Pick<Task, "content" | "due_date" | "list_id" | "title">

const useTasksCreate = () => {
  const { tasksModel } = useTasksStore()
  return useMutation({
    mutationFn: ({ payload }: { payload: InitialValues }) =>
      tasksModel.create({ ...payload }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: tqKey.tasks })
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
      context.client.invalidateQueries({ queryKey: tqKey.tasks })
    },
  })
}

export default useTasksCreate
