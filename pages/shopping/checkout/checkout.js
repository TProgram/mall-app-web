var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {}, //所选地址
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    couponPrice: 0.00, //优惠券的价格
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    addressId: 0, //地址id
    couponId: 0,
    isBuy: false,
    buyType: '',
    couponIdArr: [],
    item: {},
    type: null,
    activityType: 1 //活动类型
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.isBuy) {
      this.setData({
        isBuy: options.isBuy
      })
    }
    if (options.addressId) {
      this.setData({
        addressId: options.addressId
      })
    }
    if (options.type) {
      this.setData({
        type: options.type
      })
    }
    if (options.activityType) {
      this.setData({
        activityType: options.activityType
      })
    }
    this.data.buyType = this.data.isBuy ? 'detailBuy' : 'cart'
    //每次重新加载界面，清空数据
    app.globalData.userCoupon = 'NO_USE_COUPON'
    app.globalData.courseCouponCode = {}
  },
  //获取订单确认信息
  getCheckoutInfo: function () {
    let that = this;
    var url = api.CartCheckout
    let buyType = this.data.isBuy ? 'detailBuy' : 'cart'
    var sumPrice = 0
    let cartIds = wx.getStorageSync('checkedGoods')
    util.request(url, cartIds, "POST").then(function (res) {
      if (res.code === 200) {
        for (var i = 0; i < res.data.cartPromotionItemList.length; i++) {
          sumPrice += res.data.cartPromotionItemList[i].price
        }
        let checkedAddress = {}
        if (res.data.memberReceiveAddressList.length > 0) {
          checkedAddress = res.data.memberReceiveAddressList[0]
        }
        that.setData({
          checkedGoodsList: res.data.cartPromotionItemList, //所选下单商品信息
          checkedAddress: checkedAddress, //所选地址
          freightPrice: res.data.calcAmount.freightAmount, //运费
          goodsTotalPrice: res.data.calcAmount.totalAmount, //商品总价
          orderTotalPrice: res.data.calcAmount.payAmount //订单总价
        });
        //设置默认收获地址
        if (that.data.checkedAddress) {
          let addressId = that.data.checkedAddress.id;
          if (addressId) {
            that.setData({
              addressId: addressId
            });
          }
        } else {
          wx.showModal({
            title: '',
            content: '请添加默认收货地址!',
            success: function (res) {
              if (res.confirm) {
                that.selectAddress();
                console.log('用户点击确定')
              }
            }
          })
        }
      }
      wx.hideLoading();
    });
  },
  //选择收货地址
  selectAddress() {
    wx.navigateTo({
      url: '/pages/ucenter/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //支付订单（去付款）(备注：因后台暂未实现微信支付申请相关功能，故此处提交订单暂时只实现跳转到支付订单确认界面，提交订单数据到后台，处于待付款状态，暂未完成实际的支付功能)
  payOrder: function () {
    let that = this;
    let order = that.data.checkedGoodsList;
    let payAmount = that.data.goodsTotalPrice;
    if (that.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    wx.showLoading({
      title: '提交中'
    })
    var param = {}
    param.memberReceiveAddressId = that.data.addressId
    param.cartIds = wx.getStorageSync('checkedGoods')
    util.request(api.OrderSubmit, param, 'POST').then(res => {
      //提交订单数据到后台
      wx.hideLoading()
      if (res.code === 200) {
        const orderId = res.data.order.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          }); //因为微信支付需要向腾讯申请，这个功能没有实现
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
    wx.redirectTo({
      url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + payAmount,
    })
  },
})