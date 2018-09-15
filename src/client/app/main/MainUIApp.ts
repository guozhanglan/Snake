module wqq.app {
	export class MainUIApp extends BaseApp {
		public main_scene:eui.Group;
		public main_bg:eui.Group;
		public line_left:eui.Image;
		public line_right:eui.Image;
		public expend_group:eui.Group;

		public constructor() {
			super();
			this.skinName = "MainUISkin";
			this.isEvery = true;
		}
		/*
		 ** @description 初始化组件
         */
		protected initComponent(): void {
			//SingleModel.getInstance().gameScene.initScene(this);
			SceneControl.getInstance().initControl();
		}
        /**
         * @description 初始化事件
         */
		protected initListener(): void {
			super.initListener();
			//第一步新手指引
			//lemon.NotifyManager.registerNotify(NotifyConst.FIRST_GUIDE, this.openGuide, this);
            //切换地图,进入所有副本，则隐藏顶部栏
            //lemon.NotifyManager.registerNotify(NotifyConst.RES_ENTER_MAP_COMPLETE, this.setMapInfo, this);
		}

		protected onStageResize(){
			this.width = lemon.StageUtil.stageWidth;
            this.height = lemon.StageUtil.stageHeight;
		}
        /**
         * @description 初始化数据
         */
		protected initData(): void {
			super.initData();
		}
	}
}