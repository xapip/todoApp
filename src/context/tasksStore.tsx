import { create } from "zustand"

import { createBrowserClient } from "@src/lib/supabase/client"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { BaseModel } from "@src/lib/supabase/BaseModel"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

interface TasksStore {
  tasks: TaskWithRelation[]
  filteredTasks: TaskWithRelation[]
  selectedTaskType: "withDueDate" | "withoutDueDate"
  isLoading: boolean
  error: unknown | undefined
  tasksModel: BaseModel<"tasks">
  getTasks: () => Promise<void>
  subscribeToChanges: (listId?: string | undefined) => () => void
  setFilteredTasks: (listId: number) => void
}

export const useTasksStore = create<TasksStore>((set, get) => {
  return {
    tasks: [],
    filteredTasks: [],
    selectedTaskType: "withDueDate",
    isLoading: false,
    error: null,
    tasksModel: new BaseModel("tasks"),

    getTasks: async () => {
      set({ isLoading: true })
      const { tasksModel } = get()
      try {
        const data = await tasksModel.getAll({
          select: "*, list_id (id, list_name, list_color)",
          sort: [
            { column: "due_date", order: "asc", nullsFirst: false },
            { column: "created_at", order: "asc" },
          ],
        })
        set({
          tasks: data as unknown as TaskWithRelation[],
          isLoading: false,
          filteredTasks: data as unknown as TaskWithRelation[],
        })
      } catch (error) {
        set({ error })
      }
    },

    subscribeToChanges: (listId?: string) => {
      const subscription = createBrowserClient()
        .channel(`tasks-${listId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tasks" },
          (payload: RealtimePostgresChangesPayload<TaskWithRelation>) => {
            const { tasks: currentData } = get()
            switch (payload.eventType) {
              case "INSERT":
                set({
                  tasks: [payload.new as TaskWithRelation, ...currentData],
                })
                break
              case "UPDATE":
                set({
                  tasks: currentData.map((t) =>
                    t.id === payload.new.id
                      ? (payload.new as TaskWithRelation)
                      : t
                  ),
                })
                break
              case "DELETE":
                set({
                  tasks: currentData.filter((t) => t.id !== payload.old.id),
                  filteredTasks: get().filteredTasks.filter(
                    (t) => t.id !== payload.old.id
                  ),
                })
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    },

    setFilteredTasks: (listId: number) => {
      const { tasks } = get()
      set({
        filteredTasks:
          listId >= 0
            ? tasks.filter((t) => t.list_id.id === listId)
            : [...tasks],
      })
    },
  }
})
