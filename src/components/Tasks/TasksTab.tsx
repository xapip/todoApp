import * as motion from "motion/react-client"

import TaskItem from "./TaskItem"

import {
  AutoReplaceRelation,
  TablesInsert,
  TablesRow,
} from "@src/lib/supabase/helpers.types"

type TaskWithRelation = AutoReplaceRelation<"tasks", "list_id">
type TaskGroup = {
  dateKey: string
  label: string
  tasks: TaskWithRelation[]
}

type FormSchema = TablesInsert<"tasks"> | null

function Tasks({
  tasks,
  onSubmit,
  handleDrawer,
}: {
  tasks: TaskWithRelation[]
  onSubmit: (values: FormSchema, currentId: string | undefined) => Promise<void>
  handleDrawer: (task: TablesRow<"tasks"> | undefined) => Promise<void>
}) {
  return (
    <ul className="space-y-2">
      {tasks.map((item) => (
        <TaskItem
          key={item.id}
          item={item}
          onSubmit={onSubmit}
          handleDrawer={handleDrawer}
        />
      ))}
    </ul>
  )
}

export default function TasksTab({
  tasksType,
  tasksWithoutDueDate,
  tasksWithDueDate,
  direction,
  onSubmit,
  handleDrawer,
}: {
  tasksType: "withDueDate" | "withoutDueDate"
  tasksWithoutDueDate: TaskWithRelation[]
  tasksWithDueDate: TaskGroup[]
  direction: number
  onSubmit: (values: FormSchema, currentId: string | undefined) => Promise<void>
  handleDrawer: (task: TablesRow<"tasks"> | undefined) => Promise<void>
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

              <Tasks
                tasks={group.tasks}
                onSubmit={onSubmit}
                handleDrawer={handleDrawer}
              />
            </section>
          ))}
          {/* Spacer для возможности прокрутить последние группы до верхней части */}
          <div className="h-96" />
        </div>
      ) : (
        <Tasks
          tasks={tasksWithoutDueDate}
          onSubmit={onSubmit}
          handleDrawer={handleDrawer}
        />
      )}
    </motion.div>
  )
}
