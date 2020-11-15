const GAME_STATUS = {
  IDLE: "IDLE",
  BUILD: "BUILD",
  PLAYING: "PLAYING",
  END: "END",
}

const frequency = 200

const around = [{
    x: -1,
    y: 1
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  },
  {
    x: -1,
    y: 0
  }, {
    x: 1,
    y: 0
  },
  {
    x: -1,
    y: -1
  }, {
    x: 0,
    y: -1
  }, {
    x: 1,
    y: -1
  },
]

Page({
  data: {
    colum: 22,
    row: 26,
    mapList: [],
    showTipsOverlay: false,
    showCaseOverlay: false,
    caseList: [{
        title: ' “滑翔者”：每4个回合“它”会向右下角走一格。虽然细胞早就是不同的细胞了，但它能保持原本的形态。',
        src: '/images/case1.png',
        list: [{
            x: 1,
            y: 3
          },
          {
            x: 2,
            y: 4
          },
          {
            x: 3,
            y: 2
          },
          {
            x: 3,
            y: 3
          },
          {
            x: 3,
            y: 4
          },
        ]
      },
      {
        title: '“轻量级飞船”：它的周期是4，每2个回合会向右边走一格。',
        src: '/images/case2.png',
        list: [{
            x: 2,
            y: 2
          },
          {
            x: 2,
            y: 3
          },
          {
            x: 3,
            y: 1
          },
          {
            x: 3,
            y: 2
          },
          {
            x: 3,
            y: 3
          },
          {
            x: 4,
            y: 1
          },
          {
            x: 4,
            y: 2
          },
          {
            x: 4,
            y: 4
          },
          {
            x: 5,
            y: 2
          },
          {
            x: 5,
            y: 3
          },
          {
            x: 5,
            y: 4
          },
          {
            x: 6,
            y: 3
          },
        ]
      },
      {
        title: '"脉冲星"：它的周期为3，看起来像一颗周期爆发的星星。',
        src: '/images/case3.png',
        list: [
          {x:2,y:4},
          {x:2,y:5},
          {x:2,y:11},
          {x:2,y:12},

          {x:3,y:5},
          {x:3,y:6},
          {x:3,y:10},
          {x:3,y:11},

          {x:4,y:2},
          {x:4,y:5},
          {x:4,y:7},
          {x:4,y:9},
          {x:4,y:11},
          {x:4,y:14},

          {x:5,y:2},
          {x:5,y:3},
          {x:5,y:4},
          {x:5,y:6},
          {x:5,y:7},
          {x:5,y:9},
          {x:5,y:10},
          {x:5,y:12},
          {x:5,y:13},
          {x:5,y:14},

          {x:6,y:3},
          {x:6,y:5},
          {x:6,y:7},
          {x:6,y:9},
          {x:6,y:11},
          {x:6,y:13},

          {x:7,y:4},
          {x:7,y:5},
          {x:7,y:6},
          {x:7,y:10},
          {x:7,y:11},
          {x:7,y:12},

          {x:9,y:4},
          {x:9,y:5},
          {x:9,y:6},
          {x:9,y:10},
          {x:9,y:11},
          {x:9,y:12},

          {x:10,y:3},
          {x:10,y:5},
          {x:10,y:7},
          {x:10,y:9},
          {x:10,y:11},
          {x:10,y:13},

          {x:11,y:2},
          {x:11,y:3},
          {x:11,y:4},
          {x:11,y:6},
          {x:11,y:7},
          {x:11,y:9},
          {x:11,y:10},
          {x:11,y:12},
          {x:11,y:13},
          {x:11,y:14},

          {x:12,y:2},
          {x:12,y:5},
          {x:12,y:7},
          {x:12,y:9},
          {x:12,y:11},
          {x:12,y:14},

          {x:13,y:5},
          {x:13,y:6},
          {x:13,y:10},
          {x:13,y:11},

          {x:14,y:4},
          {x:14,y:5},
          {x:14,y:11},
          {x:14,y:12},
        ]
      },
      // {
      //   title: '“滑翔者枪”：它会不停地释放出一个又一个滑翔者。',
      //   src: '/images/case4.png',
      //   list: [
      //     {x:14,y:12},

      //   ]
      // },
      {
        title: '“蜂王穿梭”：周期30的振荡子。',
        src: '/images/case5.png',
        list: [
          {x:11,y:10},
          {x:12,y:8},
          {x:12,y:10},
          {x:13,y:1},
          {x:13,y:2},
          {x:13,y:7},
          {x:13,y:9},
          {x:13,y:21},
          {x:13,y:22},
          {x:14,y:1},
          {x:14,y:2},
          {x:14,y:6},
          {x:14,y:9},
          {x:14,y:21},
          {x:14,y:22},
          {x:15,y:7},
          {x:15,y:9},
          {x:16,y:8},
          {x:16,y:10},
          {x:17,y:10},

        ]
      }
    ]
  },
  onLoad() {
    this.creatScene()
  },

  creatScene() {
    const {
      colum,
      row
    } = this.data
    const mapList = []

    for (let i = 0; i < row; i++) {
      mapList.push([])
      for (let j = 0; j < colum; j++) {
        const obj = {}
        mapList[i].push(obj)
      }
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < colum; j++) {
        mapList[i][j].id = i * 10 + j
        mapList[i][j].xindex = j
        mapList[i][j].yindex = i
        mapList[i][j].alive = false
      }
    }
    this.setData({
      mapList,
    })
  },
  start() {
    if (this.data.status === GAME_STATUS.PLAYING) {
      return
    }
    this.setData({
      status: GAME_STATUS.PLAYING,
    })
    const timer = setInterval(() => {
      if (this.data.status === GAME_STATUS.PLAYING) {
        if (this.checkEnd()) {
          clearInterval(timer)
          wx.showToast({
            title: '全部死亡，游戏结束！',
            icon: 'none',
          })
          // console.log("end")
        } else {
          this.onPlay()
        }
      } else {
        clearInterval(timer)
        // console.log("end")
      }
    }, frequency)
  },
  onPlay() {
    const {
      mapList,
    } = this.data

    const nextList = JSON.parse(JSON.stringify(mapList))

    for (let i = 0; i < mapList.length; i++) {
      const rowList = mapList[i];
      for (let j = 0; j < rowList.length; j++) {
        const item = rowList[j];
        const nextItem = nextList[i][j] = Object.assign({}, item)
        const aliveCount = this.getAroundItem(j, i).filter(v => !!v.alive).length
        if (aliveCount < 2 || aliveCount > 3) {
          nextItem.alive = false
        } else if (!item.alive && aliveCount === 3) {
          nextItem.alive = true
        }
      }
    }

    this.setData({
      mapList: nextList
    })
  },
  getAroundItem(xindex, yindex) {
    const {
      mapList,
      colum,
      row
    } = this.data

    const list = []

    for (let i = 0; i < around.length; i++) {
      const offset = around[i];
      let offsetX = xindex + offset.x
      let offsetY = yindex + offset.y
      if (offsetX < 0) {
        offsetX = colum - 1
      } else if (offsetX >= colum) {
        offsetX = 0
      }

      if (offsetY < 0) {
        offsetY = row - 1
      } else if (offsetY >= row) {
        offsetY = 0
      }

      const item = mapList[offsetY][offsetX]
      list.push(item)
    }
    return list
  },
  clickItem(e) {
    const {
      xindex,
      yindex
    } = e.currentTarget.dataset
    const {
      mapList,
      colum,
      row
    } = this.data
    if (xindex < 0 || yindex < 0 || xindex > (colum - 1) || yindex > (row - 1)) {
      return
    }
    mapList[yindex][xindex].alive = !mapList[yindex][xindex].alive

    this.setData({
      mapList
    })
  },
  checkEnd() {
    const {
      mapList,
    } = this.data
    let allDeath = true
    for (let i = 0; i < mapList.length; i++) {
      const rowList = mapList[i];
      for (let j = 0; j < rowList.length; j++) {
        const item = rowList[j]
        if (item.alive) {
          allDeath = false
        }
      }
    }

    return allDeath
  },
  reset() {
    this.setData({
      status: GAME_STATUS.IDLE,
    })
    this.creatScene()
  },
  selectCase(e) {
    const {
      index,
    } = e.currentTarget.dataset
    const {
      mapList,
      caseList
    } = this.data

    const {
      list
    } = caseList[index]

    for (let i = 0; i < mapList.length; i++) {
      const rowList = mapList[i];
      for (let j = 0; j < rowList.length; j++) {
        const item = rowList[j]
        item.alive = false
        for (let k = 0; k < list.length; k++) {
          const caseItem = list[k];
          if (i === caseItem.y && j === caseItem.x) {
            item.alive = true
            break
          }
        }
      }
    }

    this.setData({
      mapList,
      showCaseOverlay: false,
      status: GAME_STATUS.IDLE,
    })
  },
  showCase() {
    this.setData({
      showCaseOverlay: true,
    })
  },
  closeCase() {
    this.setData({
      showCaseOverlay: false,
    })
  },
  showTips() {
    this.setData({
      showTipsOverlay: true,
    })
  },
  closeTips() {
    this.setData({
      showTipsOverlay: false,
    })
  }
})