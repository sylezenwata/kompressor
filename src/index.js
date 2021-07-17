/**
 * kompressor.js 1.0.2
 * MIT License
 * Copyright (c) 2021 sylvester ezenwata
 * https://github.com/sylezenwata/Set.git
 */

"use strict";

/**
 * @name Kompressor
 * Library to compress images to desired size and quality
 * @param {object} objectInstance 
 */
class Kompressor {

    /**
     * constructor
     * @param {object} param0 
     * @returns {object}
     * @required image
     */
    constructor({
        image,
        callback = null,
        imageWidth = 193, // passport size width or null to use original image width
        imageHeight = 193, // passport size height or null to use original image height
        returnBlob = false,
        reduceQuality = false,
        validExtensionArray = ['jpg', 'jpeg', 'png']
    }) {
        // set props
        this.setProps({image,validExtensionArray,imageWidth,imageHeight,reduceQuality,returnBlob,callback});
        // set image extension
        this.setExtension();
        // validate extension
        this.validateExtension();
        // compress image
        this.compressImage();
    }

    /**
     * function to set inastance properties as class properties
     * @param {object} data 
     */
    setProps(data) {
        Object.keys(data).forEach((eachPropKey) => {
            this[eachPropKey] = data[eachPropKey];
        });
    }

    /**
     * function to set iamge extension
     */
    setExtension() {
        let indexPoint = this.image.name.lastIndexOf('.');
        this.imageExtension = this.image.name.slice(indexPoint + 1);
    }

    /**
     * function to validate extension
     * if @param validExtensionArray is passed
     */
    validateExtension() {
        this.isValidExtension = 'object' === typeof this.validExtensionArray ? (this.validExtensionArray.filter(e => e.toLowerCase() === this.imageExtension.toLowerCase()).length > 0 ? true : false) : true;
    }

    /**
     * function to compress image
     * @returns {object}
     */
    compressImage() {
        // validate extension
        if (!this.isValidExtension) {
            let res = this.setResponse({error: {type: 'extension', msg: `"${this.imageExtension}" is not a valid image extension type in "${this.validExtensionArray.join(', ')}"`}});
            return this.callback ? this.callback(res) : res;
        }
        // process image
        let reader = new FileReader();
        reader.readAsDataURL(this.image);
        reader.onload = (e) => {
            let image = new Image();
            image.src = e.target.result;
            image.onload = () => {
                // define context width and height
                let contextWidth = this.imageWidth ? this.imageWidth : image.naturalWidth;
                let contextHeight = this.imageHeight ? this.imageHeight : image.naturalHeight;
                // create canvas and props
                let canvas = document.createElement('canvas');
                canvas.width = contextWidth;
                canvas.height = contextHeight;
                // define canvas context
                let context = canvas.getContext('2d');
                context.imageSmoothingEnabled = true;
                // draw image
                context.drawImage(image, 0, 0, contextWidth, contextHeight);
                // render image as dataURI
                let renderedImage = context.canvas.toDataURL(`image/${this.imageExtension.toLowerCase() === 'jpg' ? 'jpeg' : this.imageExtension}`, this.reduceQuality ? 0.1 : 0.9);
                // val return blob
                if (this.returnBlob) {
                    let res = this.setResponse({data: {dataURI: renderedImage, blob: this.convertToBlob(renderedImage)}});
                    return this.callback ? this.callback(res) : res;
                }
                let res = this.setResponse({data: {dataURI: renderedImage}});
                return this.callback ? this.callback(res) : res;
            };
            image.onerror = (err) => {
                // TODO: change res err
                let res = this.setResponse({error: {
                    type: 'internal',
                    msg: err
                }});
                return this.callback ? this.callback(res) : res;
            };
        };
        reader.onerror = (err) => {
            // TODO: change res err
            let res = this.setResponse({error: {
                type: 'internal',
                msg: err
            }});
            return this.callback ? this.callback(res) : res;
        };
    }

    /**
     * function to convert comnpressed image to blob
     * @param {string} dataURI 
     * @returns blob
     */
    convertToBlob(dataURI) {
        try {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            // create a view into the buffer
            var ia = new Uint8Array(ab);
            // set the bytes of the buffer to the correct values
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            // write the ArrayBuffer to a blob, and you're done
            var blob = new Blob([ab], {type: mimeString});
            return blob;
        } catch (error) {
            // log error
            console.log(error);
            return null;
        }
    }

    /**
     * function to define response
     * @param {object} param0 receives any of error & data
     * @returns 
     */
    setResponse({data = null, error = null}) {
        return {
            error,
            data
        }
    }

}

return Kompressor;
