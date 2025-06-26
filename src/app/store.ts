import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "./app-reducer"
import { tasksReducer, tasksSlice } from "@/features/todolists/model/tasks-reducer"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolists-reducer"

// объединение reducer'ов с помощью combineReducers

// создание store
export const store = configureStore({
  reducer: {
    [tasksSlice.name]: tasksReducer,
    [todolistsSlice.name]: todolistsReducer,
    [appSlice.name]: appReducer,
  },
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
