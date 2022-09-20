/**
 * kompressor.js 2.0.0
 * MIT License
 * Copyright (c) 2021 sylvester ezenwata
 * https://github.com/sylezenwata/kompressor.git
 */

"use strict";

/**
 * @name Kompressor
 */
export default class Kompressor {
	/**
	 *
	 * @param {Number} width : ;
	 * @param {Number} height
	 * @param {Number} xOrigin
	 * @param {Number} yOrigin
	 * @param {String} smoothingQuality "low"|"medium"|"high"
	 * @param {Number|Float} quality
	 */
	constructor(
		width = null,
		height = null,
		xOrigin = 0,
		yOrigin = 0,
		smoothingQuality = "low",
		quality = 0.2
	) {
		this.width = width;
		this.height = height;
		this.xOrigin = xOrigin;
		this.yOrigin = yOrigin;
		this.smoothingQuality = smoothingQuality;
		this.quality = quality;
		this.formatsToOverride = ["png", "jpg"];
	}

	// function to convert to blob
	toBlob(canvas) {
		return new Promise((resolve) => {
			canvas.toBlob(resolve, `image/${this.format}`, this.quality);
		});
	}

	// function to compress image
	compress(image) {
		return new Promise((resolve, reject) => {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");

			if (!context) {
				reject(new Error("Canvas context is not availbale"));
			}

			const contextWidth = this.width || image.naturalWidth;
			const contextHeight = this.height || image.naturalHeight;

			canvas.width = contextWidth;
			canvas.height = contextHeight;

			context.imageSmoothingsmoothingQuality = this.smoothingQuality;
			context.save();
			context.drawImage(
				image,
				this.xOrigin,
				this.yOrigin,
				contextWidth,
				contextHeight
			);
			context.restore();

			this.toBlob(canvas)
				.then((blob) => {
					const url = URL.createObjectURL(blob);
					resolve({ url, blob });
				})
				.catch((e) => {
					console.log(e);
					reject(new Error("Blob conversion failed"));
				});
		});
	}

	// funtion to set image format
	setFormat(format) {
		format = format?.toString().toLowerCase();
		this.format =
			this.formatsToOverride.some((e) => e === format) || !format
				? "jpeg"
				: format;
	}

	/**
	 * function to read file and process compression
	 * @param {File} file
	 * @returns {Promise}
	 * A successful compression will retun an object containing
	 * - url: for displaying the image
	 * - blob
	 * Otherwise, an error object is returned
	 */
	process(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener("load", (e) => {
				this.setFormat(e.target.result.split(";")[0]?.split("/")[1]);
				const img = new Image();
				img.src = e.target.result;
				img.addEventListener("load", () => {
					this.compress(img)
						.then((data) => resolve(data))
						.catch((error) => reject(error));
				});
			});
			reader.readAsDataURL(file);
		});
	}

	/**
	 * function to size in bytes to a readable format
	 * @param {Number} size
	 * @returns {String}
	 */
	readableSize(size) {
		return size / 1024 > 1024
			? ~~((10 * size) / 1024 / 1024) / 10 + "MB"
			: ~~(size / 1024) + "KB";
	}
}
