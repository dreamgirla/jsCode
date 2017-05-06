function getStyle(obj, name)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[name];
	}
	else
	{
		return getComputedStyle(obj, false)[name];
	}
}


//startMove(oDiv, {width: 400, height: 400})

//json完美框架
function startMove(obj, json, fnEnd)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;		//假设：所有值都已经到了
		
		for(var attr in json)//每一次执行都要循环几次改变不同属性，循环次数，取决于json中到底写了什么
		{
			var cur=0;
			
			if(attr=='opacity')
			{
				cur=Math.round(parseFloat(getStyle(obj, attr))*100);
			}
			else
			{
				cur=parseInt(getStyle(obj, attr));
			}
			
			var speed=(json[attr]-cur)/6;//当前目前循环的目标点
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			if(cur!=json[attr])//有一个值不等于目标点
				bStop=false;
			
			if(attr=='opacity')
			{
				obj.style.filter='alpha(opacity:'+(cur+speed)+')';
				obj.style.opacity=(cur+speed)/100;
			}
			else
			{
				obj.style[attr]=cur+speed+'px';
			}
		}
		
		if(bStop)//当所有值都到达时，停止定时器
		{
			clearInterval(obj.timer);
						
			if(fnEnd)fnEnd();//如果用户传进来的话
		}
	}, 30);
}