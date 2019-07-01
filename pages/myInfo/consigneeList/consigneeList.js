//index.js
import WxValidate from '../../../utils/WxValidate.js'
import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'

//获取应用实例
const app = getApp()
var page = 0;
var page_size = 5;
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        preConsigneeList: [],
        scrollHeight: 0,
    },
    onLoad() {
        var _self = this
        permission({ name: 'consigneeList', basePath: '../../' }).then(res => {
          //this.selectPreCustConsigneeList();
        })
        wx.getSystemInfo({
          success: function (res) {
            _self.setData({
              scrollHeight: res.windowHeight - res.windowWidth / 750 * 270
            });
          }
        });
        //this.initValidate();
        //this.fetchSelectList();
    },
    onShow(){
        this.selectPreCustConsigneeList();
    },
    //搜索相关
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    // scroll: function (e) {
    //     //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    //     this.setData({
    //         scrollTop: e.detail.scrollTop
    //     });
    // },
    selectPreCustConsigneeList() {
        var _self = this
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        request('post', '/preCustConsignee/selectPreCustConsigneeList', {
            consignee: _self.data.inputVal,
            pageNum: 1,
            pageSize: app.globalData.MAXVALUE
        }, res => {
            _self.setData({
              preConsigneeList: res.rows
            })
        })
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    deleteConsignee(e) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var preConsigneeId = e.currentTarget.dataset.preconsigneeid
        console.log(preConsigneeId)
        request('post', '/preCustConsignee/deletePreCustConsignee', {
            preConsigneeId: preConsigneeId
          }, res => {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            });
        })
        this.selectPreCustConsigneeList();
    },
    editConsignee(e){
        var preConsigneeId = e.currentTarget.dataset.preconsigneeid
        wx.navigateTo({
            url: '../consigneeEdit/consigneeEdit?preConsigneeId=' + preConsigneeId,
        })
    },
    openConfirm: function (e) {
        wx.showModal({
            title: '提示',
            content: '是否删除收货人信息！',
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    this.selectPreCustConsigneeList();
                } else {
                  //console.log('用户点击辅助操作')
                }
            }
        });
    },
    addConsignee(){
        wx.navigateTo({
            url: '../consigneeEdit/consigneeEdit',
        })
    },
})
