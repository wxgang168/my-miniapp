import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'
import formatDateGlobal from '../../../utils/util.js'
const app = getApp()
Page({
    data: {
        orderForm:{},
        orderRouterList:[],
        orderNo: '',
    },
    onLoad: function (options) {
        this.setData({
            orderNo:  options.orderNo ? options.orderNo:'',
        })
        permission({ name: 'waybillRouter', basePath: '../../' }).then(res => {
            this.fetchData() 
        })
    },
    fetchData(){
        var _self = this;
        if(this.data.orderNo != ''){
            request('post', '/followUp/findFollowUpDtlByOrderNo', {
                orderNo: this.data.orderNo
            }, res => {
                var datas = res.rows.eventRouteList;
                for (let i = 0; i < datas.length; i++) {
                    datas[i]['eventTime'] = formatDateGlobal(new Date(datas[i]['eventTime']), 'yyyy-MM-dd hh:mm:ss')
                }
                _self.setData({
                    orderRouterList: datas || [],
                    orderForm: res.rows.orderHdr || {},
                })
            })
        }
    },
});