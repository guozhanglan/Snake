module lemon {
	/**
	 * @description log日志工具类
	 *
	 */
	export class LogUtil {
		public static errorLogRequest: egret.HttpRequest = new egret.HttpRequest();
		public static errorLogUrl:string="v1/artisan/uploadlog";
		/**
		 * @description 打印普通日志
		 */
		public static log(msg: any): void {
			if (lemon.GlobalConfig.isDebug) {
				egret.log(msg);
			}
		}
		/**
		 * @description 打印warn日志
		 */
		public static warn(msg: any): void {
			if (lemon.GlobalConfig.isDebug) {
				egret.warn(msg);
			}
		}
		/**
		 * @description 打印error日志
		 */
		public static error(msg: any): void {
			if (lemon.GlobalConfig.isDebug) {
				egret.error(msg);
			}
		}
		/**
		 * @description 上报错误日志
		 */
		public static uploadErrorLog(errorContent: string, roleName: string): void {
			let sendData: any = {};
			sendData.gameid = lemon.GlobalConfig.gameid;
			sendData.channelid = lemon.GlobalConfig.channelid;
			sendData.time = Date.now();
			let signStr: string = "channelid=" + sendData.channelid + "&gameid=" + sendData.gameid + "&time=" + sendData.time + "#"+lemon.GlobalConfig.secret_key;
			sendData.sign = new md5().hex_md5(signStr);
			
			sendData.rolename = roleName;
			sendData.errorContent = errorContent;
			if (errorContent && errorContent.indexOf("null") != -1) {
				this.errorLogRequest.open(lemon.GlobalConfig.gmHost + LogUtil.errorLogUrl, egret.HttpMethod.POST);
				this.errorLogRequest.send(JSON.stringify(sendData));
			}
		}
	}
}
