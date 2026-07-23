import { create } from "zustand"

import { BaseModel } from "@src/lib/supabase/BaseModel"
import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">
interface TasksStore {
  initialFormValues: TaskWithRelation | null
  selectedTaskType: "withDueDate" | "withoutDueDate"
  tasksModel: BaseModel<"tasks">
  isOpenFormDrawer: boolean
  setIsOpenFormDrawer: (newValue: boolean) => void
  setInitialFormValues: (initialValue: TaskWithRelation | null) => void
}

export const useTasksStore = create<TasksStore>((set) => {
  return {
    initialFormValues: null,
    selectedTaskType: "withDueDate",
    tasksModel: new BaseModel("tasks"),
    isOpenFormDrawer: false,

    setIsOpenFormDrawer: (newValue) => {
      set({ isOpenFormDrawer: newValue })
    },
    setInitialFormValues: (initialValue) => {
      set({
        initialFormValues: initialValue,
      })
    },
  }
})
