module wqq.app{
    export class LoginnewApp extends BaseApp{
        public btnEnter:eui.Button;
        public check:eui.CheckBox;
        public txtDesc:eui.Label;
        public txtTips:eui.Label;
        public constructor(){
            super();
            this.baseSkinName = "Login_newUISkin";
        }
        protected initListener(): void{
            super.initListener();
            this.btnEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEnter, this);
        }
        protected onClickEnter()
        {
            if (this.check.selected)
            {
                this.EnterGame();
            }
        }
        protected async EnterGame(){
            await this.loadResource();
            AppModuleManager.closeModule(AppNameConst.LOGINNEW_MODULE);
            AppModuleManager.openModule(AppNameConst.MAINUI_MODULE);
            MainEnterGame.GetInstance().start();
        }
        protected initComponent(): void {
			this.txtDesc.textFlow =  (new egret.HtmlTextParser).parser(
    			'我已阅读并同意<font size=28 color="0xff0000">腾讯游戏用户协议</font>和<font size=28 color="0xff0000">隐私策略</font>'
			);
		}
        	protected onStageResize(): void {
			super.onStageResize();
			this.width = lemon.StageUtil.stageWidth;
			this.height = lemon.StageUtil.stageHeight;
		}

        protected async loadResource(){
            try{
                const loadingView = new LoadingUI();
                lemon.StageUtil.stage.addChild(loadingView);
                await RES.loadGroup("game",0,loadingView);
                lemon.StageUtil.stage.removeChild(loadingView);
            }
            catch(e){
                console.error(e);
            }
        }

    }
}