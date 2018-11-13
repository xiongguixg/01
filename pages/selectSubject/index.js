// pages/selectSubject/index.js
Page({

  settingTap:function()
  {
    //重定向  在传递自定义的参数 1  去给页面判断
   wx.redirectTo({
     url: '../selectCarType/index?action=1',
   })

  },
  onReady:function()
  {
    let mode=wx.getStorageSync("model")
    wx.setNavigationBarTitle({title:"驾照类型"+mode});
  },
  subjectTap:function(e)
  {
    let subject = e.currentTarget.dataset.subject;
    //console.log(subject);
    wx.navigateTo({
      url: '../selectExamType/index?subject=' + subject
    })
  }
})