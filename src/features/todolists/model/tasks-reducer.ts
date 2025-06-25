import { createAppSlice } from "@/common/utils/createAppSlice"
import { tasksApi } from "../api/tasksApi"
import { DomainTask } from "../api/tasksApi.types"
import { TaskStatus } from "@/common/enums"

const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; status: TaskStatus }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.status = action.payload.status
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
    fetchTasks: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return thunkAPI.rejectWithValue({
            todolistId,
            error: "Failed to fetch tasks",
          })
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask(args)
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue("Failed to create task")
        }
      },
      {
        fulfilled: (state, action) => {
          const { task } = action.payload
          if (!state[task.todoListId]) {
            state[task.todoListId] = []
          }
          state[task.todoListId].unshift(task)
        },
      },
    ),
  }),
})

export const tasksReducer = tasksSlice.reducer
export const { changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC, fetchTasks, createTaskTC } = tasksSlice.actions

export type TasksState = Record<string, DomainTask[]>
