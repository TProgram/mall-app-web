var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: '', //订单状态编号，-1->全部；0->待付款；1->待发货；2->已发货（待收货）；3->已完成；4->已关闭（已取消）
    orderList: [], //订单列表
    page: 1, //默认显示页
    size: 10, //每页订单数量
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1, //总页数
    status: ""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });
    this.getOrderList();
  },
  //根据页面交互所选订单状态显示对应状态的订单列表
  switchCate: function (event) {
    wx.showLoading({
      title: '加载中...'
    });
    var currentTarget = event.currentTarget;
    this.setData({
      orderId: currentTarget.dataset.id,
      totalPages: 1,
      page: 1,
      orderList: [],
    });
    console.log(this.data.orderId)
    this.getOrderList();
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    this.getOrderList()
  },
  //下拉刷新数据
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      orderList: [],
      page: 1,
      totalPages: 1
    });
    self.getOrderList();
  },
  //获取订单列表
  getOrderList() {
    let that = this;

    if (that.data.totalPages <= that.data.page - 1) {
      //若当前状态订单列表总页数小于1（即无当前状态订单），则显示“加载中”提示框
      that.setData({
        nomore: true
      })
      return;
    }
    that.data.orderId == -1 ? "" : that.data.orderId; //默认显示全部订单
    util.request(api.OrderList, {
      status: that.data.orderId
    }).then(function (res) {
      if (res.code === 200) {
        that.setData({
          orderList: res.data.list, //订单列表
          page: res.data.pageNum + 1, //后台数据页面编号从“0”开始，所以需要+1
          totalPages: res.data.totalPage,
        });
        wx.hideLoading();
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    });
  },
  //支付订单（去付款）
  payOrder(event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    wx.redirectTo({
      url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.payAmount,
    })
  },
  //取消订单（备注：取消订单后下拉刷新一下即可显示当前最新订单列表）
  cancelOrder(event) {
    console.log('开始取消订单');
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    let ids = order.id;
    console.log('可以取消订单的情况');
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          util.request(api.OrderCancel + "?orderId=" + ids, {
            orderId: order.id
          }, 'POST').then(function (res) {
            console.log(res.code);
            if (res.code === 200) {
              console.log(res.data);
              wx.showModal({
                title: '提示',
                content: res.data,
                showCancel: false,
                confirmText: '继续',
                success: function (res) {
                  wx.navigateBack({
                    url: 'pages/ucenter/order/order',
                  });
                }
              });
            }
          });

        }
      }
    });
  },
  //确认收货
  confirmOrder(event) {
    console.log('开始确认收货');
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    let ids = order.id;
    console.log('可以确认收货的情况');
    wx.showModal({
      title: '',
      content: '确定已经收到商品？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          util.request(api.OrderConfirm + "?orderId=" + ids, {
            orderId: order.id
          }, 'POST').then(function (res) {
            console.log(res.code);
            if (res.code === 200) {
              console.log(res.data);
              wx.showModal({
                title: '提示',
                content: res.data,
                showCancel: false,
                confirmText: '继续',
                success: function (res) {
                  wx.navigateBack({
                    url: 'pages/ucenter/order/order',
                  });
                }
              });
            }
          });
        }
      }
    });
  },
  //再次购买
  buyOrder(event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    console.log("------------------")
    console.log(order.orderItemList.productId)
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + order.orderItemList.productId,
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})