window.onload = function(){
	var oBtn = document.getElementById('gameBtn');

	oBtn.onclick = function(){
		this.style.display = 'none';
		Game.init('div1');//游戏Go！

	}
}

var Game = {
	init : function(id){// 初始化
		this.oParent = document.getElementById(id);//获取元素不能用局部方法
		
		this.createScore();

	},
		createScore : function(){//积分创建
			var oS = document.createElement('div');
			os.id = "score";
			os.innerHTML = '积分：<span>0</span>';
			this.oParent.appenChild(os);
		}
		
};