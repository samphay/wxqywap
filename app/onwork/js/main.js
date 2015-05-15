/**
 * Created by 星辉 on 2015/5/11.
 */

/*阻止iphone 默认滑动*/
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
/*
* 初始化程序
* */
function initOnWork(){
    new myDate().time();
    fH("body>.content");
    scroll(".box");
    checkIner("#checkIner");//初始化打卡器大小
    checkInerAct();//打卡器操作
}
initOnWork();//初始化
 /*
* 时钟
* */
function myDate(){
    myDate.prototype.time = function(opt){
        if(typeof opt =="undefined"){
            opt={
                h:".hh",
                m:".mm",
                s:".ss",
                p :".time .point"
            };
        }
        function addZero(num){
            return num = num<10?"0"+num:num;
        }

        /*
         * 获取时间
         * */
        function getTime(){
            var date = new Date(),
                h = date.getHours(),
                m = date.getMinutes(),
                s = date.getSeconds();
            return {
                "h":addZero(h),
                "m":addZero(m),
                "s":addZero(s)
            }
        }
        function setTimeHtml(){
            $(opt.h).html(getTime().h);
            $(opt.m).html(getTime().m);
            $(opt.s).html(getTime().s);
        }
        setTimeHtml();
        var stinit = setInterval(function(){
            //            console.log("stinit:"+stinit);
            setTimeHtml();
            clearInterval(stinit);
        },0);
        var st = setInterval(function(){
            //            console.log("st:"+st)
            setTimeHtml();
        },1000)
    };
};

/*
*滑动改变
* */
function fetchSize(opt){
    var tp = 0,
        mp = 0,
        cp = function(){
            return tp-mp;
        },
        end = 1,
        reset = function(){
            tp=mp=0;
        };
    $("body .box").on("touchstart",function(e){
        $(this).off("touchend");

        tp = e.touches[0].pageY;
        if(typeof opt.start === "function"){
            opt.start();
        }
        if(end == -1){
            end = 1;
            return;
        }
        $(this).on("touchmove",function(e){
            mp = e.touches[0].pageY;
            if(typeof opt.move === "function"){
                opt.move(cp());
            }
        });
        $(this).on("touchend",function(e){
            if(typeof opt.end === "function"){
                opt.end(cp());
                reset();
                end =-1;
            }
        })
    });


}

$(function(){
    var h = $(".wrapUserCardBoxLocateNav").height(),
        start = function(){
             return false;
        },
        move = function(m){
            var num = (h/200)* m,
                opacity = Math.round((1-num/h)<0?0:(1-num/h)*100)/100 >1?1:Math.round((1-num/h)<0?0:(1-num/h)*100)/100 ,
                angle = num >90?90:num;
            angle =angle< 0 ? 0 : angle;
            height = h-num>h?h:h-num;
            height =height< 0 ? 0 : height;
            $(".wrapUserCardBoxLocateNav").css({
                "opacity":opacity,
                "transform":"rotate3d(1,0,0,"+angle+"deg)",
                "-webkit-transform":"rotate3d(1,0,0,"+angle+"deg)"
            });
            $("body>.content").css({
                "position":"relative",
                "top":height
            });
        },
        end = function(c){
            console.log(c);
            if(c>10){
                $(".wrapUserCardBoxLocateNav").css({
                    "opacity":"0",
                    "transform":"rotate3d(1,0,0,90deg)",
                    "-webkit-transform":"rotate3d(1,0,0,90deg)"
                });
                scroll()
            }else{
                $(".wrapUserCardBoxLocateNav").css({
                    "opacity":1,
                    "transform":"rotate3d(1,0,0,0deg)",
                    "-webkit-transform":"rotate3d(1,0,0,0deg)"
                })
            }
        };

    /*fetchSize({
        "start":start,
        "move":move,
        "end": end
    })*/
})

/*
* 获取该dom节点的height,该height与之上面的height之和为屏幕的height;
* */
function fH(obj){
    $(function(){
        var h = $(obj).offset().top;
        h = $(window).height()-h;
        $(obj).height(h);
    })
}

function scroll(obj){
    seajs.use(["iscroll"],function(){
        fH(obj);
        $(".iScrollLoneScrollbar").remove();
        var onworkScroll = new IScroll(obj, {
            scrollX: true ,
            scrollbars:true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true});
        $(".iScrollLoneScrollbar").width(4);
        $(".iScrollIndicator").css({
            "border":"none"
        })
    })
}

/*
* 打卡器
* */
function cBox(){
    var height = $(window).width()+$(window).width()*0.1,
        width = $(window).width()+$(window).width()*0.1,
        left = 0-(height - $(window).width())/ 2,
        bottom = -height/2.5;
    return {
        h:height,
        w:width,
        l:left,
        b:bottom
    }
}
/*打卡器出来*/
function checkInerIn(obj,num){
    if(typeof num == "undefined"){
        num = 1000
    }
    $(obj).animate({
        "bottom":cBox().b
    },num,"easeOutElastic")
}
/*打卡器消失*/
function checkInerOut(obj,num){
    if(typeof num == "undefined"){
        num = 1000
    }
    $(obj).animate({
        "bottom":(-cBox().h)
    },num,"easeOutElastic")
}
/*
* 打卡器大小*/
function checkIner(obj){
    $(function(){
        $(obj).css({
            "height":cBox().h,
            "width":cBox().w,
            "left":cBox().l,
            "bottom":-cBox().h
        })
/*
        setTimeout(function(){
            checkInerIn(obj);
            checkInerOut(obj);
        },1000)*/
    })
}

/*
* 打卡器操作*/
function checkInerAct(){
    $(function(){
        $(".checkWrap").click(function(){
            checkInerIn("#checkIner");
        })
        $("#checkIner").click(function(){
            checkInerOut("#checkIner");
        })
    })
}
