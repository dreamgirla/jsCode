	
// 元素的生成（createElement)
// 敌人的移动(setInterval)
// 碰撞检测 （方法）
// 敌人跟随（运动算法）
// 关卡（实现多关卡）
// 其他功能（积分，血量）

	window.onload = function(){
	var oBtn = document.getElementById('gameBtn');

	oBtn.onclick = function(){
		this.style.display = 'none';
		Game.init('div1');//调用初始化方法，游戏Go！

	}
}

// 游戏就是一个大的json

var Game = {

	oEnemy : {//敌人的数据
		e1 : {style: 'enemy1' ,blood: 1 ,speed: 5,score: 1},
		e2 : {style: 'enemy2' ,blood: 2 ,speed: 6, score: 2},
		e3 : {style: 'enemy3' ,blood: 3 ,speed: 7 , score: 3}
	},

	gk : [//关卡的数据,数组，第一关就是数组的第一项，第二难关就是数组第二项
		{
			eMap : [//蜜蜂的布局，
			'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',

			],//但是数组不会认为是10个一行
			colNum : 10,//指定一行10个
			iSpeedX : 10,//X轴速度10
			iSpeedY :10,//Y轴速度
			times : 2000//小蜜蜂下来的速度
		},
	{//第二关关卡数据
			eMap : [
			'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
			'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
			'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
			'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',

			],
			colNum : 10,
			iSpeedX : 10,
			iSpeedY :10,
			times : 2000
		}
	],
	air : {//飞机的数据
		style : 'air1',
		bulletStyle : 'bullet'
	},

	init : function(id){// 初始化
		//id的属性this.上，可以在其他地方找到
		this.oParent = document.getElementById(id);//获取元素不能用局部方法
		
		this.createScore();//调用创建的积分

		this.createEmeny(0);//接收第一关数据

		this.createAir();//创建飞机

	},
		createScore : function(){//积分创建
			var oS = document.createElement('div');
			oS.id = 'score';
			oS.innerHTML = '积分：<span>0</span>';
			this.oParent.appendChild(oS);

			this.osNum = oS.getElementsByTagName('span')[0];
			//span是实时变化的，让span变为一个相对全局的东西，作为对象的属性
		},
		createEmeny :function(iNow){//敌人的创建

			//改变关卡时，判断ul,重新创建
			if (this.oUl) {
				clearInterval(this.oUl.timer);
				//ul重新创建
				this.oParent.removeChild(this.oUl);
			}
			//关卡提示
			document.title = '第' + (iNow) + '关';

			var gk = this.gk[iNow];//显示关卡
			var arr = [];

			var oUl = document.createElement('ul');//ul显示敌人
			oUl.id = 'bee';
			oUl.style.width = gk.colNum * 40 + 'px';//ul的宽度可以算出来，一个小蜜蜂4px，一行是10个
			this.oParent.appendChild(oUl);//添加回去，放在left的上面，添加到页面才有宽度
			//让蜜蜂居中（父层的宽度-oUL的宽度）/2
			oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px';

			this.oUl = oUl;//ul在createEmeny中为局部变量在其他方法中无法调用，所以ul变为对象的属性，也可以作为参数传参，不太建议

			for(var i = 0;i < gk.eMap.length;i++){
				var oLi = document.createElement('li');
				//gk.eMap[i]每一个就是循环e1,e2,e3，gk.eMap.length是小蜜蜂的个数
				//如果是e1就应该找oEnemy中e1的样式
				//this.oEnemy[gk.eMap[i]]数据中的属性.style就是样式
				//e1 : {style: 'enemy1' ,blood: 1 ,speed: 5,score: 1},
				oLi.className = this.oEnemy[gk.eMap[i]].style;//循环给蜜蜂加样式
				oLi.blood = this.oEnemy[gk.eMap[i]].blood;//循环添加血量
				oLi.speed = this.oEnemy[gk.eMap[i]].speed;
				oLi.score = this.oEnemy[gk.eMap[i]].score;
				oUl.appendChild(oLi);
			}
			//全局的li
			this.aLi = oUl.getElementsByTagName('li');

			//，把小蜜蜂改为定位布局，
			//把li的offsetLeft，offsetTop存在数组中
			for(var i = 0;i<this.aLi.length;i++){
				arr.push([this.aLi[i].offsetLeft,this.aLi[i].offsetTop]);
			}

			for(var i=0;i<this.aLi.length;i++){
				//把每一个li变为局对定位,
				this.aLi[i].style.position = 'absolute';
				//把left,top取出来
				this.aLi[i].style.left = arr[i][0] + 'px';
				this.aLi[i].style.top = arr[i][1] + 'px';

			}


			this.runEnemy(gk);//创建好之后就可以触发

		},
		runEnemy : function(gk){//移动敌人，开定时器改的就是ul的left值和top值
			//原this指向window，改变指向
			This = this;
			var L = 0;
			var R = this.oParent.offsetWidth - this.oUl.offsetWidth;

	this.oUl.timer = setInterval(function(){
				if (This.oUl.offsetLeft > R) {//到右边的边缘
					//往左往右就是改变正负
					gk.iSpeedX *= -1; //改变速度方向，往左走
					//到边界的时候改变蜜蜂的高度值，往下走
					This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
				}else if(This.oUl.offsetLeft < L){
					gk.iSpeedX *= -1;
				}
				This.oUl.style.left = This.oUl.offsetLeft + gk.iSpeedX + 'px';
			},200);
			
			//times就是多久飞下来一个
			setInterval(function(){
				This.oneMove();
			},gk.times);

			},


			oneMove : function(){//单兵作战
				//x轴值速度要比y轴的速度要快，速度分解公式，这样才可以跟踪走斜线
				var nowLi = this.aLi[Math.floor(Math.random()*this.aLi.length)];//random：0~1，floor向下取整,随机找一个小蜜蜂
				var This = this;

			nowLi.timer = setInterval(function(){
					//直角三角形，两个直角边a,b斜边c，假设斜边速度为10，y轴速度=10*b/c，x轴速度=10*a/c,跟速度是成比例关系的
					//This.oA.offsetLeft + This.oA.offsetWidth/2找中心点，后面是小蜜蜂的offsetleft，小蜜蜂是相对于ul的不是在一个量级上，加上nowLi.parentNode.offsetLeft
					//求a就是两个坐标的x的差值，也就是距离,b是两个坐标y轴的差值
					var a = (This.oA.offsetLeft + This.oA.offsetWidth/2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + This.oA.offsetWidth/2);//a边
					var b = (This.oA.offsetTop + This.oA.offsetHeight/2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + This.oA.offsetHeight/2);
					var c = Math.sqrt(a*a + b*b);//勾股定理求斜边c

					var iSX = nowLi.speed * a/c;//飞行速度
					var iSY = nowLi.speed * b/c;

					nowLi.style.left = nowLi.offsetLeft + iSX + 'px';
					nowLi.style.top = nowLi.offsetTop + iSY + 'px';

					if (This.pz(This.oA,nowLi)){
						alert('游戏结束');
						//重新加载游戏
						window.location.reload();
					} 

				},30)
			},

			createAir : function(){//飞机的创建
				var oA = document.createElement('div');
				oA.className = this.air.style;

				this.oA = oA;//操作飞机，变为全局属性

				This.oParent.appendChild(oA);//添加到父层中
				//飞机X位置，父层宽度见去自身宽度除以2
				oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth)/2 + 'px';
				//高度减去自身高速
				oA.style.top = this.oParent.offsetHeight -oA.offsetHeight + 'px';

				this.bindAir();
			},
			bindAir :function(){//操作飞机

				var timer = null;
				var	iNum = 0;
				var This = this;

				document.onkeydown = function(ev){
					var ev = ev || window.event;

					if (!timer) {//让计时器只走一次，如果没有time的时候就执行定时器
						timer = setInterval(show,30);//连续的计数器
					}

					if (ev.keyCode == 37) {
						//不开计数器的话，会一卡一卡的
						iNum = 1;

					}
					else if (ev.keyCode == 39) {
						iNum = 2;
					}
				};

				document.onkeyup = function(ev){
					var ev = ev || window.event;
					//不清除定时器的话，键盘弹起时，飞机还会移动
					clearInterval(timer);
					//timer不变空的话，不会走到if中,还要还原iNum
					timer = null;
					iNum = 0;

					if (ev.keyCode == 32) {
						//空格键发子弹
						This.creatBullet();
					}
				};

				function show(){
					//向左右移动
					if (iNum == 1) {
						This.oA.style.left = This.oA.offsetLeft - 10 +'px';
					}else if(iNum == 2){
						This.oA.style.left = This.oA.offsetLeft + 10 + 'px';
					}
				}

			},

			creatBullet : function(){//创建子弹
				var oB = document.createElement('div');
				oB.className = this.air.bulletStyle;
				this.oParent.appendChild(oB);
				//子弹的位置，是相对于飞机的，飞机的left值+飞机自身的width值得一般就是子弹的位置
				oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth/2 + 'px';//子弹宽度
				oB.style.top= this.oA.offsetTop - 10 + 'px';//飞机的offsetTop-子弹高度就是子弹的top（offsetTop是距离浏览器高度的）

				this.runBullet(oB);
			},
			runBullet : function(oB){//子弹的运动

				var This = this;

				oB.timer = setInterval(function(){

					if (oB.offsetTop < -10) {
						//-10出了屏幕清除子弹
						clearInterval(oB.timer);
						This.oParent.removeChild(oB);
					}else {
						oB.style.top = oB.offsetTop - 10 + 'px';//往上走top值越来越小
					}

					//循环所有li
					for(var i=0;i<This.aLi.length;i++){
						//每一个子弹oB和灭一个蜜蜂进行检测
						if (This.pz(oB,This.aLi[i])) {

							//首先判断血量
							if (This.aLi[i].blood == 1) {
								//不清除浮动，这是个浮动布局，删除之后会自动补充上来，所以把小蜜蜂设为定位布局
								//删掉敌人之前清除定时器
							     clearInterval(This.aLi.timer);
								//增加积分
								This.osNum.innerHTML = parseInt(This.osNum.innerHTML) + This.aLi[i].score;//字符串转成数字类型
								//删除小蜜蜂
								This.oUl.removeChild(This.aLi[i]);
								
							}
							else{
								This.aLi[i].blood--;
							}
							//取消定时器
							clearInterval(oB.timer);

							//不管是删除还是掉血，都删除子弹
							This.oParent.removeChild(oB);
						}
					}
					//检测小蜜蜂是否为0
					if (!This.aLi.length) {
						//进入下一关卡
						This.createEmeny(1);
					}

				},30)
			},
			pz : function(obj1,obj2){//碰撞检测检测四个方向
				//第一个元素,offsetLeft相对于有定位的值，子弹相对于黑框
				var L1 = obj1.offsetLeft;//获取左边的距离
				var R1 = obj1.offsetLeft + obj1.offsetWidth;//右
				var T1 = obj1.offsetTop;//上
				var B1 = obj1.offsetTop + obj1.offsetHeight;//下

				//小蜜蜂相对于ul，所以加上它的父级的offsetLeft的值，让他们保持在同一个父级中
				var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
				var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
				var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
				var B2 = obj2.offsetTop + obj2.offsetHeight +obj2.parentNode.offsetTop;

				if (R1<L2 || L1>R2 || B1<T2 || T1>T2) {
					return false;//没碰上
				}else{
					return true;//碰上
				}
			}
		
};