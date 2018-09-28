import axios from 'axios'
// import { Loading, Message } from 'element-ui'

const config = {
  baseURL: process.env.API_URL,
  responseType: 'json',
  withCredentials: true, // 跨站点访问
  params: {}
}

const http = axios.create(config)

export default http
