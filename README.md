
## 信息流活动

# 此demo简单实现了弹出层用户注册逻辑，代码lowB的很，新手可以借鉴

# 请在服务器(wampserver,phpstudy...)环境下打开页面，activity文件夹为手写接口

```
data:2018/5/24  1.0 初稿   author:**
```

开发时间:2018-05-29--2018-06-01

### 需求背景

通过h5活动进行各渠道推广，引导用户注册

### 功能点概要

1. 对象各渠道推广，吸引有创业意向的用户
2. 用户流程用户h5页浏览创业信息，注册成功后给予知识库文件资料
3. 功能点涉及功能点包括注册模块、短信发送密码及推广渠道区分
4. 原型地址 **

### 详情需求

1. 活动信息展示页

图一：页面逻辑

1. 首次进入h5页面，点击“免费领取”按钮 跳转至“图二”弹出框；
2. 用户注册成功至结果页需前端缓存时间24时（用户手动冲出缓存不考虑），即24时内关闭 再次访问h5页面点击“点击获取”时直接进入结果页。
【交互形式】
1. 触屏从上到下滑动
2. “获取创业礼包”按钮屏幕下方固定。

2. 活动注册弹框

图二：页面逻辑

手机号注册逻辑（判断逻辑参照客户端注册流程）
【前置条件】
1.手机号的格式:支持开头为 13、14、15、17、18 、19、16的 11 位手机号码;
2.用户判断
  2.1 未注册用户首次通过手机号获取动态密码则视为注册成功;同时未注册用户首次获取动态码时会接收到两条短信，一条是验证码，一条是初始密码;
  2.2 已注册过用户手机号，仅发送验证码。   
【注册逻辑】
1.点击“获取验证码”判断手机号

  if 手机号是否为空，是则提示：手机号不能为空
    if 否，则判断是否正确
        if 否，则提示：请输入正确的手机号
        if 是，则下发短信验证码。按钮在 1 分钟内显示 60s 倒计时，超过 1分钟则 重新获取。

2.默认“注册提交”置灰状态，当手机号和验证码位数正确则高亮展示可点击。   
3.点击“注册提交”判断
  if 先判断手机号或验证码是否正确，否 则提示：请输入正确的手机号/验证码有误，请重新输入
     if 是，则弹出领取结果页面。
4. 网络等异常情况，则提示：网络异常，请稍后再试。    
5. 其他安全规则或异常账户，开发时需适当考虑。

初始密码短信内容
【公司名称】感谢注册。。账户，初始随机密码：xxxxxxx，请及时登录。。。app账号管理中修改密码。

3. 活动结果弹框

图三：页面逻辑

点击“了解更多创业知识”进入客户端下载页面

### 技术栈

移动端活动页面，考虑兼容各个手机浏览器，所以选用的框架是原生JS和JQuery,结构为单页面链接，弹出层结构，弹出层切换；

遇到很多兼容性问题

1. 禁止手机浏览页面双击图片放大问题

```
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover"> 
//其中 viewport-fit=cover属性可以适配iphoneX

```

2. input的placeholder属性不兼容(部分浏览器下方字体被切掉了)，设置input高、行高都不生效； 原因：input框内设置font-size字体大小导致；解决方法：js模拟placeholder属性实现功能(封装了一个方法)。

```
function checkValue(obj,tipText){
    obj.focus(function(){
        if( obj.val()== tipText ){
            obj.val("");
        }
    });
    obj.blur(function(){
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
```

3. button按钮内部字体，在部分Android手机中，字体偏上；原因：button按钮内部字体默认就是居中，再特意设置line-height导致，line-height在Android手机中，容易出现此类问题；解决方法：去掉line-heiht属性。

4. 百度浏览器在识别显示隐藏属性时，jq使用obj.css("display","none")来控制。

5. Android手机自带浏览器，不识别ajax es6 对象简写、function(){}写法。

6. 华为自带浏览器，a标签的text-decoration:underline; 不显示，overline是显示的，其余浏览器都没问题

7. 给input的height设定一个较小的高度，然后用padding去填充，基本上可以解决所有浏览器的问题
```
input{
    height: 16px;
    padding: 4px 0px;
    font-size: 12px;
}
```

~~首先布局的话应该是3个div绝对定位，根据z-index判断显示层级~~

~~由于是追求性能的移动端，动画用css3的transition:transform，简单又快，通过设置transform的scale和translate来改变位置和大小~~

~~事件上需要对手势进行判断，得到向左还是向右，判断变化后图片的z-index,高宽和位置。修改transform的scale和translate即可~~