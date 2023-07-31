// axios 公共配置
// 基地址
axios.defaults.baseURL = 'http://geek.itheima.net'

// 请求拦截器
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('token')
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
},function (error) {
    return Promise.reject(error)
})
axios.interceptors.response.use(function (response){
    // response = response.data
    return response
},function (error) {
    console.log(error)
    if(error?.response?.status === 401){
        console.log('登录失败，请重新登录')
    }
    return Promise.reject(error)
})

