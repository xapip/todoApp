"use client"

import { useState, useEffect, useCallback } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { cn } from "@src/lib/utils"
import { useCalendarStore } from "@src/context/calendarStore"
import { useTasksStore } from "@src/context/tasksStore"

const DRAG_RANGE = 0
const SHOW_WEEKS = 6
// todo нужна кнопка возвращения к текущему месяцу и дате
// todo количество отображаемых недель должно быть динамическим

export function DraggableCalendar() {
  const [width, setWidth] = useState(0)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const progress = useMotionValue(1) // 0 = day, 1 = week, 2 = month
  const {
    currentDate,
    selectedDate,
    isShowDay,
    setSelectedDate,
    setIsShowDay,
  } = useCalendarStore()

  const generatedCalendar = useCallback(() => {
    return generateCalendar(selectedDate)
  }, [selectedDate])

  const {} = useTasksStore()

  const currentWeekIndex = getWeekIndex(selectedDate)

  useEffect(() => {
    if (!container) return
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [container])

  const cellSize = width / 7
  const weekHeight = cellSize
  const monthHeight = cellSize * SHOW_WEEKS

  const height = useTransform(progress, [0, 1, 2], [0, weekHeight, monthHeight])
  const translateY = useTransform(
    progress,
    [0, 1, 2],
    [-currentWeekIndex * cellSize, -currentWeekIndex * cellSize, 0]
  )

  return (
    <div
      ref={setContainer}
      className={cn("w-full transition-all", isShowDay ? "-mt-1.5" : "mt-0")}
    >
      <motion.div className="bg-background rounded-b-xl border-b">
        {/* calendar viewport */}
        <motion.div
          className="relative overflow-hidden transition-all duration-300"
          style={{ height: height }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: -DRAG_RANGE, right: DRAG_RANGE }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.velocity.x > 150 || info.offset.x > cellSize * 2) {
                const prevMonth = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() - 1,
                  1
                )
                const isCurrentDate =
                  prevMonth.getMonth() === currentDate.getMonth()
                setSelectedDate(isCurrentDate ? currentDate : prevMonth)
              } else if (
                info.velocity.x < -150 ||
                info.offset.x > -cellSize * 2
              ) {
                const nextMonth = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() + 1,
                  1
                )
                const isCurrentDate =
                  nextMonth.getMonth() === currentDate.getMonth()
                setSelectedDate(isCurrentDate ? currentDate : nextMonth)
              }
            }}
            className="flex items-center gap-4 transition-all duration-300"
            style={{ y: translateY, touchAction: "pan-x" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate.getMonth()}
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ minWidth: width }}
              >
                {generatedCalendar().map((week, wi) => (
                  <div
                    key={wi}
                    className={cn("grid grid-cols-7")}
                    style={{
                      height: cellSize,
                    }}
                  >
                    {week.map((day) => (
                      <button
                        type="button"
                        key={day.toISOString()}
                        className={cn(
                          "relative flex cursor-pointer items-center justify-center"
                        )}
                        style={{ height: cellSize }}
                        onClick={() => {
                          setSelectedDate(day)
                        }}
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "absolute inset-0 rounded-full transition-all duration-300 hover:bg-black/15",
                            isSameDay(day, new Date()) &&
                              "border-primary/50 border",
                            isSameDay(day, selectedDate) &&
                              "bg-black/10 font-bold"
                          )}
                        />
                        <span
                          className={cn(
                            isSameDay(day, currentDate) && "font-bold",
                            day.getMonth() === selectedDate.getMonth()
                              ? "text-primary"
                              : "text-primary/50"
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* drag handle */}
        <motion.div
          className="flex justify-center py-2"
          drag="y"
          dragConstraints={{ top: -DRAG_RANGE, bottom: DRAG_RANGE }}
          dragElastic={0.12}
          style={{ touchAction: "pan-y" }}
          onDragEnd={(_, info) => {
            if (
              progress.get() < 2 &&
              (info.velocity.y > 100 || info.offset.y > cellSize / 2)
            ) {
              progress.set(progress.get() + 1)
              if (progress.get() === 0) {
                setIsShowDay(true)
              } else {
                setIsShowDay(false)
              }
            } else if (
              progress.get() > 0 &&
              (info.velocity.y < -100 || info.offset.y > -cellSize / 2)
            ) {
              progress.set(progress.get() - 1)
              if (progress.get() === 0) {
                setIsShowDay(true)
              }
            }
          }}
        >
          <div className="bg-muted h-1.5 w-10 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getWeekIndex(date: Date) {
  const start = startOfMonth(date)
  const firstWeekStart = startOfWeek(start)
  const diff = (date.getTime() - firstWeekStart.getTime()) / 86400000
  return Math.floor(diff / 7)
}
function startOfMonth(date: Date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  return startOfMonth
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay() || 7
  if (day !== 1) d.setHours(-24 * (day - 1))
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function generateCalendar(date: Date) {
  const start = startOfWeek(startOfMonth(date))
  return Array.from({ length: SHOW_WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
  )
}
