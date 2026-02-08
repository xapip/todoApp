import { create } from "zustand"

type storeType = {
  isShowDay: boolean
  /* 
    текущая дата
  */
  currentDate: Date

  /* 
    дата выбранная пользователем или указанная при смене месяца
  */
  selectedDate: Date

  setIsShowDay: (val: boolean) => void
  setSelectedDate: (date: Date) => void
}

export const useCalendarStore = create<storeType>((set) => {
  return {
    isShowDay: false,
    currentDate: new Date(),
    selectedDate: new Date(),

    setIsShowDay(val) {
      set({ isShowDay: val })
    },
    setSelectedDate(date) {
      set({ selectedDate: date })
    },
  }
})
