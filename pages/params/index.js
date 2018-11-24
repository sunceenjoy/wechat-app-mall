const wxparse = require("../../wxParse/wxParse.js")
const app = getApp()
// pages/params/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获取商城名称
    let key = options.key
    if (app.params[key]) {
      this.setData({value: app.params[key]})
      wxparse.wxParse('value', 'html', this.data.value, this)
      return 
    }
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/config/get-value',
      data: {
        key: options.key
      },
      success: (res) => {
        if (res.data.code == 0) {
          app.params[key] = res.data.data.value
          this.setData({value: res.data.data.value})
          wxparse.wxParse('value', 'html', this.data.value, this)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})