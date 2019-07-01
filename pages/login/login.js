//logs.js
import WxValidate from '../../utils/WxValidate.js'
import permission from '../../utils/permission.js'
import request from '../../utils/request.js'

//获取应用实例
const app = getApp()
const TIME_COUNT = 60;
Page({
    data: {
        loginForm: {
            username: '',
            password: '',
        },
        timer: null,
        showTime: false,
        count: TIME_COUNT,
    },
    onLoad() {
        permission({name: 'login', basePath: '../'})
        this.initValidate();
    },
    //验证函数
    initValidate() {
        const rules = {
            username:{
                required: true,
                tel: true
            },
            password:{
                required: true,
            }
        }
        const messages = {
            username:{
                required:'请输入手机号',
                tel:'手机号格式有误'
            },
            password:{
                required:'请输入验证码'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    usernameInput(e){
        this.setData({
            'loginForm.username': e.detail.value
        })
    },
    //获取验证码
    fetchVerifyCode(){
        if(this.data.showTime) return
        if (!this.WxValidate.checkForm(this.data.loginForm)) {
            const errors = this.WxValidate.errorList
            for(var i=0; i<errors.length; i++){
                if(errors[i].param == 'username'){
                    wx.showToast({
                        title: errors[i].msg,
                        icon: 'none'
                    });
                    return false
                }
            }
        }
        var _self = this;
        if (!_self.data.timer || _self.data.timer == null) {
            _self.setData({
                count: TIME_COUNT,
                showTime: true,
                timer: setInterval(() => {
                    if (_self.data.count > 0 && _self.data.count <= TIME_COUNT) {
                        _self.setData({
                            count: _self.data.count - 1,
                        })
                    } else {
                        clearInterval(_self.data.timer);
                        _self.setData({
                            showTime: false,
                            timer: null
                        })
                    }
                }, 1000)
            })
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            request('post', '/orderRegisterUser/getPollCode', {
                mobileNo: _self.data.loginForm.username,
                machineId: app.globalData.openId,
                tenantId: app.globalData.tenantId,
                companyId: app.globalData.companyId
            }, res => {
                if(res.code == '200') {
                    wx.showToast({
                        title: res.msg,
                        icon: 'success'
                    });
                }
            })
        }else{
            return;
        }
    },
    //登录
    login(e){
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        //校验表单
        if (!this.WxValidate.checkForm(e.detail.value)) {
            const error = this.WxValidate.errorList[0]
            wx.showToast({
                title: error.msg,
                icon: 'none'
            });
            return false
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        request('post', '/orderRegisterUser/addOrderUser', {
            userCode: e.detail.value.username,
            custMsgNo: e.detail.value.password
        }, res => {
            if(res.code == '200') {
                app.globalData.userObj = res.rows.orderUser
                app.globalData.preCustConsigneeList = res.rows.preCustConsigneeList
                wx.redirectTo({
                    url: "../myInfo/my/my"
                })
            }
        })
    }
})
