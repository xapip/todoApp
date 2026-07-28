"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@src/components/ui/shadcn/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@src/components/ui/shadcn/form"
import { Input } from "@src/components/ui/shadcn/input"
import { useTaskListsStore } from "@src/context/taskListsStore"
import Circle from "@uiw/react-color-circle"
import useTaskListsCreate from "@src/hooks/taskLists/useTaskListsCreate"
import useTaskListsUpdate from "@src/hooks/taskLists/useTaskListsUpdate"

const formSchema = z.object({
  list_name: z.string().min(1, "Это поле не может быть пустым"),
  list_color: z.string().nullable(),
})

export function TaskListsForm() {
  const { editableItem, setIsOpenFormDrawer } = useTaskListsStore()
  const createList = useTaskListsCreate()
  const updateList = useTaskListsUpdate()
  const [hex, setHex] = useState(editableItem?.list_color ?? "")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...editableItem,
      list_name: editableItem?.list_name ?? "",
    },
    mode: "onChange",
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (editableItem) {
        updateList.mutate({
          id: editableItem.id,
          payload: { ...editableItem, ...values },
        })
      } else {
        createList.mutate({
          payload: values,
        })
      }
      form.reset()
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        form.setError("list_name", {
          type: "manual",
          message: error.message,
        })
      }
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
          name="list_name"
          render={({ field, fieldState }) => (
            <FormItem className="w-full max-w-[300px]">
              <FormLabel>Имя списка</FormLabel>
              <FormControl>
                <Input
                  placeholder="покупки"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    if (fieldState.error) {
                      form.clearErrors("list_name")
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Как будет называться список?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="list_color"
          render={({ field }) => (
            <FormItem className="w-full max-w-[300px]">
              <FormLabel>Цвет списка</FormLabel>
              <FormControl>
                <Circle
                  {...field}
                  colors={[
                    "#FF0000",
                    "#FFA500",
                    "#FFFF00",
                    "#008000",
                    "#00FFFF",
                    "#0000FF",
                    "#800080",
                  ]}
                  color={hex}
                  style={{
                    gap: 16,
                  }}
                  rectProps={{
                    style: {
                      borderRadius: 2,
                      width: 10,
                      height: 10,
                    },
                  }}
                  pointProps={{
                    style: {
                      width: 26,
                      height: 26,
                      borderRadius: 5,
                    },
                  }}
                  onChange={(color) => {
                    field.onChange(color.hexa)
                    setHex(color.hex)
                  }}
                />
              </FormControl>
              <FormDescription>Какой будет цвет у списка?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onClick={() => setIsOpenFormDrawer(false)}>
          {!!editableItem ? "Обновить" : "Добавить"}
        </Button>
      </form>
    </Form>
  )
}
