var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {}, //订单信息
    orderGoods: [], //订单中商品信息
    handleOption: {},
    status: 0, //订单状态
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  //订单细节
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail + that.data.orderId).then(function (res) {
      if (res.code === 200) {
        console.log(res.data);
        that.setData({
          orderInfo: res.data,
          orderGoods: res.data.orderItemList,
          status: res.data.status
        });
      }
    });
  },
  //取消订单
  cancelOrder() {
    console.log('开始取消订单');
    let that = this;
    let orderInfo = that.data.orderInfo;
    let ids = orderInfo.id;
    console.log(orderInfo);
    var order_status = orderInfo.status;
    console.log(order_status);
    var errorMessage = '';
    //不能取消订单的情况（由当前订单状态决定）
    switch (order_status) {
      case 2: {
        console.log('已发货，不能取消');
        errorMessage = '订单已发货';
        break;
      }
      case 3: {
        console.log('已收货，不能取消');
        errorMessage = '订单已收货';
        break;
      }
      case 4: {
        console.log('已经取消');
        errorMessage = '订单已取消';
        break;
      }
      //备注：后端程序订单状态中并无以下几种情况，可根据需求自行开发
      case 102: {
        console.log('已经删除');
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        console.log('已经退款');
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        console.log('已经退款退货');
        errorMessage = '订单已退货';
        break;
      }
    }

    if (errorMessage != '') {
      console.log(errorMessage);
      util.showErrorToast(errorMessage);
      return false;
    }
    //可以取消订单的情况。
    //备注：点击取消订单按钮后，可返回订单管理界面，下拉刷新页面即可更新页面显示的订单状态
    console.log('可以取消订单的情况');
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          util.request(api.OrderCancel + "?orderId=" + ids, {
            orderId: orderInfo.id
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
  //支付(去付款)
  payOrder() {
    let that = this;
    let order = that.data.orderInfo;
    wx.redirectTo({
      url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.payAmount,
    })
  },
  //确认收货
  confirmOrder() {
    console.log('开始确认收货');
    let that = this;
    let orderInfo = that.data.orderInfo;
    let ids = orderInfo.id;
    console.log(orderInfo);
    var order_status = orderInfo.status;
    console.log(order_status);
    var errorMessage = '';
    //不能确认收货的情况（由当前订单状态决定）
    switch (order_status) {
      case 3: {
        console.log('已收货，不能再收货');
        errorMessage = '订单已收货';
        break;
      }
      case 4: {
        console.log('已经取消');
        errorMessage = '订单已取消';
        break;
      }
      //备注：后端程序订单状态中并无以下几种情况，可根据需求自行开发
      case 102: {
        console.log('已经删除');
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        console.log('已经退款');
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        console.log('已经退款退货');
        errorMessage = '订单已退货';
        break;
      }
    }
    if (errorMessage != '') {
      console.log(errorMessage);
      util.showErrorToast(errorMessage);
      return false;
    }
    //可以确认收货的情况。
    //备注：点击确认收货按钮后，可返回订单管理界面，下拉刷新页面即可更新页面显示的订单状态
    console.log('可以确认收货的情况');
    wx.showModal({
      title: '',
      content: '确定已经收到商品？',
      success: function (res) {
        if (res.confirmStatus) {
          console.log('用户点击确定');
          util.request(api.OrderConfirm + "?orderId=" + ids, {
            orderId: orderInfo.id
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