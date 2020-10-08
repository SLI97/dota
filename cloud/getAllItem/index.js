// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios")
const cheerio = require("cheerio")
const myjsonp = require("node-jsonp")

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const dotaBaseUrl = 'https://www.dota2.com.cn'

  //商店物品汇总
  await axios({
    url: `${dotaBaseUrl}/items/index.htm`
  }).then(async res => {
    const list = []

    const {
      data
    } = res

    const $ = cheerio.load(data)

    $(".shopColumn").each((i, item) => {

      const items = []
      $(item).find("div.floatItemImage").each((i, item) => {
        // console.log($(item).attr("src").slice(1))
        const obj = {
          id: $(item).attr("id").replace("icon_", ""),
          img: `${dotaBaseUrl}/items` + $(item).find("img").attr("src").slice(1)
        }
        items.push(obj)
      })

      const obj = {
        title: $(item).find("h4").text().trim(),
        img: `${dotaBaseUrl}/items` + $(item).find("img").attr("src").slice(1),
        items
      }
      // console.log(obj)
      list.push(obj)
    })

    await db.collection("summary_shop_item").add({
      data: list
    }).then(res => console.log("summary插入成功"))
  })


  //所有物品详细信息
  await myjsonp('https://www.dota2.com.cn/items/json?callback=HeropediaDFReceive', async (res) => {
    const list = []
    for (let key in res.itemdata) {
      const desc = res.itemdata[key].desc.replace(/<.*?>/g, "<br>").split("<br>").filter(i => !!i)
      const notes = res.itemdata[key].notes.replace(/<.*?>/g, "<br>").split("<br>").filter(i => !!i)
      const attrib = res.itemdata[key].attrib.replace(/<.*?>/g, "<br>").split("<br>").filter(i => !!i)

      list.push({
        cname: key,
        ...res.itemdata[key],
        desc,
        notes,
        attrib,
        img: `${dotaBaseUrl}/items/images/` + res.itemdata[key].img
      })
    }

    await db.collection("item").add({
      data: list
    }).then(res => console.log("summary插入成功"))

  })

  //中立物品汇总
  await myjsonp('https://www.dota2.com.cn/neutralitems/json?callback=getitems&callback=jQuery171016166113628198642_1602131254989', async res => {
    // console.log(res)
    const list = []
    for (let key in res) {
      list.push({
        title: key,
        list: res[key]
      })
    }

    await db.collection("summary_neutral_item").add({
      data: list
    }).then(res => console.log("summary插入成功"))
  })


}