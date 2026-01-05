import { create } from "zustand"

import { createBrowserClient } from "@lib/supabase/client"
import {
    PostgrestError,
    RealtimePostgresChangesPayload,
} from "@supabase/supabase-js"
import { TaskListsModel } from "@lib/supabase/TaskListsModel"

interface TaskListsStore {
    taskLists: TaskLists[]
    isLoading: boolean
    error: unknown | undefined
    taskListsModel: TaskListsModel<TaskLists>
    editItem: TaskLists | null
    getTaskLists: () => Promise<void>
    subscribeToChanges: (listId?: string | undefined) => () => void
    setEditItem: (taskList: TaskLists | undefined) => void
}

export const useTaskListsStore = create<TaskListsStore>((set, get) => {
    return {
        taskLists: [],
        isLoading: false,
        error: null,
        taskListsModel: new TaskListsModel(createBrowserClient()),
        editItem: null,

        getTaskLists: async () => {
            set((state) => ({ isLoading: (state.isLoading = true) }))
            try {
                const {
                    data,
                    error,
                }: { data: TaskLists[] | null; error: PostgrestError | null } =
                    await createBrowserClient()
                        .from("taskLists")
                        .select("*")
                        .order("created_at", { ascending: false })
                if (!error && data) {
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
                .channel(`taskLists-${listId}`)
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "taskLists" },
                    (payload: RealtimePostgresChangesPayload<TaskLists>) => {
                        const { taskLists: currentData } = get()

                        switch (payload.eventType) {
                            case "UPDATE":
                                set(() => ({
                                    taskLists: currentData.map((t) =>
                                        t.id === payload.new.id
                                            ? payload.new
                                            : t
                                    ),
                                }))
                                break
                            case "DELETE":
                                set(() => ({
                                    taskLists: currentData.filter(
                                        (t) => t.id !== payload.old.id
                                    ),
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
