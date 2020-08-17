var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    navList: [], //一级分类列表
    currentCategory: [], //二级分类
    currentInfo: {}, //分类项相关信息
    goodsCount: 0 //商品总数
  },
  //页面初始化
  onLoad: function (options) {
    //调用函数，请求数据
    this.getCatalog();
  },
  //获取分类页面相关数据
  getCatalog: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    //分类列表
    util.request(api.CatalogList).then(function (res) {
      console.log(res);
      that.setData({
        navList: res.data,
        // 此处 child为 data数组中 某元素的值 需要加上index,此处默认展示第一个
        currentCategory: res.data[0].children, //二级分类信息
        currentInfo: res.data[0] //一级分类具体信息
      });
      wx.hideLoading();
    });
    //获取商品总数
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data
      });
    });
  },
  //根据一级分类获取其对应的二级分类
  getCurrentCategory: function (id) {
    console.log("getCurrentCategory" + id)
    // 不请求接口 因为该数据在getCatalog已经请求获取了
    let that = this;
    that.setData({
      // id 从 1开始 因此我们需要减1
      currentCategory: this.data.navList[id - 1].children, //根据用户点击选择的一级分类获取其二级分类内容
      currentInfo: this.data.navList[id - 1] //用户所选的一级分类具体信息
    });
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
  },
  //点击切换不同的一级分类
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }
    //调用自定义函数
    this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})