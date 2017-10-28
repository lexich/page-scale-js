### page-scale-js

[![NPM version](https://badge.fury.io/js/page-scale-js.svg)](http://badge.fury.io/js/page-scale-js)
[![Bower version](https://badge.fury.io/bo/page-scale-js.svg)](http://badge.fury.io/bo/page-scale-js)

Allow to scale you web-page and you html page reveive image behavior. You shoud to do some simple steps.

* Add to `div` layers. #container has adaptive size. #scale-element is scaled. 
```html
<body>
  <div id="container">
    <div id="scale-element">
      <!-- You site content  -->
    </div>
  </div>
  <script src="page-scale-js/index.js" />
</body>
```  
* Include script to page  
* Initialize plugin 
```js
PageScaleJs(document.getElementById("scale-element"), {
  width: 1200,  //original width of you site-layer (like original width of image)
  height: 1000, //original heigth of you site-layer (like original height of image)
  from: 1200,   //start width interval (by default equal width parametr)
  to: 1000,     //end width interval (by default equal 0)
  onChangeScale: function(scale) {
    //receive value of scale factor
  }
});
```  
* [Profit!!!](http://lexich.github.io/page-scale-js)

#### Attention
page-scale-js use `transform` for root container. It means that you can't use `position: fixed` inside.
