let flag = false


// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listIndex: 0,
    screenWidth: 0,
    screenHeight: 0,
    rowData: [{
        main: {
          src: '/images/shader.png',
          name: '夜魇暗潮着色特效',
          label: '通用栏位',
        },
        left: {
          src: '/images/calabaxa.png',
          name: '忘事鬼',
          label: '夜魇暗潮信使',
        },
        right: {
          src: '/images/new_treasure.png',
          name: '珍贵衣箱',
          label: '全新夜魇暗潮珍藏',
        }
      },
      {
        main: {
          src: '/images/costumes.png',
          name: '季节幽光捆绑包',
          label: '2个捆绑包，21名英雄',
        },
        left: {
          src: '/images/diretide_wards.png',
          name: '鸟鸟和泡泡',
          label: '夜魇暗潮守卫',
        },
        right: {
          src: '/images/diretide_courier.png',
          name: '小布团',
          label: '夜魇暗潮信使',
        }
      },
      {
        main: {
          src: '/images/ghost_courier.png',
          name: '幽灵信使特效',
          label: '通用栏位',
        },
        left: {
          src: '/images/pumpkin_head.png',
          name: '南瓜头',
          label: '任意英雄',
        },
        right: {
          src: '/images/megakill.png',
          name: '连杀配音',
          label: '连杀系统广播',
        }
      },
      {
        main: {
          src: '/images/chatlines.png',
          name: '聊天语音与音效',
          label: '共13条',
        },
        left: {
          src: '/images/high_five.png',
          name: '灵异击掌',
          label: '击掌特效',
        },
        right: {
          src: '/images/killstreak.png',
          name: '击杀特效',
          label: '连杀特效',
        }
      },
      {
        main: {
          src: '/images/diretide_chest.png',
          name: '神圣宝藏',
          label: '珍藏优化',
        },
        left: {
          src: '/images/sprays.png',
          name: '灵异喷绘',
          label: '共10幅',
        },
        right: {
          src: '/images/kill_effect.png',
          name: '死亡特效',
          label: '死亡特效',
        }
      },
    ]
  },
  jumpData(){
    wx.navigateTo({
      url: '/pages/data/data',
    })
  },
  onShow: function () {
    //获取屏幕尺寸
    const info = wx.getSystemInfoSync()
    const screenWidth = info.windowWidth
    const screenHeight = info.windowHeight
    this.setData({
      //获取页面初始状态图片数量，0.63为图片容器的高度值(63vw)，将代码中0.63改为你的容器对应高度
      listIndex: screenHeight / (screenWidth * 0.63),
      screenWidth,
      screenHeight
    })
  },
  // 滚动事件 
  onPageScroll(e) {
    if(flag){
      return
    }
    flag = true
    setTimeout(()=>{
      const {
        screenHeight,
        screenWidth
      } = this.data
  
      //滚动距离+屏幕高度换算vw倍数
      let listIndex = (e.scrollTop + screenHeight) / (screenWidth * 0.7) - 2
      this.setData({
        listIndex: listIndex
      })
      flag = false
    },100)
  }
})