function msgInit(){
	if(typeof jQuery == "undefined" && typeof Zepto == "undefined"){
		console.error("本插件msg依赖jQuery，或者zepto,请检查是否在引用本插件之前引用了jQuery库,或者zepto库！");
		return false;
	}
	var msgHtml = '<section class="msg">'+
						'<header></header>'+
						'<div class="msgContent"></div>'+
						'<footer>'+
							'<div class="cancelMsg">'+
								'取消'+
							'</div>'+
							'<div class="confirmMsg">'+
								'确认'+
							'</div>'+
						'</footer>'+
					'</section>',
		msgBlur = '<div id="msgBlur"></div>',
		msgCss	= {
			"position" : "relative",
		    "width" : "80%",
		    "margin" : "25% auto",
		    "border-radius" :" 4px",
		    "-webkit-border-radius" : "4px",
		    "overflow" : "hidden",
		    "-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
		    "-webkit-transition":"all 0.2s",
			"-webkit-transition-timing-function":"ease-out"
		},
		msgHeaderCss = {
			"line-height": "32px",
		    "height": "32px",
		    "background-color": "#fff",
		    "text-align": "center",
		    "font-size": "14px",
		    "color": "rgb(43,43,43)",
		    "width": "100%",
		    "border-bottom": "1px solid #ccc"
		},
		msgContentCss = {
		    "width": "96%",
		    "background-color": "#fff",
		    "text-align": "center",
		    "padding": "6% 2%",
		    "font-size": "14px",
		    "min-height": "20px"
		},
		msgFooterCss = {
		    "width": "100%",
		    "height": "38px",
		    "line-height": "38px",
		    "text-align": "center",
		    "position" : "relative",
		    "background-color": "#fff",
		    "border-top": "1px solid #ccc",
		    "display": "-webkit-box"		    
		},
		msgFooterDivCss = {
		    "flex":"1",
		    "-webkit-box-flex": "1",
		    "border-left":"1px solid #ccc",
		    "width" : "49%"
		},
		msgFooterDivEQ0Css = {
		    "border-left":"none"
		},
		msgBlurCss = {
			"position" : "fixed",
			"top"	   : "0",
			"left"	   : "0",
			"width"	   : "100%",
			"height"   : "100%",
			"z-index"  : "9999999999999",
			"display"  : "none",
			"background-color" : "rgba(0,0,0,.6)",
			"opcity"   : "0"
		};
	$(function(){
		if($("#msgBlur").length<=0){
			$("body").append(msgBlur);
			$("#msgBlur").html(msgHtml);
			$("#msgBlur").css(msgBlurCss);
			$(".msg").css(msgCss);
			$(".msg header").css(msgHeaderCss);
			$(".msg .msgContent").css(msgContentCss);
			$(".msg footer").css(msgFooterCss);
			$(".msg footer div").css(msgFooterDivCss);
			$(".msg footer div").eq(0).css(msgFooterDivEQ0Css);
		};		
	});
	/*window.loop = {};
	loop.alert = {};
	loop.alert.count = 0;
	loop.alert.loops = 0;
	loop.alert.handle = {};
	loop.check = function(type){
		var loops =loop.alert.loops;
		var count =loop.alert.count;
		if(loops <count){
			loops++;
			var opt = loop[type].handle[loops];
			msg.alert(opt.content,opt.handle,opt.okText);
			loop.alert.loops = loops;
			if(loops == count){
				loop.alert.count = 0;
				loop.alert.loops = 0;
				loop.alert.handle = {};
			}	
		}
	};*/
};

function desMsg(){

//        alert(123);
        $("#msgBlur").remove();

}

var msg = {	
		version : {
			"Author"  : "Samphay",
			"version" : "0.0.1-beta",
			"log" : {
				"20150425" : "1,修复后面引用了会覆盖前面的内容的BUG -samphay;2,添加了tips方法"
			}
		},
		alert : function(content,handle,okText,speed){
            msgInit();
			var alertInit = {
				0 : handle,
				1 : okText,
				2 : speed
			},
				alertAfterInit = {},
				speedOut = null ;
			$.each(alertInit,function(i,o){
				if(typeof o === "function"){
					alertAfterInit["function"] = o; 
				}else if(typeof o === "number"){
					alertAfterInit["number"] = o;
				}else if(typeof o === "string"){
					alertAfterInit["string"] = o;
				};				
			});
			if(typeof alertAfterInit["function"] !== "undefined"){
				handle = alertAfterInit["function"]
			}else{
				handle = null;
			};
			if(typeof alertAfterInit["number"] !== "undefined"){
				speed = alertAfterInit["number"];
				$(".msg footer").hide();				
			}else{
				speed = null;
				$(".msg footer").show();
				okText = "确定";
			};
			if(typeof alertAfterInit["string"] !== "undefined"){
				okText = alertAfterInit["string"]
			}else{
				okText = "确定";
			};
			// console.log("handle:"+handle+",okText:"+okText+",speed:"+speed);
			$(".cancelMsg").off("click");
			$(".msg header").show();
			$(".msg .confirmMsg").show();
			$("#msgBlur").show(0);
			$(".msg header").hide();
			$(".msg .confirmMsg").hide();

			if($.trim($(".msg .msgContent").text()).length==0){
				$(".msg .msgContent").html(content);
				$(".msg .cancelMsg").html(okText);
			}else{

			}
			$(".cancelMsg").on("click",function(e){
				e.stopPropagation();
				clearTimeout(speedOut);
				$("#msgBlur").hide(0);
				$(".msg .msgContent").html("");
				$(".msg footer").show();
                   desMsg();
//                alert(123)
//                console.log(desMsg())
				if(typeof handle === "function"){
					handle();
				}
			});
			if(typeof speed !== "undefined" && speed >0){
				speedOut = setTimeout(function(){
					$(".cancelMsg").trigger('click');
				},speed);
			}	
		},
		confirm : function(content,handle,okText){
			var alertInit = {
				0 : handle,
				1 : okText,
			},
				alertAfterInit = {};

			$.each(alertInit,function(i,o){
				if(typeof o === "function"){
					alertAfterInit["function"] = o; 
				}else if(typeof o === "string"){
					alertAfterInit["string"] = o;
				};				
			});
			if(typeof alertAfterInit["function"] !== "undefined"){
				handle = alertAfterInit["function"]
			}else{
				handle = null;
			};
			if(typeof alertAfterInit["string"] !== "undefined"){
				okText = alertAfterInit["string"]
			}else{
				okText = "确定";
			};
			// console.log("handle:"+handle+",okText:"+okText);
			$(".cancelMsg").off("click");
			$(".confirmMsg").off("click");
			$(".msg header").show();
			$(".msg .confirmMsg").show();
			$("#msgBlur").show(0);
			$(".msg header").hide();			
			if($.trim($(".msg .msgContent").text()).length==0){
				$(".msg .msgContent").html(content);
				$(".msg .cancelMsg").html(okText);
			}
			$(".msg .cancelMsg").html("取消");
			$(".cancelMsg").on("click",function(e){
				e.stopPropagation();
				$("#msgBlur").hide(0);
				$(".msg .msgContent").html("");
			});
			$(".confirmMsg").on("click",function(e){
				e.stopPropagation();				
				$("#msgBlur").hide(0);
				$(".msg footer").show();				
				if(typeof handle === "function"){
					handle();
				}
			});
		},
		tips : function(message,time){
			if(typeof(time) === "undefined"){
				time = 1000;
			};
			msg.alert(message,time);
		}
	};
