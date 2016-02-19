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
	}
	window.addEventListener("resize", this._onResize);
	resize();
}

PageScaleJs.prototype.addSize = function(width, height) {
	this.sizes = { width: width, height: height };
}

PageScaleJs.prototype.destroy = function() {
	window.removeEventListener("resize", this._onResize);
}

PageScaleJs.prototype.getFixWidth = function() {
	return this.sizes.width ? this.sizes.width : window.innerWidth; 
}

PageScaleJs.prototype.getFixHeight = function() {
	return this.sizes.height ? this.sizes.height : window.innerHeight;
}

PageScaleJs.prototype.getRatio = function() {
	return this.getFixHeight() / this.getFixWidth();
}

PageScaleJs.prototype.onResize = function() {
	var fixWidth = this.getFixWidth();
	var scale = window.innerWidth / fixWidth;
	var x = (fixWidth - window.innerWidth) / -2;
	var y = x * this.getRatio();
	this.el.style.width = "" + this.getFixWidth() + "px";
	this.el.style.height = "" + this.getFixHeight() + "px";
	transform(this.el,
		"scale(" + scale + ") translate(" + x/scale +
		"px, " + y/scale + "px)");
	var parent = this.el.parentNode;
	parent.style.width = this.getFixWidth() * scale;
	parent.style.height = this.getFixHeight() * scale;
}
