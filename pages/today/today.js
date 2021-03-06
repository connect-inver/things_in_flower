// pages/today/today.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnWidth: 310,
    starUrl: '../../image/star.png',
    starHlUrl: '../../image/star_hl.png',
    scrollFlag: false,
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'today',
      success: function (res) {
        that.setData({
          todayList: res.data
        })
        // 设置页面滚动
        if (res.data.length > 5) {
          that.setData({
            scrollFlag: true
          })
        } else {
          that.setData({
            scrollFlag: false
          })
        }
      }
    })
    wx.getStorage({
      key: 'tomorrow',
      success: function(res) {
        if (res.data) {
          that.setData({
            tomorrowList: res.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'today',
      success: function (res) {
        that.setData({
          todayList: res.data
        })
        // 设置页面滚动
        if (res.data.length > 5) {
          that.setData({
            scrollFlag: true
          })
        } else {
          that.setData({
            scrollFlag: false
          })
        }
      }
    })
    if (this.data.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: '今天'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '时间计划表'
      })
    }
    wx.getStorage({
      key: 'sugars',
      success: function (res) {
        that.setData({
          sugars: res.data
        })
      }
    })
    wx.getStorage({
      key: 'tomorrow',
      success: function (res) {
        if (res.data) {
          that.setData({
            tomorrowList: res.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '时间都去哪儿了😨',
      path: 'pages/today/today',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  scroll: util.debounce(function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    if (e.detail.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: '今天'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '时间计划表'
      })
    }
  }, 500),
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var btnWidth = this.data.btnWidth;
      var leftStyle = "";
      var rightStyle = '';
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        leftStyle = "left:20rpx";
        rightStyle = "right: -310rpx;"
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        leftStyle = "left:-" + disX + "rpx";
        var right = btnWidth - disX;
        rightStyle = "right: -" + right + 'rpx'
        if (disX >= btnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          leftStyle = "left:-" + btnWidth + "rpx";
          rightStyle = "right: 0";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.todayList;
      list[index].leftStyle = leftStyle;
      list[index].rightStyle = rightStyle;
      // //更新列表的状态
      this.setData({
        todayList: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX + 20;
      var btnWidth = this.data.btnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var leftStyle = disX > btnWidth / 5 ? "left:-" + btnWidth + "rpx" : "left:20rpx";
      var rightStyle = disX > btnWidth / 5 ? "right: 0" : "right: -310rpx"
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.todayList;
      list[index].leftStyle = leftStyle;
      list[index].rightStyle = rightStyle
      //更新列表的状态
      this.setData({
        todayList: list
      });
    }
  },  
  bindTimeChange: function (e) {
    var timeStart, timeEnd, isSure;
    var that = this;
    var array = this.data.todayList;
    var index = e.target.dataset.index;
    var key = e.target.dataset.time;  // 开始时间或者结束时间
    if (key == 'timeStart') {
      timeStart = e.detail.value;
      timeEnd = array[index].timeEnd;
      isSure = util.compareTime(timeStart, timeEnd)
    } else {
      timeEnd = e.detail.value;
      timeStart = array[index].timeStart;
      isSure = util.compareTime(timeStart, timeEnd)
    }
    if (isSure) {
      array[index][key] = e.detail.value;
    } else {
      this.setData({
        title: '提示',
        message: '开始时间不能大于结束时间哦',
        loading: true
      })
      return
    }
    this.setData({
      todayList: array
    })
  },
  bindfocus: function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList;
    todayList[index].placeholder = '';
    this.setData({
      todayList: todayList
    })
  },
  addRecord: function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList
    todayList[index].leftStyle = "left: 20rpx";  // 返回原来的位置
    todayList[index].rightStyle = "right: -310rpx"; // 返回原来的位置
    var timeStart = todayList[index].timeStart;
    var timeEnd = todayList[index].timeEnd;
    var newStart = timeEnd;
    var newEnd = util.newTime(timeEnd);
    let item = {
      "timeStart": newStart,
      "timeEnd": newEnd,
      "placeholder": "开启新的一天",
      "leftStyle": 'left: 20rpx',
      "rightStyle": 'right: -310rpx',
      "value": '',
      "stars": 0
    }
    todayList.splice(index + 1, 0, item);
    this.setData({
      todayList: todayList,
      scrollFlag: true     // 页面可以滚动
    })
    wx.setStorage({
      key: 'today',
      data: todayList,
    })
    // 滚动到新添加的安排
    var that = this;
    setTimeout(function () {
      that.setData({
        scrollTop: that.data.scrollTop + 60
      })
    }, 250)
  },
  delRecord: function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList;
    todayList.splice(index, 1);

    wx.setStorage({
      key: 'today',
      data: todayList,
    })
    // 设置页面滚动
    if (todayList.length < 6) {
      this.setData({
        scrollFlag: false,
        scrollTop: 0,
        todayList: todayList
      })
    } else {
      this.setData({
        scrollFlag: true,
        todayList: todayList
      })
    }
  },
  bindInput: util.debounce(function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList;
    todayList[index].value = e.detail.value
    this.setData({
      todayList: todayList
    })
  }, 500),
  oneStar: function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList;
    if (todayList[index].stars == 1) {
      todayList[index].stars = 0;
    } else {
      todayList[index].stars = 1;
    }
    this.setData({
      todayList: todayList
    })
    wx.setStorage({
      key: 'today',
      data: todayList,
    })
  },
  twoStar: function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList;
    if (todayList[index].stars == 2) {
      todayList[index].stars = 1;
    } else {
      todayList[index].stars = 2;
    }   
    this.setData({
      todayList: todayList
    })
    wx.setStorage({
      key: 'today',
      data: todayList,
    })
  },
  threeStar: function (e) {
    var index = e.target.dataset.index;
    var todayList = this.data.todayList;
    if (todayList[index].stars == 3) {
      todayList[index].stars = 2;
    } else {
      todayList[index].stars = 3;
    }  
    this.setData({
      todayList: todayList
    })
    wx.setStorage({
      key: 'today',
      data: todayList,
    })
  },
  outLoading: function () {
    this.setData({
      loading: false
    })
  },
  
  collectData: function () {
    var data = this.data.todayList;
    var isEmpty = data.some(function (item) {
      return item.value == ''
    })
    if (!isEmpty) {
      wx.setStorage({
        key: 'today',
        data: data,
      })
      wx.navigateTo({
        url: '../components/alldata/alldata',
      })
    } else {
      this.setData({
        title: '提示',
        message: '还有时间安排没填哦',
        loading: true
      })
    }
  }
})