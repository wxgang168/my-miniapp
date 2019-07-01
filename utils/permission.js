/**
 * 登录拦截  
 */
import request from 'request.js'
//获取应用实例
const app = getApp()
const whiteList = ['waybillSearch', 'waybillRouter', 'department'] // 不用绑定手机号的白名单
function permission(route){
    return new Promise((resolve, reject) => {
        if(wx.getStorageSync('openId') && wx.getStorageSync('openId') != null && wx.getStorageSync('openId') != ''){
            app.globalData.openId = wx.getStorageSync('openId')
            app.globalData.access_token = wx.getStorageSync('access_token')
            if(whiteList.indexOf(route.name) == -1){
                request('post', '/orderRegisterUser/selectOrderUserByOpenId', {
                    orderRegisterUser: app.globalData.openId
                }, res => {
                    if(res.rows == null){//未绑定手机号
                        if(route.name != 'login'){
                            wx.redirectTo({
                                url: route.basePath + "login/login"
                            })
                        }
                    }else{//已绑定手机号
                        app.globalData.userObj = res.rows.orderUser
                        app.globalData.preCustConsigneeList = res.rows.preCustConsigneeList
                        if(route.name == 'login'){
                            wx.redirectTo({
                                url: route.basePath + "myInfo/my/my"
                            })
                        }
                    }
                    resolve(res)
                })
            }else{
                resolve()
            }
        }else{
            // 登录
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + app.globalData.appID + '&secret='+ app.globalData.appsecret +'&code='+ res.code +'&grant_type=authorization_code'
                    wx.request({
                        url: 'http://query.yahooapis.com/v1/public/yql',
                        dataType: 'jsonp',
                        data:{
                            q: "select * from json where url=\'" + url + "'",
                            format: "json"
                        },
                        method:'get',
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            let data = JSON.parse(res.data).query.results.json
                            app.globalData.openId = data.openid
                            wx.setStorageSync('openId', data.openid)
                            app.globalData.access_token = data.access_token
                            wx.setStorageSync('access_token', data.access_token)
                            if(whiteList.indexOf(route.name) == -1){
                                request('post', '/orderRegisterUser/selectOrderUserByOpenId', {
                                    orderRegisterUser: app.globalData.openId
                                }, res => {
                                    if(res.rows == null){//未绑定手机号
                                        if(route.name != 'login'){
                                            wx.redirectTo({
                                                url: "../pages/login/login"
                                            })
                                        }
                                    }else{//已绑定手机号
                                        app.globalData.userObj = res.rows.orderUser
                                        app.globalData.preCustConsigneeList = res.rows.preCustConsigneeList
                                    }
                                    resolve(res)
                                })
                            }else{
                                resolve()
                            }
                        }
                    })
                }
            })
        }
    })
}

export default permission