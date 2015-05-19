/**
 * Created by 星辉 on 2015/5/11.
 */

/*阻止iphone 默认滑动*/
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
/*
* 初始化程序
* */
function initOnWork(){
    myDate(); //日期
    weather();//天气
    fH("body>.content");

    scroll(".box");
    checkIner("#checkIner");//初始化打卡器大小
    checkInerAct();//打卡器操作
    blurAct(function(){
        if($("#checkIner").hasClass("bluring")){
            if($("#checkIner").hasClass("__checking__")){
                return;
            }
            checkInerOut("#checkIner");
        };
        if($(".fMenu").hasClass("bluring")){
            $(".fMenu").trigger("touchend");
        }
    });

}
initOnWork();//初始化


/* 时钟
* */
function myDate(opt){
    if(typeof opt =="undefined"){
        opt={
            h:".hh",
            m:".mm",
            s:".ss",
            p :".time .point",
            day : ".dateWeather .date"
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

    /*设置日期*/
    function setDate(){
        var date = new Date();
        var day = addZero(date.getFullYear())+"-"+
                  addZero(date.getMonth()+1)+"-"+
                  addZero(date.getDate());
//            console.log(day);
           $(function(){ $(opt.day).html(day);})
    }
    var stinit = setInterval(function(){
        setTimeHtml();
        setDate();
        clearInterval(stinit);
    },0);
    var st = setInterval(function(){
        setTimeHtml();
    },1000)

}

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
//        console.log(h)
        h = $(window).height()-h;
        $(obj).height(h);
    })
}

function scroll(obj){
    seajs.use(["iscroll"],function(){
        fH(obj);
        $(obj).find(".iScrollLoneScrollbar").remove();
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

function blur(){
   $(function(){
       var blur = '<div id="__blur__"></div>';
       $("body").append(blur);
       $("#__blur__").css({
           "position":"fixed",
           "top":"0",
           "left":"0",
           "width":"100%",
           "height":"100%",
           "z-index":"8"
       })
   })
}

function noBlur(){
    $(function(){
        $("#__blur__").remove();

    })
}

function blurAct(callback){
    $(document).on("touchend","#__blur__",function(e){
        e.stopPropagation();
        e.preventDefault();
        if(typeof callback === "function"){
            callback();
        }
    })
}

/*打卡器出来*/
function checkInerIn(obj,num){
    blur();
    $(obj).addClass("bluring");
    if(typeof num == "undefined"){
        num = 1000
    }
    $(obj).animate({
        "bottom":cBox().b
    },num,"easeOutElastic")
}
/*打卡器消失*/
function checkInerOut(obj,num){
    $(obj).removeClass("bluring");
    if(typeof num == "undefined"){
        num = 1000
    }
    $(obj).animate({
        "bottom":(-cBox().h)
    },num,"easeOutElastic");
   noBlur();
}
/*
* 打卡器大小*/
function checkIner(obj){
    $(function(){
        $(obj).css({
            "height":cBox().h,
            "width":cBox().w,
            "left":cBox().l,
            "bottom":-cBox().h,
            "z-index":"9"
        })
    })
}

/*
* 打卡器操作*/
function checkTip(str){
    $("#checkIner .title").html(str);
};
 function checkInerAct(){
    $(function(){
        $(".checkWrap").on("touchstart",function(){
            $(this).off("touchend");
            $(this).addClass("on");
            $(this).on("touchend",function(){
                $(this).removeClass("on");
                checkInerIn("#checkIner");
            })
        });

        $("#checkIner").on("touchstart",function(e){
            $(this).off("touchend");
            checkTip("正在打卡");
            if($(this).hasClass("__checking__")){
                return;
            }
            $(this).addClass("__checking__");
            $(this).on("touchend",function(){
//                clearTimeout(t);
                $(this).find(".printer").addClass("on");
                var ft = setTimeout(function(){
                    checkTip("打卡完成");
                    $("#checkIner").removeClass("__checking__");
                    $("#checkIner").find(".printer").removeClass("on");
                    setTimeout(function(){
                        checkInerOut("#checkIner");
                    },400)
                },2000);
            })
        });

    })
}

function getCity(callback){
    var geolocation = new BMap.Geolocation(),
        geoc = new BMap.Geocoder();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var pt = r.point;
            geoc.getLocation(pt, function(rs){
                var addComp = rs.addressComponents;
                if(typeof callback === "function"){
                    callback(addComp.city)
                }
//                alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
            });

        }
        else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
}
function weather(){
    getCity(function(city){
        $.get("http://api.map.baidu.com/telematics/v3/weather",{
            location:city,
            output:"json",
            ak:"2WQAlmlNeRT29pY8vTqCN7kO"
        },function(a){
            var temperature = a.results[0].weather_data[0].temperature,
                weather = a.results[0].weather_data[0].weather;
            $(".weather img").remove();
            $(".weather .temperature").html(temperature).fadeIn();
            $(".weather .text").html(weather).fadeIn();

        },"jsonp")
    });
}

/*分页模块*/
function pageCss(obj){
    $(obj).css({
        "left":"0",
        "top" :"100%"
    })
}

function pageIn(obj){
    $(obj).addClass("on");
    $(obj).animate({
        "left":0,
        "top":0
    },600,"easeOutBack",function(){
        fH(".recordListBox");
        scroll("#wrap1");
    });

}


function pageOut(obj){
    $(obj).animate({
        "left":0,
        "top":"100%"
    },360,"easeInBack",function(){
//        scroll(".box");
    })
    $(obj).removeClass("on");
}

$(function(){
    pageCss("#recordBox");
    $(".open_detail").on("touchend",function(){
        pageIn("#recordBox");
    });
    $("#recordBox").find(".back").on("touchstart",function(){
        $(this).off("touchend");
        $(this).on("touchend",function(){
            pageOut("#recordBox");
        })
    })
});

$(function(){
    pageCss("#settingBox");
    $(".open_setting").on("touchend",function(){
        pageIn("#settingBox");
    });
    $("#settingBox").find(".back").on("touchstart",function(){
        $(this).off("touchend");
        $(this).on("touchend",function(){
            pageOut("#settingBox");
        })
    })
});

$(function(){
    $(".fMenu").on("touchend",function(){
//        $(".fMenu .item").length;

        if(!$(this).hasClass("on")){
            $(this).addClass("on bluring");
            blur();
            $(this).css({
                "z-index":"9"
            })
            $(".fMenu .item").each(function(i,o){
                $(this).fadeIn(0).animate({
                    "bottom":58*(i+1)
                },200*i+200>1000?1000:(200*i+200),"easeOutBack");
            })
        }else{
            $(this).removeClass("on bluring");
            noBlur();
            $(this).css({
                "z-index":"1"
            })
            $(".fMenu .item").each(function(i,o){
                $(this).animate({
                    "bottom":0
                },100*i+100>1000?1000:(100*i+100),"easeInBack").fadeOut(0);
            })
        }
    })
});