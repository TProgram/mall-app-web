var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
  data: {
    cartGoods: [],
    cartTotal: {
      'goodsCount': 0, //商品数量
      'goodsAmount': 0.00, //商品价格
      'checkedGoodsCount': 0, //所选商品数量
      'checkedGoodsAmount': 0.00 //所选商品总价
    },
    isEditCart: false, //是否处于编辑购物车状态
    checkedAllStatus: true, //是否处于全选状态
    editCartList: [] //编辑购物车
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //获取购物车列表
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.code === 200) {
        let counts = 0;
        let mounts = 0;
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]["checked"] = true
          counts = counts + res.data[i].quantity;
          mounts = mounts + res.data[i].price * res.data[i].quantity;
        }
        that.setData({
          cartGoods: res.data,
          cartTotal: res.data.length,
          'cartTotal.goodsCount': counts,
          'cartTotal.goodsAmount': mounts,
          'cartTotal.checkedGoodsCount': counts,
          'cartTotal.checkedGoodsAmount': mounts,
          checkedAllStatus: that.isCheckedAll()
        });
      }
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  //选中商品
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    if (!this.data.isEditCart) {
      //处于未编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }
        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount(),
        'cartTotal.checkedGoodsAmount': that.getCheckedGoodsAmount()
      });
    } else {
      //处于编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }
        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  //获取选中的商品数量
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.quantity;
      }
    });
    return checkedGoodsCount;
  },
  //获取选中的商品价格
  getCheckedGoodsAmount: function () {
    let checkedGoodsAmount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsAmount += (v.price * v.quantity);
      }
    });
    return checkedGoodsAmount;
  },
  //全选
  checkedAll: function () {
    let that = this;
    if (!this.data.isEditCart) {
      //未编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount(),
        'cartTotal.checkedGoodsAmount': that.getCheckedGoodsAmount()
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  //编辑购物车
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      //编辑状态
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //当前不属于编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  //更新购物车中商品的数量
  //数量减少
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.quantity - 1 > 1) ? cartItem.quantity - 1 : 1;
    cartItem.quantity = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    util.request(api.CartUpdateQuantity + "?id=" + cartItem.id + "&quantity=" + cartItem.quantity, 'GET').then(function (res) {
      if (res.code === 200) {
        this.setData({
          cartGoods: res.data,
        });
      }
    })
  },
  //数量增加
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.quantity + 1;
    cartItem.quantity = number; //更新商品数量
    this.setData({
      cartGoods: this.data.cartGoods
    });
    util.request(api.CartUpdateQuantity + "?id=" + cartItem.id + "&quantity=" + cartItem.quantity, 'GET').then(function (res) {
      if (res.code === 200) {
        this.setData({
          cartGoods: res.data,
        });
      }
    })
  },
  //获取已选择的商品,下单
  checkoutOrder: function () {
    let that = this;
    var checkedGoods = that.data.cartGoods.filter(function (element) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    checkedGoods = checkedGoods.map(function (element) {
      if (element.checked == true) {
        return element.id;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }
    wx.setStorageSync('checkedGoods', checkedGoods);
    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },
  //删除购物车中的商品
  deleteCart: function () {
    let that = this;
    let productIds = this.data.cartGoods.filter(function (element) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    productIds = productIds.map(function (element) {
      if (element.checked == true) {
        return element.id;
      }
    });
    if (productIds.length <= 0) {
      return false;
    }
    util.request(api.CartDelete + "?ids=" + productIds.join(','), {
      // 此处后端使用post方法，但是依旧通过url传参数，所以post为空就好
    }, 'POST').then(function (res) {
      if (res.code === 200) {
        let newData = []
        that.data.cartGoods.forEach(function (val) {
          if (val.checked != true) {
            newData.push(val)
          }
        })
        that.setData({
          cartGoods: newData,
          cartTotal: newData.length,
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  }
})