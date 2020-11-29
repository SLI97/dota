const axios = require("axios")
const cheerio = require("cheerio")

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    url
  } = event
  const result = axios({
    url,
  }).then(async res => {
    const $ = cheerio.load(res.data, {
      decodeEntities: false
    })
    const result = $('div.news_main')
    result.find("p").attr("style", " ")
    result.find("h2").attr("style", " ")
    if (result.find('div.journalism-code')) {
      result.find('div.journalism-code').remove()
    }
    if (result.find('div#share_line')) {
      result.find('div#share_line').remove()
    }
    return result.html()

  })

  return result
}