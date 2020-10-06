const db = wx.cloud.database()

Page({
  data: {
    hero: null,
    skillCur: 0,
  },
  onLoad: function (options) {
    console.log(options)
    const {
      name
    } = options
    this.getDetail(name)
  },
  getDetail(name) {
    db.collection("hero").where({
      name
    }).get().then(res => {
      const {
        data
      } = res
    
      this.setData({
        hero: data[0]
      })
      const {
        hero
      } = this.data
      console.log(hero)
      const UpperName = hero.name.charAt(0).toUpperCase() + hero.name.slice(1).toLowerCase()
      wx.setNavigationBarTitle({
        title: `${this.data.hero.ChineseName}${UpperName}`,
      })
    })
  },
  changeCur(e){
    const {index} = e.currentTarget.dataset
    // console.log(e)
    this.setData({
      skillCur: index
    })
  }
})