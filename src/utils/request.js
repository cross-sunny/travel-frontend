import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: 'http://localhost:8080', // 后端地址
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response => {
    let res = response.data;
    // 如果返回的是文件流，直接返回
    if (response.config.responseType === 'blob') {
        return res
    }
    // 兼容字符串数据
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res
    }
    // 统一处理错误 (假设后端 code 200 是成功)
    if (res.code !== '200') {
        ElMessage.error(res.msg || '网络异常')
        return Promise.reject(res.msg)
    }
    return res.data;
}, error => {
    console.log('err' + error)
    ElMessage.error(error.message)
    return Promise.reject(error)
})

export default request