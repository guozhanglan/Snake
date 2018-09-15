module wqq {
	/**
	 * @description 网络诊断工具类
	 */
	export class NetWorkUtil {
		private static instance: NetWorkUtil;
		private eventUtil: any;
		private callBack: Function;
		private thisObject: any;
		public constructor() {
			let self: NetWorkUtil = this;
			this.eventUtil = {
				addHandler: function (element, type, handler) {
					if (element.addEventListener) {
						element.addEventListener(type, handler, false);
					} else if (element.attachEvent) {
						element.attachEvent("on" + type, handler);
					} else {
						element["on" + type] = handler;
					}
				}
			};
			this.eventUtil.addHandler(window, "online", function () {
				setTimeout(function () {
					if (self.callBack) {
						self.callBack.call(self.thisObject);
					}
				}, 2000);
			});
			this.eventUtil.addHandler(window, "offline", function () {
				lemon.ResLoader.getInstance().closeTimeWait();
				window["Gametext"]("网络已断开,请检查网络配置");
			});
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): NetWorkUtil {
			if (NetWorkUtil.instance == null) {
				NetWorkUtil.instance = new NetWorkUtil();
			}
			return NetWorkUtil.instance;
		}
		/**
		 * @description 注册callback对象，主要是用来断点续传
		 */
		public registerCallBack(callBack: Function, thisObject: any): void {
			this.callBack = callBack;
			this.thisObject = thisObject;
		}
		/**
		 * @description 清除callback对象
		 */
		public unregisterCallBack(): void {
			this.callBack = null;
			this.thisObject = null;
		}
	}
}