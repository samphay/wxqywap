/**
 * Created by 星辉 on 2015/5/11.
 */


$(function(){
    $(".abc").click(function(){
        seajs.use(["msg"],function(){
            msg.alert("123");
        });
    })
});