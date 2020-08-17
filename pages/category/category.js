var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    goodsList: [], //该分类下的商品列表
    id: 0, //分类id
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1, //当前页页码
    size: 10, //每页商品数
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1 //总页数
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.id) {
      that.setData({
        id: parseInt(options.id) //从跳转参数中获取到分类id
      });
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //获取后台数据
    this.getGoodsList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log(1);
  },
  onHide: function () {
    // 页面隐藏
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("下一页")
    this.getGoodsList()
  },
  //根据分类获取分类商品列表
  getGoodsList: function () {
    var that = this;
    if (that.data.totalPages <= that.data.page - 1) {
      that.setData({
        nomore: true
      })
      return;
    }
    //请求接口，获取数据
    util.request(api.GoodsCategory, {
        productCategoryId: this.data.id,
        pageSize: that.data.size
      })
      .then(function (res) {
        if (res.code === 200) {
          that.setData({
            goodsList: res.data.list, //当前分类id下的商品
            page: res.data.pageNum + 1, //默认显示第一页，后台数据页码从0开始，所以要加1
            totalPages: res.data.totalPage //总页数
          });
        }
      });
  },
  onUnload: function () {
    // 页面关闭
  },
})