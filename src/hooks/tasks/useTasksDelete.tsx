import { useMutation } from "@tanstack/react-query"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"
import { useTasksStore } from "@src/context/tasksStore"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

const useTasksDelete = () => {
  const { tasksModel } = useTasksStore()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => tasksModel.delete(id),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: ["tasks"] })
      const previuosData: TaskWithRelation[] | undefined =
        context.client.getQueryData(["tasks"])
      context.client.setQueryData(["tasks"], (old: TaskWithRelation[]) => {
        return old.filter((item) => {
          return item.id !== variables.id
        })
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

export default useTasksDelete
