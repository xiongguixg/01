// pages/selectExamType/index.js
Page({
  //存储科目
  data: {subject:0 },
  onLoad:function(opts)
  {
     //从url中读取当前是考科目几？
     let subject=opts.subject;
     this.setData({subject:subject});//存储科目
  },
  //页面加载之后
  onReady:function()
  {

   let model=wx.getStorageSync("model");//去取缓存中的的车型
   let subject=this.data.subject;//科目几
    //标题设置
  
    wx.setNavigationBarTitle({ title: "驾照类型" + model+"科目"+ subject});


   //判断题库是否存在  key：tiku——model——subject
   let cachkey="tiku_"+model+"_"+subject;//储存的键
   let tiku = wx.getStorageSync(cachkey);
    if (!tiku)//如果题库不存在
       {
           wx.setNavigationBarTitle({ title: '正在下载题库'});
           wx.showNavigationBarLoading();//加载动画
           wx.request({
             url: 'http://jiakaoapi.rupeng.cn/api/Question',
             data:{subject:subject,model:model},
             method:'GET',
             success:function(res)
             {
                 if(res.data.errorCode!=0)
                 {
                   wx.setNavigationBarTitle({title: '题库下载出错'});
                   wx.showNavigationBarLoading();//加载动画
                   return ;
                 }
                 wx.setStorageSync(cachkey, res.data.result);//保存到缓存中
                 wx.setNavigationBarTitle({title: '题库下载成功'});
                
             },
             fail:function()
             {
               wx.setNavigationBarTitle({ title: '题库下载出错' });
             },
             complete:function()
             {
               //隐藏提示消息
              wx.hideNavigationBarLoading();
             }
           })

       }
  }

})