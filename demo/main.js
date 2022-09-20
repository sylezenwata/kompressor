import Kompressor from "../src/index.js";

const $ = document.querySelector.bind(document);
const imageDisplay = $("img");

$("input[type=file]").addEventListener("change", (e) => {
	if (e.target.files?.length > 0) {
		const compressor = new Kompressor();
		compressor
			.process(e.target.files[0])
			.then((_data) => {
				const { url, blob } = _data;
				imageDisplay.src = url;
				imageDisplay.style.visibility = "visible";
				console.log(compressor.readableSize(blob.size));
			})
			.catch((e) => {
				console.log(e);
			});
	}
});
