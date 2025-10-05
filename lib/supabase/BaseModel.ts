import { SupabaseClient } from "@supabase/supabase-js"

export class BaseModel<T> {
    protected supabaseClient: SupabaseClient
    protected tableName: ITableNames

    constructor(tableName: ITableNames, supabaseClient: SupabaseClient) {
        this.tableName = tableName
        this.supabaseClient = supabaseClient
    }

    async getAll(): Promise<T[]> {
        const { data, error } = await this.supabaseClient
            .from(this.tableName)
            .select("*")

        if (error) throw new Error(error.message, error)
        return data as T[]
    }

    async getBy(columnName: string, value: string): Promise<T | null> {
        const { data, error } = await this.supabaseClient
            .from(this.tableName)
            .select("*")
            .eq(`${columnName}`, value)
            .limit(1)

        return error ? null : (data as T)
    }

    async create(payload: Omit<T, "id" | "created_at" | "userId">): Promise<T> {
        const { data, error } = await this.supabaseClient
            .from(this.tableName)
            .insert(payload)
            .select("*")

        if (error) throw new Error(error.message, error)
        return data as T
    }

    async update(id: number, payload: Partial<T>): Promise<void> {
        const { error } = await this.supabaseClient
            .from(this.tableName)
            .update(payload)
            .eq("id", id)

        if (error) throw new Error(error.message, error)
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabaseClient
            .from(this.tableName)
            .delete()
            .eq("id", id)

        if (error) throw new Error(error.message, error)
    }
}
