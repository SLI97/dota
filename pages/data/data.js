//index.js
//获取应用实例
const app = getApp()

const db = wx.cloud.database()

Page({
  data: {
    heroList: [],
    itemList: [],
    currentList: [{
        Cname: '英雄',
        Ename: 'Heros',
      },
      {
        Cname: '物品',
        Ename: 'Items',
      },
    ],
    current: 0,
    heroCurrent: 0,
    itemCurrnet: 0
  },
  onLoad() {
    this.getHeroData()
    this.getItemData()
  },
  getHeroData() {
    db.collection('summary').get().then(res => {
      const {
        data
      } = res
      this.setData({
        heroList: data
      })
    })
  },
  getItemData() {
    const p1 = db.collection('summary_shop_item').get()
    const p2 = db.collection('summary_neutral_item').get()

    Promise.all([p1, p2]).then(([res1, res2]) => {
      const list = res2.data.map(i => {
        const obj = {
          items: i.list.map(e => ({
            id: e,
            img: `https://www.dota2.com.cn/items/images/${e}_lg.png?3`
          }))
        }
        return obj
      })
      const itemList = [{
          label: '基础分类',
          list: res1.data.slice(0, 5)
        }, {
          label: '合成分类',
          list: res1.data.slice(5)
        },
        {
          label: '中立物品',
          list: list
        }
      ]
      this.setData({
        itemList
      })
      console.log(this.data.itemList)
    })
  },
  changeCurrent(e) {
    const {
      index
    } = e.currentTarget.dataset
    this.setData({
      current: index
    })
  },
  changeHeroCurrent(e) {
    const {
      index
    } = e.currentTarget.dataset
    // console.log(e)
    this.setData({
      heroCurrent: index
    })
  },
  changeItemCurrent(e) {
    const {
      index
    } = e.currentTarget.dataset
    this.setData({
      itemCurrnet: index
    })
  },
  JumpToHeroDetail(e) {
    // console.log(e)
    const {
      name
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/hero/hero?id=${name}`,
    })
  },
  jumpToItemDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/item/item?id=${id}`,
    })
  }
})