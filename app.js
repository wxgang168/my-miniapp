//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userObj: {},// 个人资料
        preCustConsigneeList: [],// 收货人列表
        appID: 'wxbb452ff9b0b3b4aa',
        appsecret: '0f750998e77242cb8490e58f82033619',
        openId: '',
        access_token: '',
        baseUrl: 'http://39.106.214.34:8027',
        //baseUrl: 'http://192.168.1.168:8026',
        terminal: 'Android',
        tenantId: '101',
        companyId: '1001',
        PAGESIZE: 5,
        PAGESIZE: 5,
        MAXVALUE: 10000,

    }
})