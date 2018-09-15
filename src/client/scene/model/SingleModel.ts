module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.09
	 * @description 数据模型单例类，控制所有数据模型
	 *
	 */
	export class SingleModel {
		private static instance: SingleModel;
		private _playerModel: PlayerModel;

		public constructor() {
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): SingleModel {
			if (SingleModel.instance == null) {
				SingleModel.instance = new SingleModel();
			}
			return SingleModel.instance;
		}
		/**
		 * @description 初始化所有数据模型
		 */
		public initAllModel(): void {
			this.playerModel.initPlayerData();
			
			this.playerModel.initPlayerHotelData(null);
		}
		/**
		 * @description 获取玩家数据模型
		 */
		public get playerModel(): PlayerModel {
			if (!this._playerModel) {
				this._playerModel = new PlayerModel();
			}
			return this._playerModel;
		}
		
		
	}
}
