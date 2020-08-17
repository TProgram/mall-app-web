const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics1: {},
    topics2: {},
    topics3: {},
    skill: [],
    group: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    goodsCount: 0
  },
  onShareAppMessage: function () {
    // 小程序分享
    return {
      title: 'TPShop',
      desc: 'TP商城',
      title: 'TPShop',
      desc: 'TP商城',
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    var self = this;
    self.getIndexData();
  },
  //获取首页展示商品数据
  getIndexData: function () {
    let that = this;
    var data = new Object();
    //人气商品推荐
    util.request(api.IndexUrlHotGoods, {
      pageNum: 1,
      pageSize: 6
    }).then(function (res) {
      console.log(res);
      if (res.code === 200) {
        data.hotGoods = res.data
        that.setData(data);
      }
    });
    //首页轮播广告
    util.request(api.IndexUrlBanner).then(function (res) {
      console.log(res);
      if (res.code === 200) {
        data.banner = res.data.advertiseList
        that.setData(data);
      }
    });
    //获取商品总数
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data
      });
    });
  },
  onLoad: function (options) {
    this.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})