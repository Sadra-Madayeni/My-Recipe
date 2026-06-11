// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/',
// })
 
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access')
//     if (token) {

//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// export default api



import axios from 'axios'

const api = axios.create({

  baseURL: 'https://myrecipe-3rie1hnd.b4a.run/api/', 
})
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api