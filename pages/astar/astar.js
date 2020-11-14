const TYPE = {
  IDLE: "IDLE",
  START: "START",
  END: "END",
  OBSTACLES: "OBSTACLES",
  OPEN: "OPEN",
  CLOSE: "CLOSE",
  ACTIVE: "ACTIVE"
}

const GAME_STATUS = {
  IDLE: "IDLE",
  SELECT: "SELECT",
  BUILD: "BUILD",
  PLAYING: "PLAYING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL"
}

let buildLock = true

const frequency = 200
let tempList = []

Page({
  data: {
    colum: 16,
    row: 20,
    mapList: [],
    itemList: [],
    activeList: [],
    openList: [],
    closeList: [],
    obstaclesList: [],
    aroundList: [],
    startItem: null,
    endItem: null,
    currentItem: null,
    shortItem: null,
    status: GAME_STATUS.IDLE

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
    const itemList = []

    for (let i = 0; i < row; i++) {
      mapList.push([])
      for (let j = 0; j < colum; j++) {
        const obj = {}
        itemList.push(obj)
        mapList[i].push(obj)
      }
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < colum; j++) {
        mapList[i][j].id = i * 10 + j
        mapList[i][j].fvalue = 0
        mapList[i][j].gvalue = 0
        mapList[i][j].hvalue = 0
        mapList[i][j].parent = null
        mapList[i][j].type = TYPE.IDLE
        mapList[i][j].xindex = j
        mapList[i][j].yindex = i
        mapList[i][j].color = '#D8D8D8'
      }
    }
    this.setData({
      itemList,
      mapList,
    })
    this.setItemColor()
  },
  start() {
    if (this.data.startItem == null || this.data.endItem == null) {
      wx.showToast({
        title: '请选择起始点！',
      })
      return
    }
    this.setData({
      status: GAME_STATUS.PLAYING,
      openList: [this.data.startItem],
    })
    this.setItemData(this.data.startItem, null)
    const timer = setInterval(() => {
      if (this.data.status === GAME_STATUS.PLAYING) {
        this.findPath()
      } else {
        clearInterval(timer)
        console.log("end")
      }
      this.checkArrive()
    }, frequency)
  },
  findPath() {
    this.getShortPathItem()
    this.data.currentItem = this.data.shortItem
    this.data.openList = this.data.openList.filter(i => i.id != this.data.currentItem.id)
    this.data.closeList = this.data.closeList.concat(this.data.currentItem)
    this.setRoundItemData()
    this.showCurrentPath();
    this.setItemColor()
  },
  getShortPathItem() {
    let {
      openList,
      aroundList,
      currentItem,
    } = this.data
    if (openList.length <= 0) {
      this.setData({
        status: GAME_STATUS.FAIL
      })
      wx.showToast({
        title: '寻路失败!',
      })
      return
    }

    let minItem = openList[0];
    let minValue = minItem.fvalue;
    for (let i = 0; i < openList.length; i++) {
      const item = openList[i]
      if (item.fvalue <= minValue) {
        minItem = item;
        minValue = item.fvalue;
      }
    }

    if (aroundList.length <= 0) {
      this.data.shortItem = minItem
    } else {
      if (minValue <= currentItem.fvalue) {
        this.data.shortItem = minItem
      } else {
        this.data.currentItem = currentItem.parent
        if (this.data.currentItem === null) {
          this.data.shortItem = minItem
        } else {
          this.getShortPathItem();
        }
      }
    }
  },
  setRoundItemData() {
    const {
      colum,
      row,
      currentItem,
      obstaclesList,
      startItem,
      openList,
      closeList,
      mapList
    } = this.data
    this.data.aroundList = []

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const tempX = currentItem.xindex + i - 1;
        const tempY = currentItem.yindex + j - 1;
        if (tempX < 0 || tempY < 0 || tempX > (colum - 1) || tempY > (row - 1)) continue;
        const item = mapList[tempY][tempX]
        if (obstaclesList.includes(item) || closeList.includes(item)) continue;

        if (currentItem !== item && startItem !== item) {
          if (openList.includes(item)) {
            let cost = 0;
            if (item.xindex === currentItem.xindex || item.yindex == currentItem.yindex) {
              cost = 1;
            } else {
              cost = 1.4;
            }
            if (item.gvalue > currentItem.gvalue + cost) {
              this.setItemData(item, currentItem);
            }
          } else {
            this.setItemData(item, currentItem);
            this.data.openList = this.data.openList.concat(item)
          }
          this.data.aroundList = this.data.aroundList.concat(item)
        }
      }
    }
  },
  setItemData(item, parentItem) {
    item.parent = parentItem

    if (parentItem !== null) {
      let cost = 0;
      if (parentItem.xindex === item.xindex || parentItem.yindex === item.yindex) {
        cost = 1;
      } else {
        cost = 1.4;
      }
      item.gvalue = cost + parentItem.gvalue;
    } else {
      item.gvalue = 0;
    }

    if (this.data.endItem !== null) {
      item.hvalue = Math.abs(this.data.endItem.xindex - item.xindex) + Math.abs(this.data.endItem.yindex - item.yindex);
    }

    item.fvalue = item.gvalue + item.hvalue;
  },
  changeStatus(e) {
    const {
      type
    } = e.currentTarget.dataset
    this.setData({
      status: GAME_STATUS[type]
    })
    if (this.data.status === GAME_STATUS.SELECT) {
      this.setData({
        startItem: null,
        endItem: null,
      })
    }
    this.setItemColor()
  },
  clickItem(e) {
    const {
      xindex,
      yindex
    } = e.currentTarget.dataset
    const {
      obstaclesList,
      mapList,
      status,
      startItem,
      endItem
    } = this.data
    const item = mapList[yindex][xindex]
    if (status === GAME_STATUS.BUILD) {
      if (!obstaclesList.includes(item)) {
        this.setData({
          obstaclesList: obstaclesList.concat(item)
        })
      } else {
        this.setData({
          obstaclesList: obstaclesList.filter(i => i.id !== item.id)
        })
      }
    } else if (status === GAME_STATUS.SELECT) {
      if (startItem == null) {
        this.setData({
          startItem: item
        })
      } else if (endItem == null) {
        this.setData({
          endItem: item,
          status: GAME_STATUS.IDLE
        })
      }
    }
    this.setItemColor()
  },
  showCurrentPath() {
    const {
      startItem,
    } = this.data
    this.data.activeList = [this.data.currentItem]

    if (this.data.currentItem === startItem) {
      return;
    }

    let parentItem = this.data.currentItem.parent;
    while (parentItem !== null && parentItem != startItem) {
      this.data.activeList = this.data.activeList.concat(parentItem)
      parentItem = parentItem.parent
    }
  },
  checkArrive() {
    const {
      currentItem,
      endItem
    } = this.data
    if (currentItem != null && endItem != null &&
      currentItem.xindex == endItem.xindex && currentItem.yindex == endItem.yindex) {
      this.setData({
        status: GAME_STATUS.SUCCESS
      })
      wx.showToast({
        title: '寻路成功!',
      })
    }
  },
  setItemColor() {
    const {
      obstaclesList,
      startItem,
      endItem,
      activeList,
      openList,
      closeList,
      itemList
    } = this.data
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i]
      if (startItem === item) {
        item.color = '#e2bd3b'
      } else if (endItem === item) {
        item.color = 'green'
      } else if (openList.indexOf(item) > -1) {
        item.color = '#bb1c33'
      } else if (activeList.indexOf(item) > -1) {
        item.color = '#084495'
      } else if (closeList.indexOf(item) > -1) {
        item.color = '#6b7c87'
      } else if (obstaclesList.indexOf(item) > -1) {
        item.color = 'black'
      } else {
        item.color = '#D8D8D8'
      }
    }
    this.setData({
      mapList: this.data.mapList
    })
  },
  reset() {
    this.setData({
      activeList: [],
      openList: [],
      closeList: [],
      obstaclesList: [],
      aroundList: [],
      startItem: null,
      endItem: null,
      currentItem: null,
      shortItem: null,
      status: GAME_STATUS.IDLE,
    })
    this.creatScene()
  },
  sliderChange(e) {
    // const {
    //   value
    // } = e.detail
    // this.setData({
    //   frequency: value
    // })
  },
  touchstart(e) {
    tempList = []
    // console.log(e)
  },
  touchmove(e) {
    const {
      status,
      obstaclesList,
      mapList
    } = this.data
    if (status === GAME_STATUS.BUILD) {
      const {
        pageX,
        pageY
      } = e.touches[0]
      const item = mapList[Math.floor(pageY / 22)][Math.floor(pageX / 22)]
      if (!obstaclesList.includes(item) && !tempList.includes(item)) {
        tempList.push(item)
      }
    }
  },
  touchend(e) {
    const {
      obstaclesList
    } = this.data
    this.setData({
      obstaclesList: obstaclesList.concat(tempList)
    })
  }
})