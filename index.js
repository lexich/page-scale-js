/* eslint wrap-iife: 0, no-var: 0 */
/* global define */
(function () {
  var prefix = ["", "O", "ms", "Webkit", "Moz"];
  function transform(el, param) {
    for (var i = 0, iLen = prefix.length; i < iLen; i++) {
      var prop = prefix[i] + "transform";
      el.style[prop] = param || "";
    }
  }

  function setSize(el, width, height) {
    el.style.minWidth = width ? ("" + width + "px") : "";
    el.style.minHeight = height ? ("" + height + "px") : "";
  }

  function PageScaleJs(el, options) {
    if (!el) {
      throw new Error("null element");
    }
    if (el === document.body) {
      throw new Error("element mustn't be body elements");
    }
    if (el.parentNode === document.body) {
      throw new Error("element must be wrapped by container");
    }
    if (!(this instanceof PageScaleJs)) {
      return new PageScaleJs(el, options);
    }
    this.sizes = [];
    this.el = el;
    this.init(options);
    return this;
  }

  PageScaleJs.prototype.init = function(options) {
    var opts = options || {};
    if (opts.width && opts.height) {
      this.addRange(opts.width, opts.height, { from: opts.from, to: opts.to });
    }
    if (opts.ranges) {
      for (var i = 0, iLen = opts.ranges.length; i < iLen; i++) {
        var item = opts.ranges[i];
        this.addRange(item.width, item.height, { from: item.from, to: item.to });
      }
    }
    var handleId;
    var self = this;
    var resize = function() {
      handleId = null;
      self.onResize();
    };
    this._onResize = function() {
      !handleId && clearTimeout(handleId);
      handleId = setTimeout(resize, opts.timeout || 500);
    };
    window.addEventListener("resize", this._onResize);
    resize();
  };

  PageScaleJs.prototype.addRange = function(width, height, opts) {
    if (!width || !height) {
      throw new Error("Needs correct arguments width adn height");
    }
    opts || (opts = {});
    this.sizes.push({
      from: opts.from || width,
      to: opts.to,
      width: width,
      height: height
    });
  };

  PageScaleJs.prototype.getSizeItem = function () {
    var w = window.innerWidth;
    for (var i = 0, item = null, iLen = this.sizes.length; i < iLen; i++) {
      item = this.sizes[i];
      if (item.from >= w) {
        if (!item.to || item.to <= w) {
          return item;
        }
      }
    }
  };

  PageScaleJs.prototype.destroy = function() {
    window.removeEventListener("resize", this._onResize);
  };

  PageScaleJs.prototype.onResize = function() {
    var item = this.getSizeItem();
    if (item) {
      var fixWidth = item.width;
      var fixHeight = item.height;
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
      setSize(this.el, fixWidth, height / scale);
      setSize(this.el.parentNode, fixWidth * scale, height);
    } else {
      transform(this.el);
      setSize(this.el);
      setSize(this.el.parentNode);
    }
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
