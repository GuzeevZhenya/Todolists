import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import type { DomainTodolist } from "@/features/todolists/model/todolists-reducer"
import { useEffect } from "react"
import { TaskStatus } from "@/common/enums"
import { fetchTasks, selectTasks } from "@/features/todolists/model/tasks-reducer"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks(id))
  }, [])

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => !task.status)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolistId={id} />)}</List>
      )}
    </>
  )
}
