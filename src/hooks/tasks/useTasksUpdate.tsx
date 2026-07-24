import { useMutation } from "@tanstack/react-query"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"
import { useTasksStore } from "@src/context/tasksStore"
import { tqKey } from "@lib/tanstackQuery/helpers"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

const useTasksUpdate = () => {
  const { tasksModel } = useTasksStore()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TaskWithRelation }) =>
      tasksModel.update(id, { ...payload, list_id: payload.list_id.id }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: tqKey.tasks })
      const previousData = context.client.getQueryData(tqKey.tasks)
      context.client.setQueryData(
        tqKey.tasks,
        (old: TaskWithRelation[] | undefined) => {
          return old?.map((item) => {
            if (item.id === variables.payload.id) {
              return { ...variables.payload }
            }
            return item
          })
        }
      )
      return { previousData }
    },
    onError(error, variables, onMutateResult, context) {
      context.client.setQueryData(tqKey.tasks, onMutateResult?.previousData)
      console.error(error)
    },
    onSettled(data, error, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: tqKey.tasks })
    },
  })
}

export default useTasksUpdate
