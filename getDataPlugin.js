(function(){
	var choiceDate=function(param){
		this.initDate=new Date();
		this.default={
			today:this.initDate.getDate(),//今天日期
			//获取当前年，月，日
			year:this.initDate.getFullYear(),
			month:(this.initDate.getMonth()+1)>9?(this.initDate.getMonth()+1):("0"+(this.initDate.getMonth()+1)),
			day:this.initDate.getDay(),
			lastday:{},//保存本次数据最后一天的所有信息
			firstday:{},//保存本次数据当天的所有数据，用来和下次进来比较，判断是否想要更新生成数据
			data:{},//保存需求的所有数据
			monthLength:12,//控制生成多少个月的数据
			startmsg:{},
			endmsg:{},
			clicknum:1
		}
		try{//safair无痕浏览模式禁用localstorage
			localStorage.setItem("try","true");
			this.haveLocalStorage=true;
		}catch(e){
			this.haveLocalStorage=false;
		}
		console.log(this.default);
		this.Init();
		this.holder();
		//this.returnData();
	}

	choiceDate.prototype.Init=function(){//初始化数据
		var dataH=document.getElementById("date").clientHeight;
		var titH=document.querySelector(".app-navbar").clientHeight;
		var tit_h=document.querySelector(".title").clientHeight;
		var box=document.getElementById("box");
		box.style.cssText="overflow:hidden;height:"+(dataH-titH-tit_h)+"px";
		
		var allData={};
			//当天再次调用，直接使用存储数据
		allData=this.getData();
		console.log(allData);
		this.draw(allData);
	}
	choiceDate.prototype.getData=function(){//生成日期数据
		var flag=0;//标识当前月是否闰月，0：本月30天 1：31天 2：二月28天 3：2月29天
		var run=[1,3,5,7,8,10,12],ping=[4,6,9,11];//run31天的月份，ping30天的月份	
		var twelveMonth=[];//保存12个月的数据
		var weekflag=new Date(this.default.year,parseInt(this.default.month)-1,1).getDay();//保存每月第一天在一周中的序列，周日是0周六是7
		var dateFlag=1;//给每个日期一个从1开始的编号，方便处理选择日期的关系
		var temData={};//临时保存生成的数据

		for(var i=0;i<this.default.monthLength;i++){
			var dayNum=30;//当前月天数
			var monthdata={
			};
			if(parseInt(this.default.month)>12){
				this.default.year++;
				this.default.month=1;
			}
			if(run.indexOf(parseInt(this.default.month))>-1){
				flag=1;
				dayNum=31;
			}else if(ping.indexOf(parseInt(this.default.month))>-1){
				flag=0;
				dayNum=30;
			}else{
				if (this.default.year%4==0) {//闰年2月
					flag=3;
					dayNum=29;
				}else{
					flag=2;
					dayNum=28;
				}
			}
			this.default.month=parseInt(this.default.month)>=10?this.default.month:"0"+parseInt(this.default.month);
			var dates=[];//保存一个月内所有天的信息
			var total=0,crossWeek=1;//记录当月跨几周，5周的话j循环为35，六周42 4周28
			if(dayNum>35-weekflag){//跨六周
				total=42;
				crossWeek=6;
			}else if(28<dayNum<=35-weekflag){//跨五周
				total=35
				crossWeek=5
			}else{
				total=28
				crossWeek=4;
			}
			for(var j=1;j<=total;j++){
				var daymsg={//保存一天所有信息
					//"absoluteday":year+"年"+parseInt(month)+"月"+
				};
				if(j<=weekflag|| j>(weekflag+dayNum)){//当月第一天所在周前面的天或最后一天所在周后面的不做任何操作
					daymsg={
						"class":"",
						"inset":"",
						"id":"",
						"name":""
					}
				}else{
					var inset=j-weekflag;//当前天是几号
					
					var ID=""+this.default.year+this.default.month+(inset>9?inset:"0"+inset);
					if(i==0&&inset<this.default.today){//第一个月今天前面的不可点击
						daymsg={
							"class":"disabled",
							"inset":inset,
							"id":"",
							"name":""
						}
					}else if(i==0&&inset==this.default.today){//今天
						daymsg={
							"class":"today",
							"inset":inset,
							"istoday":"今天",
							"id":dateFlag,
							"name":ID
						}
						this.default.firstday=daymsg;//保存当前天
						dateFlag++;
					}else{
						var liClass="";
						if ((inset+weekflag)%7==0||(inset+weekflag-1)%7==0) {//周六或周日
							liClass="weekday";
						}else{
							liClass="normal";
						}
						
						daymsg={
							"class":liClass,
							"inset":inset,
							"id":dateFlag,
							"name":ID
						}
						dateFlag++;
					}

				}
				dates.push(daymsg);
			}
			monthdata={
				"title":this.default.year+"年"+this.default.month+"月",
				"flag":flag,
				"data":dates
			};
			twelveMonth.push(monthdata);

			weekflag=(weekflag+dayNum)%7;
			this.default.month++;
		}

		return {
			"today":this.default.firstday,
			"data":twelveMonth
		}
	}

	choiceDate.prototype.draw=function(allData){//渲染内容
		var twelveMonth=allData.data;
		this.wrap=document.createElement("div");
		this.wrap.setAttribute("id","fbox");
		this.wrap.style.cssText="height:100%;overflow:auto;-webkit-overflow-scrolling:touch;";
		var dfm=document.createDocumentFragment();
		for(var h=0;h<twelveMonth.length;h++){
			var fbox2=document.createElement("div");
			fbox2.setAttribute("class","fbox2");
			var dfm2=document.createDocumentFragment();
			var tit=document.createElement("div");
			tit.setAttribute("class","monTitle");
			var txt=document.createTextNode(twelveMonth[h].title);
			tit.appendChild(txt);
			dfm2.appendChild(tit);
			var ul=document.createElement("div");
			ul.setAttribute("class","ul");
			for(var k=0;k<twelveMonth[h].data.length;k++){
				var  span=document.createElement("span");
				span.setAttribute("class",twelveMonth[h].data[k].class);
				span.setAttribute("id","id"+twelveMonth[h].data[k].id);
				span.setAttribute("name",twelveMonth[h].data[k].name);
				var sdiv=document.createElement("div"),sa=document.createElement("a");
				sdiv.setAttribute("class","link");
				if(h==0&&twelveMonth[h].data[k].class=="today"){
					var temdiv=document.createDocumentFragment();
					var spantxt=document.createTextNode(twelveMonth[h].data[k].istoday);
					sdiv.appendChild(spantxt);
					temdiv.appendChild(sdiv);
					spantxt=document.createTextNode(twelveMonth[h].data[k].inset);
					sa.appendChild(spantxt);
					var ssdiv=document.createElement("div");
					ssdiv.setAttribute("class","link");
					ssdiv.appendChild(sa);
					temdiv.appendChild(ssdiv);
					span.appendChild(temdiv);
				}else{
					var spantxt=document.createTextNode(twelveMonth[h].data[k].inset);
					sa.appendChild(spantxt);
					sdiv.appendChild(sa);
					span.appendChild(sdiv);
				}
				
				ul.appendChild(span);
			}
			dfm2.appendChild(ul);
			fbox2.appendChild(dfm2);
			dfm.appendChild(fbox2);
		}
		
		this.wrap.appendChild(dfm);
		var box=document.querySelector("#box");
		box.appendChild(this.wrap);
		if(this.haveLocalStorage){
			var localData=localStorage.getItem("oldData");//从本地存储获取数据
			localData=JSON.parse(localData);
			if(localData&&localData[0].name){//本地没有数据,或者当天没有初始化日期则重新生成
				console.log(localData);
				this.default.startmsg=localData[0];
				this.default.endmsg=localData[1];
				this.default.clicknum=3;
				this.drawOld();
			}
		}
		
	}

	choiceDate.prototype.drawOld=function(){//修改渲染
		console.log(this.default);
		var msg=this.default;
		var start=document.querySelector("#"+msg.startmsg.targetId);
		start.setAttribute("class",msg.startmsg.targetClass);
		var startElement=document.createElement("div");
		startElement.setAttribute("class","startClass");
		var starttxt=document.createTextNode("开始");
		startElement.appendChild(starttxt);
		start.appendChild(startElement);
		var end=document.querySelector("#"+msg.endmsg.targetId);
		end.setAttribute("class",msg.endmsg.targetClass);
		var endElement=document.createElement("div");
		endElement.setAttribute("class","startClass");
		var endtxt=document.createTextNode("结束");
		endElement.appendChild(endtxt);
		end.appendChild(endElement);
		var startId=parseInt(this.default.startmsg.targetId.slice(2)),endId=parseInt(this.default.endmsg.targetId.slice(2));
		if(endId-startId>1){
			for (var i = 1; i < (endId-startId); i++) {
				var choiceId=startId+i;
				var initClass=document.querySelector("#id"+choiceId).getAttribute("class");
				document.querySelector("#id"+choiceId).setAttribute("class","choiced "+initClass);
			}
		}
	}

	choiceDate.prototype.holder=function(){//绑定单击事件
		var self=this;
		var clickHandler=function(e){
			var name="", targetId="", targetClass="",target;
			if(e.target.parentElement.parentElement.nodeName.toLocaleLowerCase()=="span"){
				target=e.target.parentElement.parentElement;
				name=e.target.parentElement.parentElement.getAttribute("name");
				targetId=e.target.parentElement.parentElement.getAttribute("id");
				targetClass=e.target.parentElement.parentElement.getAttribute("class");
			}else if(e.target.parentElement.nodeName.toLocaleLowerCase()=="span"){
				target=e.target.parentElement;
				name=e.target.parentElement.getAttribute("name");
				targetId=e.target.parentElement.getAttribute("id");
				targetClass=e.target.parentElement.getAttribute("class");
			}else{
				target=e.target;
				name=e.target.getAttribute("name");
				targetId=e.target.getAttribute("id");
				targetClass=e.target.getAttribute("class");
			}
			// targetClass=targetClass.replace(/choiced/,"");
			// targetClass=targetClass.replace(/linkStart/,"");
			// targetClass=targetClass.replace(/linkend/,"");
			// targetClass=targetClass.replace(/start/,"");
			// targetClass=targetClass.replace(/end/,"");
			// targetClass=targetClass.replace(/linkStart/,"");
			targetClass=self.reg(targetClass);
			if(targetClass=="disabled"||targetClass==""||targetClass=="monTitle"||targetClass=="fbox2"){//点击已过去的时间，不作操作
				return;
			}
			//var name=e.target.getAttribute("name"), targetId=e.target.getAttribute("id"), targetClass=e.target.getAttribute("class");
			if(self.default.clicknum>2){
				targetClass=targetClass.replace(/choicetoday/,"");
				var reStartId=parseInt(self.default.startmsg.targetId.slice(2)),reendId=parseInt(self.default.endmsg.targetId.slice(2));
				if((reendId-reStartId)>1){
					var nodeArr=document.querySelectorAll(".choiced");
					var reg=/choiced/;
					for (var y = 1; y < (reendId-reStartId); y++) {
						var nowElement=document.querySelector("#id"+(reStartId+y));
						var oldClass=nowElement.getAttribute("class");
						var newClass=oldClass.replace(reg,"");
						nowElement.setAttribute("class",newClass);
					}
					
				}
				self.default.startmsg.targetClass=self.default.startmsg.targetClass.replace(/choicetoday/,"");
				
				// self.default.startmsg.targetClass=reg(self.default.startmsg.targetClass);
				// self.default.endmsg.targetClass=reg(self.default.endmsg.targetClass);
				document.querySelector(".start").removeChild(document.querySelector(".startClass"));//删除开始结束标签
				document.querySelector(".end").removeChild(document.querySelector(".startClass"));//删除开始结束标签
				// self.default.startmsg.targetClass=self.reg(self.default.startmsg.targetClass);
				// self.default.endmsg.targetClass=self.reg(self.default.endmsg.targetClass);
				document.querySelector(".start").setAttribute("class",self.reg(self.default.startmsg.targetClass));//删除原来开始位置
				document.querySelector(".end").setAttribute("class",self.reg(self.default.endmsg.targetClass));//删除原来结束位置
                self.default.startmsg={};
                self.default.endmsg={};
				self.default.clicknum=1;
			}else if(name<=self.default.startmsg.name){
				targetClass=targetClass.replace(/choicetoday/,"");
				document.querySelector(".start").removeChild(document.querySelector(".startClass"));//删除开始结束标签
				document.querySelector(".start").setAttribute("class",self.default.startmsg.targetClass);//删除原来开始位置
				//document.querySelector("#"+targetId).setAttribute("class",targetClass+" start");//重新设置开始位置
				self.default.clicknum=1;
			}
			if(self.default.clicknum==1){
				self.default.startmsg={
					//"target":target,
					"name":name,
					"targetId":targetId,
					"targetClass":targetClass
				}
				var regtoday=/today/ig;
				if(regtoday.test(self.default.startmsg.targetClass)){
					targetClass="choicetoday "+self.default.startmsg.targetClass;
				}
				var startElement=document.createElement("div");
				startElement.setAttribute("class","startClass");
				var starttxt=document.createTextNode("开始");
				startElement.appendChild(starttxt);
				document.querySelector("#"+targetId).setAttribute("class",targetClass+" start");
				document.querySelector("#"+targetId).appendChild(startElement);
				self.default.startmsg.targetClass=targetClass;
			}else if(self.default.clicknum==2){
				self.default.endmsg={
					//"target":target,
					"name":name,
					"targetId":targetId,
					"targetClass":targetClass
				}
				var endElement=document.createElement("div");
				endElement.setAttribute("class","startClass");
				var endttxt=document.createTextNode("结束");
				endElement.appendChild(endttxt);
				document.querySelector("#"+targetId).setAttribute("class",targetClass+" end");
				document.querySelector("#"+targetId).appendChild(endElement);
				document.querySelector(".start").setAttribute("class","linkStart start "+self.default.startmsg.targetClass);
				document.querySelector(".end").setAttribute("class","linkend end "+self.default.endmsg.targetClass);
				var startId=parseInt(self.default.startmsg.targetId.slice(2)),endId=parseInt(self.default.endmsg.targetId.slice(2));
				if(endId-startId>1){
					for (var i = 1; i < (endId-startId); i++) {
						var choiceId=startId+i;
						var initClass=document.querySelector("#id"+choiceId).getAttribute("class");
						document.querySelector("#id"+choiceId).setAttribute("class","choiced "+initClass);
					}
				}
				var getstart=document.querySelector(".start");
				self.default.startmsg={
					//"target":getstart,
					"name":getstart.getAttribute("name"),
					"targetId":getstart.getAttribute("id"),
					"targetClass":getstart.getAttribute("class")
				}
				var getend=document.querySelector(".end");
				self.default.endmsg={
					//"target":getend,
					"name":getend.getAttribute("name"),
					"targetId":getend.getAttribute("id"),
					"targetClass":getend.getAttribute("class")
				}
			}
			self.default.clicknum++;
		}
		var father=self.wrap;
		father.addEventListener("click",clickHandler,false);
		
	}

	choiceDate.prototype.returnData=function(){
		if(!this.default.startmsg.name||this.default.startmsg.name==""||!this.default.endmsg.name||this.default.endmsg.name==""){
			alert("请选择结束时间！");
			return false;
		}
		if(this.haveLocalStorage){
			var dataArr=[this.default.startmsg,this.default.endmsg];
			localStorage.setItem("oldData",JSON.stringify(dataArr));
		}
		var startTime=this.default.startmsg.targetId?this.default.startmsg.targetId.slice(2):0;
		var  endTime=this.default.endmsg.targetId?this.default.endmsg.targetId.slice(2):0;
		return {
			startDay:this.default.startmsg.name,
			numberOfDay:parseInt(endTime)-parseInt(startTime)+1
		};
	}

	choiceDate.prototype.reg=function(str){
		str=str.replace(/choiced/g,"");
		str=str.replace(/start/g,"");
		str=str.replace(/end/g,"");
		str=str.replace(/link/g,"");
		str=str.replace(/linkend/g,"");
		str=str.replace(/linkStart/g,"");
		str=str.replace(/\s+/g," ");
		str=str.replace(/(^\s*)|(\s*$)/g,"");
		return str;
	}
	window.choiceDate=choiceDate;
})();