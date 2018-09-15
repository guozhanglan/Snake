module wqq {
    import NotifyManager = lemon.NotifyManager;
	/**
	 *
	 * @author guoqing.wen
	 * @date 2017.12.19
	 * @description 场景通信控制器
	 *
	 */
    export class SceneControl extends lemon.BaseControl {
        private static instance: SceneControl;
        /**
		 * @description 获取游戏单例
		 */
        public static getInstance(): SceneControl {
            if (SceneControl.instance == null) {
                SceneControl.instance = new SceneControl();
            }
            return SceneControl.instance;
        }
        private _buildRoomData:BaseData;

        public constructor() {
            super();
        }

        public initControl(){
            
        }
		
        
    }
}
