module wqq {
	import GlobalConfig = lemon.GlobalConfig;
	/**
	 * @author guoqing.wen
	 * @date 2017.01.17
	 * @description http工具类
	 */
	export class HttpRequestUtil {
		public constructor() {
		}
		/**
		 * @description 发送一个服务器统计给服务器
		 */
		public static sendServerRoleLog(): void {
			/*let httpHder:string="http://"+ GlobalConfig.loginServer + ":" + SingleModel.getInstance().loginModel.loginVo.httpPort;
			if(GlobalConfig.isQzone){
				httpHder="https://"+GlobalConfig.loginProxyServer+"/https/"+GlobalConfig.loginServer.replace(/\./g, "_")+"_"+SingleModel.getInstance().loginModel.loginVo.httpPort;
			}
			let url: string = httpHder + "/changelogindata?";
			url += "userId=" + SingleModel.getInstance().loginModel.loginVo.userId + "&";
			url += "sign=" + SingleModel.getInstance().loginModel.loginVo.sign + "&";
			url += "accessToken=" + GlobalConfig.accessToken + "&";
			url += "time=" + SingleModel.getInstance().loginModel.loginVo.time + "&";
			url += "platformName=" + GlobalConfig.channelid + "&";
			url += "enterServerId=" + ((GlobalConfig.gameServerId-1)*16+GlobalConfig.srcServerIndex) + "&";
			if(GlobalConfig.createRoleServerId==0){
				url += "addServerId=" +"0&";
			}else{
				url += "addServerId=" + ((GlobalConfig.createRoleServerId-1)*16+GlobalConfig.srcServerIndex)+"&";
			}
			url += "deleteServerId=" + 0;
			var request = new egret.HttpRequest();
			request.open(url, egret.HttpMethod.GET);
			request.send();*/
		}
	}
}