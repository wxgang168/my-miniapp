//place.js
import WxValidate from '../../../utils/WxValidate.js'
import DictionaryConstants from '../../../utils/dictionaryConstants.js'
import permission from '../../../utils/permission.js'
import request from '../../../utils/request.js'

//获取应用实例
const app = getApp()

Page({
    data: {
        defaultForm: {
            preOrderId: '',
            shipper: '',
            shipperMobile: '',
            contractNo: '',
            bankName: '',
            bankAccount: '',
            contractName: '',
            billDeptId: '',
            billDeptName: '',
            forReceive: '0',
            shipperAddr: '',
            consignee: '',
            consigneeMobile: '',
            discDeptId: '',
            discDeptName: '',
            destDeptName: '',
            forDelivery: '0',
            deliveryType: DictionaryConstants.DeliveryType.DELIVERY_TYPE_SH,
            consigneeAddr: '',
            itemDesc: '',
            itemQty: '',
            itemPkg: DictionaryConstants.PackageType.PAPER,
            itemKgs: '',
            itemCbm: '',
            amountFreight: 0,
            amountFreightPt: DictionaryConstants.AmountPaidType.PAY_TYPE_TF,
            amountCodService: DictionaryConstants.AmountCodService.NORMAL,
            amountBxf: '',
            amountOts1: 1,
            amountOts1Pt: DictionaryConstants.AmountPaidType.PAY_TYPE_TF,
            forHd: '0',
            hdType: DictionaryConstants.HdMode.HDMODE_TYD,
            hdCount: 1,
            customerRemark: '',
            itemJson: {
                itemDesc: '',
                itemQty: '',
                itemPkg: '',
                itemKgs: '',
                itemCbm: ''
            }   
        },
        form: {},
        userObj: {},
        showConsigneeFilter: false,
        consigneeList: [], // 收货人列表
        filterConsigneeList: [], // 过滤后的收货人列表
        showBillFilter: false,
        billDeptList: [], // 发货网点列表
        filterBillDepts: [], // 过滤后的发货网点列表
        showDiscFilter: false,
        discDeptList: [], // 到达地列表
        filterDiscDepts: [], // 过滤后的到达地列表
        sendBtn: false,
        goodsBtn: false,
        commonGood: {}, // 选中的货物
        commonGoodsList: [{
            itemDesc: '汽车配件',
            itemPkg: '10901'
        },{
            itemDesc: '日用品',
            itemPkg: '10902'
        },{
            itemDesc: '电子产品',
            itemPkg: '10903'
        },{
            itemDesc: '手机',
            itemPkg: '10904'
        },{
            itemDesc: '电脑',
            itemPkg: '10901'
        },{
            itemDesc: '电器',
            itemPkg: '10901'
        },{
            itemDesc: '食品',
            itemPkg: '10901'
        },{
            itemDesc: '化妆品',
            itemPkg: '10901'
        }], // 常发货物列表
        deliveryTypes: [],
        packageTypes: [],
        amountFreightPts: [],
        amountCodServices: [],
        hdTypes: [],
        preOrderId: '',// 修改时，传递的订单ID
        billDeptId: '',// 附近网点跳转时，传递的开票网点ID
        billDeptName: '',// 附近网点跳转时，传递的开票网点Name
    },
    onLoad(options) {
        this.setData({
            preOrderId: options.preOrderId ? options.preOrderId : '',
            billDeptId: options.billDeptId ? options.billDeptId : '',
            billDeptName: options.billDeptName ? options.billDeptName : '',
        })
        permission({name: 'place', basePath: '../../'}).then(res => {
            let tmpCommonGoods = this.data.commonGoodsList
            if(app.globalData.commonGoodsList && app.globalData.commonGoodsList.length > 0){
                tmpCommonGoods = app.globalData.commonGoodsList
            }
            this.setData({
                userObj: app.globalData.userObj,
                consigneeList: app.globalData.preCustConsigneeList,
                commonGoodsList: tmpCommonGoods
            })
          console.log(this.data.consigneeList)
            this.fetchData();
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
            shipperMobile: {
                required: true,
                tel: true
            },
            shipperAddr: {
                shipperAddr: true,
            },
            consignee: {
                required: true,
            },
            consigneeMobile:{
                required: true,
                tel: true
            },
            consigneeAddr: {
                consigneeAddr: true
            },
            itemDesc: {
                required: true,
            },
            itemQty: {
                required: true,
            },
            itemPkg: {
                required: true,
            },
            hdCount: {
                hdCount: true,
            }
        }
        const messages = {
            shipper: {
                required: '发货人必填',
            },
            shipperMobile:{
                required:'发货人手机号必填',
                tel:'发货人手机号格式有误'
            },
            consignee: {
                required: '收货人必填',
            },
            consigneeMobile:{
                required:'收货人手机号必填',
                tel:'收货人手机号格式有误'
            },
            itemDesc: {
                required: '货物名称必填',
            },
            itemQty: {
                required: '货物数量必填',
            },
            itemPkg: {
                required: '货物包装必填',
            },
        }
        this.WxValidate = new WxValidate(rules, messages)// 自定义验证规则
        var _self = this
        this.WxValidate.addMethod('shipperAddr', (value, param) => {
            if(_self.data.form.forReceive || _self.data.form.forReceive == '1'){//接货
                if(value && value != null && value != ''){
                    return true
                }else{
                    return false
                }
            }else{
                return true
            }
        }, '接货必须录入接货地址')
        this.WxValidate.addMethod('consigneeAddr', (value, param) => {
            if(_self.data.form.forDelivery || _self.data.form.forDelivery == '1'){//接货
                if(value && value != null && value != ''){
                    return true
                }else{
                    return false
                }
            }else{
                return true
            }
        }, '送货必须录入送货地址')
        this.WxValidate.addMethod('hdCount', (value, param) => {
            if(_self.data.form.forHd || _self.data.form.forHd == '1'){//接货
                if(value && value != null && value != ''){
                    return true
                }else{
                    return false
                }
            }else{
                return true
            }
        }, '带回单必须录入回单数量')
    },
    // 获取下拉框列表
    fetchSelectList() {
        var _self = this
        request('post', '/department/selectDepartmentGoTo', {}, res => {
            _self.setData({
                billDeptList: res.rows.billDept || [],
                discDeptList: res.rows.discDept || []
            })
        })
        request('post', '/dictionary/selectDictionaryAllByTypeCodes', {
            typeCodes: ['PackageType', 'HdMode', 'DeliveryType', 'AmountCodService', 'AmountPaidType']
        }, res => {
            _self.setData({
                deliveryTypes: res.rows.DeliveryType.filter(obj => {
                    return obj.dictionaryCode != DictionaryConstants.DeliveryType.DELIVERY_TYPE_KHZT
                }),
                packageTypes: res.rows.PackageType,
                amountCodServices: res.rows.AmountCodService,
                amountFreightPts: res.rows.AmountPaidType.filter(obj => {
                    var showCodes = [
                        DictionaryConstants.AmountPaidType.PAY_TYPE_XF,
                        DictionaryConstants.AmountPaidType.PAY_TYPE_KF,
                        DictionaryConstants.AmountPaidType.PAY_TYPE_XFYJ,
                        DictionaryConstants.AmountPaidType.PAY_TYPE_HDF,
                    ]
                    return showCodes.indexOf(obj.dictionaryCode) > -1
                }),
                hdTypes: res.rows.HdMode
            })
            // 调用子组件中methods的initShow方法
            this.selectComponent('#item-pkg-select').initShow()
            this.selectComponent('#hd-mode-select').initShow()
        })
    },
    // 初始化数据
    fetchData(){
        if(this.data.preOrderId != ''){// 修改
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            request('post', '/preOrderHdr/selectPreOrderHdrByPreOrderId', {
                preOrderId: this.data.preOrderId
            }, res => {
                var tmpDefaultForm = Object.assign({}, res.rows);
                tmpDefaultForm.itemJson = JSON.parse(res.rows.itemJson)
                for(var key in this.data.defaultForm.itemJson){
                    tmpDefaultForm[key] = tmpDefaultForm.itemJson[0][key]
                }
                tmpDefaultForm.forDelivery = this.parseSwitch(tmpDefaultForm.forDelivery)
                tmpDefaultForm.forReceive = this.parseSwitch(tmpDefaultForm.forReceive)
                tmpDefaultForm.forHd = this.parseSwitch(tmpDefaultForm.forHd)
                this.setData({
                    defaultForm: Object.assign({}, tmpDefaultForm),
                    form: Object.assign({}, tmpDefaultForm)
                })
                // 调用子组件中methods的initShow方法
                this.selectComponent('#item-pkg-select').initShow()
                this.selectComponent('#hd-mode-select').initShow()
            })
        }else{// 新增
            let tmpForm = {
                contractNo: this.data.userObj.contractNo || '',
                bankName: this.data.userObj.bankName || '',
                bankAccount: this.data.userObj.bankAccount || '',
                contractName: this.data.userObj.userName || '',
                shipper: this.data.userObj.shipper || '',
                shipperMobile: this.data.userObj.mobileNo || '',
                billDeptId: this.data.userObj.deptId || '',
                billDeptName: this.data.userObj.deptName || '',
                shipperAddr: this.data.userObj.userAddr || '',
            }
            if(this.data.billDeptId != '' && this.data.billDeptName != ''){
                tmpForm.billDeptId = this.data.billDeptId
                tmpForm.billDeptName = this.data.billDeptName
            }
            var tmpDefaultForm = Object.assign({}, this.data.defaultForm, tmpForm)
            tmpDefaultForm.forDelivery = this.parseSwitch(tmpDefaultForm.forDelivery)
            tmpDefaultForm.forReceive = this.parseSwitch(tmpDefaultForm.forReceive)
            tmpDefaultForm.forHd = this.parseSwitch(tmpDefaultForm.forHd)
            this.setData({
                defaultForm: Object.assign({}, tmpDefaultForm),
                form: Object.assign({}, tmpDefaultForm)
            })
            // 调用子组件中methods的initShow方法
            this.selectComponent('#item-pkg-select').initShow()
            this.selectComponent('#hd-mode-select').initShow()
        }
    },
    getHdType(e) {
        this.setData({
            'form.hdType': e.detail
        })
    },
    getItemPkg(e) {
        this.setData({
            'form.itemPkg': e.detail
        })
    },
    //收货人姓名自动匹配
    consigneeNameFocus(e){
        this.setData({
            showConsigneeFilter: true,
        })
        this.consigneeNameFilter(e)
    },
    consigneeNameFilter(e){
        let value = e.detail.value
        if(value && value != ''){
            var tmpFilterConsignees = this.data.consigneeList.filter(obj => {
                return obj.consignee.indexOf(value) > -1
            });
            this.setData({
                filterConsigneeList: tmpFilterConsignees,
            })
        }else{
            this.setData({
                filterConsigneeList: this.data.consigneeList,
            })
        }
    },
    handelConsignee(e){
        var consignee = e.currentTarget.dataset.item
        var tmpFilterConsignees = this.data.consigneeList.filter(obj => {
            return obj.consignee == consignee.consignee;
        });
        this.setData({
            'form.consignee': consignee.consignee ? consignee.consignee : '',
            'form.consigneeMobile': consignee.consigneeMobile ? consignee.consigneeMobile : '',
            'form.consigneeAddr': consignee.consigneeAddr ? consignee.consigneeAddr : '',
            'form.itemDesc': consignee.itemDesc ? consignee.itemDesc : '',
            'form.itemPkg': consignee.itemPkg ? consignee.itemPkg : '',
            filterConsigneeList: tmpFilterConsignees,
            showConsigneeFilter: false,
        })
        if(!this.data.form.discDeptId || this.data.form.discDeptId == '' || this.data.form.discDeptId == null){
            this.setData({
                'form.discDeptId': consignee.discDeptId ? consignee.discDeptId : '',
                'form.discDeptName': consignee.discDeptName ? consignee.discDeptName : '',
            })
        }
    },
    //开票部门自动匹配
    billFocus(e){
        this.setData({
            showBillFilter: true,
        })
        this.billFilter(e)
    },
    billFilter(e){
        let value = e.detail.value
        if(value && value != ''){
            var tmpFilterBillDepts = this.data.billDeptList.filter(obj => {
                return obj.deptName.indexOf(value) > -1 || obj.deptQryChar.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            this.setData({
                filterBillDepts: tmpFilterBillDepts,
            })
        }else{
            this.setData({
                filterBillDepts: this.data.billDeptList,
            })
        }
    },
    handelBillDept(e){
        var dept = e.target.dataset.item
        var tmpFilterBillDepts = this.data.billDeptList.filter(obj => {
            return obj.deptId == dept.deptId;
        });
        this.setData({
            'form.billDeptId': dept.deptId,
            'form.billDeptName': dept.deptName,
            filterBillDepts: tmpFilterBillDepts,
            showBillFilter: false,
        })
    },
    //运达部门自动匹配
    discFocus(e){
        this.setData({
            showDiscFilter: true,
        })
        this.discFilter(e)
    },
    discFilter(e){
        let value = e.detail.value
        if(value && value != ''){
            var tmpFilterDiscDepts = this.data.discDeptList.filter(obj => {
                return obj.deptName.indexOf(value) > -1 || obj.deptQryChar.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            this.setData({
                filterDiscDepts: tmpFilterDiscDepts,
            })
        }else{
            this.setData({
                filterDiscDepts: this.data.discDeptList,
            })
        }
    },
    handelDiscDept(e){
        var dept = e.target.dataset.item
        var tmpFilterDiscDepts = this.data.discDeptList.filter(obj => {
            return obj.deptId == dept.deptId;
        });
        this.setData({
            'form.discDeptId': dept.deptId,
            'form.discDeptName': dept.deptName,
            filterDiscDepts: tmpFilterDiscDepts,
            showDiscFilter: false,
        })
    },
    checkSend() {
        var tmpSendBtn = !this.data.sendBtn
        this.setData({
            sendBtn: tmpSendBtn
        })
    },
    checkGoods() {
        var tmpGoodsBtn = !this.data.goodsBtn
        this.setData({
            goodsBtn: tmpGoodsBtn
        })
    },
    commonGoodClick(e) {
        var goods = e.currentTarget.dataset.item;
        this.setData({
            'form.itemDesc': goods.itemDesc,
            'form.itemPkg': goods.itemPkg
        })
        // 调用子组件中methods的initShow方法
        this.selectComponent('#item-pkg-select').initShow()
    },
    // 选取送货类型
    checkDeliveryType(e) {
        this.setData({
            'form.deliveryType': e.target.dataset.value
        })
    },
    // 选取代收时效
    checkAmountCodService(e) {
        this.setData({
            'form.amountCodService': e.target.dataset.value
        })
    },
    // 选取运费结算方式
    checkAmountPaidType(e) {
        this.setData({
            'form.amountFreightPt': e.target.dataset.value
        })
    },
    forReceiveChange(e){
        this.setData({
            'form.forReceive': e.detail.value
        })
    },
    forDeliveryChange(e){
        this.setData({
            'form.forDelivery': e.detail.value
        })
    },
    forHdChange(e){
        this.setData({
            'form.forHd': e.detail.value
        })
    },
    // switch开关ture,false转为1,0
    formatSwitch(value) {
        return value ? '1' : '0'
    },
    // switch开关1,0转为ture,false
    parseSwitch(value) {
        if(value == '1'){
            return true
        }else{
            return false
        }
    },
    formSubmit(e) {
        var _self = this
        var tmpForm = Object.assign({}, _self.data.form)
        var submitData = Object.assign({}, tmpForm, e.detail.value)
        // 选择框赋值
        submitData.billDeptId = tmpForm.billDeptId
        submitData.discDeptId = tmpForm.discDeptId
        submitData.deliveryType = tmpForm.deliveryType
        submitData.itemDesc = e.detail.value.itemDesc == '' ? tmpForm.itemDesc : e.detail.value.itemDesc
        submitData.itemPkg = tmpForm.itemPkg
        submitData.amountFreightPt = tmpForm.amountFreightPt
        submitData.amountCodService = tmpForm.amountCodService
        submitData.hdType = tmpForm.hdType
        // switch开关赋值
        submitData.forDelivery = this.formatSwitch(submitData.forDelivery)
        submitData.forReceive = this.formatSwitch(submitData.forReceive)
        submitData.forHd = this.formatSwitch(submitData.forHd)
        // 订单录入类型赋值
        submitData.orderChannel = DictionaryConstants.PreOrderChannel.WEIXIN;
        // itemJson赋值
        submitData.itemJson = JSON.stringify([{
            itemDesc: submitData.itemDesc,
            itemQty: submitData.itemQty,
            itemPkg: submitData.itemPkg,
            itemKgs: submitData.itemKgs,
            itemCbm: submitData.itemCbm
        }])
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
        if(this.data.preOrderId != ''){// 修改
            request('post', '/preOrderHdr/editPreOrderHdr', submitData, res => {
                wx.showToast({
                    title: res.msg,
                });
                wx.navigateBack()
            })
        }else{// 新增
            request('post', '/preOrderHdr/addPreOrderHdr', submitData, res => {
                wx.showToast({
                    title: res.msg,
                });
                var tmpDefaultForm = Object.assign({}, this.data.defaultForm)
                this.setData({
                    form: tmpDefaultForm,
                    showBillFilter: false,
                    showDiscFilter: false,
                    sendBtn: false,
                    goodsBtn: false,
                })
                // 调用子组件中methods的initShow方法
                this.selectComponent('#item-pkg-select').initShow()
                this.selectComponent('#hd-mode-select').initShow()
            })
        }
    },
})
