import { useAppDispatch } from "@/common/hooks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import type { DomainTodolist } from "@/features/todolists/model/todolists-reducer"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { createTaskTC } from "@/features/todolists/model/tasks-reducer"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: string) => {
    dispatch(createTaskTC({ todolistId: todolist.id, title }))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} />
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
