import type { Database } from "@db-types"

export type Tables = Database["public"]["Tables"]

export type TablesSupport<T extends keyof Tables> = Tables[T]

export type TablesRow<T extends keyof Tables> = TablesSupport<T>["Row"]

export type TablesInsert<T extends keyof Tables> = TablesSupport<T>["Insert"]

export type TablesUpdate<T extends keyof Tables> = TablesSupport<T>["Update"]

// Получение связанной таблицы из Relationships
type GetRelatedTable<
  TTable extends keyof Tables,
  TField extends keyof TablesRow<TTable>,
> = Tables[TTable]["Relationships"] extends infer R
  ? R extends Array<infer Item>
    ? Item extends { columns: TField[]; referencedRelation: infer Ref }
      ? Ref extends keyof Tables
        ? Ref
        : never
      : never
    : never
  : never

// Универсальный тип для замены поля с поддержкой null и массивов
type ReplaceField<
  TBase,
  TField extends keyof TBase,
  TNewType,
  TNullable extends boolean = false,
  TIsArray extends boolean = false,
> = Omit<TBase, TField> & {
  [K in TField]: TIsArray extends true
    ? TNullable extends true
      ? TNewType[] | null
      : TNewType[]
    : TNullable extends true
      ? TNewType | null
      : TNewType
}

// Автоматическая замена поля на связанную таблицу
export type AutoReplaceRelation<
  TTable extends keyof Tables,
  TField extends keyof TablesRow<TTable>,
  TNullable extends boolean = false,
  TIsArray extends boolean = false,
> = ReplaceField<
  TablesRow<TTable>,
  TField,
  TablesRow<GetRelatedTable<TTable, TField>>,
  TNullable,
  TIsArray
>
