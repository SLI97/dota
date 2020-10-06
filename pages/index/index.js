//index.js
//获取应用实例
const app = getApp()

const db = wx.cloud.database()

Page({
  data: {
    summary: [],
    current: 0,
  },
  onLoad() {
    this.getData()
  },
  getData() {
    db.collection('summary').get().then(res => {
      const {
        data
      } = res
      this.setData({
        summary: data
      })
      console.log(this.data.summary)
    })
  },
  changeCur(e) {
    const {index} = e.currentTarget.dataset
    // console.log(e)
    this.setData({
      current: index
    })
  },
  navToDetail(e){
    console.log(e)
    const {name} =  e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?name=${name}`,
    })
  }
})