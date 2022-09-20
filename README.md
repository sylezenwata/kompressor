# kompressor.js

> kompressor.js is a light-weight library for compressing images to a desired size and quality.

# Install

As module

```javascript
import Kompressor from "kompressor";
```

In the browser

```html
<script type="text/javascript" src="dist/Kompressor.min.js"></script>
```

# Usage

```javascript
const compressor = new Kompressor();
compressor
	.process(file)
	.then((_data) => {
		const { url, blob } = _data;
		console.log(url);
		console.log(compressor.readableSize(blob.size)); // see new size
	})
	.catch((e) => {
		console.log(e);
	});
```

# Options

| Pararm           | Type          | Default value                        |
|------------------|---------------|--------------------------------------|
| width            | number        | null                                 |
| height           | number        | null                                 |
| xOrigin          | number        | 0                                    |
| yOrigin          | number        | 0                                    |
| smoothingQuality | string        | low - only accepts low\|medium\|high |
| quality          | number\|float | 0.2 - ranges between 0 and 1         |
