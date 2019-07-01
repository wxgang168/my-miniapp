import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'
import DictionaryConstants from '../../../utils/dictionaryConstants.js'
import formatDateGlobal from '../../../utils/util.js'
var sliderWidth = '50%'; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
Page({
    data: {
        tabs: ["运单详情", "运单路由"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        orderForm: {},
        orderRouterList:[],
        orderNo: '',
        preOrderId: '',
        preOrderStatus: '',
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '运单详情'
        })
        var that = this;
        that.setData({
            preOrderId: options.preOrderId ? options.preOrderId:'',
            orderNo:  options.orderNo ? options.orderNo:'',
            preOrderStatus:  options.preOrderStatus ? options.preOrderStatus:'', 
        })
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        permission({ name: 'orderDetails', basePath: '../../' }).then(res => {
            this.fetchData() 
        })
    },
    fetchData(){
        var _self = this;
        if(this.data.preOrderId != '' && this.data.orderNo == ''){
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            request('post', '/preOrderHdr/selectPreOrderHdrByPreOrderId', {
                preOrderId: this.data.preOrderId
            }, res => {
                let orderForm = Object.assign({}, res.rows);
                _self.setData({
                    orderForm: orderForm
                })
            })
        }else if(this.data.preOrderId != '' && this.data.orderNo != ''){
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            request('post', '/orderHdr/selectOrderHdrByOrderNo', {
                orderNo: this.data.orderNo
            }, res => {
                let orderForm = Object.assign({}, res.rows);
                _self.setData({
                    orderForm: orderForm
                })
            })
        }
    },
    tabClick: function (e) {
        var _self = this;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        if(e.currentTarget.id == 1){
            if(_self.data.orderRouterList.length == 0 || !_self.data.orderRouterList){
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                request('post', '/eventRoute/selectEventRouteByOrderNo', {
                    orderNo: this.data.orderNo
                }, res => {
                    var datas = res.rows;
                    for (let i = 0; i < datas.length; i++) {
                        datas[i]['eventTime'] = formatDateGlobal(new Date(datas[i]['eventTime']), 'yyyy-MM-dd hh:mm:ss')
                    }
                    _self.setData({
                        orderRouterList: datas || []
                        
                    })
                })
            } 
        }else{
            this.fetchData()
        }
    }
});