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
        }
        if($(".fMenu").hasClass("bluring")){
            $(".fMenu").trigger("touchend");
        }
        if($(".toolBox").hasClass("bluring")){
            $(".searchRecord").trigger("touchend");
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
                weather = a.results[0].weather_data[0].weather,
                daypic = a.results[0].weather_data[0].dayPictureUrl,
                nightpic = a.results[0].weather_data[0].nightPictureUrl,
                date = a.results[0].weather_data[0].date;
            date = (date.substr(date.length-4,3));
            $(".weather img").remove();
//            $(".weather").html('<img src="'+daypic+'" alt="" style="width:24px;position:absolute;top:24px;left:80px;"/>').fadeIn()
            $(".weather .temperature").html(date).fadeIn();
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

function pageIn(obj,callback){
    $(obj).addClass("on");
    $(obj).animate({
        "left":0,
        "top":0
    },600,"easeOutBack",function(){
        if(typeof callback === "function"){
            callback();
        }
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

function boxCss(obj){
    $(obj).css({
        "bottom":0-$(obj).height(),
        "display":"none",
        "z-index":"9"
    })
}

function boxIn(obj,callback){
    $(obj).addClass("on").fadeIn(0);
    blur();
    $(obj).addClass("bluring");
    $(obj).animate({
        "left":0,
        "bottom":0
    },600,"easeOutBack",function(){
        if(typeof callback === "function"){
            callback();
        }
    });
}

function boxOut(obj,callback){
    $(obj).removeClass("bluring");
    $(obj).animate({
        "left":0,
        "bottom":-$(obj).height()
    },400,"easeInBack",function(){
        $(obj).removeClass("on").fadeOut(0);
        noBlur();
        if(typeof callback === "function"){
            callback();
        }
        $(obj).removeClass("on");
    });
}
/*记录列表*/
$(function(){
    pageCss("#recordBox");
    $(".open_detail").on("touchend",function(){
        pageIn("#recordBox",function(){
            if(!$("#wrap1").hasClass("__scrolled__")){
                $("#wrap1").addClass("__scrolled__");
                fH(".recordListBox");
                scroll("#wrap1");
            }
        });
    });
    $("#recordBox").find(".back").on("touchstart",function(){
        $(this).off("touchend");
        $(this).on("touchend",function(){
            pageOut("#recordBox");
        })
    })
});

/*查询记录*/
$(function(){
    $(".searchRecord").on("touchend",function(){

       if($(this).hasClass("on")){
           $(this).removeClass("on");
           boxOut(".toolBox")
       }else{
           boxCss(".toolBox");
           boxIn(".toolBox");
           $(this).css({
               "z-index":"9"
           });
           $(this).addClass("on");
       }
    })
})

/*设置页面*/
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

/*浮动按钮*/
$(function(){
    $(".fMenu").on("touchend",function(){
        if(!$(this).hasClass("on")){
            $(this).addClass("on bluring");
            blur();
            $(this).css({
                "z-index":"9"
            });
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

/*滑动开关*/
$(function(){
    sliderButton({
        "obj" : ".slideButton",
        "slider" :".slider",
        "off" : function(THIS){
            THIS.waitingDone();
        },
        "on": function(THIS){
//            $(function(){
//                console.log(THIS);
                THIS.waiting();
//            })
        }
    })
});

function sliderButton(opt){
    $(opt.obj).on("touchend",function(){
//        $(this).children(".slider").waiting();
        if($(this).hasClass("on")){
            $(this).removeClass("on");
            $(this).children("").removeAttr("style");
            $(this).children(".slider").removeClass("on");
            if(typeof opt.off === "function"){
                opt.off($(this).children(".slider"));
            }
        }else{
            $(this).children("").removeAttr("style");
            $(this).addClass("on");
            $(this).children(".slider").addClass("on");
            if(typeof opt.on === "function"){
                opt.on($(this).children(".slider"));
            }
        }
    });
    sliderPress(opt.slider,function(a,THIS){
        if(a>30){
            $(THIS).parent().children("").removeAttr("style");
            $(THIS).parent().addClass("on");

            if(typeof opt.on === "function"){
                opt.on(THIS);
            }
        }else{
            $(THIS).parent().children("").removeAttr("style");
            $(THIS).parent().removeClass("on");
            $(THIS).removeClass("on");
            if(typeof opt.off === "function"){
                opt.off(THIS);
            }
        }
    })
}

function sliderPress(sClass,callback){
    var initP = null,
        initT = null,
        initM = null,
        cx = null,
        width = null,
        sliderWidth = null,
        wm = null,
        touch = null,
        setCss = function(obj,objBg,aCss){
            $(objBg).width(aCss+$(sClass).width()*1);
            $(obj).css({
                "left" : aCss
            })
        },
        percent = function(num){
            return Math.round((num/(width))*100);
        };
    $(sClass).on("touchstart mousedown",function(e){
        document.body.addEventListener('touchmove touchend', function(e) {
            e.stopPropagation();
        });
        e.preventDefault();
        e.stopPropagation();
        width = $(".slideButton").width();
        $(this).addClass("on");
        $(this).off("touchend");
        if(e.type == "touchstart"){
            initP = window.event.touches[0].pageX;
            initT = numstr($(this).css("left"));
            touch = true;

        }
    });
    $(sClass).on("touchmove",function(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.type == "touchmove"){
            initM = window.event.touches[0].pageX;
            cx = initM-initP;
            wm = initT + cx;
            if(wm>(width -$(sClass).width())){
                wm = width -$(sClass).width();
            }else if(wm<0){
                wm = 0;
            }
            if(wm>8&&wm<30){
                setCss($(this),$(this).parent().children().eq(0),wm);
            }else{
               if(wm!=0&&wm!=34){
                   $(this).width((34));
               }
            }
            touch = true;
            $(this).on("touchend",function(e){
                var pwm = percent(wm);
                e.preventDefault();
                e.stopPropagation();
                if(e.type == "touchend"){
                    if(touch){
                        touch = false;
//                        $(this).removeClass("on");
                        if(typeof(callback) === "function"){
                            callback(pwm,$(this));
                        }
                        return;
                    }
                }
            })
        }
    });
}

(function($){
    $.fn.waiting = function(callback){
        var img = '<img class="__waiting__" src="../../common/img/loading.gif" alt="" width="12" style="position: relative;left: 6px;top:4px;font-size: 0px;"/>';
         $(this).each(function(){
            $(this).html(img);
        })
    }
    $.fn.waitingDone = function(callback){
        $(this).each(function(){
            $(this).find(".__waiting__").remove();
        })
    }
}(jQuery));

/*
 * 去px,提取数字
 */
function numstr(str){
    if(typeof(str)==="string"){
        var l = str.length,
            num = str.substr(0,l-2);
        return Number(num)
    }
}

$(function(){
    $(".Date").mobiscroll().date({
        theme: 'ios',     // Specify theme like: theme: 'ios' or omit setting to use default
        mode: 'mixed',       // Specify scroller mode like: mode: 'mixed' or omit setting to use default
        display: 'bottom', // Specify display mode like: display: 'bottom' or omit setting to use default
        lang: "zh",       // Specify language like: lang: 'pl' or omit setting to use default
        minDate: new Date(2012,3,10,9,22),  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
        maxDate: new Date(2020,7,30,15,44),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
        stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
    });
    $(document).on("touchend",".dwb0",function(){
        alert($(".dwv").html())
    })
});
