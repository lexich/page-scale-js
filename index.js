/* eslint wrap-iife: 0, no-var: 0 */
/* global define */
(function () {
  var prefix = ["", "O", "ms", "Webkit", "Moz"];
  function transform(el, param) {
    for (var i = 0, iLen = prefix.length; i < iLen; i++) {
      var prop = prefix[i] + "transform";
      el.style[prop] = param;
    }
  }

  function PageScaleJs(el, options) {
    if (!(this instanceof PageScaleJs)) {
      return PageScaleJs(el, options);
    }
    this.sizes = {};
    this.init(el, options);
    return this;
  }

  PageScaleJs.prototype.init = function(el, options) {
    var opts = options || {};
    this.el = el;
    this.addSize(opts.width, opts.height);
    var resize = this.onResize.bind(this);
    this._onResize = function() {
      setTimeout(resize, opts.timeout || 500);
    };
    window.addEventListener("resize", this._onResize);
    resize();
  };

  PageScaleJs.prototype.addSize = function(width, height) {
    this.sizes = { width: width, height: height };
  };

  PageScaleJs.prototype.destroy = function() {
    window.removeEventListener("resize", this._onResize);
  };

  PageScaleJs.prototype.getFixWidth = function() {
    return this.sizes.width ? this.sizes.width : window.innerWidth;
  };

  PageScaleJs.prototype.getFixHeight = function() {
    return this.sizes.height ? this.sizes.height : window.innerHeight;
  };

  PageScaleJs.prototype.onResize = function() {
    var parent = this.el.parentNode;
    var fixWidth = this.getFixWidth();
    var fixHeight = this.getFixHeight();
    var scale = window.innerWidth / fixWidth;
    var height = fixHeight * scale;
    var ratio = fixHeight / fixWidth;
    if (height < window.innerHeight) {
      height = window.innerHeight;
      ratio = window.innerHeight / (fixWidth * scale);
    }

    var x = (fixWidth - window.innerWidth) / -2;
    var y = x * ratio;
    transform(this.el,
      "scale(" + scale + ") translate(" + x/scale +
      "px, " + y/scale + "px)");

    this.el.style.width = "" + fixWidth + "px";
    parent.style.width = "" + (fixWidth * scale) + "px";

    parent.style.height = "" + height + "px";
    this.el.style.height = "" + (height / scale) + "px";
  };

  if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      exports = module.exports = PageScaleJs;
    }
    exports.PageScaleJs = PageScaleJs;
  } else if (typeof define === "function" && define.amd) {
    define("PageScaleJs", [], function() {
      return PageScaleJs;
    });
  } else {
    window.PageScaleJs = PageScaleJs;
  }
})(this);
