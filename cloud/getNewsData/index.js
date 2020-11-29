// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios")
const cheerio = require("cheerio")

cloud.init()

const typeList = [
  'https://www.dota2.com.cn/news/index',
  'https://www.dota2.com.cn/news/gamenews/index',
  'https://www.dota2.com.cn/news/competition/index',
  'https://www.dota2.com.cn/news/gamepost/news_update/index',
  'https://www.dota2.com.cn/raiders/index',
  'https://www.dota2.com.cn/raiders/newer/index',
  'https://www.dota2.com.cn/raiders/step/index',
  'https://www.dota2.com.cn/raiders/skill/index',
]

// 云函数入口函数
exports.main = async (event, context) => {

  const {
    typeIndex,
    pageNum
  } = event

  const result = await axios({
    url: `${typeList[typeIndex]}${pageNum}.htm`,
  }).then(async res => {
    const $ = cheerio.load(res.data)
    const list = []
    if (typeIndex <= 3) {
      $('ul.panes li.pane a').each((i, item) => {
        const obj = {
          img: $(item).find('img').attr("src"),
          url: $(item).attr("href"),
          title: $(item).find('h2.title').text(),
          content: $(item).find('p.content').text(),
          date: $(item).find('p.date').text(),
        }
        list.push(obj)
      })
    } else {
      $('div.content .hd_li li.hd_ps').each((i, item) => {
        const obj = {
          img: $(item).find('div.img_left img').attr("src"),
          url: $(item).find("div.title_right a").attr("href"),
          title: $(item).find('a.enter_title').text(),
          content: $(item).find('div.title_right p').text(),
          date: null,
          // date: $(item).find('p.date').text(),
        }
        list.push(obj)
      })
    }
    return list
  })

  return result
}