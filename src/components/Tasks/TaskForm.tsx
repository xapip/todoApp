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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@src/components/ui/shadcn/popover"
import { cn } from "@src/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@src/components/ui/shadcn/command"
import { Textarea } from "@src/components/ui/shadcn/textarea"
import { useTaskListsStore } from "@src/context/taskListsStore"
import { TablesInsert } from "@db-types"
import { DateTimePickerInput } from "../ui/DatePickerInput"

type FormSchema = TablesInsert<"tasks"> | null

const formSchema = z.object({
  title: z.string().min(1, "Это поле не может быть пустым"),
  content: z.string(),
  due_date: z.string().nullable().optional(),
  list_id: z.number().min(1, "Пожалуйста, выберите список."),
})

export function TaskForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: FormSchema
  onSubmit: (values: FormSchema, currentId: string | undefined) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content,
      list_id: defaultValues?.list_id,
      due_date: defaultValues?.due_date,
    },
  })
  const { taskLists } = useTaskListsStore()

  return (
    <Form {...form}>
      <div className="relative overflow-y-scroll">
        <form
          onSubmit={form.handleSubmit((e) => onSubmit(e, defaultValues?.id))}
          className="flex flex-col items-center space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full max-w-[300px]">
                <FormLabel>Заголовок</FormLabel>
                <FormControl>
                  <Input placeholder="глянуть кинцо" {...field} />
                </FormControl>
                <FormDescription>Что нужно сделать?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full max-w-[300px]">
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="глянуть кинцо, на компе, укутавшись в плед"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Немного подробностей</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="w-full max-w-[300px]">
                <FormLabel>Срок выполнения</FormLabel>
                <FormControl>
                  <DateTimePickerInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  До какого числа нужно выполнить задачу?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="list_id"
            render={({ field }) => (
              <FormItem className="flex w-full max-w-[300px] flex-col">
                <FormLabel>Имя списка</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-expanded={open}
                      >
                        {field.value
                          ? taskLists.find(
                              (taskList) => taskList.id === field.value
                            )?.list_name
                          : "Выберите список"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Поиск списков..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Такого списка нет.</CommandEmpty>
                        <CommandGroup>
                          {taskLists.map((taskList) => (
                            <CommandItem
                              value={taskList.list_name}
                              key={taskList.id}
                              onSelect={() => {
                                field.onChange(
                                  field.value === taskList.id ? 0 : taskList.id
                                )
                                setOpen(false)
                              }}
                            >
                              {taskList.list_name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field.value === taskList.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  В какой список попадет ваше задание.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {!!defaultValues?.id ? "Обновить" : "Добавить"}
          </Button>
        </form>
      </div>
    </Form>
  )
}
