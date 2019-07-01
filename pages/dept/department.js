import permission from '../../utils/permission.js'
import request from '../../utils/request.js'
var bmap = require('../../libs/bmap-wx.js')
var wxMarkerData = []
const app = getApp()
Page({
    data: {
        tabs: [ "附近网点列表", "附近网点地图" ],
        tabIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        form: {
            region: ['广东省', '广州市', '海珠区'],
            province: '',
            city: '',
            district: '',
            addrText: '',
            xLong: '',
            yLati: '',
            pageNum: '',
            pageSize: ''
        },
        scrollHeight: 0,
        scorllTop: 0,
        tabsWidth: 0,
        deptList: [],
        pageNum: 1,
        pageSize: app.globalData.PAGESIZE,
        total: '',
        totalAmount: '',
        isHideRefresh: true,
        isHideLoadMore: false,
        localList: [],
        showAddrFilter: false,
        sugData: '',
        latitude: '',
        longitude: '',
        markers: []
    },
    onLoad: function () {
        var that = this;
        permission({name: 'department', basePath: '../'}).then(res => {
            this.fetchMapPrint()
        })
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    tabsWidth: res.windowWidth,
                    sliderLeft: that.data.sliderLeft,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.tabIndex,
                    scrollHeight: res.windowHeight - res.windowWidth / 750 * 290
                })
            }
        })
    },
    // 地图打点
    fetchMapPrint() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var that = this
        // 新建百度地图对象
        var BMap = new bmap.BMapWX({
            ak: 'MqMYP3GQubbuBxvrV6FkTHnyoBYtjcE5'
        });
        var fail = function(data) {
            console.log(data)
        };
        var success = function(data) {
            wx.hideLoading()
            wxMarkerData = data.wxMarkerData
            that.setData({
                'form.province': data.originalData.result.addressComponent.province,
                'form.city': data.originalData.result.addressComponent.city,
                'form.district': data.originalData.result.addressComponent.district,
                'form.xLong': wxMarkerData[0].longitude,
                'form.yLati': wxMarkerData[0].latitude,
                'form.region[0]': data.originalData.result.addressComponent.province,
                'form.region[1]': data.originalData.result.addressComponent.city,
                'form.region[2]': data.originalData.result.addressComponent.district,
            })
            that.fetchDeptList()
        }
        BMap.regeocoding({   
            fail: fail,   
            success: success  
        })
    },
    // 获取所有网点
    fetchDeptList(type) {
        this.setData({
            showAddrFilter: false
        })
        var searchSubmit = Object.assign({}, this.data.form)
        searchSubmit.pageNum = this.data.pageNum
        searchSubmit.pageSize = this.data.pageSize
        if(type != undefined && type != 'loadMore') {
            searchSubmit.addrText = type.detail.value.addrText,
            searchSubmit.province = type.detail.value.region[0],
            searchSubmit.city = type.detail.value.region[1],
            searchSubmit.district = type.detail.value.region[2]
        }
        request('post', '/department/selectDepartmentByAreaLocation', searchSubmit, res => {
            this.setData({
                total: res.total || 0,
                totalAmount: res.totalInfo || 0
            })
            if(type == 'loadMore') {
                this.setData({
                    deptList: this.data.deptList.concat(res.rows),
                })
            }else {
                this.setData({
                    deptList: res.rows || [],
                    isHideRefresh: true,
                    longitude: res.rows[0].xLong,
                    latitude: res.rows[0].yLati
                })
            }
            if(res.rows.length < app.globalData.PAGESIZE || Math.ceil(res.total/app.globalData.PAGESIZE) == this.data.pageNum) {
                this.setData({
                    isHideLoadMore: true
                })
            }
        })
    },
    // 获取所有点
    fetchPrintList() {
        request('post', '/department/selectDepartmentByCoordinate', {}, res => {
            this.setData({
                markers: res.rows.map(item => {
                    return {
                        longitude: item.xLong,
                        latitude: item.yLati
                    }
                })
            })
        })
    },
    refresh() {
        this.setData({
            pageNum: 1,
            isHideRefresh: false,
            isHideLoadMore: false,
        })
        this.fetchDeptList()
    },
    loadMore() {
        if(this.data.deptList.length == 0 || this.data.deptList.length < this.data.total) {
            this.setData({
                pageNum: this.data.pageNum + 1,
                isHideLoadMore: false
            })
            this.fetchDeptList('loadMore')
        }else {
            this.setData({
                isHideLoadMore: true
            })
        }
    },
    tabClick: function (e) {
        if(e.currentTarget.id == '1') {
            this.setData({
                sliderOffset: e.currentTarget.offsetLeft,
                tabIndex: e.currentTarget.id
            })
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.fetchPrintList()
        } else {
            this.setData({
                sliderOffset: e.currentTarget.offsetLeft,
                tabIndex: e.currentTarget.id,
                pageNum: 1,
                isHideRefresh: true,
                isHideLoadMore: false,
                scorllTop: 0,
            })
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.fetchDeptList()
        }
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
        this.fetchDeptList()
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
        this.fetchDeptList()
    },
    // 到这里去
    goMap(item) {
        this.setData({
            sliderOffset: this.data.tabsWidth / 2,
            tabIndex: '1',
            latitude: this.data.form.yLati,
            longitude: this.data.form.xLong,
            markers: [{
                latitude: item.currentTarget.dataset.item.yLati,
                longitude: item.currentTarget.dataset.item.xLong,
            }]
        })
    },
    // 点击地图操作
    makertap: function(e) { 
        var that = this; 
        var id = e.markerId; 
        that.showSearchInfo(wxMarkerData, id); 
        that.changeMarkerColor(wxMarkerData, id); 
    },
    // 选择省市区
    bindRegionChange(e) {
        this.setData({
            'form.region': e.detail.value
        })
    },
    // 输入详细地址
    bindKeyInput: function(e) {
        var that = this;
        if (e.detail.value === '') {
            that.setData({
                sugData: ''
            })
            return
        }
        var BMap = new bmap.BMapWX({
            ak: 'MqMYP3GQubbuBxvrV6FkTHnyoBYtjcE5'
        });
        var fail = function(data) {
            console.log(data)
        };
        var success = function(data) {
            that.setData({
                localList: data.result,
                showAddrFilter: true
            })
        }
        BMap.suggestion({
            query: e.detail.value,
            region: this.data.form.province,
            city_limit: false,
            location: [this.data.form.yLati, this.data.form.xLong],
            fail: fail,
            success: success
        })
    },
    // 输入检索
    viewTap(item) {
        this.setData({
            item: item.currentTarget.dataset.item,
            'form.addrText': item.currentTarget.dataset.item.name,
            'form.yLati': item.currentTarget.dataset.item.location.lat,
            'form.xLong': item.currentTarget.dataset.item.location.lng,
            'form.province': item.currentTarget.dataset.item.province,
            'form.city': item.currentTarget.dataset.item.city,
            'form.district': item.currentTarget.dataset.item.district,
            'form.region[0]': item.currentTarget.dataset.item.province,
            'form.region[1]': item.currentTarget.dataset.item.city,
            'form.region[2]': item.currentTarget.dataset.item.district,
            showAddrFilter: false
        })
    }
})