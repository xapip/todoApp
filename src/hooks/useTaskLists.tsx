import { useCallback, useEffect, useState } from "react"
import { createBrowserClient } from "@lib/supabase/client"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { TaskListsModel } from "@lib/supabase/TaskListsModel"

export function useTaskLists(listId?: string) {
    const [taskLists, setTaskLists] = useState<TaskLists[]>([])
    const [loading, setLoading] = useState(true)
    console.log("taskLists in hook useTaskLists", taskLists)

    const loadTaskLists = useCallback(async () => {
        setLoading(true)
        const { data, error } = await createBrowserClient()
            .from("taskLists")
            .select("*")
            .order("created_at", { ascending: false })
        if (!error && data) {
            setTaskLists(data)
        }
        setLoading(false)
    }, [])

    const taskListsModel = new TaskListsModel(createBrowserClient())

    useEffect(() => {
        loadTaskLists()

        const channel = createBrowserClient()
            .channel(`taskLists-${listId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "taskLists" },
                (payload: RealtimePostgresChangesPayload<TaskLists>) => {
                    if (payload.eventType === "INSERT") {
                        setTaskLists((prev) => [payload.new, ...prev])
                    }
                    if (payload.eventType === "UPDATE") {
                        setTaskLists((prev) =>
                            prev.map((t) =>
                                t.id === payload.new.id ? payload.new : t
                            )
                        )
                    }
                    if (payload.eventType === "DELETE") {
                        setTaskLists((prev) =>
                            prev.filter((t) => t.id !== payload.old.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            createBrowserClient().removeChannel(channel)
        }
    }, [listId, loadTaskLists])

    return { taskLists, loading, taskListsModel }
}
