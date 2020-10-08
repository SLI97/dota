const db = wx.cloud.database()

Page({
  data: {
    hero: null,
    skillCur: 0,
  },
  onLoad: function (options) {
    console.log(options)
    const {
      id
    } = options
    this.getDetail(id)
  },
  getDetail(id) {
    db.collection("hero").where({
      id
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
  changeCur(e) {
    const {
      index
    } = e.currentTarget.dataset
    // console.log(e)
    this.setData({
      skillCur: index
    })
  },
  // jumpToHero(e) {
  //   const {
  //     img
  //   } = e.currentTarget.dataset
  //   console.log(e)
  //   const id = img.match(/^\/\/www.dota2.com.cn\/images\/heroes\/(?<name>.+)_full.png$/).groups.name
  //   wx.navigateTo({
  //     url: `/pages/hero/hero?id=${id}`,
  //   })
  // },
  jumpToItem(e) {
    const {
      img
    } = e.currentTarget.dataset
    const id = img.match(/^\/\/www.dota2.com.cn\/images\/items\/(?<name>.+)_lg.png$/).groups.name
    wx.navigateTo({
      url: `/pages/item/item?id=${id}`,
    })
  },
  previewSkillImg(e) {
    const {
      img
    } = e.currentTarget.dataset
    wx.previewImage({
      current: img,
      urls: this.data.hero.skill.map(i => i.img)
    })
  },
  previewHeroImg(e) {
    const {
      img
    } = e.currentTarget.dataset
    wx.previewImage({
      current: `https:${img}`,
      urls: this.data.hero.adaptation.map(i => `https:${i.img}`)
    })
  }
})