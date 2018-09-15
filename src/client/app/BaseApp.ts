module wqq {
	import NotifyManager = lemon.NotifyManager;
	import TouchEvent = egret.TouchEvent;
	import Event = egret.Event;

	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.05
	 * @description 所有模块的基类
	 *
	 */
	export class BaseApp extends UIComponent{
		/**r
		 * _data: {
		 * 		index:number   打开第几个子界面
		 * }
		 */
    	private _isShow:boolean;
    	private _baseSkinName:string;
    	public resName:string;      //模块所引用的资源组
    	public isEvery:boolean = false;      //模块一直存在
		public BtnClose:eui.Button;//如果存在closeButton

		//采用 addClickEvent 监听的控件，必须要触发了touchBegin才能做touchEnd
		//private touchBeginTaret;
		public constructor() {
    		super();
		}
	
		/**
		 * 组件初始化完毕
		 */
        protected onCreationComplete(evt: eui.UIEvent): void
        {
            super.onCreationComplete(evt);
        }

		protected sendNotification(type:string, data?:any): void {
			lemon.NotifyManager.sendNotification(type, data);
		}

		/**
		 * centerModule
		 */
		public centerModule() {
			this.x = (lemon.StageUtil.stageWidth - this.width)/2;
            this.y = (lemon.StageUtil.stageHeight - this.height)/2;
		}

		/**
		 * @description 设置皮肤名字,需要在构造函数里面调用
		 */ 
		public set baseSkinName(value:string){
		    this._baseSkinName=value;
		}
        /**
         * @description 初始化组件,需被子类继承
         */ 
        protected initComponent():void{
        }
        /**
         * @description 初始化事件,需被子类继承
         */ 
        protected initListener():void{
			super.initListener();
			if (this.BtnClose){
				this.BtnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnTouchHandler,this);
			}
        }
        /**
         * @description 初始化数据,需被子类继承
         */ 
        protected initData():void{
			super.initData();
        }

		private btnTouchHandler(event:egret.TouchEvent):void {
			this.BtnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnTouchHandler,this);
			this.dispos();
			//lemon.TweenEffectUtil.bounceInUp(this, 0, 1000);
		}
		/**
		 * @description 打开模块
		 * @param needLoadSkin 是否需要加载皮肤，这个在模块管理器ModuleManager里面自动判断了
		 * @param data 打开模块时，需要向这个模块传递的一些数据
		 * @param layer 当前模块所处的层级
		 */ 
		public openModule(needLoadSkin:boolean,data:any,layer:number,needCenter?:boolean):void{
		    this.data = data;
		    if(needLoadSkin){
		        this.skinName = this._baseSkinName;
		    }else{
				egret.callLater(this.initData,this);
				//this.initData();
		        //this.initListener();
		    }
		    this.show(layer,needCenter);
		}
		/**
		 * @description 显示模块
		 */ 
		private show(layer:number,needCenter?:boolean):void{
		    this._isShow = true;
		    LayerManager.getInstance().addDisplay(this,layer);
			if (needCenter){
				 this.centerModule();
			}
		}
		/**
		 * @description 获取当前模块的显示状态
		 */ 
		public get isShow():boolean{
		    return this._isShow;
		}
		/**
		 * @description 获取模块中某个控件在舞台中的位置
		 */
		public getComponentGlobalPoint(componentName:string):any{
			let component:egret.DisplayObject=this[componentName];
			if(component){
				if(component.parent){
					return component.parent.localToGlobal(component.x,component.y);
				}else{
					return component.localToGlobal(component.x,component.y);
				}
			}
			return {x:0,y:0};
		}
		/**
		 * @description 资源释放
		 */ 
		public dispos():void{
    		lemon.NotifyManager.removeThisObjectNofity(this);
    		this.removeAllEvent();
    		this._isShow=false;
		    if(this.parent){
		        this.parent.removeChild(this);
		    }
		}
	}
}
