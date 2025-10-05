import { SupabaseClient } from "@supabase/supabase-js"

import { BaseModel } from "./BaseModel"

export class TaskListsModel<T> extends BaseModel<ITaskLists> {
    constructor(client: SupabaseClient) {
        super("taskLists", client)
    }

    async getAllWithTasks(): Promise<T[]> {
        const { data, error } = await this.supabaseClient
            .from(this.tableName)
            .select("*,tasks(*)")

        if (error) throw new Error(error.message, error)
        return data as T[]
    }
}
