import { baseUrl } from '@/config.js'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || '',
        // 添加以下header解决简单请求的CORS问题
        'X-Requested-With': 'XMLHttpRequest'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        // 更详细的错误处理
        if (err.errMsg.includes('request:fail')) {
          uni.showToast({
            title: '网络请求失败，请检查网络连接',
            icon: 'none'
          })
        }
        reject(err)
      }
    })
  })
}