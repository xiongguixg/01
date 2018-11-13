
Page({
   data:{model:"",subject:0,examType:"",tiku:[],timu:null,
      showAnswer:false,
      crrcheck:false
   },
   onLoad:function(opts)
   {
     let model=wx.getStorageSync("model");
     let subject=opts.subject;
     let examType=opts.examType;
     //console.log("类型"+model+"科目"+subject+"练习"+examType);
     let dict = {"shunxu":"顺序练习","suiji":"随机练习","cuoti":"错题练习"};
     let text = dict[examType];
     wx.setNavigationBarTitle({ title: model + "科目" + subject +text});
     this.setData({ model: model, subject: subject, examType:examType});
     
     if(examType=="cuoti")//错题题库
     {
       let key = "cuoti_" + model + "_" + subject;
       let cuotis=wx.getStorageSync(key)||[];
       this.setData({ tiku: cuotis});


     } else if (examType == "shunxu" || examType == "suiji")
     {
       let cachkey = "tiku_" + model + "_" + subject;//储存的键
       let tiku = wx.getStorageSync(cachkey)//从缓存中读取题库
       if (!tiku)//在次判断一下题库是否存在    防御性编程
       {
         wx.showModal({
           title: '错误',
           content: '题库未下载',
           showCancel: false
         })
       }
       this.setData({ tiku: tiku });//不能超过1024kb
     }
     else
      {
        console.error("错误类型");
      }
    
  },
  getTimType:function(timu)//判断题目的类型
  {
        if(timu.item3=="")
        {
          return "判断题";
        }else if(timu.answer<=4)
        {
          return "单选题";
        }else
        {
          return "多选题";
        }
     
  },
  onReady:function()
  {  
    this.gotoNext();
    
    //第一个
     //let timu=this.data.tiku[0];
     //this.showTimu(timu);
     /*
     let timuType=this.getTimType(timu);
    this.setData({ timu: timu, timuType: timuType});//设置当前题目*/
  },
        //todo 滑屏切题

        gotoNext:function()//切下一题
        {
              //顺序练习与错题练习  下一题事件
          if (this.data.examType=="shunxu"||this.data.examType=="cuoti")
          {
            if(!this.data.timu)//第一加载的时候还没有值
            //防止  if (newTimu.id == this.data.timu.id)出错
            {
             
              let timu=this.data.tiku[0];
              if (timu!=undefined)
              {
                this.showTimu(timu);
              }else
              {
                wx.showToast({
                  title: '还没有错题呢'
                });
              
              }
              
            }
            else{
              //先计算单前是第几题
              for (let i = 0; i < this.data.tiku.length; i++) {
                let newTimu = this.data.tiku[i];
                if (newTimu.id == this.data.timu.id) {
                  if (i == this.data.tiku.length - 1) {
                    wx.showToast({
                      title: '已经是最后一题了',
                    })
                  }
                  else {
                    let nextTimu = this.data.tiku[i + 1];
                    this.showTimu(nextTimu);

                    break;
                  }
                }

              }

            }
         
 
          } else if(this.data.examType == "suiji")//随机练习
          {
            //生成随机数
            let newIndex =parseInt(Math.random()*this.data.tiku.length);
            let nextTimu = this.data.tiku[newIndex];
            this.showTimu(nextTimu);//展示题目
          }
            
        },
        showTimu:function(timu)
        {
          let timuType = this.getTimType(timu);
          this.setData({ timu: timu, timuType: timuType, crrcheck: false, showAnswer: false});
        },
      getDuoxuanAnserDesc: function (userAnser)
          {
            let dict={7:"AB",8:"AC",9:"AD",10:"BC",11:"BD",12:"CD",13:"ABC",14:"ABD",15:"ACD",16:"BCD",17:"ABCD"};
            
           let anser=dict[userAnser];
            if (anser)
            {
              return anser;
            }
            else
            {
              console.error("未知答案");
            }
          },
      getDuoxuanAnser:function(userAnser)
      { 
         let str="";
         for(let i=0;i<userAnser.length;i++)
         {
           str=str+userAnser[i];
           switch(str)
           {
             case "AB":
               return 7;
             case "AC":
               return 8;
             case "AD":
               return 9;
             case "BC":
               return 10;
             case "BD":
               return 11;
             case "CD":
               return 12;
             case "ABC":
               return 13;
             case "ABD":
               return 14;
             case "ACD":
               return 15;
             case "BCD":
               return 16;
             case "ABCD":
               return 17;
               default: 
                  console.log("未知答案");
           }
         }
      },
          getDanxuanAnser: function (userAnser) 
          { 
            
            switch (userAnser) {
                case "A":
                  return 1;
                case "B":
                  return 2;
                case "C":
                  return 3;
                case "D":
                  return 4;
                  default:
                  console.log("未知答案");
            
            }
          },
          //添加错题
          addToCuoTi:function(timu)
          { 
             // key: cuoti_model_subject
             let key="cuoti_"+this.data.model+"_"+this.data.subject;
             let cuotis=wx.getStorageSync(key)||[];
             for(let  i=0;i<cuotis.length;i++)
             {
               if(cuotis[i].id==timu.id)
               {
                 return;
               }
             }
             cuotis.push(timu);
            wx.setStorageSync(key, cuotis)//保存在文件中
          },
      formSubmit: function (e) {
        let timu=this.data.timu;
        let timuType=this.data.timuType;
        if(timuType=="多选题")
        {
              let userAnser = e.detail.value.duoxuanValue;
              //对比答案
              if (timu.answer == this.getDuoxuanAnser(userAnser))
              {
                wx.showToast({ title: '正确'});
              }
              else
              {
                wx.showToast({ title: '错误' });
                this.addToCuoTi(timu);
              }
              //把数字答案转换为 A  B 
              let answerDesc = this.getDuoxuanAnserDesc(timu.answer)
              this.setData({ answerDesc:answerDesc});
        } else if (timuType == "单选题")
        {
          let userAnser = e.detail.value.danxunValue;
            if (timu.answer == this.getDanxuanAnser(userAnser))
            {
              wx.showToast({ title: '正确' });
            }else
            {
              wx.showToast({ title: '错误' });
              this.addToCuoTi(timu);
            }
          let dict = { 1: "A", 2: "B", 3: "C", 4: "D" };
          let answerDesc = dict[timu.answer];
          this.setData({ answerDesc: answerDesc });

          
        } else if (timuType == "判断题")
        {
          let userAnser = (e.detail.value.pandunValue=="A")?1:2;
          if (timu.answer==userAnser)
          {
            wx.showToast({ title: '正确' });
          }
          else
           {
           wx.showToast({ title: '错误' });
            this.addToCuoTi(timu);
          }
          let answerDesc = ((timu.answer == 1)?"正确":"错误");
          this.setData({ answerDesc: answerDesc });
        }
        //显示答案
        this.setData({showAnswer:true});
      }
 
})