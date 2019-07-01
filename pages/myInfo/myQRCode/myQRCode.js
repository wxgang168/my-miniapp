//myQRCode.js
import permission from '../../../utils/permission.js'
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
//获取应用实例
const app = getApp()

Page({
    data: {
    },
    onLoad: function () {
        permission({name: 'my', basePath: '../../'}).then(res => {
            drawQrcode({
                width: 200,
                height: 200,
                canvasId: 'myQRCode',
                text: app.globalData.userObj.mobileNo,
            })
        })
    },
})
