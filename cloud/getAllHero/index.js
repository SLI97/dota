// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios")
const cheerio = require("cheerio")

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let summaryJson = []
  const dotaBaseUrl = 'https://www.dota2.com.cn'

  axios({
    url: `${dotaBaseUrl}/heroes/index.htm`
  }).then(async res => {
    const $ = cheerio.load(res.data)
    $(".black_cont ul.hero_list").each((i, item) => {
      const titleLi = $(item).find("li.hero_list_tit span")
      const heros = []
      $(item).find(":not(li:nth-child(1))>a").each((i, item) => {
        const obj = {
          name: $(item).attr("href").match(/^http:\/\/www.dota2.com.cn\/hero\/(?<name>.+)\/$/).groups.name,
          url: `${dotaBaseUrl}/hero/` + $(item).attr("href").match(/^http:\/\/www.dota2.com.cn\/hero\/(?<name>.+)\/$/).groups.name,
          img: dotaBaseUrl + $(item).find("img.heroHoverSmall").attr("src"),
        }
        heros.push(obj)
      })
      const obj = {
        label: titleLi.text(),
        img: 'https://www.dota2.com.cn/images/heropedia/overviewicon_' + titleLi.attr("class") + '.png',
        heros: heros
      }
      summaryJson.push(obj)
    })

    summaryJson[0].heros = summaryJson[0].heros.concat(summaryJson[3].heros)
    summaryJson[1].heros = summaryJson[1].heros.concat(summaryJson[4].heros)
    summaryJson[2].heros = summaryJson[2].heros.concat(summaryJson[5].heros)
    summaryJson = summaryJson.slice(0, 3)

    //插入summary数据
    // await db.collection("summary").add({
    //   data: summaryJson
    // }).then(res => console.log("summary插入成功"))

    const allHeroList = [...summaryJson[0].heros, ...summaryJson[1].heros, ...summaryJson[2].heros]
    // const allHeroList = [...summaryJson[0].heros].slice(0, 2)

    const AllHeroDetailList = []
    const AllHeroDetailListPromise = []

    for (let i = 0; i < allHeroList.length; i++) {
      const p = axios({
        url: allHeroList[i].url
      })
      AllHeroDetailListPromise.push(p)
    }

    await Promise.all(AllHeroDetailListPromise).then(res => {
      // console.log(res)
      res.forEach((item,index) => {
        const $1 = cheerio.load(item.data)

        //6维属性
        const proList = []
        $1('.pro6_box li').each((i, item) => {
          const index = i < 3 ? 3 : i + 1
          const obj = {
            img: dotaBaseUrl + `/event/201401/herodata/images/pro${index}.png`,
            text: $(item).text().trim().split("\t")[0]
          }
          proList.push(obj)
        })

        //天赋
        const talentList = []
        $1('.talent-explain').each((i, item) => {
          talentList.push($1(item).text().trim())
        })

        //技能
        const skillList = []
        $1('.skill_wrap').each((i, item) => {
          const detailList = []
          $1(item).find(".skill_ul li").each((i, item) => {
            detailList.push({
              title: $1(item).find("span").text().trim(),
              desc: $1(item).text().trim().split("\t").pop().split($1(item).find("span").text().trim()).pop()
            })
          })
          const obj = {
            name: $1(item).find(".skill_intro span").text().trim(),
            img: dotaBaseUrl + $1(item).find("img.skill_b").attr("src"),
            skill_intro: $1(item).find(".skill_intro").text().trim().split("\t").pop(),
            tip: $1(item).find(".color_green").text().trim(),
            mana: {
              img: dotaBaseUrl + `/event/201401/herodata/images/icon_xiaohao.png`,
              text: $1(item).find(".xiaohao_wrap .icon_xh").text().trim()
            },
            coolTime: {
              img: dotaBaseUrl + `/event/201401/herodata/images/icon_lengque.png`,
              text: $1(item).find(".xiaohao_wrap .icon_lq").text().trim(),
            },
            detail: detailList,
            bottom: $1(".skill_bot").eq(i + 1).text().trim(),
          }
          skillList.push(obj)
        })

        //装备选择
        const equipmentList = []
        $1(".equip_wrap .equip_one").each((i, item) => {
          const imgs = []
          $1(item).find(".equip_ul li").each((i, item) => {
            imgs.push($1(item).find("img.equip_s").attr("src"))
          })
          const obj = {
            title: $1(item).find(".equip_t").text().trim(),
            imgs
          }
          equipmentList.push(obj)
        })

        //适配英雄
        const adaptationList = []
        $1(".match_ul li").each((i, item) => {
          const obj = {
            name: $1(item).find("a").text().trim(),
            img: $1(item).find("a img").attr("src")
          }
          adaptationList.push(obj)
        })


        const heroObj = {
          id: allHeroList[index].name,
          name: $1(".top_hero_card p").text().trim().match(/(?<name>[A-Za-z0-9_]+)/).groups.name.toLowerCase(),
          ChineseName: $1('.hero_name').text().trim(),
          img: dotaBaseUrl + $1('.hero_b').attr('src'),
          icon: dotaBaseUrl + $1('.hero_name>img').attr('src'),
          story: {
            img: dotaBaseUrl + $1('.story_pic>a>img:nth-child(1)').attr('src'),
            desc: $1('.story_box').text().trim()
          },
          properties: proList,
          talent: talentList,
          skill: skillList,
          equipment: equipmentList,
          adaptation: adaptationList,
          weizhun: $1('.weizhun').text().trim()
        }

        AllHeroDetailList.push(heroObj)
      })
    })

    db.collection("hero").add({
      data: AllHeroDetailList,
      createTime: db.serverDate()
    })

    // fs.writeFile('./hero.json', JSON.stringify(AllHeroDetailList), () => {
    //   console.log("写入成功")
    // })

    // fs.writeFile('./data.json', JSON.stringify(json), () => {
    //   console.log("写入成功")
    // })


    // fs.writeFile('./index.html', heroData, (err, res) => {
    //   console.log("OK~")
    // })
  })
}