import { createBrowserClient } from "./client"
import {
  Tables,
  TablesInsert,
  TablesRow,
  TablesUpdate,
} from "@src/lib/supabase/helpers.types"

type TableName = keyof Tables

type SortOrder = "asc" | "desc"

type OrderOptions<T extends TableName> = {
  column: keyof TablesRow<T>
  order: SortOrder
  nullsFirst?: boolean
}

// Тип для поддержки связанных таблиц в select
// Пример: "id, title, list_id(id, list_name, list_color)"
type SelectString = string

// Универсальный тип для результата с учетом select
type SelectResult<
  T extends TableName,
  TSelect extends SelectString | undefined,
> = TSelect extends undefined
  ? TablesRow<T>[]
  : TSelect extends string
    ? TablesRow<T>[]
    : TablesRow<T>[]

export class BaseModel<T extends TableName> {
  protected supabaseClient = createBrowserClient()
  protected tableName: T

  constructor(tableName: T) {
    this.tableName = tableName
  }

  async getAll<
    TSelect extends SelectString | undefined = undefined,
    TSort extends OrderOptions<T> | OrderOptions<T>[] | undefined = undefined,
  >(
    options: {
      select?: TSelect
      sort?: TSort
    } = {}
  ): Promise<SelectResult<T, TSelect>> {
    const { select, sort } = options

    let query = this.supabaseClient.from(this.tableName).select(select || "*")

    if (sort) {
      if (sort instanceof Array) {
        sort.forEach((option) => {
          const order = option.order || "asc"
          query = query.order(String(option.column), {
            ascending: order === "asc",
            nullsFirst: option.nullsFirst,
          })
        })
      } else {
        const order = sort.order || "asc"
        query = query.order(String(sort.column), { ascending: order === "asc" })
      }
    }

    const { data, error } = await query

    if (error) throw new Error(error.message, error)
    return data as unknown as SelectResult<T, TSelect>
  }

  async getBy<TColumn extends keyof TablesRow<T>>(
    columnName: TColumn,
    value: TablesRow<T>[TColumn]
  ) {
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .select("*")
      .eq(columnName as string, value as never)
      .limit(1)

    return error ? null : data
  }

  async create(payload: TablesInsert<T>) {
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .insert(payload as never)

    if (error) throw new Error(error.message, error)
    return data
  }

  async update(id: TablesRow<T>["id"], payload: TablesUpdate<T>) {
    const { error } = await this.supabaseClient
      .from(this.tableName)
      .update(payload as never)
      .eq("id", id as never)

    if (error) throw new Error(error.message, error)
  }

  async delete(id: TablesRow<T>["id"]) {
    const { error } = await this.supabaseClient
      .from(this.tableName)
      .delete()
      .eq("id", id as never)

    if (error) throw new Error(error.message, error)
  }
}
