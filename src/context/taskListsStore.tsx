import { create } from "zustand"

import { BaseModel } from "@src/lib/supabase/BaseModel"
import { TablesRow } from "@src/lib/supabase/helpers.types"

interface TaskListsStore {
  taskListsModel: BaseModel<"task_lists">
  editableItem: TablesRow<"task_lists"> | null
  selectedItem: TablesRow<"task_lists"> | null
  isOpenFormDrawer: boolean
  setIsOpenFormDrawer: (newValue: boolean) => void
  setEditableItem: (taskList: TablesRow<"task_lists"> | undefined) => void
  setSelectedItem: (taskList: TablesRow<"task_lists"> | undefined) => void
}

export const useTaskListsStore = create<TaskListsStore>((set) => {
  return {
    taskListsModel: new BaseModel("task_lists"),
    editableItem: null,
    selectedItem: null,
    isOpenFormDrawer: false,

    setIsOpenFormDrawer: (newValue) => {
      set({ isOpenFormDrawer: newValue })
    },
    setEditableItem: (taskList) => {
      if (!!taskList) {
        set(() => ({
          editableItem: { ...taskList },
        }))
      } else {
        set(() => ({ editableItem: null }))
      }
    },

    setSelectedItem: (taskList) => {
      if (!!taskList) {
        set(() => ({
          selectedItem: { ...taskList },
        }))
      } else {
        set(() => ({ selectedItem: null }))
      }
    },
  }
})
