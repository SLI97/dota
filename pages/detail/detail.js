const WxParse = require('../../utils/wxParse/wxParse.js');

let flag = false

Page({
  data: {
    showBackTop: false,
    loading: false,
  },
  onLoad(option) {
    const {
      id
    } = option
    this.getData(id)
  },
  getData(url) {
    wx.cloud.callFunction({
      name: 'getNewsDetail',
      data: {
        url
      },
    }).then(res => {
      // console.log(res.result)
      WxParse.wxParse('content', 'html', res.result, this, 30);
      this.setData({
        isLoaded: true
      })
    }).catch(console.error)
  },
  onViewScroll(e) {
    if (flag) {
      return
    }
    flag = true
    setTimeout(() => {
      //滚动距离+屏幕高度换算vw倍数
      if (e.detail.scrollTop > 1000 && !this.data.showBackTop) {
        this.setData({
          showBackTop: true
        })
      } else if (e.detail.scrollTop < 1000 && this.data.showBackTop) {
        this.setData({
          showBackTop: false
        })
      }
      flag = false
    }, 100)
  },
  backTop() {
    const topNum = this.data.topNum === 0 ? -1 : 0;
    this.setData({
      topNum
    })
  },
})