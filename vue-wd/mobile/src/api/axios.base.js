import axios from 'axios'

const config = {
  baseURL: process.env.API_URL,
  responseType: 'json',
  withCredentials: true, // 跨站点访问
  params: {},
  isShowLoad: true
}

const http = axios.create(config)

export default http

