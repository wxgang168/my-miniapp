//commonGoods.js
import WxValidate from '../../../utils/WxValidate.js'
import request from '../../../utils/request.js'
import permission from '../../../utils/permission.js'


//获取应用实例
const app = getApp()
const defaultForm = {
  itemDesc: '',
  itemPkg: ''
}

var page = 0;
var page_size = 5;
var loadMore = function (that) {
  var goodsList = that.data.goodsList;
  that.setData({
    hidden: false
  })
  that.setData({
    goodsList: goodsList
  })
  page++
  goodsList.push(that.data.goodsList[0])
  that.setData({
    hidden: true
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    profileForm: Object.assign({}, defaultForm),
    selectArray: [],
    //goodsList: [{ itemDesc: '测试', itemPkg:'纸'}],//常发货物列表（本地测试用）
    goodsList: [],//常发货物列表
    // profileForm: {
    //   itemPkg: {
    //     //这里是为了让select默认显示第一个option值
    //   }
    // },
    showToast: false,
    scrollTop: 0,
    scrollHeight: 0,
    hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var _self = this
    permission({ name: 'commonGoods', basePath: '../../' }).then(res => {
      this.setData({
        profileForm: Object.assign({}, _self.data.profileForm, app.globalData.userObj)
      })
      this.selectPreCustItemAll();//必须放这里面，为了获取openId
    })
    //这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 122

        })
      }
    });
    loadMore(that);
  },
  getItemPkg(e) {
    //console.log(e.detail)
    this.setData({
      'profileForm.itemPkg': e.detail
    })
  },
  scroll: function (e) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: e.detail.scrollTop
    });
  },
  initValidate() {
    const rules = {
      itemDesc: {
        required: true,
      },
      itemPkg: {
        required: true,
      }
    }
    const messages = {
      itemDesc: {
        required: '货物名称必填',
      },
      itemPkg: {
        required: '包装必选',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  selectPreCustItemAll() {
    var _self = this
    request('post', '/preCustItem/selectPreCustItemAll', {}, res => {
      _self.setData({
        goodsList: res.rows
      })
    })
    request('post', '/dictionary/selectDictionaryAllByTypeCodes', { 
        typeCodes: ['PackageType']
    }, res => {
      _self.setData({
        selectArray: res.rows.PackageType
      })
       // 调用子组件中methods的initShow方法
      this.selectComponent('#itemPkg-name-select').initShow()
    })
  },
  formSubmit(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var _self = this
    //Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
    //如果不想要原对象obj发生改变，可以采用如下的方法，让传入的第一个参数为空时，则原对象不发生改变 如下就是
    var submitData = Object.assign({}, _self.data.profileForm, e.detail.value)
    submitData.itemPkg = this.data.profileForm.itemPkg
    //console.log(submitData)
    this.initValidate();
    //校验表单
    if (!this.WxValidate.checkForm(submitData)) {
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
    request('post', '/preCustItem/addPreCustItem', submitData, res => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      });
      app.globalData.userObj = res.rows
      _self.setData({
        profileForm: Object.assign({}, res.rows)
      })
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    })
  },
  delCommonGoods(goodsid) {
    //console.log('删除功能，携带数据为：', goodsid)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    request('post', '/preCustItem/deletePreCustItem', goodsid, res => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      });
    })
  },
  openConfirm: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否删除常用货物信息！',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        //console.log(res);
        if (res.confirm) {
          //console.log(e.currentTarget.dataset.text)
          //delCommonGoods(e.currentTarget.dataset.text)
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          request('post', '/preCustItem/deletePreCustItem', { preItemId: e.currentTarget.dataset.text }, res => {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              success: function () {
                getCurrentPages()[getCurrentPages().length - 1].onLoad()
              },
            });
          })
        } else {
          //console.log('用户点击辅助操作')
        }
      }
    });
  },
})