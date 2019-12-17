const baseUrl = 'http://134.175.224.127:7003'

const request = (url) => {
  let promise = new Promise((resolve, reject) => {
    uni.showLoading({
      title: '加载中'
    });
    uni.request({
      url: baseUrl+url
    }).then((res) => {
      uni.hideLoading()
      resolve(res[1].data)
    }).catch((response) => {
      uni.hideLoading()
      reject(response)
    })
  })
  return promise
}

export default request;