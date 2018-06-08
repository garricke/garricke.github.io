//定义一组全局变量，用于缓存或预料外的函数通信
var globalParams = {
	"canvasBackground":"",
}

//jQuery
$(document).ready(function(){
	//图片加载完成方可执行
	$(objPic).ready(function(){
		//展示测试图片
		$("#canvasContent").renderImage({});

		//监听本地图片加载行为
		$("#imageLoad").change(function(){
			var imageReader = new FileReader();
			$("#objPic").src = imageReader.readAsDataURL(this.files[0]);
			imageReader.onload = function(evt){
				$("#objPic")[0].src = this.result;
				$("#objPic")[0].onload = function(){
					$("#canvasContent").renderImage({});
				}
			}
		})

		//监听缩放按钮
		$("#scaleImage").click(function(){
			var scaleX = parseFloat($("#scaleParamHorizon")[0].value);
			var scaleY = parseFloat($("#scaleParamVertical")[0].value);
			$("#canvasContent").renderImage({
				"scaleX":scaleX,
				"scaleY":scaleY,
				"clearCanvas":true
			})
		});

		//监听图片旋转按钮
		$("#rotateImage").click(function(){
			var scaleX = parseFloat($("#scaleParamHorizon")[0].value);
			var scaleY = parseFloat($("#scaleParamVertical")[0].value);
			var angle = parseFloat($("#rotateAngle")[0].value)
				+($("#rotateDegree")[0].checked?"deg":"");
			$("#canvasContent").renderImage({
				"scaleX":scaleX,
				"scaleY":scaleY,
				"angle":angle,
				"clearCanvas":true
			})
		});

		//监听添加文字操作
		$("#fillText").click(function(){
			var colorArray = $(".font-color-param");
			var objectText = $("#objectText")[0].value;
			var fontSize = parseInt($("#fontSize")[0].value);
			var fontFamily = $("#fontFamily")[0].value;
			var red = parseInt(colorArray[0].value)||0;
			var green = parseInt(colorArray[1].value)||0;
			var blue = parseInt(colorArray[2].value)||0;
			var opacity = parseFloat(colorArray[3].value)||1;

			//在文字层画布显示文字
			$("#canvasText").renderText({
				"clearCanvas":true,
				"text":objectText,
				"fontFamily":fontFamily,
				"fontSize":fontSize,
				"red":red,
				"green":green,
				"opacity":opacity,
				"blue":blue,
			})
		});

		//监听调色板变化
		$(".font-color-param").change(function(){
			textColorPreviews();
		})
	})


	//绘图方法
	;(function($){
		$.fn.renderImage = function(params){
			//清空画布重新绘制
			if(params.clearCanvas){
				this[0].height = this[0].height;
			}

			//默认采用当前画布
			var imageCtx = this[0].getContext("2d");

			//默认图片对象
			var objPic = params.objPic||$("#objPic")[0];

			//剪切尺寸
			var sWidth = params.sWidth||$("#canvasContent")[0].offsetWidth;
			var sHeight = params.sHeight||$("#canvasContent")[0].offsetHeight;

			//对象图片尺寸
			var width = params.width||sWidth;
			var height = params.height||sHeight;

			//缩放比例
			var scaleX = params.scaleX||1;
			var scaleY = params.scaleY||1;

			//旋转角度，默认为弧度，使用角度的话，需要加deg单位
			var rotateAngle = (/deg/).test(params.angle+"")?
			parseFloat(params.angle+"")*Math.PI/180
			:parseFloat(params.angle+"");

			//如有旋转，移动图片使得旋转中心为图片中心
			if(params.angle){
				imageCtx.translate(0.5*width, 0.5*height);
				imageCtx.rotate(rotateAngle);
			}
			else{}

			//如有拉伸，移动图片使得拉伸后图片中心点不变动
			var width = width*scaleX;
			var height = height*scaleY;
			var x = params.scaleX?(0.5*(1-scaleX)*width):0;
			var y = params.scaleY?(0.5*(1-scaleY)*height):0;

			//如有旋转，在拉伸的基础上平移图片中心点
			if(params.angle){
				x = x - 0.5*width/scaleX;
				y = y - 0.5*height/scaleY;
			}

			//绘图
			imageCtx.drawImage(
				params.objPic||objPic,
				params.sX||0,
				params.sY||0,
				sWidth,
				sHeight,
				x,
				y,
				width,
				height
			);

			//绘图完毕，将画布背景缓存
			// globalParams.canvasBackground = imageCtx.getImageData(0,0 ,width, height);
		}
	})(jQuery);

	//添加文字方法
	;(function(){
		$.fn.renderText = function(params){
			//清空画布重新绘制
			if(params.clearCanvas){
				this[0].height = this[0].height;
				console.log("ing");
			}

			//默认采用当前画布
			var textCtx = this[0].getContext("2d");

			//引入背景图
			// textCtx.putImageData(globalParams.canvasBackground, 0, 0);

			//字体设定
			var fontSize = params.fontSize?parseInt(params.fontSize):20;
			var fontFamily = params.fontFamily||'Georgia';
			textCtx.font = fontSize + "px " +fontFamily ;

			//文字颜色设定
			textCtx.fillStyle = "rgba)"
				+ params.red + "," 
				+ params.green + ","
				+ params.blue + ","
				+ params.opacity + ")";

			//写入文字
			textCtx.fillText(params.text, params.left||100, params.top||100);
		}
	})(jQuery);

	//文字颜色预览
	function textColorPreviews(){
		var colorArray = $(".font-color-param");
		var red = parseInt(colorArray[0].value)||0;
		var green = parseInt(colorArray[1].value)||0;
		var blue = parseInt(colorArray[2].value)||0;
		var opacity = parseFloat(colorArray[3].value)||1;

		//修改色彩预览区域颜色
		$("#colorPreviews")[0].style.backgroundColor = "rgba("
			+ red +","
			+ green + ","
			+ blue + ","
			+ opacity+ ")";
	}

});
