module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2017.01.10
	 * @desc 错误码统一管理器
	 */
	export class ErrorCodeManager {
		public constructor() {
		}
		/**
		 * @desc 显示错误通知
		 */
		public static showErrorTip(code: number, value: Array<string>, isHorseTip: boolean = false): string {
			let desc = "未找到对应ErrorCode[" + code + "]";
			return desc;
		}
	}
}