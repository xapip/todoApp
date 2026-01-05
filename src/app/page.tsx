"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
    initDataState as _initDataState,
    useSignal,
} from "@telegram-apps/sdk-react"
import eruda from "eruda"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { motion } from "motion/react"

import { Calendar } from "@components/ui/shadcn/calendar"
import TaskLists from "@components/TaskLists/TaskLists"
import Tasks from "@components/Tasks/Tasks"

// import { Search } from "lucide-react";

import mokUserPhoto from "@public/mok-user-photo.png"
import { useTaskListsStore } from "@context/store"

export default function Home() {
    eruda.init()

    const [month, setMonth] = useState<Date | undefined>(new Date())
    const [date, setDate] = useState<Date | undefined>(new Date())

    const telegramData = useSignal(_initDataState)

    const { taskLists, isLoading, getTaskLists, subscribeToChanges } =
        useTaskListsStore()

    useEffect(() => {
        getTaskLists()
    }, [getTaskLists])

    useEffect(() => {
        const unsubscribe = subscribeToChanges()
        return () => {
            unsubscribe()
        }
    }, [subscribeToChanges])

    return (
        <div className="flex h-full w-full flex-col space-y-3 overflow-hidden">
            <header className="border-text-color/10 mx-5 my-5 mt-2.5 grid grid-cols-3 items-center justify-between border-b pt-0.5 pb-2">
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
                <div className="justify-self-center text-2xl leading-none font-semibold uppercase">
                    {!!month && format(month, "LLLL", { locale: ru })}
                </div>
                {/* <div className="justify-self-end">
                    <Search />
                </div> */}
            </header>
            <TaskLists taskLists={taskLists} isLoading={isLoading}>
                <motion.div className="relative rounded-b-3xl bg-white px-0.5 shadow-lg">
                    <motion.div
                        transition={{ type: "spring", damping: 25 }}
                        className="relative overflow-hidden"
                    >
                        <Calendar
                            locale={ru}
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            month={month}
                            onMonthChange={setMonth}
                            weekStartsOn={1}
                            modifiers={{
                                weekend: { dayOfWeek: [0] },
                            }}
                            modifiersStyles={{
                                weekend: {
                                    color: "var(--weekend-color)",
                                },
                                dayButton: {
                                    borderRadius: "100%",
                                },
                            }}
                            className="w-full overflow-hidden p-0"
                        />
                    </motion.div>
                    <motion.div className="flex w-full items-center justify-center py-5">
                        <div className="bg-text-color/20 h-1 w-10 rounded-full" />
                    </motion.div>
                </motion.div>
            </TaskLists>
            <Tasks />
        </div>
    )
}
