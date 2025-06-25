import type { RootState } from "@/app/store"
import { DomainTodolist } from "./todolists-reducer"
 
export const selectTodolists = (state: RootState): DomainTodolist[] => state.todolists
