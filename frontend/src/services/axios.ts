// src/libs/axios.ts
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true, // ส่ง cookie ไปด้วย (กรณี auth)
})


export default instance
