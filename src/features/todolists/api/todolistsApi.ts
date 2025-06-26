// import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import axios from "axios"
import type { Todolist } from "./todolistsApi.types"

// VITE_BASE_URL=http://social-network.samuraijs.com/api/1.1
// VITE_AUTH_TOKEN=a73b443c-1e4e-40ec-9576-f8dbd6fcd719
// VITE_API_KEY=0c996da3-8cbb-451a-b885-75cfe34701ae

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "0c996da3-8cbb-451a-b885-75cfe34701ae",
  },
})

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
}
