/**
 **** Confirm弹窗插件
 *  PluginName: ZjsjConfirm
 *  Author: Mrzou 2018-01-04
 *  param: {
 *		       title: String,
 *           text: String,
 *           confirm: Function
 *           concel: Function
 *           animate: 'bottom || top || left || 默认不填则为渐隐'
 *           type: '1为单按钮，默认双按钮'
 *       }
 *  button.addEventListener("click", function () {
 *       ZjsjConfirm.plugin().setInfo({
 *		       title:"titlePops",
 *           text: 'yooooo',
 *           confirm: function () {
 *               console.log('你点了确定')
 *           },
 *           concel: function () {
 *               console.log('你点了取消')
 *           },
 *       })
 *   })
 ****/
var ZjsjConfirm = {
  plugin: (function () {
    function ZjsjConfirm() {
      this.opt = {
        confirm: new Function(),
        concel: new Function(),
        text: '',
        title: '',
        animate: ''
      }
      this.prefixStyle = function (style) {
        var elementStyle = document.createElement('div').style
        var sty = style.charAt(0).toUpperCase() + style.substr(1)
        var vendor = (function () {
          var transformNames = {
            webkit: 'webkit' + sty,
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
      }
      this.prevent = function (e) {
        e.preventDefault()
      }
      this.init()
    }

    ZjsjConfirm.prototype = {
      init: function () {
        var ndDom = document.getElementById('zjsjPopConfirmWrapper')
        var ndSty = document.getElementById('ZjsjConfirmStyleId')
        ndDom === null ? this.dom_div = document.createElement("div") : this.dom_div = document.getElementById("zjsjPopConfirmWrapper")
        if (ndDom === null) this.dom_div.id = "zjsjPopConfirmWrapper";
        if (ndSty === null) var style = document.createElement("style");
        if (ndSty === null) style.id = 'ZjsjConfirmStyleId'
        if (ndSty === null) style.innerHTML = '*{outline:none;margin:0;padding:0}#zjsjtitlePops{text-align: center;line-height: 1.6em;padding: .8em .625em 0;color: #555;}#zjsjPopConfirmShade{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.3);display:none;opacity:0;z-index:999999998;-webkit-transition:all .3s;-moz-transition:all .3s;-ms-transition:all .3s;-o-transition:all .3s;transition:all .3s}#zjsjPopConfirmShade.show,#zjsjPopConfirm.show{display:block}#zjsjPopConfirm{width:13em;height:auto;overflow:hidden;background:#fff;display:none;border-radius:.4em;-webkit-border-radius:.4em;position:fixed;z-index:999999999;transform:translate(-50%,-50%);webkit-transform:translate(-50%,-50%);opacity:0;-webkit-transition:all .3s;-moz-transition:all .3s;-ms-transition:all .3s;-o-transition:all .3s;transition:all .3s}.zjsjPopText{font-size:.95em;line-height:1.5em;text-align:center;width:100%;padding:.4em .625em .9em .625em;box-sizing:border-box;-webkit-box-sizing:border-box;color:#555;}.zjsjPopButton{width:100%;border-top:1px solid #e1e1e1;color:#5998ff;font-size:.95em;}.zjsjPopYes,.zjsjPopNo{line-height:1em;text-align:center;float:left;width:50%;box-sizing:border-box;-webkit-box-sizing:border-box;padding:.7em 0;position:relative;}.zjsjPopNo:after{content:"";position:absolute;left:0;top:50%;width:1px;background:#e1e1e1;height:100%;transform:translate(-50%,-50%);webkit-transform:translate(-50%,-50%);}';
        if (ndDom === null) this.dom_div.innerHTML = '<div id="zjsjPopConfirm"><div id=zjsjtitlePops></div><div class="zjsjPopText"id="zjsjPopConfirmText">提示语</div><div class="zjsjPopButton"><div class="zjsjPopYes"id="zjsjPopConfirmYes">确定</div><div class="zjsjPopNo"id="zjsjPopConfirmNo">取消</div></div></div><div id="zjsjPopConfirmShade"></div>';
        if (ndSty === null) document.head.appendChild(style);
        if (ndDom === null) document.body.appendChild(this.dom_div);
        this.bottonYes = document.querySelector('#zjsjPopConfirmYes');
        this.bottonNo = document.querySelector('#zjsjPopConfirmNo');
        this.ngtext = document.querySelector('#zjsjPopConfirmText');
        this.ngtitle = document.querySelector('#zjsjtitlePops');
        this.shade = document.querySelector('#zjsjPopConfirmShade');
        this.wrap = document.querySelector('#zjsjPopConfirm');
        var transitionEnd = this.prefixStyle('transition') + 'End';
        transitionEnd && this.wrap.addEventListener(transitionEnd, function () {
          var show = window.getComputedStyle(this.shade, null)['opacity'];
          if (!(show * 1)) {
            this.shade.classList.remove('show');
            this.wrap.classList.remove('show');
          }
        }.bind(this), false);
      },
      onButton: function () {
        var that = this
        that.ngtext.innerHTML = this.opt.text

        if (this.opt.title) {
          that.ngtitle.style.display = "block"
          that.ngtitle.innerHTML = this.opt.title
        } else {
          that.ngtitle.innerHTML = ''
          that.ngtitle.style.display = "none"
        }

        that.shade.classList.add('show');
        that.wrap.classList.add('show');

        switch (that.opt.animate) {
          case 'left':
            that.wrap.style.cssText = 'left:0;top:50%;'
            break
          case 'top':
            that.wrap.style.cssText = 'top:0;left:50%;'
            break
          case 'bottom':
            that.wrap.style.cssText = 'bottom:0;left:50%;'
            break
          default:
            that.wrap.style.cssText = 'top:50%;left:50%;'
            break
        }

        setTimeout(function () {
          that.shade.style.opacity = '1';
        }, 20)

        setTimeout(function () {
          that.wrap.style.opacity = '1';
          if (that.opt.animate == 'bottom') return that.wrap.style[that.opt.animate] = '45%';
          that.wrap.style[that.opt.animate] = '50%';
        }, 100)

        return function () {
          var isFun = typeof that.opt.confirm
          var ngDom = this.id

          if (isFun === 'function' && ngDom === 'zjsjPopConfirmYes') {
            that.opt.confirm()

            that.shade.style.opacity = '0';
            that.wrap.style.opacity = '0';
            that.wrap.style[that.opt.animate] = '0';
          } else {
            if (ngDom === 'zjsjPopConfirmNo' && isFun === 'function') {
              that.opt.concel()
            }
            that.shade.style.opacity = '0';
            that.wrap.style.opacity = '0';
            that.wrap.style[that.opt.animate] = '0';
          }
          that.dom_div.removeEventListener('touchmove', that.prevent, false);
          that.bottonYes.removeEventListener('click', that.back, false);
          that.bottonNo.removeEventListener('click', that.back, false);
        }
      },
      setInfo: function (opt) {
        var that = this
        var _n = document.querySelector('#zjsjPopConfirmNo');
        var _y = document.querySelector('#zjsjPopConfirmYes');
        var type = opt.type ? opt.type : 0
        switch (type) {
          case 1:
            _n.style.display = 'none'
            _y.style.width = '100%'

            break;
          default:
            _n.style.display = 'block'
            _y.style.width = '50%'
            break;
        }
        that.opt.text = opt.text
        that.opt.title = opt.title
        that.opt.animate = opt.animate
        that.opt.confirm = opt.confirm
        that.opt.concel = opt.concel
        that.back = that.onButton()
        that.bottonYes.addEventListener("click", that.back, false);
        that.bottonNo.addEventListener("click", that.back, false);
        that.dom_div.addEventListener('touchmove', that.prevent, false);
      }
    }
    return function () {
      return new ZjsjConfirm();
    }
  })()
}