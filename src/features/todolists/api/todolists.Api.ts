import { instance } from "@/common/instance/instance"
import { Todolist } from "./todolistsApi.types"
import { BaseResponse } from "@/common/types"

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>('/todo-lists')
  },
  changeTodolistTitle(id: string, title: string) {
    return instance.put<BaseResponse>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>('/todo-lists', { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  }
}