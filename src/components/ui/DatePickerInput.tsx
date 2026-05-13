"use client"

import * as React from "react"
import { CalendarIcon, Clock3 } from "lucide-react"
import { ru } from "date-fns/locale"

import { Calendar } from "@components/ui/shadcn/calendar"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@components/ui/shadcn/input-group"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/shadcn/popover"

import { cn } from "@src/lib/utils"

interface DateTimePickerInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  /**
   * timestamptz from DB
   * example:
   * 2026-05-09T18:30:00.000Z
   */
  value?: string | null

  /**
   * returns ISO string for PostgreSQL timestamptz
   */
  onChange?: (value: string | null) => void
}

function isValidDate(date: Date | undefined): date is Date {
  return !!date && !Number.isNaN(date.getTime())
}

function parseDate(value?: string | null): Date | undefined {
  if (!value) return undefined

  const date = new Date(value)

  return isValidDate(date) ? date : undefined
}

function formatDisplayDate(date?: Date) {
  if (!date) return ""

  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function buildLocalDateTime(date: Date, hours: number, minutes: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  )
}

function clamp(value: string, max: number) {
  const numeric = value.replace(/\D/g, "")

  if (!numeric) {
    return "00"
  }

  return String(Math.min(Number(numeric), max)).padStart(2, "0")
}

export function DateTimePickerInput({
  className,
  value: externalValue,
  onChange: externalOnChange,
  ...props
}: DateTimePickerInputProps) {
  const parsedExternalDate = React.useMemo(
    () => parseDate(externalValue),
    [externalValue]
  )

  const [open, setOpen] = React.useState(false)

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    parsedExternalDate
  )

  const [month, setMonth] = React.useState<Date>(
    parsedExternalDate ?? new Date()
  )

  const [hours, setHours] = React.useState(
    parsedExternalDate
      ? String(parsedExternalDate.getHours()).padStart(2, "0")
      : "12"
  )

  const [minutes, setMinutes] = React.useState(
    parsedExternalDate
      ? String(parsedExternalDate.getMinutes()).padStart(2, "0")
      : "00"
  )

  React.useEffect(() => {
    setSelectedDate(parsedExternalDate)

    if (parsedExternalDate) {
      setMonth(parsedExternalDate)

      setHours(String(parsedExternalDate.getHours()).padStart(2, "0"))

      setMinutes(String(parsedExternalDate.getMinutes()).padStart(2, "0"))
    }
  }, [parsedExternalDate])

  const emitChange = (
    date: Date | undefined,
    nextHours: string,
    nextMinutes: string
  ) => {
    if (!date) {
      externalOnChange?.(null)
      return
    }

    const localDate = buildLocalDateTime(
      date,
      Number(nextHours),
      Number(nextMinutes)
    )

    /**
     * PostgreSQL timestamptz compatible
     */
    externalOnChange?.(localDate.toISOString())
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)

    emitChange(date, hours, minutes)
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = clamp(e.target.value, 23)

    setHours(formatted)

    emitChange(selectedDate, formatted, minutes)
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = clamp(e.target.value, 59)

    setMinutes(formatted)

    emitChange(selectedDate, hours, formatted)
  }

  const displayDate = selectedDate
    ? buildLocalDateTime(selectedDate, Number(hours), Number(minutes))
    : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <InputGroup>
            <InputGroupInput
              readOnly
              value={formatDisplayDate(displayDate)}
              placeholder="Выберите дату и время"
              className={cn("cursor-pointer", className)}
              {...props}
            />

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0"
        align="end"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="border-b p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
            locale={ru}
            weekStartsOn={1}
            captionLayout="dropdown"
            startMonth={new Date(Date.now())}
            endMonth={new Date(2100, 11)}
          />
        </div>

        <div className="flex items-center gap-2 p-3">
          <Clock3 className="text-muted-foreground size-4" />

          <input
            value={hours}
            onChange={handleHoursChange}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            className={cn(
              "border-input bg-background focus:border-ring h-9 w-14 rounded-md border px-2 text-center text-sm outline-none"
            )}
          />

          <span className="text-muted-foreground text-sm">:</span>

          <input
            value={minutes}
            onChange={handleMinutesChange}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            className={cn(
              "border-input bg-background focus:border-ring h-9 w-14 rounded-md border px-2 text-center text-sm outline-none"
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
