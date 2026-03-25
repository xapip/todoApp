type ITableNames = "users" | "users_in_list" | "task_lists" | "tasks"

interface IBaseTableFields {
  id: number
  created_at: string
}

interface TaskLists extends IBaseTableFields {
  user_id: number
  list_name: string
  list_color: string
  tasks?: Tasks[]
}

interface Tasks extends IBaseTableFields {
  content?: string
  due_day?: Date | null
  is_completed?: boolean
  list_id?: number
  user_id: string
}

type User = {
  tg_id: number
  first_name: string
  last_name: string
  user_name: string
  created_at: Date
}

type Task = {
  id: number
  title: string
  content: string
  is_completed?: boolean
  due_day?: Date | null
  // eslint-disable-next-line
  list_id: number | any
  created_at: Date
}

type UserInList = {
  id: number
  user_id: number
  list_id: number
  role: string
  created_at: Date
}
