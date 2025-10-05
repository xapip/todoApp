import { SupabaseClient } from "@supabase/supabase-js"

import { BaseModel } from "./BaseModel"

export class TasksModel extends BaseModel<Tasks> {
    constructor(client: SupabaseClient) {
        super("tasks", client)
    }
}
