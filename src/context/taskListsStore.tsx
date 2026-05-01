import { create } from "zustand"

import { createBrowserClient } from "@src/lib/supabase/client"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { BaseModel } from "@src/lib/supabase/BaseModel"
import { TablesRow } from "@src/lib/supabase/helpers.types"

interface TaskListsStore {
  taskLists: TablesRow<"task_lists">[]
  isLoading: boolean
  error: unknown | undefined
  taskListsModel: BaseModel<"task_lists">
  editItem: TablesRow<"task_lists"> | null
  getTaskLists: () => Promise<void>
  subscribeToChanges: (listId?: string | undefined) => () => void
  setEditItem: (taskList: TablesRow<"task_lists"> | undefined) => void
}

export const useTaskListsStore = create<TaskListsStore>((set, get) => {
  return {
    taskLists: [],
    isLoading: false,
    error: null,
    taskListsModel: new BaseModel("task_lists"),
    editItem: null,

    getTaskLists: async () => {
      set((state) => ({ isLoading: (state.isLoading = true) }))
      const { taskListsModel } = get()
      try {
        const data = await taskListsModel.getAll({
          sort: { column: "created_at", order: "desc" },
        })
        if (data) {
          set((state) => ({
            taskLists: (state.taskLists = data),
            isLoading: (state.isLoading = false),
          }))
        }
      } catch (error) {
        set((state) => ({ error: (state.error = error) }))
      }
    },

    subscribeToChanges: (listId?: string) => {
      const subscription = createBrowserClient()
        .channel(`task_lists-${listId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "task_lists" },
          (
            payload: RealtimePostgresChangesPayload<TablesRow<"task_lists">>
          ) => {
            const { taskLists: currentData } = get()

            switch (payload.eventType) {
              case "UPDATE":
                set(() => ({
                  taskLists: currentData.map((t) =>
                    t.id === payload.new.id ? payload.new : t
                  ),
                }))
                break
              case "DELETE":
                set(() => ({
                  taskLists: currentData.filter((t) => t.id !== payload.old.id),
                }))
            }
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    },

    setEditItem: (taskList) => {
      if (!!taskList) {
        set((state) => ({
          editItem: (state.editItem = { ...taskList }),
        }))
      } else {
        set((state) => ({ editItem: (state.editItem = null) }))
      }
    },
  }
})
