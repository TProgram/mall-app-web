var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({
  data: {
    winHeight: "", //页面高度相关参数
    id: 0, //商品id参数
    userId: 0, //用户id
    productList: [], //商品相关所有信息
    goods: {}, //商品信息
    gallery: [], //商品展示图（轮播图）
    attribute: [], //商品参数
    attributevlue: [], //商品参数值
    issueList: [], //常见问题
    brand: {}, //品牌信息
    specificationList: [], //商品规格
    cartGoodsCount: 0, //购物车图标显示购物车商品数量
    number: 1, //加购、购买商品数量
    checkedSpecText: '请选择规格数量',
    checkedSpecPrice: 0, //所选规格对应价格
    yprice: 0, //佣金
    proId: 0, //产品id
    proImg: '', //产品展示图
    openAttr: false, //规格选择窗口是否打开
    cimPart: true, //显示底端按钮
    backImage: "", //退出规格选择窗口图标
    nowtime: 0,
    type: 0,
    ntype: '',
  },
  //分享
  onShareAppMessage: function () {
    const share_obj = {
      title: this.data.goods.name,
      imageUrl: this.data.goods.pic,
      path: 'pages/goods/goods?id=' + this.data.id + '&userId=' + wx.getStorageSync('uId')
    }
    return share_obj
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      nowtime: new Date().getTime() + 20000
    });
    if (options.id) {
      that.setData({
        id: options.id, //从跳转参数中获取商品id
      });
    }
    if (options.type) {
      that.setData({
        type: options.type,
      });
    }
    if (options.userId) {
      //以当前登录用户的id作为用户id
      wx.setStorageSync('userId', options.userId) //以当前登录用户的id作为用户id
    }
    if (options.q) {
      const q = decodeURIComponent(options.q)
      that.setData({
        id: util.getQueryString(q, 'id')
      });
      wx.setStorageSync('userId', util.getQueryString(q, 'userId'))
      that.newLogin()
    }
    that.getGoodsInfo();
    var that = this
    //高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow: function () {
    //页面显示
    let token = wx.getStorageSync('token');
    this.cartGoodsCount();
  },
  //获取商品详细信息
  getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail + that.data.id).then(function (res) {
      if (res.code === 200) {
        that.setData({
          productList: res.data,
          goods: res.data.product, //商品信息
          gallery: res.data.product.pic, //商品展示 （备注：此处商品展示图本应调用的是res.data.product.albumPics(相册)的图片数据，但因为后台数据相册中的图片数据没有切割开，无法正常显示，故暂时此处暂时使用封面图进行展示）
          attribute: res.data.productAttributeList, //商品参数
          issueList: res.data.issue, //常见问题
          brand: res.data.brand, //品牌信息
          attributevlue: res.data.productAttributeValueList, //商品参数值
          specificationList: res.data.skuStockList, //商品规格
        });
        //设置默认值
        that.setDefSpecInfo(that.data.specificationList);
        WxParse.wxParse('goodsDetail', 'html', res.data.product.detailHtml, that); //商品图文详细展示
      }
    });

  },
  //选择商品规格属性
  clickSkuValue: function (event) {
    let that = this
    let state = event.currentTarget.dataset.state;
    let id = event.currentTarget.dataset.nameId;
    let price = event.currentTarget.dataset.price;
    // 如果为无货导致的禁用 直接返回
    if (state) {
      return;
    }
    this.unSelectValue()
    this.selectValue(id)
    that.setData({
      "checkedSpecPrice": price
    })
  },
  //选中规格
  selectValue: function (id, specNameId) {
    let that = this
    for (var z = 0; z < that.data.specificationList.length; z++) {
      if (that.data.specificationList[z].id == id) {
        that.data.specificationList[z].checked = true
        break
      }
    }
    that.setData({
      'specificationList': that.data.specificationList
    });
  },
  //取消选择
  unSelectValue: function () {
    let that = this;
    for (var z = 0; z < that.data.specificationList.length; z++) {
      if (that.data.specificationList[z].checked == true) {
        that.data.specificationList[z].checked = false
      }
    }
    that.setData({
      'specificationList': that.data.specificationList
    });
  },
  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].value.length; j++) {
        if (_specificationList[i].value[j].checked) {
          _checkedObj.valueId = _specificationList[i].value[j].id;
          _checkedObj.valueText = _specificationList[i].value[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }
    return checkedValues;
  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {},
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return true
  },
  //获取选中规格关键值
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });
    return checkedValue.join('_');
  },
  //调整规格信息
  changeSpecInfo: function () {
    let that = this;
    let checkedNameValue = that.getCheckedSpecValue();
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }
  },
  //获取购物车中商品数量
  cartGoodsCount: function () {
    let that = this
    util.request(api.CartList).then(function (res) {
      if (res.code === 200) {
        that.setData({
          cartGoodsCount: res.data.length,
        });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
        backImage: "/static/images/detail_back.png"
      });
    }
  },
  //跳转到首页
  goUrl: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //退出商品规格选择界面
  closeAttrOrCollect: function () {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
        backImage: ""
      });
    }
  },
  //跳转到购物车页面
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },
  //获取选中相应规格后的商品信息(该函数仅在直接购中调用,后台缺少该功能，待完善)
  getCheckedProductItem: function (key) {
    console.log('---------00--------00----:', this.data.productList)
    return this.data.productList.filter(function (v) {
      if (v.skuStockList.id = key) {
        return true;
      } else {
        return false;
      }
    });
  },
  //直接购买（立即购）（后台缺少接口，暂未完成）
  /*buyGoods: function (e) {
    var that = this;
    var ntype = e.target.dataset.ntype || ''
    var activityType = e.target.dataset.activitytype || '';
    var groupBuyingId = e.target.dataset.groupbuyingid || '';
    that.setData({
      groupBuyingId: groupBuyingId
    });
    if (that.data.openAttr == false) {
      //规格选择窗口未打开
      that.setData({
        openAttr: !that.data.openAttr,//打开规格选择窗口
        backImage: "/static/images/detail_back.png"
      });
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.setStorageSync('isYJ', that.data.isYJ);
      //提示选择完整规格
      if (!that.isCheckedAllSpec()) {
        wx.showToast({
          title: '请选择完整规格'
        });
        return false;
      }
      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = that.getCheckedProductItem(that.getCheckedSpecKey());
      if (that.getCheckedSpecKey() != "") {
        if (!checkedProduct || checkedProduct.length <= 0) {
          //找不到对应的product信息，提示没有库存
          wx.showToast({
            title: '库存不足'
          });
          return false;
        }
      } else {
        if (that.data.goods.goods_number < that.data.number) {
          wx.showToast({
            title: '库存不足'
          });
          return false;
        }
      }
      // 直接购买商品
      util.request(api.BuyAdd, {
          goodsId: that.data.goods.id,
          number: that.data.number,
          productId: that.data.proId ? that.data.proId : that.data.productList[0].id
        }, "POST")
        .then(function (res) {
          wx.hideLoading();
          let _res = res;
          if (_res.errno == 0) {
            that.setData({
              openAttr: !that.data.openAttr
            });
            wx.navigateTo({
              url: '/pages/shopping/checkout/checkout?isBuy=true&type=' + ntype + '&groupBuyingId=' + groupBuyingId + '&activityType=' + activityType
            })
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }
        });
    }
  },*/

  //添加到购物车(加入购)
  addToCart: function () {
    var that = this;
    if (that.data.openAttr == false) {
      //规格选择窗口未打开
      that.setData({
        openAttr: !this.data.openAttr, //打开规格选择窗口
        backImage: "/static/images/detail_back.png"
      });
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.setStorageSync('isYJ', that.data.isYJ);
      let attr = null
      for (var z = 0; z < that.data.specificationList.length; z++) {
        if (that.data.specificationList[z].checked == true) {
          attr = that.data.specificationList[z]
          break
        }
      }
      if (attr === null) {
        //规格为空（未选择规格）
        wx.showToast({
          title: '请选择规格'
        });
        return false;
      }
      console.log(that.data.goods)
      //加购商品相关信息
      let goodsData = {
        "price": attr.price,
        "productAttr": attr.spData,
        "productBrand": that.data.goods.brandName,
        "productCategoryId": that.data.goods.productCategoryId,
        "productId": that.data.goods.id,
        "productName": that.data.goods.name,
        "productPic": that.data.goods.pic,
        "productSkuCode": attr.skuCode,
        "productSkuId": attr.id,
        "productSn": that.data.goods.productSn,
        "productSubTitle": that.data.goods.subTitle,
        "quantity": that.data.number,
      }
      //添加到购物车，将加购商品相关信息作为参数发送到后台接口，完成后台数据写入更新
      util.request(api.CartAdd, goodsData, "POST") .then(function (res) {
          wx.hideLoading();
          let _res = res;
          if (_res.code == 200) {
            wx.showToast({
              title: '添加成功'
            });
            that.cartGoodsCount();
            that.setData({
              openAttr: !that.data.openAttr,
            });
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.message,
              mask: true
            });
          }
        });
      }
  },
  //加购数量减
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  //加购数量加
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
  setDefSpecInfo: function (specificationList) {
    //未考虑规格联动情况
    let that = this;
    let hasDefault = false;
    let price = 0

    if (!specificationList) return;
    for (let z = 0; z < specificationList.length; z++) {
      specificationList[z]["checked"] = false
      specificationList[z]["state"] = false
      if (specificationList[z].stock > 0) {
        specificationList[z]["state"] = true
        if (!hasDefault) {
          specificationList[z]["checked"] = true
          price = specificationList[z].price
          hasDefault = true
        }
      }
    }
    console.log("nsalsnaln" + specificationList)
    that.setData({
      'specificationList': specificationList,
      "checkedSpecPrice": price
    })
  },
  newLogin: function () {
    let that = this;
    //重新登陆
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                //用户按了允许授权按钮
                user.loginByWeixin(res).then(res => {
                  let userInfo = wx.getStorageSync('userInfo');
                  app.globalData.userInfo = userInfo.userInfo;
                  app.globalData.token = res.data.openid;
                  that.cartGoodsCount();
                }).catch((err) => {
                  console.log(err)
                });
              }
            })
          } else {
            wx.showModal({
              title: '警告通知',
              content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
                        user.loginByWeixin(e.detail).then(res => {
                          let userInfo = wx.getStorageSync('userInfo');
                          this.setData({
                            userInfo: userInfo.userInfo
                          });
                          app.globalData.userInfo = userInfo.userInfo;
                          app.globalData.token = res.data.openid;
                          that.cartGoodsCount();
                        }).catch((err) => {
                          console.log(err)
                        });
                      }
                    }
                  })
                }
              }
            });
          }
        }
      })
    }
  }
})