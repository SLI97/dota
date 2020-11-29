let pageNum = 1,
  flag = false

Page({
  data: {
    cateList: ['综合新闻', '官方新闻', '赛事新闻', '更新日志', '全部攻略', '新手攻略', '进阶攻略', '技巧攻略'],
    newsList: [],
    typeIndex: 0,
    topNum: 0,
    loading: false,
    showBackTop: false,
    isLoaded: false,
    total: 400,
  },
  onLoad() {
    this.getData()
  },
  getData() {
    const {
      typeIndex,
      newsList
    } = this.data
    wx.cloud.callFunction({
        name: 'getNewsData',
        data: {
          typeIndex,
          pageNum,
        },
      })
      .then(res => {
        const temp = res.result.map(i => {
          if (i.img.indexOf('http') === -1 && i.img.indexOf('www.dota2.com') === -1) {
            i.img = '/images/placeholder.png'
          }
          return i
        })
        this.setData({
          newsList: newsList.concat(temp),
          loading: false,
          isLoaded: true
        })
        console.log(res.result)
      })
      .catch(console.error)
  },
  changeCategory(e = {
    target: {
      dataset: {
        index: 0
      }
    }
  }) {
    const {
      index
    } = e.target.dataset
    this.setData({
      typeIndex: index,
      newsList: []
    })

    pageNum = 1
    this.getData()
  },
  async scrollBottom() {
    try {
      if (this.data.loading) {
        return
      }
      this.setData({
        loading: true
      });
      pageNum += 1
      this.getData();
    } catch (e) {
      this.setData({
        loading: false
      });
    }
  },
  onViewScroll(e) {
    if (flag) {
      return
    }
    flag = true
    setTimeout(() => {
      //滚动距离+屏幕高度换算vw倍数
      if (e.detail.scrollTop > 1000 && !this.data.showBackTop) {
        this.setData({
          showBackTop: true
        })
      } else if (e.detail.scrollTop < 1000 && this.data.showBackTop) {
        this.setData({
          showBackTop: false
        })
      }
      flag = false
    }, 100)
  },
  backTop() {
    const topNum = this.data.topNum === 0 ? -1 : 0;
    this.setData({
      topNum
    })
  },
  jumpDetail(e) {
    const {
      index
    } = e.currentTarget.dataset
    const {
      url
    } = this.data.newsList[index]
    wx.navigateTo({
      url: `/pages/detail/detail?id=${url}`,
    });
  }
})