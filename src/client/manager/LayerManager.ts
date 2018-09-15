module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.05
	 * @description 层级管理器
	 *
	 */
    export class LayerManager {
        private static instance: LayerManager;
        private root: eui.UILayer;
        private mapLayer: egret.DisplayObjectContainer;
        //ui层现在改为3层，底部为 主界面 活动，以及聊天，战斗部分内容
        private uiBtmLayer: egret.DisplayObjectContainer;
        //其他level显示layer
        private _uiLayer: egret.DisplayObjectContainer;
        //最底 常驻功能按钮和 最顶玩家信息内容
        private uiTopLayer: egret.DisplayObjectContainer;
        //弹出层
        private _popLayer: egret.DisplayObjectContainer;
        //系统消息层
        private tipLayer: egret.DisplayObjectContainer;
        public constructor() {
        }
		/**
		 * @description 获取单例对象
		 */
        public static getInstance(): LayerManager {
            if (LayerManager.instance == null) {
                LayerManager.instance = new LayerManager();
            }
            return LayerManager.instance;
        }
		/**
		 * @description 初始化游戏的根容器
		 */
        public init(root: eui.UILayer): void {
            this.root = root;
            this.mapLayer = new egret.DisplayObjectContainer();
            this.root.addChild(this.mapLayer);
            this.uiBtmLayer = new egret.DisplayObjectContainer();
            this.root.addChild(this.uiBtmLayer);
            this._uiLayer = new egret.DisplayObjectContainer();
            this.root.addChild(this._uiLayer);
            this.uiTopLayer = new egret.DisplayObjectContainer();
            this.root.addChild(this.uiTopLayer);
            this._popLayer = new egret.DisplayObjectContainer();
            this.root.addChild(this._popLayer);
            this.tipLayer = new egret.DisplayObjectContainer();
            this.root.addChild(this.tipLayer);
        }
		/**
		 * @description 添加显示对象
		 * @param disPlay 要添加的显示对象
		 * @param layer 显示对象的层级
		 */
        public addDisplay(disPlay: egret.DisplayObject, layer: number, zIndex?: number): void {

            switch (layer) {
                case LayerConst.MAP_LAYER:
                    this.mapLayer.addChild(disPlay);
                    break;
                case LayerConst.UI_BOTTOM_LAYER:
                    this.uiBtmLayer.addChild(disPlay);
                    break;
                case LayerConst.UI_LAYER:
                    this._uiLayer.addChild(disPlay);
                    break;
                case LayerConst.UI_TOP_LAYER:
                    this.uiTopLayer.addChild(disPlay);
                    break;
                case LayerConst.POP_LAYER:
                    //暂时新手指引界面需要
                    if (zIndex) {
                        this.popLayer.addChildAt(disPlay, 999);
                    } else {
                        this.popLayer.addChild(disPlay);
                    }
                    break;
                case LayerConst.TIP_LAYER:
                    if (zIndex) {
                        this.tipLayer.addChildAt(disPlay,zIndex);
                    }else{
                        this.tipLayer.addChild(disPlay);
                    }
                    break;
            }
        }
        /**
         * @description 地图点击状态切换
         */
        public set mapEnabled(value: boolean) {
            this.mapLayer.touchEnabled = this.mapLayer.touchChildren = value;
        }
        /**
         * @description 获取根节点显示容器
         */
        public get rootLayer(): eui.UILayer {
            return this.root;
        }
        public get popLayer(): egret.DisplayObjectContainer {
            return this._popLayer;
        }
        public get uiLayer(): egret.DisplayObjectContainer {
            return this._uiLayer;
        }
        private m_CurrentScene:BaseGameScene;
        public ReplaceScene(scene:BaseGameScene)
        {
            let current = this.m_CurrentScene;
            if (current) {
                current.Leave();
                current.dispose();
                if (current.parent){
                    this.mapLayer.removeChild(current);
                }
            }
            if (scene) {
                this.mapLayer.addChild(scene);
                this.m_CurrentScene = scene;
                scene.Resize();
                scene.Enter();
            }
	    }
    }
}
