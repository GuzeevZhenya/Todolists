import { createAction, createAsyncThunk, createReducer, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"
import { createAppSlice } from "@/common/utils/createAppSlice"

export type FilterValues = "all" | "active" | "completed"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),
      fetchTodolists: create.asyncThunk(
        async (arg, thunkAPI) => {
          try {
            const res = await todolistsApi.getTodolists()
            console.log(res)

            return { todolists: res.data }
          } catch (error) {
            return thunkAPI.rejectWithValue({
              message: error instanceof Error ? error.message : "Unknown error",
            })
          }
        },
        {
          fulfilled: (state, action) => {
            return action.payload?.todolists.map((el) => ({
              ...el,
              filter: "all" as FilterValues,
              entityStatus: "idle",
            }))
          },
        },
      ),
      deleteTodolists: create.asyncThunk(
        async (id: string, thunkAPI) => {
          try {
            const res = await todolistsApi.deleteTodolist(id)
            console.log("Delete response:", res)

            if (res.data.resultCode === 0) {
              console.log("Delete successful")
              return { id }
            } else {
              console.warn("Server returned error:", res.data)
              return thunkAPI.rejectWithValue(res.data)
            }
          } catch (error) {
            console.error("Delete failed:", error)
            return thunkAPI.rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
          },
        },
      ),
      addTodolists: create.asyncThunk(
        async (title: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            const res = await todolistsApi.createTodolist(title)

            return { todolist: res.data.data.item }
          } catch (error: any) {
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const newTodolist: DomainTodolist = {
              ...action.payload.todolist,
              filter: "all",
            }
            state.unshift(newTodolist)
          },
        },
      ),
      changeTodolistTitleTC: create.asyncThunk(
        async (data: { id: string; title: string }, thunkAPI) => {
          try {
            await todolistsApi.changeTodolistTitle(data)
            return { id: data.id, title: data.title }
          } catch (error) {
            return thunkAPI.rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          },
        },
      ),
    }
  },
})

export const todolistsReducer = todolistsSlice.reducer
export const { changeTodolistFilterAC, fetchTodolists, deleteTodolists, addTodolists, changeTodolistTitleTC } =
  todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}
