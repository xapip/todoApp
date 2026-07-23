import { useMutation } from "@tanstack/react-query"
import { TablesRow } from "@src/lib/supabase/helpers.types"
import { useTasksStore } from "@src/context/tasksStore"

type Task = TablesRow<"tasks">
type InitialValues = Pick<Task, "content" | "due_date" | "list_id" | "title">

const useTasksCreate = () => {
  const { tasksModel } = useTasksStore()
  return useMutation({
    mutationFn: ({ payload }: { payload: InitialValues }) =>
      tasksModel.create({ ...payload }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: ["tasks"] })
      const previuosData = context.client.getQueryData(["tasks"])
      context.client.setQueryData(["tasks"], (old: InitialValues[]) => {
        return [...old, variables.payload]
      })
      return { previuosData }
    },
    onError(error, variables, onMutateResult, context) {
      context.client.setQueryData(["tasks"], onMutateResult?.previuosData)
    },
    onSettled(data, error, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

export default useTasksCreate
