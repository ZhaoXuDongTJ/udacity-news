// 使用moment库转换时间
var moment = require('../../libs/moment-cn.min.js');
moment.locale('zh-cn');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsID: '',
    articleInfo:{},
    articleNode:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      newsID: options.id
    })
    this.getArticle()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getArticle(() => {
      wx.stopPullDownRefresh()
    })
  },
  getArticle(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data:{
        id:this.data.newsID
      },
      success:res=>{
        let result = res.data.result
        this.setArticleInfo(result)
      },
      complete:()=>{
        callback && callback()
      }
    })
  },
  setArticleInfo(articleInfo){
    articleInfo.time = moment(articleInfo.date).format('YYYY-MM-DD hh:mm')
    let articleNodes = this.convertArticleNodes(articleInfo.content)
    this.setData({
      articleInfo: articleInfo,
      articleNodes: articleNodes
    })

  },
  // 渲染新闻富文本
  convertArticleNodes(content) {
    let nodes = []
    for (let i = 0; i < content.length; i += 1) {
      if (content[i].type === 'image') {
        nodes.push([{
          name: 'img',
          attrs: {
            class: 'article-img', // 设定为图像类
            src: content[i].src
          }
        }])
      }
      else {
        nodes.push([{
          name: content[i].type,
          attrs: {
            class: 'article-text' // 设定为文本类
          },
          children: [{
            type: 'text',
            text: content[i].text
          }]
        }
        ])
      } 
    } 
    return nodes;
  }
})