import { NextResponse, NextRequest } from "next/server"
import { createServerClient } from "@lib/supabase/server"
import { TaskListsModel } from "@lib/supabase/TaskListsModel"

/*
    GET
*/
export async function GET(req: NextRequest) {
    const withTasks = req.nextUrl.searchParams.has("withTasks")
    const client = await createServerClient()
    const taskListsModel = new TaskListsModel<ITaskLists & ITasks>(client)

    if (withTasks) {
        const taskListsWithTasks = await taskListsModel.getAllWithTasks()
        return NextResponse.json(taskListsWithTasks)
    }

    const taskLists = await taskListsModel.getAll()
    return NextResponse.json(taskLists)
}

/*
    POST
*/
export async function POST(req: NextRequest) {
    const body = await req.json()

    const client = await createServerClient()
    const taskListsModel = new TaskListsModel(client)

    const checkByName = await taskListsModel.getBy("listName", body.listName)

    if (Array.isArray(checkByName) && checkByName.length > 0) {
        return NextResponse.json(
            { message: "Список с таким именем уже существует" },
            { status: 400 }
        )
    }

    try {
        const taskLists = await taskListsModel.create({ ...body })
        return NextResponse.json(taskLists)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error("An unknown error occurred")
        }
    }
}
