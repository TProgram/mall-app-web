var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    address: {
      id: 0,
      city: '广州市', //省份城市区县
      city_code: '',
      province: '广东省', // 省
      region: '海珠区', // 区
      detailAddress: '', //详细地址
      userName: '', //收货人姓名
      telNumber: '', //收货人电话
      is_default: 0 //是否为默认地址
    },
    addressId: 0,
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  //输入电话号码
  bindinputMobile(event) {
    let address = this.data.address;
    address.telNumber = event.detail.value;
    this.setData({
      address: address
    });
  },
  //输入收货人姓名
  bindinputName(event) {
    let address = this.data.address;
    address.userName = event.detail.value;
    this.setData({
      address: address
    });
  },
  //输入详细地址
  bindinputAddress(event) {
    let address = this.data.address;
    address.detailAddress = event.detail.value;
    this.setData({
      address: address
    });
  },
  //设置默认地址状态
  bindIsDefault() {
    let address = this.data.address;
    address.is_default = !address.is_default;
    this.setData({
      address: address
    });
  },
  //获取地址详情
  getAddressDetail() {
    let that = this;
    util.request(api.AddressDetail + that.data.addressId).then(function (res) { //, { id: that.data.addressId }
      console.log(res.data);
      if (res.code === 200) {
        if (res.data) {
          let address = that.data.address
          address.city = res.data.city
          address.province = res.data.province
          address.region = res.data.region
          address.detailAddress = res.data.detailAddress
          address.userName = res.data.name
          address.telNumber = res.data.phoneNumber
          address.is_default = res.data.defaultStatus == 1
          address.id = res.data.id
          that.setData({
            region: [address.province, address.city, address.region],
            address: address
          });
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    console.log(options);
    if (options.id != '' && options.id != 0 && options.id != undefined) {
      that.setData({
        addressId: options.id
      });
      that.getAddressDetail();
    }
  },
  onReady: function () {

  },
  cancelAddress() {
    wx.navigateBack({
      url: '/pages/ucenter/address/address',
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log('picker发送选择改变，携带值为', e.detail.code)
    let that = this
    let address = that.data.address
    address.province = e.detail.value[0]
    address.city = e.detail.value[1]
    address.region = e.detail.value[2]
    this.setData({
      region: e.detail.value,
      address: address
    })
  },

  saveAddress() {
    console.log(this.data.address)
    let address = this.data.address;

    if (address.userName == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }

    if (address.telNumber == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }

    if (!util.validatePhone(address.telNumber)) {
      util.showErrorToast('请输入正确手机号码');
      return false;
    }

    if (address.detailInfo == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }

    console.log(address)
    if (address.id == 0) { // 插入地址(添加地址)
      util.request(api.AddressSave, {
        city: address.city,
        defaultStatus: address.is_default ? 1 : 0,
        detailAddress: address.detailAddress,
        id: address.id,
        name: address.userName,
        phoneNumber: address.telNumber,
        province: address.province,
        region: address.region
      }, 'POST').then(function (res) {
        if (res.code === 200) {
          wx.navigateBack({
            url: '/pages/ucenter/address/address',
          })
        }
      });
    } else { // 更新地址
      util.request(api.AddressUpdate + address.id, {
        city: address.city,
        defaultStatus: address.is_default ? 1 : 0,
        detailAddress: address.detailAddress,
        id: address.id,
        name: address.userName,
        phoneNumber: address.telNumber,
        province: address.province,
        region: address.region
      }, 'POST').then(function (res) {
        if (res.code === 200) {
          wx.navigateBack({
            url: '/pages/ucenter/address/address',
          })
        }
      });
    }
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