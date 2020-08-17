//var NewApiRootUrl = 'https://shop.51shop.ink/demo/api/';
var MallApiRootUrl = 'http://81.70.0.224:8085/';
//var MallApiRootUrl = 'http://127.0.0.1:8085/';
var SearchApiRootUrl = 'http://81.70.0.224:8081/';
module.exports = {
  //首页数据接口
  IndexUrlBanner: MallApiRootUrl + 'home/content', //首页轮播广告
  IndexUrlHotGoods: MallApiRootUrl + 'home/hotProductList', //首页人气商品列表
  GoodsCount: MallApiRootUrl + 'home/goodsCount', //统计商品总数

  //分类页数据接口
  CatalogList: MallApiRootUrl + 'product/categoryTreeList', //分类目录全部分类数据接口
  //CatalogCurrent: NewApiRootUrl + 'catalog/index',  //分类目录全部分类数据接口
  GoodsCategory: MallApiRootUrl + 'product/search', //获得具体分类下的产品数据
  //GoodsCategory: NewApiRootUrl + 'goods/category',  //获得具体分类数据

  //微信登录
  AuthLoginByWeixin: MallApiRootUrl + 'wx/login_by_weixin', //微信登录

  //商品信息详情页
  GoodsDetail: MallApiRootUrl + 'product/detail/', //获得商品的详情

  //GoodsDetail: NewApiRootUrl + 'goods/detail',  //获得商品的详情
  //Login: NewApiRootUrl + 'auth/login', //账号登录
  //CouponList: MallApiRootUrl + '/member/coupon/list', // 获取用户优惠券列表
  //CouponList: NewApiRootUrl + 'coupon/list', // 优惠券列表
  //GoodsCouponList: MallApiRootUrl + '/member/coupon/listByProduct/', // 根据当前商品获取优惠券列表
  //GoodsCouponList: NewApiRootUrl + 'coupon/listByGoods', // 商品优惠券列表
  //TakeMerCoupon: MallApiRootUrl + '/member/coupon/add/',//用户主动领取指定优惠卷
  //TakeMerCoupon: NewApiRootUrl + 'coupon/getMerCoupon.do',//用户主动领取商户优惠卷
  //CouponListByMer: NewApiRootUrl +'coupon/listMer.do',//获取商户优惠劵列表
  //ValidCouponList: NewApiRootUrl + 'coupon/getValidCouponList.do',//选择优惠卷列表
  //GoodsRelated: NewApiRootUrl + 'goods/related',  //商品详情页的关联商品（相关推荐）


  //BrandList: NewApiRootUrl + 'brand/list',  //品牌列表
  //BrandDetail: NewApiRootUrl + 'brand/detail',  //品牌详情

  //购物车页面相关
  CartList: MallApiRootUrl + 'cart/list', //获取购物车的数据
  CartAdd: MallApiRootUrl + 'cart/add', // 添加商品到购物车
  CartDelete: MallApiRootUrl + 'cart/delete', // 删除购物车的商品
  CartList: MallApiRootUrl + 'cart/list', //获取购物车列表的数据
  CartAdd: MallApiRootUrl + 'cart/add', // 添加商品到购物车
  CartDelete: MallApiRootUrl + 'cart/delete', // 删除购物车的商品
  CartUpdate: MallApiRootUrl + 'cart/update/attr', // 修改购物车中商品的规格
  CartUpdateQuantity: MallApiRootUrl + 'cart/update/quantity', //修改购物车中商品数量
  //BuyAdd: NewApiRootUrl + 'buy/add', // 直接购买

  //下单页面
  CartCheckout: MallApiRootUrl + 'order/generateConfirmOrder', // 根据购物车信息生成订单信息（下单）
  //BuyCheckout: NewApiRootUrl + 'buy/checkout', // 付款前信息确认
  OrderSubmit: MallApiRootUrl + 'order/generateOrder', // 提交订单
  //NewApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

  //搜索页面相关
  SearchResult: SearchApiRootUrl + 'esProduct/search/simple', //搜索结果
  GoodsList: MallApiRootUrl + 'home/newProductList', //获得商品列表
  //GoodsList: NewApiRootUrl + 'goods/list',  //获得商品列表
  //SearchResult: NewApiRootUrl + 'search/result',  //搜索数据

  //地址管理相关接口
  AddressList: MallApiRootUrl + 'member/address/list', //收货地址列表
  AddressDetail: MallApiRootUrl + 'member/address/', //收货地址详情
  AddressSave: MallApiRootUrl + 'member/address/add', //保存收货地址
  AddressDelete: MallApiRootUrl + 'member/address/delete/', //保存收货地址
  AddressUpdate: MallApiRootUrl + 'member/address/update/', // 更新地址

  //订单管理相关页面
  OrderList: MallApiRootUrl + 'order/list', //订单列表
  //OrderList: NewApiRootUrl + 'order/list',  //订单列表
  OrderDetail: MallApiRootUrl + 'order/detail/', //根据id获取订单详情
  //OrderDetail: NewApiRootUrl + 'order/detail',  //订单详情
  OrderCancel: MallApiRootUrl + 'order/cancelUserOrder', //用户取消订单
  //OrderCancel: NewApiRootUrl + 'order/cancelOrder',  //取消订单
  OrderConfirm: MallApiRootUrl + 'order/confirmReceiveOrder', //用户确认收货
  //OrderConfirm: NewApiRootUrl + 'order/confirmOrder',  //确认收货

  //意见反馈
  FeedbackAdd: MallApiRootUrl + 'feedback/add', //添加反馈

  //注册账户相关
  /* SmsCode: NewApiRootUrl + 'sendRegisterCode', //发送短信
   BindMobile: NewApiRootUrl + 'inviteReg', //fx注册
  //Login: NewApiRootUrl + 'auth/login', //账号登录
   //Register: NewApiRootUrl + 'auth/register', //注册*/

  //订单支付   
  //OrderQuery: NewApiRootUrl + 'pay/query', //确认支付
  //OrderSuccess: NewApiRootUrl + 'order/updateSuccess',   //支付成功

 /* WhSave: NewApiRootUrl + 'upkeep/save.do', //维护历史保存
  WhUpdate: NewApiRootUrl + 'upkeep/update.do', //维护历史修改
  QueryObject: NewApiRootUrl + 'upkeep/queryObject.do', //
  BirthdayList: NewApiRootUrl + 'user/getBirthdayList', //生日列表
  Holiday: NewApiRootUrl + 'user/getHoliday', //节假日提醒
  CreateCode: NewApiRootUrl + 'auth/createCode',
  UserInfoById: NewApiRootUrl + 'user/getUserInfoById.do', //获取实名认证信息
  UpkeepUpdate: NewApiRootUrl + 'upkeep/update.do', //编辑维护历史
  SetFid: NewApiRootUrl + 'mlsuser/setFid', //mlsuser/setFid*/
}