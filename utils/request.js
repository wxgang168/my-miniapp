/**
 * wx.request() post请求封装
 * @param {*} method get、post请求
 * @param {*} url 网络请求的url
 * @param {*} data 请求参数
 * @param {*} success 成功的回调函数
 * @param {*} fail 失败的回调
 */
//获取应用实例
const app = getApp()
function request(method, url, data, success, fail) {
    // 获取当前页路由
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var tmpRoutes = currentPage.route.split('\/')
    var currentPageName = tmpRoutes[tmpRoutes.length - 1]
    // content-type
    var contentType = ''
    if(method == 'post'){
        contentType = 'application/x-www-form-urlencoded'
    }else if(method == 'get'){
        contentType = 'application/json'
    }
    // 发起请求
    wx.request({
        url: app.globalData.baseUrl + url,
        data: data,
        header: {
            'content-type': contentType,
            'openid': app.globalData.openId,
            'terminal': app.globalData.terminal,
            'module': data.module || currentPageName
        },
        method: method,
        success: function (res) {
            wx.hideLoading()
            if(res.data.code == '200'){
                success(res.data)
            }else{
                wx.hideLoading()
                wx.showModal({
                    content: res.data.msg,
                    showCancel: false,
                })
            }
        },
        fail: function (error) {
            wx.hideLoading()
            wx.showModal({
                content: error.response.data.message,
                showCancel: false,
            })
        },
        complete: function (res) {
            wx.hideLoading()
        },
    })
}

export default request