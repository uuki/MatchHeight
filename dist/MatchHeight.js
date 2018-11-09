/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MatchHeight = factory());
}(this, (function () { 'use strict';

	function throttle(fn, threshhold) {

		var last = void 0,
		    deferTimer = void 0;

		return function () {

			var now = Date.now();

			if (last && now < last + threshhold) {

				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {

					last = now;
					fn();
				}, threshhold);
			} else {

				last = now;
				fn();
			}
		};
	}

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};











	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};











	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var _class = function () {
	  function _class(selector) {
	    classCallCheck(this, _class);

	    this.selector = selector;
	    this.elements = document.querySelectorAll(this.selector);

	    if (this.elements.length) {
	      this.init();
	    }
	  }

	  _class.prototype.init = function init() {};

	  return _class;
	}();

	var errorThreshold = 1; // in px

	var MatchHeight = function (_ViewBase) {
		inherits(MatchHeight, _ViewBase);

		function MatchHeight(selector) {
			classCallCheck(this, MatchHeight);

			var _this = possibleConstructorReturn(this, _ViewBase.call(this, selector));

			_this.initialized = false;
			_this.remains;
			_this.resizeHandler;
			return _this;
		}

		MatchHeight.prototype.init = function init() {
			_ViewBase.prototype.init.call(this);
			if (!this.resizeHandler) this.resizeHandler = throttle(this.update.bind(this), 200).bind(this);

			this.update();
			this.bind();

			this.initialized = true;
		};

		MatchHeight.prototype.bind = function bind() {
			window.addEventListener('resize', this.resizeHandler);
		};

		MatchHeight.prototype.unbind = function unbind() {
			window.removeEventListener('resize', this.resizeHandler);
		};

		MatchHeight.prototype.update = function update() {
			if (this.elements.length === 0 || !this.initialized) return;

			this.remains = Array.prototype.map.call(this.elements, function (el) {
				el.style.minHeight = '';
				return { el: el };
			});

			this.process();
		};

		MatchHeight.prototype.clear = function clear() {
			if (!this.initialized) return;
			this.unbind();

			Array.prototype.map.call(this.elements, function (el) {
				el.style.minHeight = '';
			});

			this.initialized = false;
		};

		MatchHeight.prototype.isInitialized = function isInitialized() {
			return this.initialized;
		};

		MatchHeight.prototype.process = function process() {
			this.remains.forEach(function (item) {
				var bb = item.el.getBoundingClientRect();
				item.top = bb.top;
				item.height = bb.height;
			});

			this.remains.sort(function (a, b) {
				return a.top - b.top;
			});

			var processingTop = this.remains[0].top;
			var processingTargets = this.remains.filter(function (item) {
				return Math.abs(item.top - processingTop) <= errorThreshold;
			});
			var maxHeightInRow = Math.max.apply(Math, processingTargets.map(function (item) {
				return item.height;
			}));

			processingTargets.forEach(function (item) {

				var error = processingTop - item.top + errorThreshold;
				var paddingAndBorder = parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-top'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('padding-bottom'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-top-width'), 10) + parseFloat(window.getComputedStyle(item.el).getPropertyValue('border-bottom-width'), 10);
				item.el.style.minHeight = maxHeightInRow - paddingAndBorder + error + 'px';
			});

			this.remains.splice(0, processingTargets.length);
			if (0 < this.remains.length) this.process();
		};

		return MatchHeight;
	}(_class);

	var matchHeight = new MatchHeight('[data-mh]');

	window.addEventListener('DOMContentLoaded', function onDomReady() {
	  matchHeight.init();
	  window.removeEventListener('DOMContentLoaded', onDomReady);
	});

	window.addEventListener('load', function onLoad() {
	  matchHeight.update();
	  window.removeEventListener('load', onLoad);
	});

	return matchHeight;

})));
