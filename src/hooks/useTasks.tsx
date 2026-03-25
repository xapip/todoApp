import { useCallback, useEffect, useState } from "react"
import { createBrowserClient } from "@lib/supabase/client"
import { TasksModel } from "@lib/supabase/TasksModel"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export function useTasks(listId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    const { data, error } = await createBrowserClient()
      .from("tasks")
      .select(
        `content, created_at, due_date, id, is_completed, title, user_id, list_id (id, list_name, list_color, created_at, user_id)`
      )
      .order("created_at", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
    if (!error && data) {
      setTasks(data)
    }
    setLoading(false)
  }, [])

  const taskModel = new TasksModel(createBrowserClient())

  useEffect(() => {
    loadTasks()

    const channel = createBrowserClient()
      .channel(`tasks-${listId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload: RealtimePostgresChangesPayload<Task>) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new, ...prev])
          }
          if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new : t))
            )
          }
          if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      createBrowserClient().removeChannel(channel)
    }
  }, [listId, loadTasks])

  return { tasks, loading, taskModel }
}
