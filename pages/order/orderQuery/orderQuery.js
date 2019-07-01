import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'
import formatDateGlobal from '../../../utils/util.js'
import DictionaryConstants from '../../../utils/dictionaryConstants.js'
const app = getApp()
Page({
    data: {
        index: 0,
        preOrderDate: formatDateGlobal(new Date(), 'yyyy-MM-dd'),
        orderList:[],
        scrollTop: 0,
        scrollHeight :0,
        hidden: true,
        pageNum: 1,
        pageSize: app.globalData.PAGESIZE,
        total: '',
        searchForm: {
            preOrderDateBgn: '',
            preOrderDateEnd: ''
        },
        isHideRefresh: true,
        isHideLoadMore: false,
    },
    onLoad: function () {
        var that = this;
        permission({ name: 'orderQuery', basePath: '../../' }).then(res => {
            that.setData({
                searchForm: Object.assign({}, that.data.searchForm,{
                    wxOpenId: app.globalData.userObj.wxOpenId,
                })
            })
            this.fetchData() 
        })
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    scrollHeight: res.windowHeight - 50
                });
            }
        });   
    },
    // 获取我的订单列表
    fetchData(type) {
        var searchForm = Object.assign({}, this.data.searchForm)
        searchForm.pageNum = this.data.pageNum
        searchForm.pageSize = this.data.pageSize
        if(this.data.preOrderDate && this.data.preOrderDate != '' && this.data.preOrderDate != null && this.data.preOrderDate != NaN){
            searchForm.preOrderDateBgn = (new Date(this.data.preOrderDate.replace(/-/g, '/') + ' 00:00:00')).getTime()
            searchForm.preOrderDateEnd = (new Date(this.data.preOrderDate.replace(/-/g, '/') + ' 23:59:59')).getTime()
        }
        request('post', '/preOrderHdr/selectPreOrderHdrList', searchForm, res => {
            var datas = res.rows;
            for (let i = 0; i < datas.length; i++) {
                datas[i]['preOrderDate'] = formatDateGlobal(new Date(datas[i]['preOrderDate']), 'yyyy-MM-dd hh:mm:ss')
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
    bindDateChange: function(e) {
        this.setData({
            preOrderDate: e.detail.value,
            pageNum: 1,
            isHideRefresh: true,
            isHideLoadMore: false,
            scorllTop: 0,
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.fetchData()
    },
    openConfirm: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '是否确定删除订单信息！',
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    request('post', '/preOrderHdr/cancelPreOrderHdr', {preOrderIds:id}, res => {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            success: function () {
                                that.fetchData()
                            }
                        });
                    })
                    
                }else{
                    console.log('用户点击辅助操作')
                }
            }
        });
    },
});