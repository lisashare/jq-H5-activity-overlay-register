
// 验证码判断
var InterValObj;
var count = 60;
var curCount;
//滚动条
var sss;

//监听滚动条事件，显示隐藏，底部   
contentscroll();
function contentscroll(){
//  var flag;
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
//      console.log(sss)
        if(scrollTop >= 600){
//          if(!flag){
//              flag = true;
                $('.footer1').css("display","block");
//          }
        }else{
//      	console.log('why')
			if(!sss){
//				console.log(sss)
//				flag = false;
				$('.footer1').css("display","none");
			}
        }
    })
}            
// 关闭弹框和遮罩        
$('.icon_close').on('click',function(){  
    // $('body,html').removeClass("bodyHtmlNo");
    $('.dialog_input').fadeOut();
    $(".mask").fadeOut();
    window.clearInterval(InterValObj);        //停止计时器
    $('#enableSendBtn').bind('click',sendMessage);
    $('#enableSendBtn').text('发送验证码');
    //弹窗消失时设置 使用scrollTo方法回到原来的滚动位置:
    document.body.style.overflow='';
    document.body.style.position=null;
    document.body.style.top=null;
    window.scrollTo(0,sss);
    sss = null;
 })

//点击按钮，出现弹框
$('.layer').on('click',function(){ 
//	alert(document.body.style.top = 800)
    //移动端显示弹出层，下方滚动条禁止滚动的解决办法	    
    var scrollTop = window.pageYOffset  
        || document.documentElement.scrollTop  
        || document.body.scrollTop  
        || 0;
    sss=scrollTop;//保存当前滚动条位置
    document.body.style.top=-1*scrollTop+"px";
    document.body.style.position='fixed';
    //判断是显示注册表单还是成功详情内容
    //请求
        $.ajax({
            type:'POST',
            url:"/activity/validate-token",
            dataType:"json",
            success:function(data){
                // $('body,html').addClass("bodyHtmlNo");    //底层轮播停止
                // $(".mask").fadeIn('slow');
                if( data.code == 200 ){
                    $('.dialog_success').show('slow');
                    // $('.dialog_submit').fadeOut('slow')
                    //渲染页面数据
                    $.ajax({
                        type:'POST',
                        url:"/activity/show-gift",
                        dataType:"json",
                        success:function(data){
                            console.log(data);
                            var data = data.data;
                            if(data.url && data.pwd ){
//                              $('.footer1').css("display","none");
//                              $('body,html').addClass("bodyHtmlNo");    //底层轮播停止
                                $(".mask").show('slow');
                                $(".link").attr('href', data.url ).html( data.url );
                                $(".passwordNum").html( data.pwd );
                            }
                        }
                    });
      
                }else{
//                     $('.footer1').css("display","none");
//                  $('body,html').addClass("bodyHtmlNo");   //底层轮播停止
                    $(".mask").fadeIn();
                    $('.vercode').val("验证码");              //验证码清空
                    $('.dialog_submit').fadeIn();               //注册框显示
                    $(".form-warning").text("");              //两个信息框都清空
                }
            },
            error:function(){
             $('#m-toast-inner-text').text('网络异常，请稍后再试');
             $('#m-toast-pop').fadeIn();
             setTimeout(function() {
                 $('#m-toast-pop').fadeOut();
             }, 2000);
            }
        });
    });

//监听input text 事件,设置提交按钮
$(".mobile,.vercode").on('input propertychange',function() {
    var phone = $('.mobile').val();
    var vercode = $('.vercode').val();
    if(phone.length === 11 && vercode.length === 6){
        //提交按钮可用,并提交
        $('[data-role="registerBtn"]').addClass('btn_active');
        $('[data-role="registerBtn"]').bind('click',submit);
    }else{
        $('[data-role="registerBtn"]').removeClass('btn_active');
        $('[data-role="registerBtn"]').unbind('click');
    }
});

$(".mobile").on('input propertychange',function() {
    $(".form-warning-phone").text("");
});
$(".vercode").on('input propertychange',function() {
    $(".form-warning-code").text("");
});
        
//手机号判断
function validateMobile(){
    var phone = $('.input-text').val();       //获取手机号码输入框值
    var reg = /^1[3|4|5|7|8|9|6]\d{9}$/;      //正则
    var flag = false;
    //判断手机号是否为空
    if(!$.trim(phone).length || phone === "手机号"){
        $('.form-warning-phone').text('手机号不能为空');
        flag = false;
    }else{
        if(!reg.test(phone)){                 //校验手机号码格式
            $('.form-warning-phone').text('请输入正确的手机号');
            flag = false;
        }else{
            $('.form-warning-phone').text('');
            flag = true;
        }
    }
    return flag;
}

//验证码判断
function validateVercoode(){
    var vercode = $('.vercode').val();
    var reg = /^\d{6}$/;
    var flag = false;
    if(!reg.test(vercode)){
        $('.form-warning-code').text('验证码有误，请重新输入');
        flag = false;
    }else{
        flag = true;
    }
    return flag;
} 
        
//用户注册
//点击获取验证码
$("#enableSendBtn").bind('click',sendMessage);

//注册按钮
function submit(){
    var vercode = $('.vercode').val();
    var phone = $('.mobile').val();
    var deviceType = judgeType();
    var fr = window.location.search.split("=")[1];
    var phoneFlag = validateMobile();
    var vercodeFlag = validateVercoode();
    if( phoneFlag && vercodeFlag ){
           $.ajax({
               type:'POST',
               url: "/activity/register",
               dataType:"json",
               data:{
                   "deviceType":deviceType,
                   "phone_Number":phone,
                   "code":vercode,
                   "fr":fr,
               },
               success:function(data){
                   if(data.code ==200 ){
                   	
                   	
                   	
                   	
                    $('.dialog_submit').fadeOut(function(){
                       	$.ajax({
                           type:'POST',
                           url:"/activity/show-gift",
                           dataType:"json",
                           success:function(data){
                               if(data.code==200){
                                   var data = data.data;
                                   if(data.url && data.pwd ){
                                       $(".link").attr('href', data.url ).html( data.url );
                                       $(".passwordNum").html( data.pwd );
                                    $('.dialog_success').removeClass('kdHiden');
                                    $('.dialog_success').fadeIn();
                                    }
                                }

                           },
                           error:function() {

                           }
                       	});
                    })
                   }else if( data.code == 500 ){
                       //失败的处理
                       $(".form-warning-code").text( data.message );
                       $(".mobile").on('input propertychange',function() {
                           $(".form-warning").text("");
                       });
                       $('.vercode').val("验证码");
                       return ;
                   }
         
                   },
               error:function(){
                   $(".form-warning-code").text("网络异常，请稍后再试");
                   $(".mobile").on('input propertychange',function() {
                       $(".form-warning").text("");
                   });
               }
           })
    }
}
//计时器
function setRemainTime(){
    if(curCount == 0){
        window.clearInterval(InterValObj);        //停止计时器
        $('#enableSendBtn').bind('click',sendMessage);
        $('#enableSendBtn').text('重新获取');
    }else{
        curCount--;
        $("#enableSendBtn").text(curCount+"s");
    }
}      
function sendMessage(){
    curCount = count;
    //先验证手机号
    if(validateMobile()){
	    //设置button效果，置灰+开始倒计时
	    $('#enableSendBtn').unbind('click');
	    $("#enableSendBtn").text(curCount+"s");
	    var phone = $('.input-text').val();
	    InterValObj = window.setInterval(setRemainTime,1000);
	     $.ajax({
	         type:'POST',
	         url: "/activity/send-code",
	         data:{"phone_number":phone},
	         dataType:"json",
	         success:function(data){
	             console.log(data);
	             if(data.code === 200){
	             }else{
	                //请重新获取验证码
	                window.clearInterval(InterValObj);
	                $('#enableSendBtn').text('发送验证码');
	                $('#enableSendBtn').unbind('click',sendMessage);
	                $(".form-warning-code").text( data.message );
	             }
	         }
	
	     });
    }
}
function judgeType(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/iPhone\sOS/i) == "iphone os") {
        // return "IOS";
        return '2';
    } else if(ua.match(/Android/i) == "android") {
        // return "Android";
        return '1';
    }
}

//下载
var downLoadApp = {
    ua:window.navigator.userAgent.toLowerCase(), //获取用户浏览器信息
    init:function(){
        var self = this;
        $('.androidApp').on('click',function(){
            self.androidApp('kuaidao://kuaidao.app.com/open');
        });
        if( self.judgeType()=='IOS' ){
            $('.iosApp').removeClass('kdHidenImp');
            $('.androidApp').addClass('kdHidenImp');
//          console.log('IOS');
        }else if( self.judgeType()=='Android' ){
            $('.iosApp').addClass('kdHidenImp');
            $('.androidApp').removeClass('kdHidenImp');
//          console.log('Android');
        }
//      console.log('init end');
    },
    iosApp:function(url){
        var self = this;
        var timeout, t = 1000, hasApp = true;
        setTimeout(function () {
            if (hasApp) {

            } else {
                window.location.href = $("#appKd").val().split("|")[1];
            }
            document.body.removeChild(ifr);
        }, 2000)

        var t1 = Date.now();
        var ifr = document.createElement("iframe");
        ifr.setAttribute('src', url);
        ifr.setAttribute('style', 'display:none');
        document.body.appendChild(ifr);
        timeout = setTimeout(function () {
            var t2 = Date.now();
            if (!t1 || t2 - t1 < t + 100) {
                hasApp = false;
            }
        }, t);
    },
    androidApp:function(url){
        // function androidApp(url) {
        var self = this;
        var ua = window.navigator.userAgent.toLowerCase();
        var timeout, t = 1000, hasApp = true;
        setTimeout(function () {
            if (hasApp) {
                $('.androidApp').attr('href','kuaidao://kuaidao.app.com/open');
                return false;
            } else {
                if (ua.match(/iPhone\sOS/i) == "iphone os") {

                } else if(ua.match(/Android/i) == "android") {

                    var lcoaltionUrl=window.location.href;
                    var cha=lcoaltionUrl.substring(0,lcoaltionUrl.indexOf("/activity"));
                    window.location.href = $("#appKd").val().split("|")[0];

                    // alert(56)

                }
                return false;
            }
            document.body.removeChild(ifr);
        }, 2000)

        var t1 = Date.now();
        var ifr = document.createElement("iframe");
        ifr.setAttribute('src', url);
        ifr.setAttribute('style', 'display:none');
        document.body.appendChild(ifr);
        timeout = setTimeout(function () {
            var t2 = Date.now();
            if (!t1 || t2 - t1 < t + 100) {
                hasApp = false;
            }
        }, t);
        // }
    },
    judgeType:function(){
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
            return "IOS";
        } else if(ua.match(/Android/i) == "android") {
            return "Android";
        }
    },
    judgeFr:function(){
        return window.location.search.split("=")[1];
    },
    appKd:function(){
        return $("#appKd").val();
    }
}

downLoadApp.init();
//模仿placeholder
function checkValue(obj,tipText){
    $(obj).focus(function(){
        if( obj.val()== tipText ){
            obj.val("");
        }
    });
    $(obj).blur(function(){
        if( obj.val()=="" ){
            obj.val(tipText);
        }
    });
    if( $.trim( obj.val() )=="" ){
        obj.val(tipText);
    }
}
checkValue($(".mobile"),'手机号');
checkValue($(".vercode"),'验证码');

console.log("%c亲！demo对你有用，请点个赞吧"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:3em");