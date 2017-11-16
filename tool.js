/**
 * Created by Mrzou on 2017-11-11.
 */

"use strict";
(function (window) {

    var tool = function (args) {
        return new Tool(args);
    }

    function Tool(args) {
        //创建一个数组，来保存获取的节点和节点数组
        this.elements = [];
        this.reg = /\[*\]/i;
        this.ele = /\<*\>/i;
        if (typeof args == 'string') {
            if (this.ele.test(args)) {

                this.elements = [];
                var temp = document.createElement('div');
                temp.innerHTML = args;
                this.elements.push(temp.children);
                temp = null;

            } else if (this.reg.test(args)) {

                var bgin = args.indexOf('[') + 1;
                var den = args.indexOf('=');
                var ends = args.indexOf(']');
                var attr = args.substring(bgin, den);
                var val = args.substring(den + 2, ends - 1);
                var Ele = args.substring(0, bgin - 1)

                var tagsArr = this.getTagName(Ele);
                this.elements = [];
                this.each(function (i, el) {
                    // console.log(el, tool(el).attr(attr), '-----', val)
                    if (tool(el).attr(attr) === val) {

                        this.elements.push(el);
                    }
                }.bind(this), tagsArr)

            } else if (args.indexOf(' ') != -1) {
                //find模拟
                var elements = args.split(' ');			//把节点拆开分别保存到数组里
                var childElements = [];					//存放临时节点对象的数组，解决被覆盖的问题
                var node = [];								//用来存放父节点用的
                for (var i = 0; i < elements.length; i++) {
                    if (node.length == 0) node.push(document);		//如果默认没有父节点，就把document放入
                    switch (elements[i].charAt(0)) {
                        case '#' :
                            childElements = [];				//清理掉临时节点，以便父节点失效，子节点有效
                            childElements.push(this.getId(elements[i].substring(1)));
                            node = childElements;		//保存父节点，因为childElements要清理，所以需要创建node数组
                            break;
                        case '.' :
                            childElements = [];
                            for (var j = 0; j < node.length; j++) {
                                var temps = this.getClass(elements[i].substring(1), node[j]);
                                for (var k = 0; k < temps.length; k++) {
                                    childElements.push(temps[k]);
                                }
                            }
                            node = childElements;
                            break;
                        default :
                            childElements = [];
                            for (var j = 0; j < node.length; j++) {
                                var temps = this.getTagName(elements[i], node[j]);
                                for (var k = 0; k < temps.length; k++) {
                                    childElements.push(temps[k]);
                                }
                            }
                            node = childElements;
                    }
                }
                this.elements = childElements;
            } else {
                //css模拟
                switch (args.charAt(0)) {
                    case '#' :
                        this.elements.push(this.getId(args.substring(1)));
                        break;
                    case '.' :
                        this.elements = this.getClass(args.substring(1));
                        break;
                    default :
                        this.elements = this.getTagName(args);
                }
            }
        } else if (typeof args == 'object') {
            //当参数直接为一个节点dom时，typeof: 'object'
            if (args != undefined) {
                this.elements[0] = args;
            }
        } else if (typeof args == 'function') {
            this.ready(args);
        }
    }

    Tool.prototype = {
        constructor: Tool,
        /*
         * method: isApp
         * 检测是否是appcan环境
         * */
        isApp: function () {
            //return typeof uexWidget === 'object'
            if (navigator.appVersion.indexOf('Windows') !== -1 || typeof uexWidget === 'object') {
                return true;
            } else {
                return false;
            }
        },
        toast: function (a, t) {
            t = t ? t : 2000
            appcan.window.openToast(a, t);
        },
        back: function () {
            appcan.window.close(1);
        },
        open: function (a, c, b) {
            var html = a + '.html'
            if (c) html = html + '?' + c
            appcan.window.open(a, html, (b) ? b : 2);
        },
        removeItem: function (n) {
            if (!n) return localStorage.clear();
            appcan.locStorage.remove(n);
        },
        setItem: function (n, v) {
            appcan.locStorage.setVal(n, v);
        },
        getItem: function (n) {
            return appcan.locStorage.getVal(n);
        },
        button: function (id, fn, cls) {
            if (!cls) cls = 'btn-act'
            appcan.button(id, cls, fn);
        },
        call: function (tel) {
            if (!tel) return;
            uexCall.dial(tel)
        },
        /*
         * 可识标标签内容添加，及获取
         * */
        html: function (str) {
            for (var i = 0; i < this.elements.length; i++) {
                if (arguments.length == 0) {
                    return this.elements[i].innerHTML;
                }
                this.elements[i].innerHTML = str;
            }
            return this;
        },
        /*
         *不识标标签内容添加，及或取
         * **/
        text: function (str) {
            for (var i = 0; i < this.elements.length; i++) {
                var obj = this.elements[i];
                if (arguments.length == 0) {
                    return (typeof obj.textContent == 'string') ? obj.textContent : obj.innerText;
                }

                if (typeof obj.textContent == 'string') {
                    obj.textContent = str;
                } else {
                    obj.innerText = str;
                }
            }
            return this;
        },
        /*
         * 获取元素属性
         * */
        attr: function (attr, value) {
            for (var i = 0; i < this.elements.length; i++) {
                if (arguments.length == 1) {
                    return this.elements[i].getAttribute(attr);
                } else if (arguments.length == 2) {
                    this.elements[i].setAttribute(attr, value);
                }
            }
            return this;
        },
        /*
         * 获取ID节点
         * */
        getId: function (id) {
            return document.getElementById(id)
        },
        /*
         * 获取class节点数组
         * */
        getClass: function (className, parentNode) {
            var node = null;
            var temps = [];
            if (parentNode != undefined) {
                node = parentNode;
            } else {
                node = document;
            }
            var all = node.getElementsByTagName('*');
            for (var i = 0; i < all.length; i++) {
                if ((new RegExp('(\\s|^)' + className + '(\\s|$)')).test(all[i].className)) {
                    temps.push(all[i]);
                }
            }
            return temps;
        },
        /*
         * 获取元素节点数组
         * */
        getTagName: function (tag, parentNode) {
            var node = null;
            var temps = [];
            if (parentNode != undefined) {
                node = parentNode;
            } else {
                node = document;
            }
            var tags = node.getElementsByTagName(tag);
            for (var i = 0; i < tags.length; i++) {
                temps.push(tags[i]);
            }
            return temps;
        },
        /*
         * 设置CSS选择器子节点
         * */
        find: function (str) {
            var childElements = [];
            for (var i = 0; i < this.elements.length; i++) {
                switch (str.charAt(0)) {
                    case '#' :
                        childElements.push(this.getId(str.substring(1)));
                        break;
                    case '.' :
                        var temps = this.getClass(str.substring(1), this.elements[i]);
                        for (var j = 0; j < temps.length; j++) {
                            childElements.push(temps[j]);
                        }
                        break;
                    default :
                        var temps = this.getTagName(str, this.elements[i]);
                        for (var j = 0; j < temps.length; j++) {
                            childElements.push(temps[j]);
                        }
                }
            }
            this.elements = childElements;
            return this;
        },
        /**
         * 获取当前查找的节点数量
         * */
        length: function () {
            return this.elements.length;
        },
        /**
         *重写模似jquery $.each方法
         * */
        each: function (fn, arr) {

            var obj = arr ? arr : ((this.elements && this.elements.length && this.elements) || this.elements[0])

            Array.prototype.forEach.call(obj, function (obj, index) {
                if (typeof fn === 'function') {
                    fn(index, obj);
                }
            });
            return this;
        },
        /*
         * arguments.length == 2设置css行内样式
         * arguments.length == 1获取css行内样式值
         * */
        css: function (attr, value) {
            for (var i = 0; i < this.elements.length; i++) {
                if (arguments.length == 1) {
                    return this.getStyle(attr, this.elements[i]);
                }
                this.elements[i].style[attr] = value;
            }
            return this;
        },
        /*
         * 获取元素当前采用的样式:
         * 行内、内联、link、import的样式都可以获取，并计算出最终采用的样式
         * @param: {
         *   attr 必填 样式名 width...
         *   ele  可选 为当前求样式值的元素，不选则默认为Tool中tool.elements[0]
         * }
         * **/
        getStyle: function (attr, ele) {
            var value;
            var element = ele ? ele : this.elements[0];

            if (typeof window.getComputedStyle != 'undefined') {//W3C
                value = window.getComputedStyle(element, null)[attr];
            } else if (typeof element.currentStyle != 'undeinfed') {//IE
                value = element.currentStyle[attr];
            }
            return value;
        },
        /*
         * 检查是否存在匹配的class
         * */
        hasClass: function (className, ele) {
            var element = ele ? ele : this.elements[0];
            return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        },
        on: function (type, fn, ele) {
            var obj = ele ? [ele] : this.elements;
            obj[0] && obj[0].length && (obj = obj[0]);

            console.log(this)

            if (typeof obj[0].addEventListener != 'undefined') {
                for (var i = 0; i < obj.length; i++) {
                    obj[i].addEventListener(type, fn, false);
                }
            }

            return this;
        },
        off: function (type, fn, ele) {
            var obj = ele ? [ele] : this.elements;
            obj[0] && obj[0].length && (obj = obj[0]);

            if (typeof obj[0].removeEventListener != 'undefined') {

                for (var i = 0; i < obj.length; i++) {
                    obj[i].removeEventListener(type, fn, false);
                }
            }
            return this;
        },
        /*
         * 模似jquery $.append()方法
         * **/
        append: function (text) {
            if (typeof text === 'string') {
                var temp = document.createElement('div');
                temp.innerHTML = text;
                // 防止元素太多 进行提速
                var frag = document.createDocumentFragment();
                while (temp.firstChild) {
                    frag.appendChild(temp.firstChild);
                }
                this.each(function (index, obj) {
                    obj.appendChild(frag);
                })
            } else if (text instanceof Tool) {
                var arr = text.elements[0];
                this.each(function (index, obj) {
                    for (var i = 0; i < arr.length; i++) {
                        obj.appendChild(arr[i]);
                    }
                })
            } else {
                this.each(function (index, obj) {
                    obj.appendChild(text);
                })
            }
            return this;
        },
        /*
         * 获取当前元素的下标
         * */
        index: function () {
            var children = this.elements[0].parentNode.children;
            for (var i = 0; i < children.length; i++) {
                if (this.elements[0] == children[i]) return i;
            }
        },
        /*
         * 获取某一个节点，并且返回Tool对象
         * */
        eq: function (num) {
            var element = this.elements[num];
            this.elements = [];
            this.elements[0] = element;
            return this;
        },
        /**
         * 获取当前元素的子节点
         * */
        children: function (index) {
            if (typeof index !== 'undefined') {
                this.elements = this.elements[0].children(index);
            } else {
                this.elements = this.elements[0].children;
            }
            return this;
        },
        /*
         * 动态加载JS
         * @param String   url     js文件URL
         * @param function callback
         */
        loadScript: function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                }
            } else {
                script.onload = function () {
                    callback();
                }
            }

            if (tool('script[src="' + url + '"]').length == 0) {
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            } else {
                callback();
            }

        },
        /**
         * 滑动删除，修改
         * @param object
         *{
         *  this : 绑定元素
         *  delete : 删除按钮事件
         *  change : 修改按钮事件
         *  url: flipsnap.js文件相对于调用页面的url,
         *  width: 侧滑出的宽度
         *}
         */
        slideFun: function (obj) {
            var that = this;
            that.loadScript(obj.url, function () {
                obj.width = obj.width ? obj.width : 60
                var flipsnap = [], flag = true, move, _this = obj.this, delOn = obj.delete, chaOn = obj.change;
                var addWidth = delOn && chaOn ? obj.width * 2 : obj.width;
                var content = tool('.content');
                content.css("width", "");
                tool(_this).each(function (i, e) {
                    var item = tool(e);
                    var height = parseInt(item.getStyle('height'));
                    //如果想刷新插件再次调用本方法，为了删除和修改滑动按钮高度能自适应变化，
                    // 要在调用本方法前进行$('.deleteButton/changeButton').remove()操作
                    if ((delOn && item.find('.deleteButton').length == 0) || (chaOn && item.find('.changeButton').length == 0)) {
                        var style = 'height: ' + height + 'px; line-height: ' + height + 'px;width:' + obj.width / 16 + 'em;text-align: center;color:#ffffff;position: absolute;z-index: 20;top:0;'
                        var delbtn = tool('<div class="deleteButton" style="' + style + ';background: #FE3C0F;right:-' + addWidth / 16 + 'em;">删除</div>');
                        var chabtn = tool('<div class="changeButton" style="' + style + ';background: #C7C7CD;right:-' + obj.width / 16 + 'em;">修改</div>');
                        item.children().each(function (i, child) {
                            tool(child).css('width', tool(child).getStyle('width'));
                        });
                        delOn && delbtn.on("click", delOn);
                        chaOn && chabtn.on("click", chaOn);
                        chaOn && item.append(chabtn.elements[0]);
                        delOn && item.append(delbtn.elements[0]);
                        item.append('<div class="delete-overlay" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);z-index: 10;visibility: visible;opacity: 0;"></div>');
                    }
                    ;

                    var fontSize = parseInt(tool(_this).getStyle('font-size'))
                    flipsnap[i] = Flipsnap(e, {
                        distance: (addWidth / 16) * fontSize,
                        maxPoint: 1
                    });

                    flipsnap[i].element.addEventListener('fstouchmove', function (ev) {
                        flag = true;

                        that.each(function (i, e) {
                            if (e.currentPoint == 1) {
                                flag = false;
                                // $('.delete-overlay').css("visibility","visible");
                                move && move.toPrev();
                                (move !== e) && (move = e);
                            }
                        }, flipsnap);

                        if (flag) {
                            move = null;
                            // $('.delete-overlay').css("visibility","hidden");
                        }
                    }, false);

                    tool.each(function (y, dom) {
                        tool(dom).on("click", function () {
                            flipsnap[i].toPrev();
                        })
                    }, ['.delete-overlay', '.deleteButton'])

                    //tool('.delete-overlay').on("click", function () {
                    //    flipsnap[i].toPrev();
                    //})
                    //tool('.deleteButton').on("click", function () {
                    //    flipsnap[i].toPrev();
                    //})
                });
            })
        },
        /*
         * prefixStyle:
         * 能力检测函数
         * style: 'transform'
         * */
        prefixStyle: function (style) {
            var elementStyle = document.createElement('div').style
            var sty = style.charAt(0).toUpperCase() + style.substr(1)
            var vendor = (function () {
                var transformNames = {
                    webkit: 'Webkit' + sty,
                    Moz: 'Moz' + sty,
                    O: 'O' + sty,
                    ms: 'ms' + sty,
                    standard: style
                }
                for (var key in transformNames) {
                    if (elementStyle[transformNames[key]] !== undefined) {
                        return key
                    }
                }
                return false
            })()
            if (vendor === false) return false
            if (vendor === 'standard') return style
            return vendor + sty
        },
        /**
         * nouislider: 双向滑块 plugin
         * param {
         *   id: '#slider'
         *   url: noUiSlider.js文件相对于调用页面的url,
         *   defaultValue: [100,500]
         *   minMax: [0, 1000]
         *   minMaxDom: [$('#rangeMin'),$('#rangeMax')]
         *   callBack: function(){}
         * }
         * */
        rangeSlider: function (param) {
            var style = document.createElement("style");
            style.innerHTML = '.noUi-target,.noUi-target *{-webkit-touch-callout:none;-webkit-user-select:none;-ms-touch-action:none;touch-action:none;-ms-user-select:none;-moz-user-select:none;user-select:none;-moz-box-sizing:border-box;box-sizing:border-box}.noUi-target{position:relative;direction:ltr}.noUi-base{width:100%;height:100%;position:relative;z-index:1}.noUi-origin{position:absolute;right:0;top:0;left:0;bottom:0}.noUi-handle{position:relative;z-index:1}.noUi-stacking .noUi-handle{z-index:10}.noUi-state-tap .noUi-origin{-webkit-transition:left .3s,top .3s;transition:left .3s,top .3s}.noUi-state-drag *{cursor:inherit!important}.noUi-base,.noUi-handle{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.noUi-horizontal{height:1.2rem}.noUi-horizontal .noUi-handle{width:1.4rem;height:1.4rem;left:-.7rem;top:-.3rem}.noUi-vertical{width:18px}.noUi-vertical .noUi-handle{width:1.4rem;height:1.4rem;left:-.7rem;top:-.1rem}.noUi-background{background:#e9eaee}.noUi-connect{background:#e4cc9e}.noUi-origin{border-radius:4px}.noUi-target{border-radius:4px}.noUi-target.noUi-connect{box-shadow:inset 0 0 3px rgba(51,51,51,.45),0 3px 6px -5px #BBB}.noUi-draggable{cursor:w-resize}.noUi-vertical .noUi-draggable{cursor:n-resize}.noUi-handle{border:1px solid #D9D9D9;border-radius:3px;background:#FFF;cursor:default}.noUi-active{box-shadow:inset 0 0 1px #FFF,inset 0 1px 7px #DDD,0 3px 6px -3px #BBB}.noUi-handle:after,.noUi-handle:before{content:"";display:block;position:absolute;height:14px;width:1px;background:#E8E7E6;left:14px;top:6px}.noUi-handle:after{left:17px}.noUi-vertical .noUi-handle:after,.noUi-vertical .noUi-handle:before{width:14px;height:1px;left:6px;top:14px}.noUi-vertical .noUi-handle:after{top:17px}[disabled] .noUi-connect,[disabled].noUi-connect{background:#B8B8B8}[disabled] .noUi-handle,[disabled].noUi-origin{cursor:not-allowed}.noUi-pips,.noUi-pips *{-moz-box-sizing:border-box;box-sizing:border-box}.noUi-pips{position:absolute;color:#999}.noUi-value{position:absolute;text-align:center}.noUi-value-sub{color:#ccc;font-size:10px}.noUi-marker{position:absolute;background:#CCC}.noUi-marker-large,.noUi-marker-sub{background:#AAA}.noUi-pips-horizontal{padding:10px 0;height:80px;top:100%;left:0;width:100%}.noUi-value-horizontal{-webkit-transform:translate3d(-50%,50%,0);transform:translate3d(-50%,50%,0)}.noUi-marker-horizontal.noUi-marker{margin-left:-1px;width:2px;height:5px}.noUi-marker-horizontal.noUi-marker-sub{height:10px}.noUi-marker-horizontal.noUi-marker-large{height:15px}.noUi-pips-vertical{padding:0 10px;height:100%;top:0;left:100%}.noUi-value-vertical{-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);padding-left:25px}.noUi-marker-vertical.noUi-marker{width:5px;height:2px;margin-top:-1px}.noUi-marker-vertical.noUi-marker-sub{width:10px}.noUi-marker-vertical.noUi-marker-large{width:15px}.noUi-tooltip{display:block;position:absolute;border:1px solid #D9D9D9;border-radius:3px;background:#fff;padding:5px;text-align:center}.noUi-horizontal .noUi-handle-lower .noUi-tooltip{top:-32px}.noUi-horizontal .noUi-handle-upper .noUi-tooltip{bottom:-32px}.noUi-vertical .noUi-handle-lower .noUi-tooltip{left:120%}.noUi-vertical .noUi-handle-upper .noUi-tooltip{right:120%}.noUi-horizontal .noUi-handle{border-radius:50%;-webkit-border-radius:50%}.noUi-handle:after,.noUi-handle:before{content:"";display:none;position:absolute;height:0;width:0;background:0 0;left:14px;top:6px}.noUi-connect{background:#5998ff}.noUi-horizontal .noUi-handle{width:.8em;height:.8em;left:-.4em;top:-.4rem}.blueColor{color:#5998ff}'
            document.querySelector("head").appendChild(style);
            $.loadScript(param.url, function () {
                var slider = document.querySelector(param.id);
                slider.style.height = '2px'
                var dom = param.minMaxDom
                noUiSlider.create(slider, {
                    start: param.defaultValue,
                    connect: true,
                    range: {
                        'min': param.minMax[0],
                        'max': param.minMax[1]
                    }
                });
                slider.noUiSlider.on('update', function (values, handle) {
                    if (typeof param.callBack === 'function') param.callBack(values, handle, dom)
                });
            })
        },
        /**
         * banner轮播图
         * wrap : better-scroll id  arg: css selector '#banner'
         * inner: content 内容       arg: css selector  '#bannerWrap'
         * dots : 轮播导航小点开关     arg: css selector || false
         * speed: 动画速阀           arg: Number 400
         * auto : 自动播放间隔时间     arg: Number 3000
         * */
        slider: function (obj) {
            this.loadScript(obj.url, function () {
                function Slider(options) {
                    this.options = {
                        wrap: options.wrap,
                        inner: options.inner,
                        dots: options.dots,
                        speed: options.speed,
                        auto: options.auto
                    }

                    this.$slider = document.querySelector(options.wrap);
                    this.$content = document.querySelector(options.inner);
                    if (options.dots) this.$dots = document.querySelector(options.dots);

                    this.resize();
                    this.runScroll();
                    this.autoScroll();
                }

                Slider.prototype = {
                    init: function (isResize) {
                        var dots = '';

                        var sliderWidth = window.getComputedStyle(this.$slider).width;
                        sliderWidth = parseInt(sliderWidth);

                        var sliderItems = this.$content.children;

                        var sliderLength = this.pages = sliderItems.length;

                        if (!isResize) {
                            sliderLength += 2;
                        }

                        var contentWidth = sliderLength * sliderWidth;

                        this.$content.style.width = contentWidth + 'px';

                        for (var i = 0; i < this.pages; i++) {
                            sliderItems[i].style.width = sliderWidth + 'px';
                        }

                        !isResize && this.options.dots ? this.createDots() : null;
                    },
                    createDots: function () {
                        for (var i = 0; i < this.pages; i++) {
                            if (i === 0) {
                                dots = '<span class="on"></span>';
                            } else {
                                dots += '<span></span>'
                            }
                        }
                        this.$dots.innerHTML = dots;
                    },
                    resize: function () {
                        var that = this;

                        window.addEventListener('resize', function () {
                            that.init(true);
                        })
                    },
                    runScroll: function () {
                        var that = this;

                        this.init(false);

                        this.slider = new BScroll(this.$slider, {
                            scrollX: true,
                            scrollY: false,
                            momentum: false,
                            snap: true,
                            snapLoop: true,
                            snapSpeed: this.options.speed
                        });

                        if (!this.options.dots) return
                        this.slider.on('scrollEnd', function () {
                            that.currentPage = that.slider.getCurrentPage().pageX;

                            for (var i = 0; i < that.$dots.children.length; i++) {
                                that.$dots.children[i].className = '';
                                if (i === (that.currentPage - 1)) {
                                    that.$dots.children[i].className = 'on';
                                }
                            }
                        });
                    },
                    autoScroll: function () {
                        if (!this.options.auto) {
                            return
                        }
                        var that = this;
                        var page = that.slider.getCurrentPage().pageX;

                        setInterval(function () {
                            that.slider.next()
                        }, this.options.auto)
                    }
                }

                new Slider({
                    wrap: obj.wrap,
                    inner: obj.inner,
                    dots: obj.dots ? obj.dots : false,
                    speed: obj.speed ? obj.speed : 400,
                    auto: obj.auto ? obj.auto : 3000
                });
            })
        },
        /**
         * method: ready
         * 入口初始化，
         * 用于在浏览器与appCan中调试
         * */
        ready: function (callBack) {
            if (!(callBack instanceof Function)) return
            appcan.ready(function () {
                callBack(appcan)
            })
        },
        /**
         * 针对百度地图点击延迟
         * 扩展的点击事件，采用touch事件，
         * 消除了touchend拖动时，也会触发点击的bug
         * arguments[0] : var map = new BMap.Map("mapView");的地图对象
         * arguments[1] : callBack 事件触发回调函数
         * */
        touchClick: function (map, fn) {
            var firstX = 0
            var firstY = 0

            map.addEventListener("touchstart", function (e) {
                console.log(e.pixel)
                var firstTouch = e.pixel
                firstX = firstTouch.x
                firstY = firstTouch.y
            });

            map.addEventListener("touchend", function (e) {
                console.log(e.pixel)
                var firstTouch = e.pixel
                var lastX = firstTouch.x
                var lastY = firstTouch.y
                var diffX = Math.abs(lastX - firstX)
                var diffY = Math.abs(lastY - firstY)
                if (diffX < 10 && diffY < 10) {
                    console.log('is Ok')
                    if (typeof fn === 'function') {
                        fn(e)
                    }
                }
            });
        }
    };

    if (typeof $ !== 'undefined') {
        //throw new Error('$变量有重名，请使用tool方法名')
        window.tool = tool;
    } else {
        window.tool = window.$ = tool;
    }
})(window)