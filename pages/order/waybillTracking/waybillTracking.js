import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'
import formatDateGlobal from '../../../utils/util.js'
const app = getApp()
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        tabs: ["我的发货", "我的收货"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        orderList:[],
        scrollTop : 0,
        scrollHeight:0,
        searchForm:{},
        pageNum: 1,
        pageSize: app.globalData.PAGESIZE,
        total: '',
        isHideRefresh: true,
        isHideLoadMore: false,   
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: that.data.sliderLeft,
                    scrollHeight: res.windowHeight - 100
                });
            }
        });
        permission({ name: 'waybillTracking', basePath: '../../' }).then(res => {
            this.setData({
                searchForm: Object.assign({},this.data.searchForm,{
                    wxOpenId: app.globalData.userObj.wxOpenId,
                    shipperMobile: app.globalData.userObj.userCode,
                    consigneeMobile: app.globalData.userObj.userCode,
                })
            })
            this.fetchData() 
        })
    },
    fetchData(type){
        var searchForm = Object.assign({}, this.data.searchForm)
        searchForm.pageNum = this.data.pageNum
        searchForm.pageSize = this.data.pageSize
        if(this.data.activeIndex == 0){
            searchForm.consigneeMobile = ''
        }else{
            searchForm.wxOpenId = '';
            searchForm.shipperMobile = ''
        }
        request('post', '/orderHdr/selectOrderHdrListForWeChat', searchForm, res => {
            var datas = res.rows;
            for (let i = 0; i < datas.length; i++) {
                datas[i]['orderDate'] = formatDateGlobal(new Date(datas[i]['orderDate']), 'yyyy-MM-dd  hh:mm:ss')
            }
            this.setData({
                total: res.total || 0
            })
            if(type == 'loadMore'){
                console.log(1)
                this.setData({
                    orderList: this.data.orderList.concat(datas),
                    isHideLoadMore: true
                })
            }else{
                this.setData({
                    orderList: datas,
                    isHideRefresh: true,
                    isHideLoadMore: true,
                })
            }
            if(this.data.orderList.length < app.globalData.PAGESIZE){
                this.setData({
                    orderList: datas,
                    isHideLoadMore: true,
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
        if(this.data.orderList.length == 0 || this.data.orderList.length < this.data.total){
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
            activeIndex: e.currentTarget.id
        });
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.fetchData() 
    },
});