//index.js
import permission from '../../../utils/permission.js'
//获取应用实例
const app = getApp()

Page({
    data: {
        enterBtns: [
            { key: 'myProfile', label: '我的资料', icon: 'icon-profile', link: '../myProfile/myProfile' },
            { key: 'place', label: '我要下单', icon: 'icon-edit-order', link: '../../order/place/place' },
            { key: 'waybillTracking', label: '运单查询', icon: 'icon-waybill-search', link: '../../order/waybillTracking/waybillTracking' },
            { key: 'orderQuery', label: '我的订单', icon: 'icon-order', link: '../../order/orderQuery/orderQuery' },
            { key: 'goodsQuery', label: '货款查询', icon: 'icon-money', link: '../../goodsQuery/goodsQuery' },
 
          { key: 'consigneeList', label: '收货人信息', icon: 'icon-consignee', link: '../consigneeList/consigneeList' },
          { key: 'commonGoods', label: '常发货物', icon: 'icon-goods', link: '../commonGoods/commonGoods' },
          { key: 'department', label: '附近网点', icon: 'icon-dept', link: '../../dept/department' },
            { key: 'myQRCode', label: '订单提取码', icon: 'icon-qrcode', link: '../myQRCode/myQRCode' },
            /*{ key: 'place', label: '消息推送', icon: 'icon-setting', link: '/order/place' }*/
        ],
        userObj: {},
    },
    onLoad: function () {
        permission({name: 'my', basePath: '../../'}).then(res => {
            this.setData({
                userObj: app.globalData.userObj
            })
        })
    },
})
