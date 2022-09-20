module.exports = {
	mode: "production",
	entry: `${__dirname}/src/index.js`,
	output: {
		path: `${__dirname}/dist`,
		filename: "Kompressor.min.js",
		library: "Kompressor",
		libraryTarget: "umd",
		umdNamedDefine: true,
		libraryExport: "default",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
};
