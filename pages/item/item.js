const db = wx.cloud.database()

Page({
  data: {
    equipment: null
  },
  onLoad(options) {
    const {
      id
    } = options
    this.getDetail(id)
  },
  getDetail(id) {
    db.collection("item").where({
      cname: id
    }).get().then(res => {
      const {
        data
      } = res
      const item = data[0]

      if (item.requirements) {
        item.requirements = item.requirements.map(i => `https://www.dota2.com.cn/items/images/${i}_lg.png`)
      }

      if (item.attrib) {
        const attrib = []
        for (let i = 0; i < item.attrib.length; i = i + 2) {
          attrib.push({
            label: item.attrib[i],
            value: item.attrib[i + 1]
          })
        }
        item.attrib = attrib

      }

      this.setData({
        equipment: item
      })
      console.log(this.data.equipment)
      wx.setNavigationBarTitle({
        title: `${this.data.equipment.dname}`,
      })
    })
  }
})