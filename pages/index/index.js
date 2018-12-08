// pages/index/index.js
const categoryMap = {
  'gn': '国内',
  'gj': '国际',
  'cj': '财经',
  'yl': '娱乐',
  'js': '军事',
  'ty': '体育',
  'other': '其他',
}

// 使用moment库转换时间
var moment = require('../../libs/moment-cn.min.js'); // 精简压缩moment库, 压缩80%体积
moment.locale('zh-cn');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],  // 导航 列表
    category:'gn',     // 目前 导航
    newsList: [],      // list 新闻列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setcategoryList()
    this.getNewsList()
  },

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getNewsList(()=>{
      wx.stopPullDownRefresh()
    })
  },
  // 导航 
  setcategoryList(){
    let categoryClass = ['gn', 'gj', 'cj', 'yl', 'js', 'ty', 'other']
    let categoryList = []
    for (let i = 0; i < 7; i++) {
      categoryList.push({
        cateClass: categoryClass[i],
        cateChina: categoryMap[categoryClass[i]]
      })
    }
    this.setData({
      categoryList: categoryList
    })
  },
  // 变更当前栏目
  onTapCategory(event) {
    this.setData({
      category: event.currentTarget.dataset.category
    })
    this.getNewsList()
  },
  getNewsList(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data:{
        type: this.data.category
      },
      success:res=>{
        let result = res.data.result
        this.setNewsList(result)
      },
      complete:()=>{
        callback && callback()
      }
    })
  },
  setNewsList(result){
    let newsList = []
    for (let i = 0; i < result.length; i++) {
      newsList.push({
        id: result[i].id,
        title: result[i].title.slice(0, 30),                            //处理过长的标题
        time: moment(result[i].date).fromNow(),
        source: result[i].source || '',                                 //值不存在的情况
        firstImage: result[i].firstImage || "/images/default-news.png", //值不存在的情况
      })
    }
    this.setData({
      newsList: newsList
    })
  },
  // 跳转到详情页面
  onTapNews(event) {
    let newsID = event.currentTarget.dataset.newsid
    wx.navigateTo({
      url: '/pages/list/list?id=' + newsID
    })
  }
})