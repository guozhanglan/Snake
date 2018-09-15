module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.09
	 * @description 玩家数据模型
	 *
	 */
    export class PlayerModel {
        private playerDataDic: any;
        public isAutoChallenge: boolean;    //是否处于自动挑战状态
       
        private _baseInfo: ResPlayerInfoVo;

        public constructor() {
            this.isAutoChallenge = false;
            this.playerDataDic = {};
        }

        /**
         * baseInfo
         */
        public get baseInfo():ResPlayerInfoVo {
            return this._baseInfo;
        }
        /**
		 * @description 初始化所有技能数据
		 */
        public initPlayerData(): void {
            
        }

        /**
		 * @description 初始化所有技能数据
		 */
        public initPlayerHotelData(data:any): void {
            
        }

        /**
         * @description 获取玩家角色名字
         */
        public get roleName(): string {
            if (this._baseInfo) {
                return this._baseInfo.nickName;
            }
            return "还未登陆";
        }
    }
}
