import { useMutation } from "@tanstack/react-query"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"
import { useTasksStore } from "@src/context/tasksStore"
import { tqKey } from "@src/lib/tanstackQuery/helpers"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

const TASK_KEY = tqKey.tasks

const useTasksDelete = () => {
  const { tasksModel } = useTasksStore()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => tasksModel.delete(id),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: TASK_KEY })
      const previousData: TaskWithRelation[] | undefined =
        context.client.getQueryData(TASK_KEY)
      context.client.setQueryData(TASK_KEY, (old: TaskWithRelation[]) => {
        return old.filter((item) => {
          return item.id !== variables.id
        })
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

export default useTasksDelete
