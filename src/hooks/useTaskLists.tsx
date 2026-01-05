import { useEffect } from "react"

import { useTaskListsStore } from "@context/store"

export function useTaskLists(listId?: string) {
    console.log("taskLists in hook useTaskLists")

    const {
        taskLists,
        isLoading,
        error,
        taskListsModel,
        getTaskLists,
        subscribeToChanges,
    } = useTaskListsStore()

    useEffect(() => {
        getTaskLists()

        const unsubscribe = subscribeToChanges()

        return () => {
            unsubscribe()
        }
    }, [getTaskLists, listId, subscribeToChanges])

    return { taskLists, isLoading, error, taskListsModel }
}
