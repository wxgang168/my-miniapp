import permission from '../../utils/permission.js'
import request from '../../utils/request.js'
import DictionaryConstants from '../../utils/dictionaryConstants.js'
import formatDateGlobal from '../../utils/util.js'

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

//获取应用实例
const app = getApp()
Page({
    data: {
        tabs: ["已到账", "未到账"],
        tabIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        form: {
            orderDateBegin: '',
            orderDateEnd: '',
        },
        scrollHeight: 0,
        scorllTop: 0,
        waybillList: [],
        pageNum: 1,
        pageSize: app.globalData.PAGESIZE,
        total: '',
        totalAmount: '',
        isHideRefresh: true,
        isHideLoadMore: false,
    },
    onLoad: function () {
        var that = this;
        permission({name: 'goodsQuery', basePath: '../'}).then(res => {
            this.fetchData();
        })
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: that.data.sliderLeft,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.tabIndex,
                    scrollHeight: res.windowHeight - res.windowWidth / 750 * 355
                });
            }
        });
    },
    fetchData(type){
        var searchSubmit = Object.assign({}, this.data.form)
        if(searchSubmit.orderDateBegin && searchSubmit.orderDateBegin != '' && searchSubmit.orderDateBegin != null && searchSubmit.orderDateBegin != NaN){
            searchSubmit.orderDateBegin = (new Date(searchSubmit.orderDateBegin.replace(/-/g, '/') + ' 00:00:00')).getTime()
        }
        if(searchSubmit.orderDateEnd && searchSubmit.orderDateEnd != '' && searchSubmit.orderDateEnd != null && searchSubmit.orderDateEnd != NaN){
            searchSubmit.orderDateEnd = (new Date(searchSubmit.orderDateEnd.replace(/-/g, '/') + ' 23:59:59')).getTime()
        }
        searchSubmit.pageNum = this.data.pageNum
        searchSubmit.pageSize = this.data.pageSize
        if(this.data.tabIndex == 0){//已到账
            searchSubmit.paymentStatus = [DictionaryConstants.CodPaymentStatus.SUCC]
        }else{//未到账
            searchSubmit.paymentStatus = [DictionaryConstants.CodPaymentStatus.UNPAID, DictionaryConstants.CodPaymentStatus.WAITING, DictionaryConstants.CodPaymentStatus.PROCESSING, DictionaryConstants.CodPaymentStatus.FAIL]
        }
        request('post', '/cod/selectAmountCodAuditList4WX', searchSubmit, res => {
            var tmpWaybillList = Object.assign([], res.rows);
            tmpWaybillList = tmpWaybillList.map(obj => {
                if(obj.paymentTime){
                    obj.paymentTime = formatDateGlobal(obj.paymentTime, 'yyyy-MM-dd hh:mm:ss')
                }
                if(obj.shpTime){
                    obj.shpTime = formatDateGlobal(obj.shpTime, 'yyyy-MM-dd hh:mm:ss')
                }
                return obj;
            })
            this.setData({
                total: res.total || 0,
                totalAmount: res.totalInfo.totalAmount || 0
            })
            if(type == 'loadMore'){
                this.setData({
                    waybillList: this.data.waybillList.concat(tmpWaybillList),
                })
            }else{
                this.setData({
                    waybillList: tmpWaybillList,
                    isHideRefresh: true,
                })
            }
            if(tmpWaybillList.length < app.globalData.PAGESIZE || Math.ceil(res.total/app.globalData.PAGESIZE) == this.data.pageNum){
                this.setData({
                    isHideLoadMore: true
                })
            }
        })
    },
    refresh(){
        this.setData({
            pageNum: 1,
            isHideRefresh: false,
            isHideLoadMore: false,
        })
        this.fetchData();
    },
    loadMore(){
        if(this.data.waybillList.length == 0 || this.data.waybillList.length < this.data.total){
            this.setData({
                pageNum: this.data.pageNum + 1,
                isHideLoadMore: false
            })
            this.fetchData('loadMore')
        }else{
            this.setData({
                isHideLoadMore: true
            })
        }
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            tabIndex: e.currentTarget.id,
            pageNum: 1,
            isHideRefresh: true,
            isHideLoadMore: false,
            scorllTop: 0,
        });
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.fetchData();
    },
    bindDateBeginChange: function(e) {
        this.setData({
            'form.orderDateBegin': e.detail.value,
            pageNum: 1,
            isHideRefresh: true,
            isHideLoadMore: false,
            scorllTop: 0,
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.fetchData();
    },
    bindDateEndChange: function(e) {
        this.setData({
            'form.orderDateEnd': e.detail.value,
            pageNum: 1,
            isHideRefresh: true,
            isHideLoadMore: false,
            scorllTop: 0,
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.fetchData();
    },
});