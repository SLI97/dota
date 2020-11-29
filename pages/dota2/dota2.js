let flag = false


// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSwiperIndex: 0,
    isAuto: false,
  },
  changeCurSwiper(event) {
    const {
      current
    } = event.detail
    this.setData({
      currentSwiperIndex: current
    })
  },
  changeActionSwiper(event) {
    const {
      index
    } = event.currentTarget.dataset
    this.setData({
      isAuto: false
    }, () => {
      this.setData({
        currentSwiperIndex: index,
        isAuto: true
      })
    })
  },
  jumpNews() {
    wx.switchTab({
      url: '/pages/news/news',
    })
  },
  jumpHero() {
    wx.switchTab({
      url: '/pages/data/data',
    })
  },
})