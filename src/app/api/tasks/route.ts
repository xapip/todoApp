import { NextResponse, NextRequest } from "next/server"
import { createServerClient } from "@lib/supabase/server"
import { TasksModel } from "@lib/supabase/TasksModel"

/*
    GET
*/
export async function GET() {
    const client = await createServerClient()
    const tasksModel = new TasksModel(client)

    const tasks = await tasksModel.getAll()

    return NextResponse.json(tasks)
}

/*
    POST
*/
export async function POST(req: NextRequest) {
    const body = await req.json()

    const client = await createServerClient()
    const tasksModel = new TasksModel(client)
    try {
        const taskLists = await tasksModel.create({ ...body })
        return NextResponse.json(taskLists)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error("An unknown error occurred")
        }
    }
}
