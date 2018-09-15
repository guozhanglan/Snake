import './js/libs/weapp-adapter'
import './js/libs/symbol'
import './js/base64'
import sha1 from './js/sha1.js'
//import './js/emscripten'
//import './js/SlitherDemo'
let code;
let openid;
let session_key;
let unionId;


wx.login({
  success: function (loginRes) {
    code = loginRes.code;
    console.log("登录code:", code);
    wx.getUserInfo({
      success: function (res) {
        console.log(res);

        wx.request({
          url: "http://localhost:8081/loginCheck?game=demo&signature=" + res.signature + "&rawData=" + res.rawData + "&code=" + code + "&encryptedData=" + res.encryptedData + "&iv=" + res.iv,
          success: function (checkData) {
            console.log("data:", checkData.data);
            if (checkData.data.errcode == 0) {
              openid = checkData.data.openid;
              session_key = checkData.data.session_key;
              console.log("登录校验通过,openid=", openid, "session_key=",session_key);
            }
            else{
              console.log("登录校验失败,msg=", checkData.data.errmsg);
            }
          },
          fail:function(err){
            console.log("登录校验失败,msg=", err.data.errmsg);
          }
        });

      }
    });
  }
});



