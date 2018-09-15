var request = require('request');
var express = require('express');
var sha1 = require('js-sha1');
var CryptoJS = require("crypto-js");
var app = express();

//app_id
var APPID_HOTEL = "wx97fea6f7aee6751c";
var SECRET_HOTEL = "0c8731fefb3afab3f6f3d6c677a94555";
 
var APPID_DEMO = "wxa28a1915edf9db6a";
var SECRET_DEMO = "5ad9e63361eb6a2a48cac72400eacd56";

function Base64_Decode(str){
	var b = new Buffer(str, 'base64').toString();
	return b;
}

function decrypt(text, key, iv){
    var result = CryptoJS.AES.decrypt(text,CryptoJS.enc.Utf8.parse(key),{
        iv:CryptoJS.enc.Utf8.parse(iv),
        mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
    });
	var decryptedStr = result.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

app.get('/', function (req, res) {
   res.send('This login check server....');
});

app.get('/loginCheck', function (req, res) {
   var gameName = req.query.game;
   var signature = req.query.signature;
   var rawData = req.query.rawData;
   var code = req.query.code;
   
   //unionID[多平台统一帐号]
   var encryptedData = req.query.encryptedData;
   var iv = req.query.iv;
   var app_id;
   var app_secret;
   if (gameName == "hotel"){
	  app_id = APPID_HOTEL;
	  app_secret = SECRET_HOTEL;
   }
   else if (gameName == "demo"){
	  app_id = APPID_DEMO;
	  app_secret = SECRET_DEMO;
   }
   console.log("get openid:", gameName, code, signature);
   request('https://api.weixin.qq.com/sns/jscode2session?appid='+app_id+'&secret='+app_secret+'&js_code='+code+'&grant_type=authorization_code', function(error, response, body){
	   if (!error && response.statusCode == 200) {
			console.log(body);
			var resData = JSON.parse(body);
			if (resData.errcode != undefined){
				console.log("get error msg:", resData.errmsg);
				res.send('{"errcode":1,"errmsg":'+resData.errmsg+'}');
			}
			else{
				var openid = resData.openid;
				var session_key = resData.session_key;
				//var uinionid = resData.uinionid;
				console.log("rawData:",rawData);
				//check signature
				var sign2 = sha1.hex(rawData+session_key);
				if (signature != sign2){
					console.log("签名验证错误sign2:",resData);
					res.send('{"errcode":2,"errmsg":"签名验证错误."}');
				}
				else{
					var ret = {errcode:0,openid:openid,session_key:session_key};
					
					//AES-128-CBC解密数据
					//var encrypted = Base64_Decode(encryptedData);
					//console.log("数据:", encryptedData);
					//var decryptData = decrypt(encrypted, Base64_Decode(session_key), Base64_Decode(iv)); 
					//console.log("AES-128-CBC解密数据:", decryptData);
					var retStr = JSON.stringify(ret);
					console.log("签名验证成功，发送响应数据:", retStr);
					res.send(retStr);
				}
			}
	   }
	   else{
		   res.send('{"errcode":1,"errmsg":'+resData.errmsg+'}');		   
	   }
   });
});

app.get('/uploadHotel', function (req, res) {
   var HotelData = req.query.data;
   //base64 decode
   var HotelStr = new Buffer(HotelData, 'base64').toString();
   //base64 encode
   //new Buffer(String).toString('base64');
   res.send('This login check server....');
});
 
var server = app.listen(8081, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("Server starting http://%s:%s", host, port);
});