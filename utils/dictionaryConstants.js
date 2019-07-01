/**
 *数据字典
 **/
const DictionaryConstants = {

    /**
     * 订单状态
     */
    PreOrderStatus: {
        /** 待受理*/
        WAITING_ACCEPT: '22201',
        /** 已受理*/
        ACCEPT: '22202',
        /** 已拒绝*/
        REFUSER: '22203',
        /** 已取消*/
        CANCEL: '22204',
        /** 接货中*/
        DELIVERYING: '22205',
        /** 已确认*/
        CONFIRM: '22206',
        /** 已发车*/
        TRANSPORT: '22207',
        /** 已签收*/
        SIGNIN: '22208',
        /** 已退货*/
        RETURNED: '22209',
    },

    /**
     * 订单录入类型
     */
    PreOrderChannel: {
        /** 桌面端*/
        PC: '22301',
        /** 微信*/
        WEIXIN: '22302',
        /** APP*/
        APP: '22303',
    },

    /**
     * 运单类型
     */
    OrderType: {
        /** 正常运单*/
        COMMON: '11301',
        /** 回单运单*/
        HD: '11302',
        /** 退货运单*/
        TH: '11303',
    },

    /**
     * 代收时效
     */
    AmountCodService: {
        /** 正常时效*/
        NORMAL: '10201',
        /** T+0*/
        T0: '10202',
        /** T+1*/
        T1: '10203',
    },

    /**
     * 包装类型
     */
    PackageType: {
        /** 纸*/
        PAPER: '10901',
        /** 袋*/
        BAG: '10902',
        /** 桶*/
        BUCKET: '10903',
        /** 木*/
        WOOD: '10904',
        /** 膜*/
        FILM: '10905',
        /** 回单*/
        HD: '10906',
        /** 无*/
        NONE: '10907',
    },

    /**
     * 带回单要求
     */
    HdMode: {
        /** 托运单签名盖章返回*/
        HDMODE_TYD: '10501',
        /** 送货单签名盖章返回*/
        HDMODE_SHD: '10502',
        /** 回单签名盖章返回*/
        HDMODE_HD: '10503',
        /** 其他*/
        HDMODE_OTHERS: '10504',
    },

    /**
     * 送货方式
     */
    DeliveryType: {
        /** 送货*/
        DELIVERY_TYPE_SH: '10401',
        /** 送货上门*/
        DELIVERY_TYPE_SHSM: '10402',
        /** 送货上楼*/
        DELIVERY_TYPE_SHSL: '10403',
        /** 客户自提*/
        DELIVERY_TYPE_KHZT: '10404',
    },

    /**
     * 付款方式数据字典Code
     */
    AmountPaidType: {
        /** 提付*/
        PAY_TYPE_TF: '10301',
        /** 现付*/
        PAY_TYPE_XF: '10302',
        /** 现付月结*/
        PAY_TYPE_XFYJ: '10303',
        /** 提付月结*/
        PAY_TYPE_TFYJ: '10304',
        /** 回单付*/
        PAY_TYPE_HDF: '10305',
        /** 扣付*/
        PAY_TYPE_KF: '10306',
        /** 双方付*/
        PAY_TYPE_SFF: '10307',
    },

    /**
     * 佣金结算方式
     */
    AmountYjType: {
        /** 现返*/
        AMOUNT_YJ_XF: '11101',
        /** 欠返*/
        AMOUNT_YJ_QF: '11102',
    },

    /**
     * 运单状态数据字典Code
     */
    OrderStatus: {
        /** 网点入库*/
        ORDER_STATUS_10801: '10801',
        /** 网点配载*/
        ORDER_STATUS_LOAD: '10802',
        /** 网点发车*/
        ORDER_STATUS_10803: '10803',
        /** 中转入库*/
        ORDER_STATUS_10804: '10804',
        /** 中转配载*/
        ORDER_STATUS_10805: '10805',
        /** 中转发车*/
        ORDER_STATUS_10806: '10806',
        /** 部分抵达*/
        ORDER_STATUS_10807: '10807',
        /** 到站待提*/
        ORDER_STATUS_STATION: '10808',
        /** 客户提货*/
        ORDER_STATUS_PINK: '10809',
        /** 客户退货*/
        ORDER_STATUS_10810: '10810',
    },
    /*
    * 货箱批次状态
     */
    PackageStatus: {
        /**装箱计划 */
        PACKAGE_STATUS_PLAN: '11601',
        /**货物配载 */
        PACKAGE_STATUS_LOAD: '11602',
        /**货箱封箱 */
        PACKAGE_STATUS_LOCK: '11603',
        /**货箱解封 */
        PACKAGE_STATUS_UNLOCK: '11604',
        /**卸货完成 */
        PACKAGE_STATUS_UNLOAD: '11605',
    },

    /**
     * 发车任务状态数据字典Code  任务创建  任务执行  任务完成
     */
    TransportStatus: {
        /**发车任务状态  12201 任务创建*/
        TRANSPORT_STATUS_CREATE: '12201',
        /**发车任务状态  12202 任务执行*/
        TRANSPORT_STATUS_RUN: '12202',
        /**发车任务状态  12203 任务完成*/
        TRANSPORT_STATUS_SUCCESS: '12203',
    },

    /**
     * 车次状态数据字典Code 车次计划 货物配载 车次在途 车次到车 卸货完成
     */
    VoyageStatus: {
        /**车次状态 车次计划*/
        VOYAGE_STATUS_PLAN: '11401',
        /**车次状态 货物配载*/
        VOYAGE_STATUS_LOAD: '11402',
        /**车次状态 车次在途*/
        VOYAGE_STATUS_RUNNING: '11403',
        /**车次状态 车次到车*/
        VOYAGE_STATUS_ARRIVE: '11404',
        /**车次状态 卸货完成*/
        VOYAGE_STATUS_UNLOAD: '11405',
    },

    /**
     * 车次解封状态数据字典Code  未封车 已封车 已解封
     */
    SealStatus: {
        /**车次解封状态 未封车*/
        SEAL_STATUS_UNSEALED: '11501',
        /**车次解封状态 已封车*/
        SEAL_STATUS_SEALED: '11502',
        /**车次解封状态 已解封*/
        SEAL_STATUS_UNBLOCK: '11503',
    },

    /**
     * 回单运输状态数据字典Code  发出计划 回单配载 回单发出 回单到达
     */
    TransferStatus: {
        /**回单运输状态 发出计划*/
        TRANSFER_STATUS_PLAN: '13901',
        /**回单运输状态 回单配载*/
        TRANSFER_STATUS_LOAD: '13902',
        /**回单运输状态 回单发出*/
        TRANSFER_STATUS_SEND: '13903',
        /**回单运输状态 回单到达*/
        TRANSFER_STATUS_ARRIVE: '13904',
    },

    /**
     * 打印模板类型
     */
    PrintTemplateType: {
        /**托运单*/
        PRINT_TEMPLATE_TY: '11001',
        /**标签*/
        PRINT_TEMPLATE_LABEL: '11002',
    },

    /**
     * 回单状态
     */
    HdStatus: {
        /*回单未签*/
        HD_STATUS_NOT: '11901',   
        /*回单已签*/
        HD_STATUS_SIGNED: '11902' ,  
        /*回单发出*/   
        HD_STATUS_SEND: '11903' ,
        /*回单已回*/    
        HD_STATUS_BACK: '11904' ,
        /*回单退回*/    
        HD_STATUS_RETURN: '11905' ,
        /*回单领取*/    
        HD_STATUS_DRAW: '11906' ,
    },

    /**
     * 签收状态
     */
    ArrivedStatus: {
        /*未签收*/
        ARRIVED_STATUS_NOT: '13001',   
        /*已签收*/
        ARRIVED_STATUS_SIGNED: '13002' ,
    },

    /**
     * 车次运单明细类型
     */
     VoyageDetailType: {
        /*运单*/
        VOYAGE_DETAIL_TYPE_ORDERNO: '13701',   
        /*货箱*/
        VOYAGE_DETAIL_TYPE_PACKAGENO: '13702' ,
    },

    /**
     * 核销费用类型
     */
     ChargeModeType: {
        /**提付*/
        CHARGE_MODE_TYPE_TF: '16001',
        /**现付*/
        CHARGE_MODE_TYPE_XF: '16002',
        /**现付月结*/
        CHARGE_MODE_TYPE_XFYJ: '16003',
        /**提付月结*/
        CHARGE_MODE_TYPE_TFYJ: '16004',
        /**回单付*/
        CHARGE_MODE_TYPE_HDF: '16005',
        /**扣付*/
        CHARGE_MODE_TYPE_KF: '16006',
        /**代收款*/
        CHARGE_MODE_TYPE_COD: '16007',
        /**代收运费*/
        CHARGE_MODE_TYPE_COD_FREIGHT: '16008',
        /**佣金*/
        CHARGE_MODE_TYPE_YJ: '16009',
        /**中转费*/
        CHARGE_MODE_TYPE_TRANSFER: '16010',
        /**垫付费*/
        CHARGE_MODE_TYPE_DFF: '16011',
    },

    /**
     * 派送批次状态
     */
    DeliveryStatus: {
        /*派送计划 */
        DELIVERY_STATUS_PLAN: '16301',
        /*派送中*/
        DELIVERY_STATUS_SENDING: '16302',
        /*派送完成*/
        DELIVERY_STATUS_FINISH: '16303',
    },

    /**
     * 权限等级
     */
    OrganizeLevel: {
        /*租户 */
        ORGANIZEL_LEVEL_TEN: '17101',
        /*公司*/
        ORGANIZEL_LEVEL_COM: '17102',
        /*品牌*/
        ORGANIZEL_LEVEL_BRAND: '17103',
        /*物流中心*/
        ORGANIZEL_LEVEL_LOG: '17104',
        /*区域*/
        ORGANIZEL_LEVEL_AREA: '17105',
        /*网点*/
        ORGANIZEL_LEVEL_DEPT: '17106',
    },

    /**
     * 代收款发放支付状态
     */
    CodPaymentStatus: {
        /*未支付 */
        UNPAID: '17201',
        /*待支付 */
        WAITING: '17202',
        /*支付中 */
        PROCESSING: '17203',
        /*支付成功 */
        SUCC: '17204',
        /*支付失败 */
        FAIL: '17205',
    },
}
export default DictionaryConstants