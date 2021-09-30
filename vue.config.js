module.exports = {
	devServer: {
		port: 9999, //本机端口号
		host: "0.0.0.0", //本机主机名
		https: false, //协议
		open: true, //启动服务器时自动打开浏览器访问
		proxy: {
			'/api': {
				//目标服务器,代理访问到http://localhost:8888
				//target: "http://127.0.0.1:9001",
				target: "http://huxinhainode.vaiwan.com",
				changOrigin: true, //开启代理
				pathRewrite: {
					'^/api': ''
				}
			}
		},
		disableHostCheck: true
	},
	lintOnSave: false
}
