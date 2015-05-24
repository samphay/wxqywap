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
    searchForRecord(function(a,b){  //查询记录
        seajs.use("msg",function(){
         /*   $("#msgBlur").find("header").show();
            var content = '<div class="f16 textMiddle" style="position: relative;bottom: 6px;">查询记录？</div>' +
                '<div style="height: 46px;line-height: 46px;"><span class="f16" style="color: rgb(96,204,211);">' +
                a+
                '</span>' +
                '<span class="f16"> 至 </span>' +
                '<span class="f16" style="color: rgb(96,204,211);">' +
                b+
                '</span> </div>';
            msg.confirm(content,function(){
                $(function(){
                    $(".recordListBox .wrap").waiting(function(){
                        setTimeout(function(){
                            $(".recordListBox .wrap").waitingDone(
                                msg.tips("加载完成")
                            )
                        },5000)
                    })
                });
            });*/
            $(function(){
                $(".recordListBox .wrap").waiting(function(){
                    setTimeout(function(){
                        $(".recordListBox .wrap").waitingDone(
                            msg.tips("加载完成")
                        )
                    },5000)
                },24)
            });
        });

    });
    blurAct(function(){
        if($("#checkIner").hasClass("bluring")){
            if($("#checkIner").hasClass("__checking__")){
                return;
            }
            checkInerOut("#checkIner",600);
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

        tp =  window.event.touches[0].pageY;
        if(typeof opt.start === "function"){
            opt.start();
        }
        if(end == -1){
            end = 1;
            return;
        }
        $(this).on("touchmove",function(e){
            mp = window.event.touches[0].pageY;
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

   /* fetchSize({
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
    },num,"easeOutBack")//easeOutElastic
}
/*打卡器消失*/
function checkInerOut(obj,num){
    $(obj).removeClass("bluring");
    if(typeof num == "undefined"){
        num = 1000
    }
    $(obj).animate({
        "bottom":(-cBox().h)
    },num,"easeInBack");
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
    $("#checkIner").find(".title").html(str);
}
 function checkInerAct(){
    $(function(){
        var tt = null;
        $(".checkWrap").on("touchstart",function(){
            if(tt){
//                console.log(tt);
                return;
            }
            $(this).off("touchend");
            $(this).addClass("on");
            $(this).on("touchend",function(){
                if(tt){
//                    console.log(tt);
                    return;
                }
                tt = 1;
                $(this).removeClass("on");
                checkInerIn("#checkIner",600);
                setTimeout(function(){
                    tt= null;
                },1000)

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
                    $("#checkIner").removeClass("__checking__").find(".printer").removeClass("on");
//                    $("#checkIner")
//                    setTimeout(function(){
                        checkInerOut("#checkIner",600);
//                    },400)
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
    $(function(){
        $(".weather").waiting();
    })
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
            $(".weather").waitingDone();
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
    },600,"easeOutQuart",function(){
        if(typeof callback === "function"){
            callback();
        }
    });

}


function pageOut(obj){
    $(obj).animate({
        "left":0,
        "top":"100%"
    },360,"easeInQuart",function(){
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
    $("#recordBox").find(".goBackWrap").on("touchstart",function(){
        $(this).off("touchend");
        $(this).on("touchend",function(){
            pageOut("#recordBox");
        })
    })
});

/*查询记录*/
$(function(){
    $(".searchRecordWrap").on("touchend",function(){

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
    $("#settingBox").find(".goBackWrap").on("touchstart",function(){
        $(this).off("touchend");
        $(this).on("touchend",function(){
            pageOut("#settingBox");
        })
    })
});

/*浮动按钮*/
$(function(){
    var tt = null;
    $(".fMenu").on("touchend",function(){
        if(tt){
//                    console.log(tt);
            return;
        }
        tt = 1;
//        WeixinJSBridge;
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
            });
            setTimeout(function(){
                tt = null;
            },400)
        }else{
            $(this).removeClass("on bluring");
            noBlur();
            setTimeout(function(){
                tt = null;
            },400);
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

function abc(a){
    if(typeof a ==="undefined"){
        a=13;
    }
    alert(a)
}

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
                var handle = THIS.parent().data("switch").split("-");
                THIS.waiting(function(){
                    THIS.addClass("__disabled","");
                    setTimeout(function(){
                        THIS.waitingDone(function(){
                            eval(handle[0]+"("+handle[1]+")");
                            THIS.removeClass("__disabled");
                        })
                    },1000)
                });
//            })
        }
    })
});

function sliderButton(opt){
    $(opt.obj).on("touchstart",function(){
        if($(this).children(".slider").hasClass("__disabled"))   return;
        if($(this).hasClass("on")){
            $(this).children(".slider").width(34).css({"left":"14px"});
        }else{
            $(this).children(".slider").width(34).css({"left":"12px"});
        }
    });
    $(opt.obj).on("touchend",function(){
        if($(this).children(".slider").hasClass("__disabled"))   return;
        $(this).children(".slider").width(24);
        var at = setTimeout(function(){
            $(this).children(".slider").removeClass("on");
            clearTimeout(at);
        },400);
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
        at = null,
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
        if($(this).hasClass("__disabled"))   return;
        document.body.addEventListener('touchmove touchend', function(e) {
            e.stopPropagation();
        });
        e.preventDefault();
        e.stopPropagation();

        width = $(".slideButton").width();
        $(this).addClass("on");
         at = setTimeout(function(){
            $(this).children(".slider").removeClass("on");
            clearTimeout(at);
        },400);
        $(this).off("touchend");
        if(e.type == "touchstart"){
            initP = window.event.touches[0].pageX;
            initT = numstr($(this).css("left"));
            touch = true;

        }
    });
    $(sClass).on("touchmove",function(e){
        if($(this).hasClass("__disabled"))   return;
        e.preventDefault();
        e.stopPropagation();
        if(e.type == "touchmove"){

            clearTimeout(at);
            initM = window.event.touches[0].pageX;
            cx = initM-initP;
            wm = initT + cx;
            if(wm>(width -$(sClass).width())){
                wm = width -$(sClass).width();

            }else if(wm<0){
                wm = 0;
//                alert(123)
            };
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
    $.fn.waiting = function(callback,size){
        if(!size){
            size = 12
        }
        var loading = "data:image/gif;base64,R0lGODlhgACAAKIAAP///93d3bu7u5mZmQAA/wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBQAEACwCAAIAfAB8AAAD/0i63P4wygYqmDjrzbtflvWNZGliYXiubKuloivPLlzReD7al+7/Eh5wSFQIi8hHYBkwHUmD6CD5YTJLz49USuVYraRsZ7vtar7XnQ1Kjpoz6LRHvGlz35O4nEPP2O94EnpNc2sef1OBGIOFMId/inB6jSmPdpGScR19EoiYmZobnBCIiZ95k6KGGp6ni4wvqxilrqBfqo6skLW2YBmjDa28r6Eosp27w8Rov8ekycqoqUHODrTRvXsQwArC2NLF29UM19/LtxO5yJd4Au4CK7DUNxPebG4e7+8n8iv2WmQ66BtoYpo/dvfacBjIkITBE9DGlMvAsOIIZjIUAixliv9ixYZVtLUos5GjwI8gzc3iCGghypQqrbFsme8lwZgLZtIcYfNmTJ34WPTUZw5oRxdD9w0z6iOpO15MgTh1BTTJUKos39jE+o/KS64IFVmsFfYT0aU7capdy7at27dw48qdS7eu3bt480I02vUbX2F/JxYNDImw4GiGE/P9qbhxVpWOI/eFKtlNZbWXuzlmG1mv58+gQ4seTbq06dOoU6vGQZJy0FNlMcV+czhQ7SQmYd8eMhPs5BxVdfcGEtV3buDBXQ+fURxx8oM6MT9P+Fh6dOrH2zavc13u9JXVJb520Vp8dvC76wXMuN5Sepm/1WtkEZHDefnzR9Qvsd9+/wi8+en3X0ntYVcSdAE+UN4zs7ln24CaLagghIxBaGF8kFGoIYV+Ybghh841GIyI5ICIFoklJsigihmimJOLEbLYIYwxSgigiZ+8l2KB+Ml4oo/w8dijjcrouCORKwIpnJIjMnkkksalNeR4fuBIm5UEYImhIlsGCeWNNJphpJdSTlkml1jWeOY6TnaRpppUctcmFW9mGSaZceYopH9zkjnjUe59iR5pdapWaGqHopboaYua1qije67GJ6CuJAAAIfkEBQUABAAsCgACAFcAMAAAA/9Iutz+ML5Ag7w46z0r5WAoSp43nihXVmnrdusrv+s332dt4Tyo9yOBUJD6oQBIQGs4RBlHySSKyczVTtHoidocPUNZaZAr9F5FYbGI3PWdQWn1mi36buLKFJvojsHjLnshdhl4L4IqbxqGh4gahBJ4eY1kiX6LgDN7fBmQEJI4jhieD4yhdJ2KkZk8oiSqEaatqBekDLKztBG2CqBACq4wJRi4PZu1sA2+v8C6EJexrBAD1AOBzsLE0g/V1UvYR9sN3eR6lTLi4+TlY1wz6Qzr8u1t6FkY8vNzZTxaGfn6mAkEGFDgL4LrDDJDyE4hEIbdHB6ESE1iD4oVLfLAqPETIsOODwmCDJlv5MSGJklaS6khAQAh+QQFBQAEACwfAAIAVwAwAAAD/0i63P5LSAGrvTjrNuf+YKh1nWieIumhbFupkivPBEzR+GnnfLj3ooFwwPqdAshAazhEGUXJJIrJ1MGOUamJ2jQ9QVltkCv0XqFh5IncBX01afGYnDqD40u2z76JK/N0bnxweC5sRB9vF34zh4gjg4uMjXobihWTlJUZlw9+fzSHlpGYhTminKSepqebF50NmTyor6qxrLO0L7YLn0ALuhCwCrJAjrUqkrjGrsIkGMW/BMEPJcphLgDaABjUKNEh29vdgTLLIOLpF80s5xrp8ORVONgi8PcZ8zlRJvf40tL8/QPYQ+BAgjgMxkPIQ6E6hgkdjoNIQ+JEijMsasNY0RQix4gKP+YIKXKkwJIFF6JMudFEAgAh+QQFBQAEACw8AAIAQgBCAAAD/kg0PPowykmrna3dzXvNmSeOFqiRaGoyaTuujitv8Gx/661HtSv8gt2jlwIChYtc0XjcEUnMpu4pikpv1I71astytkGh9wJGJk3QrXlcKa+VWjeSPZHP4Rtw+I2OW81DeBZ2fCB+UYCBfWRqiQp0CnqOj4J1jZOQkpOUIYx/m4oxg5cuAaYBO4Qop6c6pKusrDevIrG2rkwptrupXB67vKAbwMHCFcTFxhLIt8oUzLHOE9Cy0hHUrdbX2KjaENzey9Dh08jkz8Tnx83q66bt8PHy8/T19vf4+fr6AP3+/wADAjQmsKDBf6AOKjS4aaHDgZMeSgTQcKLDhBYPEswoA1BBAgAh+QQFBQAEACxOAAoAMABXAAAD7Ei6vPOjyUkrhdDqfXHm4OZ9YSmNpKmiqVqykbuysgvX5o2HcLxzup8oKLQQix0UcqhcVo5ORi+aHFEn02sDeuWqBGCBkbYLh5/NmnldxajX7LbPBK+PH7K6narfO/t+SIBwfINmUYaHf4lghYyOhlqJWgqDlAuAlwyBmpVnnaChoqOkpaanqKmqKgGtrq+wsbA1srW2ry63urasu764Jr/CAb3Du7nGt7TJsqvOz9DR0tPU1TIA2ACl2dyi3N/aneDf4uPklObj6OngWuzt7u/d8fLY9PXr9eFX+vv8+PnYlUsXiqC3c6PmUUgAACH5BAUFAAQALE4AHwAwAFcAAAPpSLrc/m7IAau9bU7MO9GgJ0ZgOI5leoqpumKt+1axPJO1dtO5vuM9yi8TlAyBvSMxqES2mo8cFFKb8kzWqzDL7Xq/4LB4TC6bz1yBes1uu9uzt3zOXtHv8xN+Dx/x/wJ6gHt2g3Rxhm9oi4yNjo+QkZKTCgGWAWaXmmOanZhgnp2goaJdpKGmp55cqqusrZuvsJays6mzn1m4uRAAvgAvuBW/v8GwvcTFxqfIycA3zA/OytCl0tPPO7HD2GLYvt7dYd/ZX99j5+Pi6tPh6+bvXuTuzujxXens9fr7YPn+7egRI9PPHrgpCQAAIfkEBQUABAAsPAA8AEIAQgAAA/lIutz+UI1Jq7026h2x/xUncmD5jehjrlnqSmz8vrE8u7V5z/m5/8CgcEgsGo/IpHLJbDqf0Kh0ShBYBdTXdZsdbb/Yrgb8FUfIYLMDTVYz2G13FV6Wz+lX+x0fdvPzdn9WeoJGAYcBN39EiIiKeEONjTt0kZKHQGyWl4mZdREAoQAcnJhBXBqioqSlT6qqG6WmTK+rsa1NtaGsuEu6o7yXubojsrTEIsa+yMm9SL8osp3PzM2cStDRykfZ2tfUtS/bRd3ewtzV5pLo4eLjQuUp70Hx8t9E9eqO5Oku5/ztdkxi90qPg3x2EMpR6IahGocPCxp8AGtigwQAIfkEBQUABAAsHwBOAFcAMAAAA/9Iutz+MMo36pg4682J/V0ojs1nXmSqSqe5vrDXunEdzq2ta3i+/5DeCUh0CGnF5BGULC4tTeUTFQVONYAs4CfoCkZPjFar83rBx8l4XDObSUL1Ott2d1U4yZwcs5/xSBB7dBMBhgEYfncrTBGDW4WHhomKUY+QEZKSE4qLRY8YmoeUfkmXoaKInJ2fgxmpqqulQKCvqRqsP7WooriVO7u8mhu5NacasMTFMMHCm8qzzM2RvdDRK9PUwxzLKdnaz9y/Kt8SyR3dIuXmtyHpHMcd5+jvWK4i8/TXHff47SLjQvQLkU+fG29rUhQ06IkEG4X/Rryp4mwUxSgLL/7IqFETB8eONT6ChCFy5ItqJomES6kgAQAh+QQFBQAEACwKAE4AVwAwAAAD/0i63A4QuEmrvTi3yLX/4MeNUmieITmibEuppCu3sDrfYG3jPKbHveDktxIaF8TOcZmMLI9NyBPanFKJp4A2IBx4B5lkdqvtfb8+HYpMxp3Pl1qLvXW/vWkli16/3dFxTi58ZRcChwIYf3hWBIRchoiHiotWj5AVkpIXi4xLjxiaiJR/T5ehoomcnZ+EGamqq6VGoK+pGqxCtaiiuJVBu7yaHrk4pxqwxMUzwcKbyrPMzZG90NGDrh/JH8t72dq3IN1jfCHb3L/e5ebh4ukmxyDn6O8g08jt7tf26ybz+m/W9GNXzUQ9fm1Q/APoSWAhhfkMAmpEbRhFKwsvCsmosRIHx444PoKcIXKkjIImjTzjkQAAIfkEBQUABAAsAgA8AEIAQgAAA/VIBNz+8KlJq72Yxs1d/uDVjVxogmQqnaylvkArT7A63/V47/m2/8CgcEgsGo/IpHLJbDqf0Kh0Sj0FroGqDMvVmrjgrDcTBo8v5fCZki6vCW33Oq4+0832O/at3+f7fICBdzsChgJGeoWHhkV0P4yMRG1BkYeOeECWl5hXQ5uNIAOjA1KgiKKko1CnqBmqqk+nIbCkTq20taVNs7m1vKAnurtLvb6wTMbHsUq4wrrFwSzDzcrLtknW16tI2tvERt6pv0fi48jh5h/U6Zs77EXSN/BE8jP09ZFA+PmhP/xvJgAMSGBgQINvEK5ReIZhQ3QEMTBLAAAh+QQFBQAEACwCAB8AMABXAAAD50i6DA4syklre87qTbHn4OaNYSmNqKmiqVqyrcvBsazRpH3jmC7yD98OCBF2iEXjBKmsAJsWHDQKmw571l8my+16v+CweEwum8+hgHrNbrvbtrd8znbR73MVfg838f8BeoB7doN0cYZvaIuMjY6PkJGSk2gClgJml5pjmp2YYJ6dX6GeXaShWaeoVqqlU62ir7CXqbOWrLafsrNctjIDwAMWvC7BwRWtNsbGFKc+y8fNsTrQ0dK3QtXAYtrCYd3eYN3c49/a5NVj5eLn5u3s6e7x8NDo9fbL+Mzy9/T5+tvUzdN3Zp+GBAAh+QQJBQAEACwCAAIAfAB8AAAD/0i63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdArcQK2TOL7/nl4PSMwIfcUk5YhUOh3M5nNKiOaoWCuWqt1Ou16l9RpOgsvEMdocXbOZ7nQ7DjzTaeq7zq6P5fszfIASAYUBIYKDDoaGIImKC4ySH3OQEJKYHZWWi5iZG0ecEZ6eHEOio6SfqCaqpaytrpOwJLKztCO2jLi1uoW8Ir6/wCHCxMG2x7muysukzb230M6H09bX2Nna29zd3t/g4cAC5OXm5+jn3Ons7eba7vHt2fL16tj2+QL0+vXw/e7WAUwnrqDBgwgTKlzIsKHDh2gGSBwAccHEixAvaqTYcFCjRoYeNyoM6REhyZIHT4o0qPIjy5YTTcKUmHImx5cwE85cmJPnSYckK66sSAAj0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gwxZJAAA7LyogIHx4R3YwMHwzNjY3YzY4MzBmOTBmNjgzODNmN2ViN2E0OWQ0MTEyMCAqLw==";
        var img = '<div class="__waiting__" ' +
            'style ="position:absolute;z-index:2; width:100%;height:14px;text-align:center;">' +
            '<img  src='+loading+' alt="" width="'+size+'" ' +
            '/> '+
                  '</div>';
         $(this).each(function(){
            $(this).prepend(img);
            if(typeof callback === "function"){
                callback();
            }
        });
    };
    $.fn.waitingDone = function(callback){
        $(this).each(function(){
            $(this).find(".__waiting__").remove();
            if(typeof callback === "function"){
                callback();
            }
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


 /*
 * opt.obj 是触发的对象，opt.minDate和optmaxDate格式为new Date(yyyy,mm,dd) mm从0开始 */
function scrollDate(opt,callback){
   $(opt.obj).mobiscroll().date({
       theme: 'ios',     // Specify theme like: theme: 'ios' or omit setting to use default
       mode: 'Scroller',       // Specify scroller mode like: mode: 'mixed' or omit setting to use default
       display: 'bottom', // Specify display mode like: display: 'bottom' or omit setting to use default
       lang: "zh",       // Specify language like: lang: 'pl' or omit setting to use default
       onSelect: function (valueText, inst) {
           function _setVal(obj,date){
               $(obj).mobiscroll("setVal",date)
           }
           if(typeof callback === "function"){
               callback({
                   valueText:valueText,
                   inst:inst,
                   _setVal :_setVal
               });
           }
       },
       minDate: opt.minDate,  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
       maxDate: opt.maxDate,   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
       stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
   });

}

/*
*        opt={
*           startDate :"#startDate",
*           endDate : "#endDate",
*           startMinDate : new Date(2014,0,1),
*           endMinDate
*        }
*
* */

function searchRecording(opt,callback){
    var start = 0,
        end = 0,
        startVal = function(){return $(opt.startDate).val()},
        endVal = function(){return $(opt.endDate).val()},
        st = null;
    scrollDate({
        obj:opt.startDate,
        minDate:opt.startMinDate?opt.startMinDate:new Date(2014,0,1),
        maxDate:new Date()
    },function(op){
        start = op.inst.getVal().getTime();
        startVal = op.valueText;
        $(opt.startDate).data("date",op.inst.getVal().getTime());
        $(opt.endDate).removeAttr("disabled");
        correct(start,end,function(){
            $(opt.endDate).val($(opt.startDate).val());
        });
        st = setTimeout(function(){
            check(function(a,b){
                if(typeof callback ==="function"){
                    seajs.use("msg",function(){
                        var content = '<div class="f16 textMiddle" style="position: relative;bottom: 6px;">查询记录？</div>' +
                            '<div style="height: 46px;line-height: 46px;"><span class="f16" style="color: rgb(96,204,211);">' +
                            a+
                            '</span>' +
                            '<span class="f16"> 至 </span>' +
                            '<span class="f16" style="color: rgb(96,204,211);">' +
                            b+
                            '</span> </div>';
                        msg.confirm(content,function(){
                            callback(a,b);
                        });
                    });
//                    callback(a,b);
                }
            });
        },1000);
        scrollDate({
            obj:opt.endDate,
            minDate:opt.endMinDate?opt.endMinDate:op.inst.getVal(),
            maxDate:new Date()
        },function(op){
            clearTimeout(st);
            end = op.inst.getVal().getTime();
            endVal = op.valueText;
            $(opt.endDate).data("date",op.inst.getVal().getTime());
            check(function(a,b){
                if(typeof callback ==="function"){
                    seajs.use("msg",function(){
                        var content = '<div class="f16 textMiddle" style="position: relative;bottom: 6px;">查询记录？</div>' +
                            '<div style="height: 46px;line-height: 46px;"><span class="f16" style="color: rgb(96,204,211);">' +
                            a+
                            '</span>' +
                            '<span class="f16"> 至 </span>' +
                            '<span class="f16" style="color: rgb(96,204,211);">' +
                            b+
                            '</span> </div>';
                        msg.confirm(content,function(){
                            callback(a,b);
                        });
                    });
//                    callback(a,b);
                }
            });
//           $(opt.startDate).mobiscroll('destroy')
        });
//        $(opt.endDate).trigger("click");
    });
    function correct(a,b,callback){
        if(a>b && b!=0){
            if(typeof callback ==="function"){
                callback();
            }
        }
    }
    function check(callback){
        var a = $(opt.startDate).val(),
            b = $(opt.endDate).val();
        if(a&&b){
            if(typeof callback ==="function"){
                callback(a,b);
            }
        }
    }
}

function searchForRecord(callback,startDate){

    $(function(){
        searchRecording({
            startDate :"#startDate",
            endDate : "#endDate",
            startMinDate : startDate?startDate:new Date(2014,0,1)
        },function(start,end){
            if(typeof callback ==="function"){
                callback(start,end);
            }
            $(".searchRecord").trigger("touchend");
        });
        function getDayHtml (date){
            return date.getFullYear()+"-"+(date.getMonth()+1<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+date.getDate();
        }
        function quickSearch(date){
            var now = new Date(),
                nowDate = null,
                startDate = getDayHtml(date);
            nowDate = getDayHtml(now);
            $("#endDate").removeAttr("disabled").val(nowDate).mobiscroll("setVal",nowDate);
            $("#startDate").val(startDate).mobiscroll("setVal",startDate);

        }

        $(".changeRangeBox").on("touchend",".tap",function(e){
            e.stopPropagation();
            e.preventDefault();
            $(".changeRangeBox").find(".on").removeClass("on");
            $(this).addClass("on");
            var checknum = Number($(this).attr("check")),
                nowTime = new Date().getTime();
            checkTime = [
                    new Date(2015,4,22).getTime()-new Date(2015,4,15).getTime(),
                    new Date(2015,4,22).getTime()-new Date(2015,3,22).getTime(),
                    new Date(2015,4,22).getTime()-new Date(2015,1,22).getTime()
            ];
            var date = (new Date(new Date().getTime() - checkTime[checknum])),
                nowD = getDayHtml(new Date()),
                startD = getDayHtml(date);
            if(typeof callback ==="function"){
                callback(startD,nowD);
            }
            $(".searchRecord").trigger("touchend");
//        quickSearch(date)
        });
        $(".end.Date").on("touchend",function(){
            if($("#startDate").val()==""){
                seajs.use("msg",function(){
                    msg.alert("请先选择开始日期",function(){
//                        $("#startDate").trigger("click");
                    },1000)
                })
            }
        })
    });
}


(function($){
    $.fn.tapColor=function(){
        return $(this).each(function(){
            $(this).on("touchstart",function(e){
//                $(this).off("touchend");
//                $(this).addClass("touching")
                $(this).css({
                    "text-shadow":"-1px 2px 1px rgba(0,0,0,.2)"
                });
                $(this).on("touchend",function(){
                    var THIS = $(this);
//                    setTimeout(function(){
//                        THIS.removeClass("touching")
                        THIS.css({
                            "text-shadow":"none"
                        })
//                    },280)
                })
            })
        })
    }
}(jQuery));

$(function(){
    $(".__tapColor__").tapColor();
});