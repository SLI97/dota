//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env:'sli-1e19c27'
    })
  },
  globalData: {
    userInfo: null
  }
})