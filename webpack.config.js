module.exports = {
    mode: "production",
    output: {
        path: `${__dirname}/dist`,
        library: 'Kompressor',
        libraryTarget: 'umd',
        filename: 'kompressor.min.js',
        auxiliaryComment: 'Test Comment',
        environment: {
			arrowFunction: false
		},
    },
};