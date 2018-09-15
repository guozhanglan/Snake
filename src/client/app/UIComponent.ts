module wqq {
	/**
	 *
	 * @desc 基本的UI界面显示类
	 *
	 */
    export class UIComponent extends eui.Component {
        private _eventDic: any;
        private _data: any;
        private _touchBeginTaret: any;
        protected isSkinLoaded: boolean;
        public constructor() {
            super();
            this._eventDic = {};
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
        }

		/**
		 * 组件初始化完毕
		 */
        protected onCreationComplete(evt: eui.UIEvent): void {
            this.initComponent();
            this.initData();
            this.initListener();
            this.isSkinLoaded = true;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
        }
        /**
         * 初始化组件,需被子类继承
         */
        protected initComponent(): void {

        }
        /**
        * 初始化数据
        */
        protected initData(): void {
            this.onStageResize();
        }

		/**
		 * @description 获取当前属于这个模块的数据
		 */
        public get data(): any {
            return this._data;
        }
		/**
		 * @description 获取当前属于这个模块的数据
		 */
        public set data(data: any) {
            this._data = data;
        }
        /**
         * 初始化事件监听器,需被子类继承
         */
        protected initListener(): void {
            lemon.NotifyManager.registerNotify(lemon.StageUtil.STAGE_RESIZE, this.onStageResize, this);
        }
        protected onStageResize() {

        }
        /**
         * 事件注册，所有事件的注册都需要走这里
         */
        public addEvent(target: egret.EventDispatcher, type: string, callBack: Function, thisObject: any): void {
            if (target) {
                var eventParams: any = {};
                eventParams.target = target;
                eventParams.type = type;
                eventParams.callBack = callBack;
                eventParams.thisObject = thisObject;
                target.addEventListener(type, callBack, thisObject);
                this._eventDic[target.hashCode + type] = eventParams;
            }
        }
		/**
		 * @description 添加点击函数
		 */
        protected addClickEvent(target: egret.DisplayObject, callBack: Function, thisObject: any): void {
            if (!target){
                return;
            }
            var eventParams: any = {};
            eventParams.target = target;
            eventParams.type = egret.TouchEvent.TOUCH_BEGIN;
            eventParams.thisObject = thisObject;
            eventParams.callFunc = this.onTouchBegin;
            eventParams.thisCall = this;
            eventParams.scaleX = target.scaleX;
            eventParams.scaleY = target.scaleY;
            target.addEventListener(eventParams.type, this.onTouchBegin, this);
            this._eventDic[target.hashCode + eventParams.type] = eventParams;

            var eventParamsEnd: any = {};
            eventParamsEnd.target = target;
            eventParamsEnd.type = egret.TouchEvent.TOUCH_END;
            eventParamsEnd.callBack = callBack;
            eventParamsEnd.thisObject = thisObject;
            eventParamsEnd.callFunc = this.onTouchEnd;
            eventParamsEnd.thisCall = this;
            eventParamsEnd.scaleX = target.scaleX;
            eventParamsEnd.scaleY = target.scaleY;
            target.addEventListener(eventParamsEnd.type, this.onTouchEnd, this);
            this._eventDic[target.hashCode + eventParamsEnd.type] = eventParamsEnd;
            
            var eventParamsOutSide: any = {};
            eventParamsOutSide.target = target;
            eventParamsOutSide.type = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
            eventParamsOutSide.thisObject = thisObject;
            eventParamsOutSide.callFunc = this.onTouchReleaseOutSide;
            eventParamsOutSide.thisCall = this;
            eventParamsOutSide.scaleX = target.scaleX;
            eventParamsOutSide.scaleY = target.scaleY;
            target.addEventListener(eventParamsOutSide.type, this.onTouchReleaseOutSide, this);
            this._eventDic[target.hashCode + eventParamsOutSide.type] = eventParamsOutSide;
            
        }
		/**
		 * @description 当点击开始
		 */
        private onTouchBegin(evt: egret.TouchEvent): void {
            let target:any = evt.target;
            this._touchBeginTaret = target;
            let eventParams:any = this._eventDic[target.hashCode + evt.type];
            if (eventParams){
                //target.anchorOffsetX = target.width/2;
                //target.anchorOffsetY = target.height/2;
                egret.Tween.get(target).to({ scaleX: eventParams.scaleX*0.9, scaleY: eventParams.scaleX*0.9 }, 50);
            }
        }
        /**
         * @description 当点击结束
         */
        private onTouchEnd(evt: egret.TouchEvent): void {
            let self: any = this;
            let target: any = evt.target;
            if (this._touchBeginTaret != target) return;
            this._touchBeginTaret = null;
            let params:any = this._eventDic[target.hashCode + evt.type];

            egret.Tween.get(target).to({ scaleX: params.scaleX, scaleY: params.scaleY }, 50).call(function () {
                for (let key in self._eventDic) {
                    let eventParams: any = self._eventDic[key];
                    if (eventParams.target == target && eventParams.type == egret.TouchEvent.TOUCH_END) {
                        eventParams.callBack.call(eventParams.thisObject);
                    }
                }
            }, this);
        }
        /**
         * @description 当点击结束的时候，按钮不在被点击的对象上
         */
        private onTouchReleaseOutSide(evt: egret.TouchEvent): void {
            let target: any = evt.target;
            if (this._touchBeginTaret != target) return;
            let params:any = this._eventDic[target.hashCode + evt.type];
            this._touchBeginTaret = null;
            if (params){
                target.scaleX = params.scaleX;
                target.scaleY = params.scaleY;
                //target.anchorOffsetX = 0;
                //target.anchorOffsetY = 0;
            }
            else{
                evt.target.scaleX = 1;
                evt.target.scaleY = 1;
            }
        }
        /**
         * 统一移除所有事件
         */
        public removeAllEvent(): void {
            let tempEvent;
            for (let name in this._eventDic) {
                tempEvent = this._eventDic[name];
                if (tempEvent.target != null) {
                    tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callBack, tempEvent.thisObject);
                    tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callFunc, tempEvent.thisCall);
                }
                delete this._eventDic[name];
            }
            this._eventDic = {};
        }
        /**
         * 资源释放
         * @$isDispos 是否彻底释放资源
         */
        public dispos($isDispos: boolean = false): void {
            lemon.NotifyManager.removeThisObjectNofity(this);
            this.removeAllEvent();
            this._touchBeginTaret = null;
            this._data = null;
            if ($isDispos) {
                //todo释放资源
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
    }
}
