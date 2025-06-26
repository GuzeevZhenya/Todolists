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
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
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
        debugger
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

// import type { RootState } from "@/app/store"
// import { tasksApi } from "@/features/todolists/api/tasksApi"
// import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"
// import { createAppSlice } from "@/common/utils/createAppSlice"
// import { addTodolists, deleteTodolists } from "./todolists-reducer"
// import { setAppStatusAC } from "@/app/app-reducer"

// export const tasksSlice = createAppSlice({
//   name: "tasks",
//   initialState: {} as TasksState,
//   selectors: {
//     selectTasks: (state) => state,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addTodolists.fulfilled, (state, action) => {
//         state[action.payload.todolist.id] = []
//       })
//       .addCase(deleteTodolists.fulfilled, (state, action) => {
//         delete state[action.payload.id]
//       })
//   },
//   reducers: (create) => ({
//     fetchTasksTC: create.asyncThunk(
//       async (todolistId: string, { dispatch, rejectWithValue }) => {
//         try {
//           dispatch(setAppStatusAC({ status: "loading" }))
//           const res = await tasksApi.getTasks(todolistId)
//           dispatch(setAppStatusAC({ status: "succeeded" }))
//           return { todolistId, tasks: res.data.items }
//         } catch (error) {
//           dispatch(setAppStatusAC({ status: "failed" }))
//           return rejectWithValue(null)
//         }
//       },
//       {
//         fulfilled: (state, action) => {
//           state[action.payload.todolistId] = action.payload.tasks
//         },
//       },
//     ),
//     createTaskTC: create.asyncThunk(
//       async (payload: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
//         try {
//           dispatch(setAppStatusAC({ status: "loading" }))
//           const res = await tasksApi.createTask(payload)
//           dispatch(setAppStatusAC({ status: "succeeded" }))
//           return { task: res.data.data.item }
//         } catch (error) {
//           dispatch(setAppStatusAC({ status: "failed" }))
//           return rejectWithValue(null)
//         }
//       },
//       {
//         fulfilled: (state, action) => {
//           state[action.payload.task.todoListId].unshift(action.payload.task)
//         },
//       },
//     ),
//     deleteTaskTC: create.asyncThunk(
//       async (payload: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
//         try {
//           dispatch(setAppStatusAC({ status: "loading" }))
//           await tasksApi.deleteTask(payload)
//           dispatch(setAppStatusAC({ status: "succeeded" }))
//           return payload
//         } catch (error) {
//           dispatch(setAppStatusAC({ status: "failed" }))
//           return rejectWithValue(null)
//         }
//       },
//       {
//         fulfilled: (state, action) => {
//           const tasks = state[action.payload.todolistId]
//           const index = tasks.findIndex((task) => task.id === action.payload.taskId)
//           if (index !== -1) {
//             tasks.splice(index, 1)
//           }
//         },
//       },
//     ),
//     updateTaskTC: create.asyncThunk(
//       async (
//         payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
//         { dispatch, getState, rejectWithValue },
//       ) => {
//         const { todolistId, taskId, domainModel } = payload

//         const allTodolistTasks = (getState() as RootState).tasks[todolistId]
//         const task = allTodolistTasks.find((task) => task.id === taskId)

//         if (!task) {
//           return rejectWithValue(null)
//         }

//         const model: UpdateTaskModel = {
//           description: task.description,
//           title: task.title,
//           priority: task.priority,
//           startDate: task.startDate,
//           deadline: task.deadline,
//           status: task.status,
//           ...domainModel,
//         }

//         try {
//           dispatch(setAppStatusAC({ status: "loading" }))
//           const res = await tasksApi.updateTask({ todolistId, taskId, model })
//           dispatch(setAppStatusAC({ status: "succeeded" }))
//           return { task: res.data.data.item }
//         } catch (error) {
//           dispatch(setAppStatusAC({ status: "failed" }))
//           return rejectWithValue(null)
//         }
//       },
//       {
//         fulfilled: (state, action) => {
//           const allTodolistTasks = state[action.payload.task.todoListId]
//           const taskIndex = allTodolistTasks.findIndex((task) => task.id === action.payload.task.id)
//           if (taskIndex !== -1) {
//             allTodolistTasks[taskIndex] = action.payload.task
//           }
//         },
//       },
//     ),
//     changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
//       const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
//       if (task) {
//         task.title = action.payload.title
//       }
//     }),
//   }),
// })

// export const { selectTasks } = tasksSlice.selectors
// export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC } = tasksSlice.actions
// export const tasksReducer = tasksSlice.reducer

// export type TasksState = Record<string, DomainTask[]>
