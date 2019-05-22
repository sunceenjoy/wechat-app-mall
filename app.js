//app.js
App({
  onLaunch: function () {
    var that = this;
    /**
   * 初次加载判断网络情况
   * 无网络状态下根据实际情况进行调整
   */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function() {
            that.goStartIndexPage()
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });       
    //  获取商城名称
    wx.request({
      url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
        }
      }
    })
    //  获取是否搜索
    wx.request({
      url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/config/get-value',
      data: {
        key: 'search-display'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorageSync('searchDisplay', res.data.data.value);
        }
      }
    })
    //  Display score columns on my homepage
    wx.request({
      url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/config/get-value',
      data: {
        key: 'score-column-display'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorageSync('scoreColumnDisplay', res.data.data.value);
        }
      }
    })
    //  Is Atlanta mode?
    wx.request({
      url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/config/get-value',
      data: {
        key: 'is-atlanta-mode'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorageSync('isAtlantaMode', parseInt(res.data.data.value));
        }
      }
    })
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/score/send/rule',
      data: {
        code: 'goodReputation'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.order_reputation_score = res.data.data[0].score;
        }
      }
    })
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/config/get-value',
      data: {
        key: 'recharge_amount_min'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.recharge_amount_min = res.data.data.value;
        }
      }
    })
    // 获取砍价设置
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/shop/goods/kanjia/list',
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.kanjiaList = res.data.data.result;
        }
      }
    })
    // Get item nums in cart
    wx.getStorage({
      key: 'shopCarInfo',
      success: (res) => {
        setTimeout(() => {
          res.data.shopNum && this.setCartBadge(res.data.shopNum)
        }, 3000)
      } 
    })
  },
  sendTempleMsg: function (orderId, trigger, template_id, form_id, page, postJsonString){
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        type:0,
        module:'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url:page,
        postJsonString: postJsonString
      },
      success: (res) => {
        //console.log('*********************');
        //console.log(res.data);
        //console.log('*********************');
      }
    })
  },
  sendTempleMsgImmediately: function (template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        type: 0,
        module: 'immediately',
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
        // console.log(res.data);
      }
    })
  },  
  goLoginPageTimeOut: function () {
    setTimeout(function(){
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }, 10)    
  },
  goStartIndexPage: function () {
    setTimeout(function () {
      wx.redirectTo({
        url: "/pages/start/start"
      })
    }, 1000)
  },
  globalData:{
    userInfo:null,
    subDomain: "412d438ee8ba800edf3f72c648af7666", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
    version: "4.1.0",
    note:'增加小程序购物单支持',
    appid: "wxc4ab698e830747b1", // 您的小程序的appid
    shareTitle: '欢迎您' // 首页转发的时候话术
  },
  params: {
    navTo: null,
    fromSharing: false,
    orderExpireMinutes: 24 * 60 * 30 // new order expire minutes, default 1 month,
  },
  setCartBadge (nums) {
    return
    if (nums === 0) {
      wx.removeTabBarBadge({index: 1})
      return
    }
    wx.setTabBarBadge({index: 1, text: nums + ''})
  }
  /*
  根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒；
  1、/pages/to-pay-order/index.js 中已添加关闭订单、商家发货后提醒消费者；
  2、/pages/order-details/index.js 中已添加用户确认收货后提供用户参与评价；评价后提醒消费者好评奖励积分已到账；
  3、请自行修改上面几处的模板消息ID，参数为您自己的变量设置即可。  
   */
})
