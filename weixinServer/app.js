var http = require('http');
var url = require('url');
var util = require('util');

var APPID = "wx97fea6f7aee6751c";
var SECRET = "fdfkjdkfdkfd";

http.createServer(function (request, response) {
	var params = url.parse(req.url, true).query;
	var signature = params.signature;
	var rawData = params.rawData;
	var code = params.code;
	console.log("get openid:", code, signature);
	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	response.writeHead(200, {'Content-Type': 'text/plain'});
	//get 请求外网
	http.get('https://api.weixin.qq.com/sns/jscode2session?appid='+APPID+'&secret='+SECRET+'&js_code='+code+'&grant_type=authorization_code',function(req,res){
		var html='';
		req.on('onerror');
		req.on('data',function(data){
			html+=data;
		});
		req.on('end',function(){
			console.info(html);
			var res = JSON.stringify(html);
			if (res.errcode == 0){
				var openid = res.openid;
				var session_key = res.session_key;
				var uinionid = res.uinionid;
				// 发送响应数据 "Hello World"
				var ret = {openid:openid,session_key:session_key,uinionid:uinionid};
				response.end(JSON.toString(ret));
			}
			else{
				console.log("get error msg:", res.errMsg);
				response.end(res.errMsg);
			}
		});
	}); 
	
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');