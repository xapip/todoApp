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
import { useUserStore } from "@src/context/userStore"

interface TaskListsFormProps {
  closeDrawer: () => void
}

const formSchema = z.object({
  list_name: z.string().min(1, "Это поле не может быть пустым"),
  list_color: z.string().nullable(),
})

export function TaskListsForm({ closeDrawer }: TaskListsFormProps) {
  const [loading, setLoading] = useState(false)
  const { editableItem, taskListsModel } = useTaskListsStore()
  const [hex, setHex] = useState("#F44E3B")
  const { user } = useUserStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...editableItem },
    mode: "onChange",
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      if (taskListsModel) {
        if (editableItem) {
          taskListsModel.update(editableItem.id, { ...values })
        } else {
          taskListsModel.create({
            ...values,
            user_id: user?.id,
          })
        }
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
        <Button type="submit" onClick={closeDrawer}>
          {!!editableItem ? "Обновить" : "Добавить"}
        </Button>
        {loading && <div className="absolute inset-0 blur-sm"></div>}
      </form>
    </Form>
  )
}
