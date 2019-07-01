// Componet/Componet.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: {
            type: null,
        },
        optionArray: {
            type: Array,
        },
        optionLabel: {
            type: String,
            value: 'label',
        },
        optionValue: {
            type: String,
            value: 'value',
        },
    },
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的初始数据
     */
    data: {
        selectShow: false,//初始option不显示
        nowText: '',//初始内容
        animationData: {}//右边箭头的动画
    },
    ready() {
        // 值回显
        this.initShow();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 值回显
        initShow(){
            if(this.properties.value && this.properties.value != null && this.properties.value != '' && this.properties.optionArray && this.properties.optionArray != null && this.properties.optionArray.length > 0){
                var _self = this;
                var selectedArray = _self.properties.optionArray.filter(obj => {
                    if(_self.properties.optionValue == ''){
                        return obj[_self.properties.optionValue] == _self.properties.value[_self.properties.optionValue]
                    }else{
                        return obj[_self.properties.optionValue] == _self.properties.value
                    }
                })[0] || {}
                this.setData({
                    nowText: selectedArray[_self.properties.optionLabel],
                })
                // this.triggerEvent('myget', _self.properties.value)
            }else{
                var tmpNowText = ''
                if (this.properties.optionValue == ''){
                    tmpNowText = {}
                }
                this.setData({
                  nowText: tmpNowText,
                })
                // this.triggerEvent('myget', tmpNowText)
            }
        },
        //option的显示与否
        selectToggle(){
            var nowShow=this.data.selectShow;//获取当前option显示的状态
            //创建动画
            var animation = wx.createAnimation({
                timingFunction:"ease"
            })
            this.animation=animation;
            if(nowShow){
                animation.rotate(0).step();
                this.setData({
                    animationData: animation.export()
                })
            }else{
                animation.rotate(180).step(); 
                this.setData({
                    animationData: animation.export()
                })
            }
            this.setData({
                selectShow: !nowShow
            })
        },
        //设置内容
        setText(e){
            var nowData = this.properties.optionArray;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
            var nowIdx = e.target.dataset.index;//当前点击的索引
            var nowText = nowData[nowIdx][this.properties.optionLabel];//当前点击的内容
            //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
            this.animation.rotate(0).step();
            this.setData({
                selectShow: false,
                nowText:nowText,
                animationData: this.animation.export()
            })
            var nowDate = this.properties.optionValue == '' ? nowData[nowIdx] : nowData[nowIdx][this.properties.optionValue]
            this.triggerEvent('myget', nowDate)
        }
    }
  })