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
    el.style.width = width ? ("" + width + "px") : "";
    el.style.height = height ? ("" + height + "px") : "";
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
    this.init(el, options);
    return this;
  }

  PageScaleJs.prototype.init = function(el, options) {
    var opts = options || {};
    this.sizes = [];
    this.el = el;
    this.className = opts.className || "page-scale-js";
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
      var scale = self.onResize();
      opts.onChangeScale && opts.onChangeScale(scale);
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
          return {
            index: i,
            width: typeof item.width === "function" ? item.width() : item.width,
            height: typeof item.height === "function" ? item.height() : item.height
          };
        }
      }
    }
  };

  PageScaleJs.prototype.destroy = function() {
    window.removeEventListener("resize", this._onResize);
  };

  PageScaleJs.prototype.onResize = function() {
    var item = this.getSizeItem();
    const parentNode = this.el.parentNode;
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
      setSize(parentNode, fixWidth * scale, height);
      if (this.className) {
        parentNode.classList.add(this.className);
        parentNode.setAttribute("data-page-scale", item.index);
      }
      return scale;
    } else {
      transform(this.el);
      setSize(this.el);
      setSize(parentNode);
      if (this.className) {
        parentNode.classList.remove(this.className);
        parentNode.removeAttribute("data-page-scale");
      }
      return 1;
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
