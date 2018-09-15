module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2017.01.05
	 * @desc 提示框管理器
	 */
	export class TipManager {
		private static instance: TipManager;

		
		public constructor() {
			
			this.init();
		}
		/**
		 * @desc 获取一个单例
		 */
		public static getInstance(): TipManager {
			if (TipManager.instance == null) {
				TipManager.instance = new TipManager();
			}
			return TipManager.instance;
		}
		/**
		 * @desc 初始化浮动提示
		 */
		private init(): void {
			
		}
		/**
		 *--------------------创建一个战斗力变化漂浮提示---------------------------
		 */
		public createFightFloatTip(newFightPoint: number, currentFightNum: number): void {
			
		}
	}
}