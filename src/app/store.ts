import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { appReducer } from "./app-reducer"
import { tasksReducer } from "@/features/todolists/model/tasks-reducer"
import { todolistsReducer } from "@/features/todolists/model/todolists-reducer"

// объединение reducer'ов с помощью combineReducers

// создание store
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
  },
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
