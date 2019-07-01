//myProfile.js
import WxValidate from '../../../utils/WxValidate.js'
import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'

//获取应用实例
const app = getApp()

const defaultForm = {
    userId: '',
    userCode: '',
    userName: '',
    contractNo: '',
    bankName: '',
    bankAccount: '',
    shipper: '',
    mobileNo: '',
    userAddr: '',
    deptId: '',
    deptName: '',
}
Page({
    data: {
        profileForm: Object.assign({}, defaultForm),
        bankNameList: [],//银行名称列表
        deptList: [],//部门列表
        filterDepts: [],//过滤后的部门列表
    },
    onLoad() {
        var _self = this
        permission({name: 'myProfile', basePath: '../../'}).then(res => {
            this.setData({
                profileForm: Object.assign({}, _self.data.profileForm, app.globalData.userObj)
            })
            // 调用子组件中methods的initShow方法
            this.selectComponent('#bank-name-select').initShow()
        })
        this.initValidate();
        this.fetchSelectList();
    },
    //验证函数
    initValidate() {
        const rules = {
            shipper: {
                required: true,
            },
            mobileNo:{
                required: true,
                tel: true
            },
            bankAccount:{
                digits: true,
                rangelength: [12, 24]
            }
        }
        const messages = {
            shipper: {
                required: '发货人姓名必填',
            },
            mobileNo:{
                required:'发货人手机号必填',
                tel:'发货人手机号格式有误'
            },
            bankAccount:{
                digits:'银行卡号格式有误',
                rangelength:'银行卡号格式有误'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    // 获取下拉框列表
    fetchSelectList() {
        var _self = this
        request('post', '/department/selectDepartmentGoTo', {}, res => {
            _self.setData({
                deptList: res.rows.billDept ||[]
            })
        })
        request('post', '/dictionary/selectDictionaryAllByTypeCodes', {
            typeCodes: ['BankName']
        }, res => {
            _self.setData({
                bankNameList: res.rows.BankName
            })
            // 调用子组件中methods的initShow方法
            this.selectComponent('#bank-name-select').initShow()
        })
    },
    getBankName(e) {
        this.setData({
            'profileForm.bankName': e.detail
        })
    },
    deptFocus(e){
        this.setData({
            showDeptFilter: true,
        })
        this.deptFilter(e)
    },
    deptFilter(e){
        let value = e.detail.value
        if(value && value != ''){
            var tmpFilterDepts = this.data.deptList.filter(obj => {
                return obj.deptName.indexOf(value) > -1 || obj.deptQryChar.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            this.setData({
                filterDepts: tmpFilterDepts,
            })
        }else{
            this.setData({
                filterDepts: this.data.deptList,
            })
        }
    },
    handelDept(e){
        var dept = e.target.dataset.item
        var tmpFilterDepts = this.data.deptList.filter(obj => {
            return obj.deptId == dept.deptId;
        });
        this.setData({
            'profileForm.deptId': dept.deptId,
            'profileForm.deptName': dept.deptName,
            filterDepts: tmpFilterDepts,
            showDeptFilter: false,
        })
    },
    formSubmit(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var _self = this
        var submitData = Object.assign({}, _self.data.profileForm, e.detail.value)
        submitData.bankName = this.data.profileForm.bankName
        submitData.deptId = this.data.profileForm.deptId
        submitData.deptName = this.data.profileForm.deptName
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
        request('post', '/orderRegisterUser/editOrderUser', submitData, res => {
            wx.showToast({
                title: res.msg,
            });
            app.globalData.userObj = res.rows
            _self.setData({
                profileForm: Object.assign({}, res.rows)
            })
        })
        // wx.showModal({
        //     content: '提交成功',
        //     showCancel: false,
        // })
    },
})
