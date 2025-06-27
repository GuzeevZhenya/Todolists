// import axios from "axios"

// export const instance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
//     "API-KEY": import.meta.env.VITE_API_KEY,
//   },
//   withCredentials: true,
// })

// import axios from "axios"

// export const instance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
//     "API-KEY": import.meta.env.VITE_API_KEY,
//   },
// })

import axios from "axios"

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer 29335d88-2e13-4491-ac23-5605b0bab0fb`,
    "API-KEY": "0c996da3-8cbb-451a-b885-75cfe34701ae",
  },
})