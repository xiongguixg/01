
Page({
  data: {
    cars: [{ imgSrc: "/images/xiaoche.png", name: "小车", model: "c1c2" },
      { imgSrc: "/images/keche.png", name: "客车", model: "a1b1" }, 
      { imgSrc: "/images/huoche.png", name: "货车", model: "a2b2"}]

  },
 onLoad:function(opt)
 {
   let action= opt.action;
   if (action!=1)
   {
     //读取是否缓存存在
     let model = wx.getStorageSync("model");
     //
     if (model) {
       wx.redirectTo({
         url: '/pages/selectSubject/index'
       });

     }
   }
 
 
 },
  carTap:function(e)
  { //设置缓存
    let model = e.currentTarget.dataset.model;
    wx.setStorageSync("model", model );
    //跳转页面  
    wx.redirectTo({
      url:'/pages/selectSubject/index',
    })
  }

})