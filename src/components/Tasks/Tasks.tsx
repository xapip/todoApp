import { useEffect, useRef, useState } from "react"
import { Button } from "@src/components/ui/shadcn/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@src/components/ui/shadcn/drawer"
import { TaskForm } from "@src/components/Tasks/TaskForm"
import { AutoReplaceRelation, TablesRow } from "@src/lib/supabase/helpers.types"
import { TablesInsert } from "@db-types"
import { useTasksStore } from "@src/context/tasksStore"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import TasksTab from "./TasksTab"
import { cn } from "@src/lib/utils"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { format, isToday, isTomorrow, isYesterday } from "date-fns"
import { ru } from "date-fns/locale"
import { useCalendarStore } from "@src/context/calendarStore"

type FormSchema = TablesInsert<"tasks"> | null
type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">

// TODO - в случае успеха, окно закрывается из-за useEffect ниже, но если будет ошибка и что-то пойдет не так?
// TODO - добавить стилей для задач(застилить каждый айтем, добавить иконки для кнопок, застилить drawer)

type TaskGroup = {
  dateKey: string
  label: string
  tasks: TaskWithRelation[]
}

const TOP_BARRIER_HEIGHT = 45

function getDateLabel(date: Date) {
  if (isToday(date)) return "Сегодня"

  if (isTomorrow(date)) return "Завтра"

  if (isYesterday(date)) return "Вчера"

  return format(date, "d MMMM", {
    locale: ru,
  })
}

function groupTasksByDate(tasks: TaskWithRelation[]) {
  const groups = new Map<string, TaskGroup>()

  for (const task of tasks) {
    if (!task.due_date) continue

    const date = new Date(task.due_date)

    /**
     * IMPORTANT:
     * grouping by LOCAL day
     */
    const dateKey = format(date, "yyyy-MM-dd")

    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        dateKey,
        label: getDateLabel(date),
        tasks: [],
      })
    }

    groups.get(dateKey)!.tasks.push(task)
  }

  return Array.from(groups.values())
}

export default function Tasks() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [defaultValues, setDefaultValues] = useState<FormSchema>(null)
  const [tasksType, setTasksType] = useState<"withDueDate" | "withoutDueDate">(
    "withDueDate"
  )

  const { selectedItem } = useTaskListsStore()
  const { filteredTasks, getTasks, setFilteredTasks, tasksModel } =
    useTasksStore()
  const { selectedDate, setSelectedDate } = useCalendarStore()

  const [tasksWithDueDate, setTasksWithDueDate] = useState<
    typeof filteredTasks
  >([])
  const [tasksWithoutDueDate, setTasksWithoutDueDate] = useState<
    typeof filteredTasks
  >([])

  const observerRootRef = useRef<HTMLDivElement>(null)
  const currentObservedDateRef = useRef<string | null>(null)
  const isProgrammaticScrollRef = useRef(false)
  const lastSetFromObserverRef = useRef(false)
  const programmaticScrollTimeoutRef = useRef<number | undefined>(undefined)

  const groupedTasks = groupTasksByDate(tasksWithDueDate)

  const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  const scrollToGroupDateKey = (dateKey: string, smooth = true) => {
    const root = observerRootRef.current
    if (!root) return false

    const element = root.querySelector<HTMLElement>(`#group-${dateKey}`)
    if (!element) return false

    root.scrollTo({
      top: Math.max(element.offsetTop - TOP_BARRIER_HEIGHT, 0),
      behavior: smooth ? "smooth" : "auto",
    })

    return true
  }

  useEffect(() => {
    if (selectedItem) {
      setFilteredTasks(selectedItem.id)
    } else {
      setFilteredTasks(-1)
    }
  }, [selectedItem, setFilteredTasks])

  useEffect(() => {
    setTasksWithDueDate(filteredTasks.filter((t) => t.due_date !== null))
    setTasksWithoutDueDate(filteredTasks.filter((t) => t.due_date === null))
  }, [filteredTasks])

  useEffect(() => {
    getTasks()
  }, [getTasks])

  async function onSubmit(values: FormSchema, currentId: string | undefined) {
    if (values) {
      if (currentId) {
        await tasksModel.update(currentId, { ...values })
      } else {
        await tasksModel.create({ ...values })
      }
    }
  }

  const handleDrawer = async (task: TablesRow<"tasks"> | undefined) => {
    if (task) {
      setDefaultValues({ ...task })
    } else {
      setDefaultValues(null)
    }
    setOpenDrawer(true)
  }

  const direction = tasksType === "withDueDate" ? 1 : -1

  useEffect(() => {
    setOpenDrawer(false)
  }, [filteredTasks])

  const handleChangeTabs = () => {
    setTasksType(tasksType === "withDueDate" ? "withoutDueDate" : "withDueDate")
  }

  useEffect(() => {
    if (tasksType !== "withDueDate" || !observerRootRef.current) return

    const root = observerRootRef.current

    const getCurrentGroupKey = () => {
      const currentTop = root.scrollTop + TOP_BARRIER_HEIGHT
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[id^='group-']")
      )

      let currentKey: string | null = null
      let currentOffset = -Infinity

      sections.forEach((section) => {
        if (
          section.offsetTop <= currentTop &&
          section.offsetTop > currentOffset
        ) {
          currentOffset = section.offsetTop
          currentKey = section.id.replace("group-", "")
        }
      })

      return currentKey
    }

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return

      const dateKey = getCurrentGroupKey()
      if (!dateKey || currentObservedDateRef.current === dateKey) return

      currentObservedDateRef.current = dateKey
      lastSetFromObserverRef.current = true
      setSelectedDate(parseDateKey(dateKey))
    }

    root.addEventListener("scroll", onScroll, { passive: true })

    // Выполняем начальный расчет на случай, если список уже проскроллен
    onScroll()

    return () => {
      root.removeEventListener("scroll", onScroll)
    }
  }, [groupedTasks, tasksType, setSelectedDate])

  useEffect(() => {
    if (tasksType !== "withDueDate" || groupedTasks.length === 0) return
    if (lastSetFromObserverRef.current) {
      lastSetFromObserverRef.current = false
      return
    }

    const dateKey = format(selectedDate, "yyyy-MM-dd")
    const exactGroup = groupedTasks.find((group) => group.dateKey === dateKey)

    const findNearestGroupKey = (dateKey: string) => {
      const targetDate = parseDateKey(dateKey)
      return groupedTasks.reduce(
        (best, group) => {
          const groupDate = parseDateKey(group.dateKey)
          const diff = Math.abs(groupDate.getTime() - targetDate.getTime())
          if (!best || diff < best.diff) {
            return { key: group.dateKey, diff }
          }
          return best
        },
        null as { key: string; diff: number } | null
      )?.key
    }

    const targetKey = exactGroup ? dateKey : findNearestGroupKey(dateKey)
    if (!targetKey) return

    const shouldUpdateCalendar = !exactGroup && targetKey !== dateKey
    const scrolled = scrollToGroupDateKey(targetKey)
    if (!scrolled) return

    isProgrammaticScrollRef.current = true
    if (programmaticScrollTimeoutRef.current) {
      window.clearTimeout(programmaticScrollTimeoutRef.current)
    }
    programmaticScrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false
    }, 300)

    currentObservedDateRef.current = targetKey
    if (shouldUpdateCalendar) {
      setSelectedDate(parseDateKey(targetKey))
    }
  }, [groupedTasks, selectedDate, tasksType, setSelectedDate])

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
      repositionInputs={false}
    >
      <ul className="flex w-full flex-row items-center gap-2">
        <li className="flex w-full items-center justify-between gap-2">
          <motion.div className="w-full">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => handleChangeTabs()}
              className="min-h-9 w-full overflow-hidden"
            >
              <motion.span
                className={cn(
                  "translate-x-1/6 transition-all duration-300",
                  tasksType === "withDueDate"
                    ? "translate-x-1/6"
                    : "-translate-x-1/6"
                )}
              >
                <span
                  className={cn(
                    "transition-colors duration-300",
                    tasksType !== "withDueDate" && "text-text-color/50"
                  )}
                >
                  Со сроком
                </span>{" "}
                <span
                  className={cn(
                    "bg-foreground/90 text-accent rounded-full p-0.5 text-[11px] transition-all duration-300",
                    tasksType !== "withDueDate" && "bg-foreground/50"
                  )}
                >
                  {tasksWithDueDate.length}
                </span>
                <span className="text-text-color/70">/</span>{" "}
                <span
                  className={cn(
                    "transition-colors duration-300",
                    tasksType === "withDueDate" && "text-text-color/50"
                  )}
                >
                  Без срока
                </span>{" "}
                <span
                  className={cn(
                    "bg-foreground/90 text-accent rounded-full p-0.5 text-[11px] transition-all duration-300",
                    tasksType === "withDueDate" && "bg-foreground/50"
                  )}
                >
                  {tasksWithoutDueDate.length}
                </span>
              </motion.span>
            </Button>
          </motion.div>
        </li>
        <li>
          <DrawerTrigger asChild>
            <Button size={"icon"} onClick={() => handleDrawer(undefined)}>
              +
            </Button>
          </DrawerTrigger>
        </li>
      </ul>

      <div ref={observerRootRef} className="relative overflow-y-scroll pb-4">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <TasksTab
            key={tasksType}
            tasksType={tasksType}
            tasksWithoutDueDate={tasksWithoutDueDate}
            tasksWithDueDate={groupedTasks}
            direction={direction}
            onSubmit={onSubmit}
            handleDrawer={handleDrawer}
          />
        </AnimatePresence>
      </div>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {defaultValues && !!defaultValues.id
              ? "Обновить задачу"
              : "Добавить задачу"}
          </DrawerTitle>
        </DrawerHeader>
        <TaskForm defaultValues={defaultValues} onSubmit={onSubmit} />
        <DrawerFooter>
          <DrawerClose>Закрыть</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
