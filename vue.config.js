module.exports = {
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:3500",
				changeOrigin: true
			}
		}
	},
	outputDir: '../McbeRank/public',
	publicPath: '/' + process.env.VUE_APP_BASE_URL + '/'
};
