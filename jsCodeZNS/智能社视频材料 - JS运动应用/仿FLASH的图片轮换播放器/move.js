//任意值运动框架
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
}//解决offsetHight问题

function startMove(obj, attr, iTarget)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var cur=0;//要改透明度小数
		
		if(attr=='opacity')
		{
			cur=Math.round(parseFloat(getStyle(obj, attr))*100);//透明度除以100
		}
		else//修改宽高整数
		{
			cur=parseInt(getStyle(obj, attr));
		}
		
		var speed=(iTarget-cur)/6;
		speed=speed>0?Math.ceil(speed):Math.floor(speed);
		
		if(cur==iTarget)
		{
			clearInterval(obj.timer);
		}
		else
		{
			if(attr=='opacity')//单独处理透明度问题
			{
				obj.style.filter='alpha(opacity:'+(cur+speed)+')';//IE使用
				obj.style.opacity=(cur+speed)/100;
				
				document.getElementById('txt1').value=obj.style.opacity;
			}
			else
			{
				obj.style[attr]=cur+speed+'px';
			}
		}
	}, 30);
}