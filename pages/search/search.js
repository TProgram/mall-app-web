var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    keyword: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 10,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
  },
  //事件处理函数
  //退出搜索
  closeSearch: function () {
    wx.navigateBack()
  },
  //清除关键词
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {

  },
  //输入有变
  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
  },
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }
  },
  //清除搜索历史
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })

    util.request(api.SearchClearHistory, {}, 'POST')
      .then(function (res) {
        console.log('清除成功');
      });
  },
  //获取搜索结果商品列表
  getGoodsList: function () {
    let that = this;
    util.request(api.SearchResult, {
      keyword: that.data.keyword
    }).then(function (res) {
      if (res.code === 200) {
        that.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data.list,
          filterCategory: res.data.list.productCategoryName,
          page: res.data.pageNum,
          size: res.data.pageSize,
        });
      }

      //重新获取关键词
      //that.getSearchKeyword();
    });
  },
  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  //获取搜索结果
  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  //筛选（可根据需要自行开发实现）
  /* openSortFilter: function (event) {
     let currentId = event.currentTarget.id;
     switch (currentId) {
       case 'categoryFilter'://类别
         this.setData({
           'categoryFilter': !this.data.categoryFilter,
           'currentSortOrder': 'asc'
         });
         break;
       case 'priceSort'://价格区间
         let tmpSortOrder = 'asc';
         if (this.data.currentSortOrder == 'asc') {
           tmpSortOrder = 'desc';
         }
         this.setData({
           'currentSortType': 'price',
           'currentSortOrder': tmpSortOrder,
           'categoryFilter': false
         });

         this.getGoodsList();
         break;
       default:
         //综合排序
         this.setData({
           'currentSortType': 'default',
           'currentSortOrder': 'desc',
           'categoryFilter': false
         });
         this.getGoodsList();
     }
   },
   //按类别筛选
   selectCategory: function (event) {
     let currentIndex = event.target.dataset.categoryIndex;
     let filterCategory = this.data.filterCategory;
     let currentCategory = null;
     for (let key in filterCategory) {
       if (key == currentIndex) {
         filterCategory[key].selected = true;
         currentCategory = filterCategory[key];
       } else {
         filterCategory[key].selected = false;
       }
     }
     this.setData({
       'filterCategory': filterCategory,
       'categoryFilter': false,
       categoryId: currentCategory.id,
       page: 1,
       goodsList: []
     });
     this.getGoodsList();
   },*/
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})