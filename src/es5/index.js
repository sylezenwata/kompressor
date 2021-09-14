/**
 * kompressor.js 1.0.2
 * MIT License
 * Copyright (c) 2021 sylvester ezenwata
 * https://github.com/sylezenwata/kompressor.git
 */
"use strict";
/**
 * @name Kompressor
 * Library to compress images to desired size and quality
 * @param {object} objectInstance
 */

function _instanceof(left, right) {
	if (
		right != null &&
		typeof Symbol !== "undefined" &&
		right[Symbol.hasInstance]
	) {
		return !!right[Symbol.hasInstance](left);
	} else {
		return left instanceof right;
	}
}

Object.defineProperty(exports, "__esModule", {
	value: true,
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
	if (!_instanceof(instance, Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}

function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}

var Kompressor = /*#__PURE__*/ (function () {
	/**
	 * constructor
	 * @param {object} param0
	 * @returns {object}
	 * @required image
	 */
	function Kompressor(_ref) {
		var image = _ref.image,
			callback = _ref.callback,
			_ref$imageWidth = _ref.imageWidth,
			imageWidth = _ref$imageWidth === void 0 ? null : _ref$imageWidth,
			_ref$imageHeight = _ref.imageHeight,
			imageHeight = _ref$imageHeight === void 0 ? null : _ref$imageHeight,
			_ref$returnBlob = _ref.returnBlob,
			returnBlob = _ref$returnBlob === void 0 ? false : _ref$returnBlob,
			_ref$reduceQuality = _ref.reduceQuality,
			reduceQuality = _ref$reduceQuality === void 0 ? true : _ref$reduceQuality,
			_ref$validExtensionAr = _ref.validExtensionArray,
			validExtensionArray =
				_ref$validExtensionAr === void 0
					? ["jpg", "jpeg", "png"]
					: _ref$validExtensionAr;

		_classCallCheck(this, Kompressor);

		// set props
		this.setProps({
			image: image,
			validExtensionArray: validExtensionArray,
			imageWidth: imageWidth,
			imageHeight: imageHeight,
			reduceQuality: reduceQuality,
			returnBlob: returnBlob,
			callback: callback,
		}); // set image extension

		this.setExtension(); // validate extension

		this.validateExtension(); // compress image

		this.compressImage();
	}
	/**
	 * function to set inastance properties as class properties
	 * @param {object} data
	 */

	_createClass(Kompressor, [
		{
			key: "setProps",
			value: function setProps(data) {
				var _this = this;

				data["response"] = null;
				Object.keys(data).forEach(function (eachPropKey) {
					_this[eachPropKey] = data[eachPropKey];
				});
			},
			/**
			 * function to set iamge extension
			 */
		},
		{
			key: "setExtension",
			value: function setExtension() {
				var indexPoint = this.image.name.lastIndexOf(".");
				this.imageExtension = this.image.name.slice(indexPoint + 1);
			},
			/**
			 * function to validate extension
			 * if @param validExtensionArray is passed
			 */
		},
		{
			key: "validateExtension",
			value: function validateExtension() {
				var _this2 = this;

				this.isValidExtension = Array.isArray(this.validExtensionArray)
					? this.validExtensionArray.filter(function (e) {
							return e.toLowerCase() === _this2.imageExtension.toLowerCase();
					  }).length > 0
						? true
						: false
					: true;
			},
			/**
			 * function to compress image
			 * @returns {object}
			 */
		},
		{
			key: "compressImage",
			value: function compressImage() {
				var _this3 = this;

				// validate extension
				if (!this.isValidExtension) {
					var res = this.setResponse({
						error: {
							type: "extension",
							msg: '"'
								.concat(
									this.imageExtension,
									'" file extension type is neither "'
								)
								.concat(this.validExtensionArray.join(" or "), '"'),
						},
					});
					return this.callback(res);
				} // process image

				var reader = new FileReader();
				reader.readAsDataURL(this.image);

				reader.onload = function (e) {
					var image = new Image();
					image.src = e.target.result;

					image.onload = function () {
						// define context width and height
						var contextWidth = _this3.imageWidth
							? _this3.imageWidth
							: image.naturalWidth;
						var contextHeight = _this3.imageHeight
							? _this3.imageHeight
							: image.naturalHeight; // create canvas and props

						var canvas = document.createElement("canvas");
						canvas.width = contextWidth;
						canvas.height = contextHeight; // define canvas context

						var context = canvas.getContext("2d");
						context.imageSmoothingEnabled = true; // draw image

						context.drawImage(image, 0, 0, contextWidth, contextHeight); // render image as dataURI

						var renderedImage = context.canvas.toDataURL(
							"image/".concat(
								_this3.imageExtension.toLowerCase() === "jpg"
									? "jpeg"
									: _this3.imageExtension
							),
							_this3.reduceQuality ? 0.1 : 0.9
						); // val return blob

						if (_this3.returnBlob) {
							var _res = _this3.setResponse({
								data: {
									dataURI: renderedImage,
									blob: _this3.convertToBlob(renderedImage),
								},
							});

							return _this3.callback(_res);
						}

						var res = _this3.setResponse({
							data: {
								dataURI: renderedImage,
							},
						});

						return _this3.callback(res);
					};

					image.onerror = function (err) {
						// TODO: change res err
						var res = _this3.setResponse({
							error: {
								type: "internal",
								msg: err,
							},
						});

						return _this3.callback(res);
					};
				};

				reader.onerror = function (err) {
					// TODO: change res err
					var res = _this3.setResponse({
						error: {
							type: "internal",
							msg: err,
						},
					});

					return _this3.callback(res);
				};
			},
			/**
			 * function to convert comnpressed image to blob
			 * @param {string} dataURI
			 * @returns blob
			 */
		},
		{
			key: "convertToBlob",
			value: function convertToBlob(dataURI) {
				try {
					// convert base64 to raw binary data held in a string
					// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
					var byteString = atob(dataURI.split(",")[1]); // separate out the mime component

					var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]; // write the bytes of the string to an ArrayBuffer

					var ab = new ArrayBuffer(byteString.length); // create a view into the buffer

					var ia = new Uint8Array(ab); // set the bytes of the buffer to the correct values

					for (var i = 0; i < byteString.length; i++) {
						ia[i] = byteString.charCodeAt(i);
					} // write the ArrayBuffer to a blob, and you're done

					return new Blob([ab], {
						type: mimeString,
					});
				} catch (error) {
					// log error
					console.log(error);
					return null;
				}
			},
			/**
			 * function to define response
			 * @param {object} param0 receives any of error & data
			 * @returns
			 */
		},
		{
			key: "setResponse",
			value: function setResponse(_ref2) {
				var _ref2$data = _ref2.data,
					data = _ref2$data === void 0 ? null : _ref2$data,
					_ref2$error = _ref2.error,
					error = _ref2$error === void 0 ? null : _ref2$error;
				return {
					error: error,
					data: data,
				};
			},
		},
	]);

	return Kompressor;
})();

var _default = Kompressor;
exports.default = _default;
