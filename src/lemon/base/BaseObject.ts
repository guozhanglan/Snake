module lemon {
	/**
	 * @description 场景中基础的显示对象,所有场景中参与排序的物体都要继承此类
	 *
	 */
    export class BaseObject {
        private _touchEnable: boolean;              //是否支持触摸事件
        private _x: number;
        private _y: number;
        private _isFocus: boolean;                  //是否是被摄像机跟随
        private _ui: egret.DisplayObject;          //ui显示对象
        private _screenPoint: egret.Point;        //物体对应的舞台坐标点
        private _isMaster: boolean;                 //是否是主角
        private _isRobot:boolean;                   //是否是机器人
        private _isRobotMonster:boolean;            //是否是机器怪
        public id: any;               //物体的唯一标识对象,64位
        public type: number;             //物体类型，用于区分各种类型的物体的
        public dy: number = 0;               //动态排序的增量值
        public scene: Scene;           //物体所属场景
        public range:number;         //用来做距离排序的
        public constructor() {
            this._touchEnable = false;
            this._isFocus = false;
            this._isMaster = false;
            this.id = {};
            this.range=0;
            this._isRobot=false;
            this._screenPoint = new egret.Point();
        }
		
		/**
		 * @description 设置是否被摄像机跟随
		 */
        public set isFocus(value: boolean) {
            this._isFocus = value;
        }
		/**
		 * @description 获取是否被摄像机跟随
		 */
        public get isFocus(): boolean {
            return this._isFocus;
        }
		/**
		 * @description 设置X坐标
		 */
        public set x(value: number) {
            this._x = value;
            if (this._ui != null) {
                this._ui.x = value;
            }
        }
		/**
		 * @description 获取x坐标
		 */
        public get x(): number {
            return this._x;
        }
		/**
		 * @description 设置y坐标
		 */
        public set y(value: number) {
            this._y = value;
            if (this._ui != null) {
                this._ui.y = value;
            }
        }
		/**
		 * @description 获取Y坐标
		 */
        public get y(): number {
            return this._y;
        }
        /**
         * @description 获取中心点Y坐标
         */
        public get centerY(): number {
            if (this.ui) {
                return this.y - this.ui.height / 2;
            }
            return this.y;
        }
		/**
		 * @description 设置ui显示对象
		 */
        public set ui(disPlay: egret.DisplayObject) {
            this._ui = disPlay;
            if (disPlay) {
                disPlay.x = this.x;
                disPlay.y = this.y;
                disPlay.touchEnabled = this._touchEnable;
            }
        }
		/**
		 * @description 获取ui显示对象
		 */
        public get ui(): egret.DisplayObject {
            return this._ui;
        }
        /**
	     * 是否精确点击，像素点级判断,方法逻辑应被子类继承实现
	     */
        public isPixelClick(stageX: number, stageY: number): boolean {
            if (this.ui) {
                if (this.ui.hitTestPoint(stageX, stageY)) {
                   return true;
                }
            }
            return false;
        }
		/**
		 * @description 获取排序Y
		 */
        public get sortY(): number {
            return this._y + this.dy;
        }
		/**
		 * @description 设置滤镜效果
		 */
        public set filters(filter: Array<any>) {
            if (this._ui) {
                this._ui.filters = filter;
            }
        }
        /**
         * @description 设置透明度
         */
        public set alpha(value: number) {
            if (this.ui) {
                this.ui.alpha = value;
            }
        }
        /**
         * @description 获取透明度
         */
        public get alpha():number{
            if(this.ui){
                return this.ui.alpha;
            }
            return 1;
        }
		/**
		 * @description 设置触摸
		 */
        public set touchEnabled(value: boolean) {
            this._touchEnable = value;
            if (this._ui) {
                this._ui.touchEnabled = value;
            }
        }
        /**
         * @description 设置是否可见
         */
        public set visible(value: boolean){
            if (this._ui) {
                this._ui.visible = value;
            }
        }
        /**
         * @description 获取当前的可见性
         */
        public get visible():boolean{
            if(this._ui){
                return this._ui.visible;
            }
            return false;
        }
        /**
         * @description 获取舞台坐标点
         */
        public get screenPoint(): egret.Point {
            if (this._ui && this._ui.parent) {
                this._ui.parent.localToGlobal(this._x, this._y, this._screenPoint);
            }
            return this._screenPoint;
        }
        /**
         * @description 设置master
         */
        public set isMaster(value: boolean) {
            this._isMaster = value;
        }
        /**
         * @description 获取master标识
         */
        public get isMaster(): boolean {
            return this._isMaster;
        }
        /**
         * @description 是否是机器人AI
         */
        public set isRobot(value: boolean){
            this._isRobot=value;
        }
        /**
         * @description 是否是机器人AI
         */
        public get isRobot():boolean{
            return this._isRobot;
        }
        /**
         * @description 设置是否是机器怪
         */
        public set isRobotMonster(value:boolean){
            this._isRobotMonster=value;
        }
        /**
         * @description 获取是否是机器怪
         */
        public get isRobotMonster():boolean{
            return this._isRobotMonster;
        }
        /**
         * @description 是否在可视区域内,需要被子类继承
         */
        public isInView(value:boolean):void{

        }
		/**
		 * @description 资源释放
		 */
        public dispos(): void {
            this._isFocus = false;
            this.id=0;
            if (this._ui) {
                this._ui.filters = null;
                if (this._ui["dispos"]) {
                    this._ui["dispos"]();
                } else {
                    if (this._ui.parent) {
                        this._ui.parent.removeChild(this._ui);
                    }
                }
            }
        }
    }
}
