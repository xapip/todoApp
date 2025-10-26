"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@components/ui/shadcn/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/shadcn/form"
import { Input } from "@components/ui/shadcn/input"

const formSchema = z.object({
    listName: z.string().min(1, "Это поле не может быть пустым"),
})

export function TaskListsForm() {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            listName: "",
        },
        mode: "onChange",
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const res = await fetch(`/api/taskLists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Ошибка при создании списка")
            }

            form.reset()
        } catch (error) {
            console.error(error)
            if (error instanceof Error) {
                form.setError("listName", {
                    type: "manual",
                    message: error.message,
                })
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative flex flex-col items-center space-y-8"
            >
                <FormField
                    control={form.control}
                    name="listName"
                    render={({ field, fieldState }) => (
                        <FormItem className="w-full max-w-[300px]">
                            <FormLabel>Имя списка</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="покупки"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e) // Стандартное изменение поля
                                        // Если есть ошибка и пользователь начал вводить - очищаем ошибку
                                        if (fieldState.error) {
                                            form.clearErrors("listName")
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Как будет называться список?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Добавить</Button>
                {loading && <div className="absolute inset-0 blur-sm"></div>}
            </form>
        </Form>
    )
}
