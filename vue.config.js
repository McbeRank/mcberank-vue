module.exports = {
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:3500",
				changeOrigin: true
			}
		}
	},
	publicPath: ''
};
