#mini-tool
一个轻量级的工具库，实现了jquery的一些常用功能，及日常用到的一些小功能，<br>
如：链式、元素查找（选择器关系查找、属性查找、子节点查找...）、遍历循环、属性获取及设定、样式获取及设定、<br>
js加载异步引用、事件绑定及移除、检测class、添加节点,内容添加及获取.....<br>
因为最近的项目都是用到appcan来做APP开发的，所以里面封装了些常用的API，有需要的同学可以直接get下来<br>
```
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>mini-tool</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        *{margin:0;padding: 0;font-size: 14px;font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';}
        .event{height: 40px;line-height: 40px;text-align: center;}
        .item{background: #d8d8d8;height: 40px;line-height: 40px;margin: 5px 0;}
        .add-element{background: darkseagreen;height: 40px;line-height: 40px;}
    </style>
</head>
<body>

<div class="event">第一个可以点击的div</div>
<p class="event">第一个可以点击的P</p>
<ul class="parent">
    <li class="child"></li>
    <li class="child-two"></li>
    <li class="child"></li>
</ul>
<div src="div">用来测试属性选择器查找的元素</div>
<ul class="list">
    <li class="item"></li>
    <li class="item"></li>
</ul>
<script src="tool.js"></script>

<script type="text/javascript">
    "use strict";

    $('.event').on('click', function () {
        console.log('点击了')
    }).css('border', '1px solid #ddd').css('font-weight', 'bold');

    $('.parent').css('background', 'red').find('li').css('background', 'blue').css('height', '50px').html('<span style="color:red">child</span>')

    $('.parent').find('.child').css('background', 'green').text('first child').eq(1).text('last child')

    $('div[src="div"]').html('js通过属性选择器找到的').css('background', 'yellow').css('height', '80px')

    console.log('src属性值为：' + $('script[src="tool.js"]').attr('src'))

    $('body').append('<div class="add-element" style="color:red;">js插入的元素</div>')

    $('.list .item').text('js填入的内容')


</script>

</body>
</html>
```

