module wqq {
	/**
	 * @description 浏览器工具类
	 */
	export class WebBrowerUtil {
		public constructor() {
		}
		/**
		 * @description 判断当前浏览器是否是微信浏览器,不一定准
		 */
		public static isWeiXin(): boolean {
			let ua: string = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) != null && ua.match(/MicroMessenger/i)[0] == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		}
		/**
		 * @description 判断是否是非微信的移动端浏览器
		 */
		public static isNoMicroWeiXin(): boolean {
			if (!egret.Capabilities.isMobile) return false;
			return !WebBrowerUtil.isWeiXin();
		}
		/**
		 * @description 判断是否支持WebWorker
		 */
		public static isSupportWebWorker(): boolean {
			if (typeof (Worker) !== "undefined") {
				return true;
			}
			return false;
		}
		/**
		 * @description 是否支持音效,去掉ios端的手机QQ和微信浏览器
		 */
		public static isSupportMusic(): boolean {
			let result: boolean = true;
			let osName: string = egret.Capabilities.os;
			return true;
			/*
			if (osName.indexOf("iOS") != -1 || osName.indexOf("ios") != -1) {
				let ua: string = window.navigator.userAgent.toLowerCase();
				if (ua.indexOf("qq") != -1) {
					return false;
				}
				if (ua.match(/MicroMessenger/i) != null && ua.match(/MicroMessenger/i)[0] == 'micromessenger') {
					return false;
				}
			}
			return result;*/
		}
	}
}