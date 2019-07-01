import WxValidate from '../../../utils/WxValidate.js'
import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'
const app = getApp()
Page({
    data: {
        orderNo: "",
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        });
        permission({ name: 'waybillSearch', basePath: '../../' })
        this.initValidate();
    },
    //验证函数
    initValidate() {
        const rules = {
            orderNo:{
                required: true,
                digits: true
            },
        }
        const messages = {
            orderNo:{
                required:'请输入运单号！',
                digits:'运单号格式有误！'
            },
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    formSubmit(e){
        var orderNo = e.detail.value.orderNo
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
        request('post', '/followUp/findFollowUpDtlByOrderNo', {orderNo: orderNo}, res => {
            if(res.code == '200'){
                wx.navigateTo({
                    url: "../waybillRouter/waybillRouter?orderNo=" + orderNo,
                })
            }else{
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
                return false
            }
        })
    }
});