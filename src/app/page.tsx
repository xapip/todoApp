"use client"

import Image from "next/image"
import {
    initDataState as _initDataState,
    useSignal,
} from "@telegram-apps/sdk-react"
import eruda from "eruda"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { motion } from "motion/react"

// import { Search } from "lucide-react";

import { Calendar } from "@components/ui/calendar"

import mokUserPhoto from "@public/mok-user-photo.png"
import Tasks from "@components/Tasks/Tasks"
import { Button } from "@components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@components/ui/drawer"
import { TaskListsForm } from "@components/forms/TaskListsForm"
import { useTaskLists } from "@src/hooks/useTaskLists"
import { useState } from "react"

export default function Home() {
    eruda.init()

    const [month, setMonth] = useState<Date | undefined>(new Date())
    const [date, setDate] = useState<Date | undefined>(new Date())

    const { taskLists } = useTaskLists()

    const telegramData = useSignal(_initDataState)

    return (
        <div className="flex h-full w-full flex-col space-y-3 overflow-hidden">
            <Drawer repositionInputs={false}>
                <div className="space-y-5">
                    <header className="border-text-color/10 mx-5 mt-2.5 grid grid-cols-3 items-center justify-between border-b pt-0.5 pb-2">
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
                    <div className="mx-4 -mt-4 flex items-center justify-between gap-2">
                        <ul className="flex w-full items-center gap-1.5 overflow-y-scroll px-0.5 py-1">
                            {taskLists && taskLists.length > 0 && (
                                <>
                                    <li>
                                        <Button
                                            variant={"outline"}
                                            size={"sm"}
                                            className="relative overflow-hidden whitespace-nowrap"
                                        >
                                            Все
                                        </Button>
                                    </li>
                                    {taskLists?.map((item) => (
                                        <li key={item.id}>
                                            <Button
                                                variant={"outline"}
                                                size={"sm"}
                                                className="relative overflow-hidden whitespace-nowrap"
                                            >
                                                {item.listName}
                                                <span
                                                    className="absolute right-0 bottom-0 left-0 h-1"
                                                    style={{
                                                        backgroundColor: "grey",
                                                    }}
                                                />
                                            </Button>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                        <DrawerTrigger asChild>
                            <Button variant={"outline"} size={"sm"}>
                                +
                            </Button>
                        </DrawerTrigger>
                    </div>
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
                    {taskLists && taskLists?.length <= 0 && (
                        <DrawerTrigger asChild>
                            <div className="mt-10 flex flex-col items-center">
                                <div>
                                    У тебя нет списков с задачами. Создай новый.
                                </div>
                                <Button>Создать список</Button>
                            </div>
                        </DrawerTrigger>
                    )}
                    <DrawerContent className="px-5">
                        <DrawerHeader>
                            <DrawerTitle>Добавить список</DrawerTitle>
                        </DrawerHeader>
                        <TaskListsForm />
                        <DrawerFooter>
                            <DrawerClose>Закрыть</DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </div>
            </Drawer>

            {taskLists && taskLists.length > 0 && (
                <Tasks taskLists={taskLists} />
            )}
        </div>
    )
}
