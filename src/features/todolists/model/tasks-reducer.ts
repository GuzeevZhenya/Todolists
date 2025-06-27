import { createAppSlice } from "@/common/utils/createAppSlice"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { TaskStatus } from "@/common/enums"
import { addTodolists, deleteTodolists } from "./todolists-reducer"
import { setAppStatusAC } from "@/app/app-reducer"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolists.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolists.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  reducers: (create) => ({
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
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: "loading" }))
        try {
          const res = await tasksApi.getTasks(todolistId)

          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return rejectWithValue(null)
        } finally {
          dispatch(setAppStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: "loading" }))
        try {
          const res = await tasksApi.createTask(args)
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue("Failed to create task")
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
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(payload)
          return payload
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload?.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    changeTaskStatusTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string; model: UpdateTaskModel }, thunkAPI) => {
        try {
          const res = await tasksApi.updateTask(args)
          console.log(res)
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }
        },
      },
    ),
  }),
})

export const { selectTasks } = tasksSlice.selectors

export const tasksReducer = tasksSlice.reducer
export const { changeTaskStatusAC, changeTaskTitleAC, changeTaskStatusTC, deleteTaskTC, fetchTasks, createTaskTC } =
  tasksSlice.actions

export type TasksState = Record<string, DomainTask[]>
