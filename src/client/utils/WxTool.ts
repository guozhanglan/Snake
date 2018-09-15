module wqq {
	/**
	 * @description 微信工具类
	 */
	export class WxTool {
		private static instance:WxTool;
		public constructor() {
		}
		/**
		 * @description 获取单例
		 */
		public static getInstance():WxTool{
			if(WxTool.instance==null){
				WxTool.instance = new WxTool();
			}
			return WxTool.instance;
		}
	}
}