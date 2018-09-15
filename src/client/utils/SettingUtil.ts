module wqq {
	/**
	 * @description 系统设置的一个工具类
	 */
	export class SettingUtil {
		private static instance: SettingUtil;
		private sVariantType: number;		//初始设置,int32位，每一位代表一种设置类型,1代表屏蔽状态，0代表非屏蔽状态
		public constructor() {
			this.sVariantType = 0;
			let flag: string = egret.localStorage.getItem(lemon.GlobalConfig.channelid + "zgmrsetting"+lemon.GlobalConfig.userId);
			if (flag && flag != "undefined") {
				this.sVariantType = parseInt(flag);
			}
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): SettingUtil {
			if (SettingUtil.instance == null) {
				SettingUtil.instance = new SettingUtil();
			}
			return SettingUtil.instance;
		}
		/**
		 * @description 根据类型获取是否是屏蔽状态
		 */
		public getForbidState(bit: number): boolean {
			return BitUtil.checkAvalibe(this.sVariantType, bit);
		}
		/**
		 * @description 设置某一位的屏蔽状态
		 */
		public setForbidState(bit: number, value: number): void {
			this.sVariantType = BitUtil.changeBit(this.sVariantType, bit, value);
			egret.localStorage.setItem(lemon.GlobalConfig.channelid + "zgmrsetting"+lemon.GlobalConfig.userId, this.sVariantType + "");
		}
	}
}