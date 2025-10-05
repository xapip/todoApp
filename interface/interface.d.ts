type ITableNames = "users" | "usersInList" | "taskLists" | "tasks"

interface IBaseTableFields {
    id: number
    created_at: string
}

interface TaskLists extends IBaseTableFields {
    userId: number
    listName: string
    listColor: string
    tasks?: ITasks[]
}

interface Tasks extends IBaseTableFields {
    content?: string
    dueDay?: Date | null
    isCompleted?: boolean
    listId?: number
    userId: string
}

type User = {
    tgId: number
    firstName: string
    lastName: string
    userName: string
    createdAt: Date
}

type Task = {
    id: number
    title: string
    content?: string
    isCompleted?: boolean
    dueDay?: Date | null
    listId: number
    createdAt: Date
}

type UserInList = {
    id: number
    userId: number
    listId: number
    role: string
    createdAt: Date
}
