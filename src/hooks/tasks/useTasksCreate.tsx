import { useMutation } from "@tanstack/react-query"
import { TablesRow } from "@src/lib/supabase/helpers.types"
import { useTasksStore } from "@src/context/tasksStore"
import { tqKey } from "@src/lib/tanstackQuery/helpers"

type Task = TablesRow<"tasks">
type InitialValues = Pick<Task, "content" | "due_date" | "list_id" | "title">

const TASK_KEY = tqKey.tasks

const useTasksCreate = () => {
  const { tasksModel } = useTasksStore()
  return useMutation({
    mutationFn: ({ payload }: { payload: InitialValues }) =>
      tasksModel.create({ ...payload }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: TASK_KEY })
      const previousData = context.client.getQueryData(TASK_KEY)
      context.client.setQueryData(TASK_KEY, (old: InitialValues[]) => {
        return [...old, variables.payload]
      })
      return { previousData }
    },
    onError(error, variables, onMutateResult, context) {
      context.client.setQueryData(TASK_KEY, onMutateResult?.previousData)
    },
    onSettled(data, error, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: TASK_KEY })
    },
  })
}

export default useTasksCreate
