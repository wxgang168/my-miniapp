//myProfile.js
import WxValidate from '../../../utils/WxValidate.js'
import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'
import DictionaryConstants from '../../../utils/dictionaryConstants.js'

//获取应用实例
const app = getApp()
const defaultForm = {
    consignee: '',
    consigneeMobile: '',
    consigneeAddr: '',
    discDeptId: '',
    discDeptName: '',
    itemPkg: '',
    itemJson: {
        itemDesc: '',
        itemPkg: ''
    },
}
Page({
    data: {
        form: Object.assign({}, defaultForm),
        deptList: [],//部门列表
        filterDepts: [],//过滤后的部门列表
        packageTypes: [],
        preConsigneeId: '',
    },
    onLoad(options) {
        var _self = this
        var tmpId = options.preConsigneeId ? options.preConsigneeId :''
        this.setData({
            preConsigneeId: tmpId
        })
        permission({ name: 'consigneeEdit', basePath: '../../' }).then(() => {
            this.fetchSelectList();
            this.fetchData();
        })
        this.initValidate();
    },
    //验证函数
    initValidate() {
        const rules = {
            consignee: {
                required: true,
            },
            consigneeMobile: {
                required: true,
                tel: true
            },
        }
        const messages = {
            consignee: {
                required: '收货人姓名必填',
            },
            consigneeMobile: {
                required: '收货人手机号必填',
                tel: '收货人手机号格式有误'
            },
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    // 获取下拉框列表
    fetchSelectList() {
        var _self = this
        request('post', '/department/selectDepartmentGoTo', {}, res => {
            _self.setData({
                deptList: res.rows.discDept || []
            })
        })
        request('post', '/dictionary/selectDictionaryAllByTypeCodes', {
            typeCodes: ['PackageType']
        }, res => {
            _self.setData({
                packageTypes: res.rows.PackageType
            })
            // 调用子组件中methods的initShow方法
            this.selectComponent('#item-pkg-select').initShow()
        })
    },
    fetchData(){
        if(this.data.preConsigneeId == ''){//新增
            this.setData({
                form: Object.assign({}, defaultForm)
            })
        } else {//修改
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            request('post', '/preCustConsignee/selectPreCustConsignee', {
                preConsigneeId: this.data.preConsigneeId
            }, res => {
                this.setData({
                  form: Object.assign({}, res.rows)
                })
                // 调用子组件中methods的initShow方法
                this.selectComponent('#item-pkg-select').initShow()
            })
        }
    },
    deptFocus(e) {
        this.setData({
            showDeptFilter: true,
        })
        this.deptFilter(e)
    },
    deptFilter(e) {
        let value = e.detail.value
        if (value && value != '') {
            var tmpFilterDepts = this.data.deptList.filter(obj => {
                return obj.deptName.indexOf(value) > -1 || obj.deptQryChar.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            this.setData({
                filterDepts: tmpFilterDepts,
            })
        } else {
            this.setData({
                filterDepts: this.data.deptList,
            })
        }
    },
    handelDept(e) {
        var dept = e.target.dataset.item
        var tmpFilterDepts = this.data.deptList.filter(obj => {
            return obj.deptId == dept.deptId;
        });
        this.setData({
            'form.discDeptId': dept.deptId,
            'form.discDeptName': dept.deptName,
            filterDepts: tmpFilterDepts,
            showDeptFilter: false,
        })
    },
    getItemPkg(e) {
        this.setData({
            'form.itemPkg': e.detail
        })
    },
    formSubmit(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var _self = this
        var submitData = Object.assign({}, _self.data.form, e.detail.value)
        submitData.discDeptId = this.data.form.discDeptId
        submitData.discDeptName = this.data.form.discDeptName
        submitData.itemPkg = this.data.form.itemPkg
        // itemJson赋值
        submitData.itemJson = JSON.stringify([{
            itemDesc: submitData.itemDesc,
            itemPkg: submitData.itemPkg,
        }])
        console.log(submitData)
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
        if (this.data.preConsigneeId != '') {// 修改
            request('post', '/preCustConsignee/editPreCustConsignee', submitData, res => {
                wx.showToast({
                    title: res.msg,
                });
                // wx.navigateTo({
                //     url: '../consigneeList/consigneeList'
                // })
                wx.navigateBack({
                    delta: 1
                })
            })
        } else {// 新增
            request('post', '/preCustConsignee/addPreCustConsignee', submitData, res => {
                wx.showToast({
                    title: res.msg,
                });
                _self.setData({
                    form: Object.assign({}, defaultForm)
                })
                // 调用子组件中methods的initShow方法
                this.selectComponent('#item-pkg-select').initShow()
            })
        } 
        //wx.showModal({
            //content: '提交成功',
            //showCancel: false,
        //})
    },
})
