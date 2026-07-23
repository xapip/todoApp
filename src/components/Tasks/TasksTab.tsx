import * as motion from "motion/react-client"

import TaskItem from "./TaskItem"

import { AutoReplaceRelation } from "@src/lib/supabase/helpers.types"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">
type TaskGroup = {
  dateKey: string
  label: string
  tasks: TaskWithRelation[]
}

function Tasks({ tasks }: { tasks: TaskWithRelation[] }) {
  return (
    <ul className="space-y-2">
      {tasks.map((item) => (
        <TaskItem key={item.id} item={item} />
      ))}
    </ul>
  )
}

export default function TasksTab({
  tasksType,
  tasksWithoutDueDate,
  tasksWithDueDate,
  direction,
}: {
  tasksType: "withDueDate" | "withoutDueDate"
  tasksWithoutDueDate: TaskWithRelation[]
  tasksWithDueDate: TaskGroup[]
  direction: number
}) {
  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      position: "absolute" as const,
      width: "100%",
    }),

    animate: {
      x: 0,
      position: "relative" as const,
      width: "100%",
    },

    exit: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      position: "absolute" as const,
      width: "100%",
    }),
  }

  if (
    tasksType === "withDueDate"
      ? tasksWithDueDate.length === 0
      : tasksWithoutDueDate.length === 0
  ) {
    return <div>List: {tasksType} is empty</div>
  }

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {tasksType === "withDueDate" ? (
        <div className="space-y-6">
          {tasksWithDueDate.map((group) => (
            <section
              key={group.dateKey}
              id={`group-${group.dateKey}`}
              className="relative"
            >
              <div className="bg-background/95 sticky top-0 z-20 mb-2 border-b px-1 py-2 text-sm font-medium backdrop-blur">
                {group.label}
              </div>

              <Tasks tasks={group.tasks} />
            </section>
          ))}
          {/* Spacer для возможности прокрутить последние группы до верхней части */}
          <div className="h-96" />
        </div>
      ) : (
        <Tasks tasks={tasksWithoutDueDate} />
      )}
    </motion.div>
  )
}
