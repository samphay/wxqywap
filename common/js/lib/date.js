/**
 * Created by 星辉 on 2015/5/17.
 */
/*define(function(require, exports, module) {*/
    function addZero(num){
        return num = num<10?"0"+num:num;
    }
    function weeky (a,b){
        var weekstyle =[
                "周",
                "星期"
            ],
            week = [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ];
        if (typeof(b) == "undefined" ) b=0;
        return weekstyle[b]+week[a];
    }
    var date={
        time:function(){
            var date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate(),
                weekDay = date.getDay(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();
            return {
                "year":addZero(year),
                "month":addZero(month+1),
                "day":addZero(day),
                "weekDay":weeky(weekDay),
                "hour":addZero(hour),
                "minute":addZero(minute),
                "second":addZero(second)
            }
        },
        check:{
            year:function(){return new Date().getFullYear()},
            month:function(){return new Date().getMonth()},
            day:function(){return new Date().getDate()},
            weekDay:function(){return new Date().getDay()},
            hour:function(){return new Date().getHours()},
            minute:function(){return new Date().getMinutes()},
            second:function(){return new Date().getSeconds()},
            timeStamp:function(){return new Date().getTime()},
            apm : function(){
                if(new Date().getHours()<12){
                    return 0;
                }else{
                    return 1;
                }
            }
        }
    };
/*
});*/
//获取当前时秒数Time()
function NowTime(){
    var d=new Date();
    var dT = d.getTime();
    //console.log(dT);
    return dT;
}

function GetTime(year,month,day,hour,minute,seconds){
    month-=1;
    if(seconds>60||seconds<0||!seconds){
        seconds = 0;
    }else{
        seconds = seconds;
    }
    var MissionDate = new Date();
    MissionDate.setFullYear(year,month,day);
    MissionDate.setHours(hour,minute,seconds,0);
    var MD=MissionDate.getTime();
    // console.log(MissionDate);
    return MD;
};

//求时间差
function TimeLeft(Start,End){
    var Start=Start;  //开始时间
    var End=End;    //结束时间
    var date3=End-Start  //时间差的毫秒数
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000))
    //计算出小时数
    // console.log(days);
    var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))
    //计算相差分钟数
    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))
    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    if(seconds<0||minutes<0||hours<0||days<0){
        var timeArray = new Array;
        timeArray['d']="00";
        timeArray['h']="00";
        timeArray['m']="00";
        timeArray['s']="00";
    }else{
        var timeArray = new Array;
        timeArray['d']=days;
        timeArray['h']=hours<10?"0"+hours:hours;
        timeArray['m']=minutes<10?"0"+minutes:minutes;
        timeArray['s']=seconds<10?"0"+seconds:seconds;
    }
    return timeArray;
// alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
}