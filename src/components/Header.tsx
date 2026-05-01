"use client"

import Image from "next/image"
import {
  initDataState as _initDataState,
  useSignal,
} from "@telegram-apps/sdk-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useCalendarStore } from "@src/context/calendarStore"
// import { Search } from "lucide-react";

import mokUserPhoto from "@public/mok-user-photo.png"
import { cn } from "@src/lib/utils"

export default function Header() {
  const telegramData = useSignal(_initDataState)
  const { selectedDate, isShowDay } = useCalendarStore()
  return (
    <header className="border-text-color/10 grid grid-cols-[1fr_2fr_1fr] items-center justify-between border-b py-2">
      <div className="">
        <Image
          src={
            telegramData?.user?.photo_url
              ? telegramData.user.photo_url
              : mokUserPhoto
          }
          alt={"user photo"}
          width={32}
          height={32}
          className="rounded-full object-cover object-center"
        />
      </div>
      <div
        className={cn(
          "justify-self-center text-2xl leading-none font-semibold uppercase",
          isShowDay && "text-base"
        )}
      >
        {/* // todo если isShowDay=true а календарь перемотан на другой месяц, то будет указан другой месяц с текущим днем(РЕШЕНИЕ? - использовать только month из стора, он имеет тип данных Date, указывает на текущий день, выбранную дату либо на первое число месяца?) */}
        {format(
          selectedDate,
          isShowDay ? `EEEE ${selectedDate.getDate()} LLL` : "LLLL",
          {
            locale: ru,
          }
        )}
      </div>
      {/* <div className="justify-self-end">
                    <Search />
                </div> */}
    </header>
  )
}
