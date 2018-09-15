module lemon {
	/**
     * * @description 场景
	 *
	 */
    export class Scene extends egret.DisplayObjectContainer {
        private callBack: Function;                       //地图加载完毕后的回调函数
        private thisObject: any;                          //回调函数的引用对象
        private mapLayer: egret.DisplayObjectContainer;   //地图所在层级
        private viewRect: egret.Rectangle;               //可视区域范围
        private bottomLayer: egret.DisplayObjectContainer; //底部层，比如道具掉落，脚底特效等
        private shadowLayer: egret.DisplayObjectContainer;   //脚底阴影层
        private objList: Array<BaseObject>;            //所有的物体对象
        private objLayer: egret.DisplayObjectContainer;   //物体层
        private objFrontLayer: egret.DisplayObjectContainer;  //物体层前面的东西，比如血条什么的
        private frontLayer: egret.DisplayObjectContainer;  //人物前层，比如飘血,前景特效
        private renderList: Array<BaseObject>          //需要进行排序的物体对象
        private mapWidth: number;                        //地图总宽度
        private mapHeight: number;                       //地图的总高度
        private viewPortWidth: number;                   //视口的宽度
        private viewPortHeight: number;                  //视口的高度
        private sliceWidth: number;                      //切片宽度
        private sliceHeight: number;                     //切片高度
        private row: number;                             //总的纵向切片个数
        private col: number;                             //总的横向切片个数
        private nowXIndex: number;                       //玩家当前所在的切片X索引
        private nowYIndex: number;                       //玩家当前所在的切片Y索引
        private preloadX: number;                        //预加载的横向切片数
        private preloadY: number;                        //预加载的纵向切片数
        private needShowX: number;                       //当前屏幕需要加载的横向切片数
        private needShowY: number;                       //当前屏幕需要加载的纵向切片数
        private centerRect: egret.Rectangle;             //玩家可移动的自由中心范围
        private vx: number;                              //x方向速度
        private vy: number;                              //y方向速度
        private right: number;                           //右边距，即超出屏幕后的宽度
        private bottom: number;                          //下边距,即超出屏幕后的高度
        private screePoint: egret.Point;                  //当前的舞台坐标点
        private localPoint: egret.Point;                  //世界坐标中的位置
        private currentFocusTarget: BaseObject;         //当前聚焦的对象
        private mapJsonData: any;                         //当前地图的Json数据结构
        private relativePath: string;                     //地图资源的相对路径
        public constructor(relativePath: string) {
            super();
            this.relativePath = relativePath;
            this.objList = [];
            this.renderList = [];
            this.preloadX = 4;
            this.preloadY = 4;
            this.screePoint = new egret.Point();
            this.localPoint = new egret.Point();
            this.viewRect = new egret.Rectangle(0, 0, 0, 0);
            this.bottomLayer = new egret.DisplayObjectContainer();
            this.frontLayer = new egret.DisplayObjectContainer();
            this.shadowLayer = new egret.DisplayObjectContainer();
            this.objLayer = new egret.DisplayObjectContainer();
            this.objFrontLayer = new egret.DisplayObjectContainer();
            this.mapLayer = new egret.DisplayObjectContainer();
            this.mapLayer.touchEnabled = true;
            this.mapLayer.touchChildren = false;
            this.bottomLayer.touchEnabled = this.bottomLayer.touchChildren = false;
            this.shadowLayer.touchEnabled = this.shadowLayer.touchChildren = false;
            this.objFrontLayer.touchEnabled = this.objFrontLayer.touchChildren = false;
            this.frontLayer.touchEnabled = this.frontLayer.touchChildren = false;
            this.addChild(this.mapLayer);
            this.addChild(this.bottomLayer);
            this.addChild(this.shadowLayer);
            this.addChild(this.objLayer);
            this.addChild(this.objFrontLayer);
            this.addChild(this.frontLayer);
            Ticker.getInstance().registerTick(this.render, this);
        }
        
        
        /**
         * @description 当舞台尺寸发生变化
         */
        private onStageResize(): void {
            
        }
        /**
         * @description 设置聚焦对象
         */
        public setFoucsTarget(target: BaseObject, points: any): void {
            if (points) {
                this.localPoint.x = points.x;
                this.localPoint.y = points.y;
                target.x = points.x;
                target.y = points.y;
            } else {
                this.localPoint.x = target.x;
                this.localPoint.y = target.y;
            }
            if (this.currentFocusTarget) {
                this.currentFocusTarget.isFocus = false;
            }
            target.isFocus = true;
            this.currentFocusTarget = target;
            this.checkPosition();
        }
        /**
         * @description 校验位置
         */
        private checkPosition(): void {
            let xScroll: number = this.localPoint.x - this.viewPortWidth > 0 ? this.localPoint.x : 0;
            let yScroll: number = this.localPoint.y - this.viewPortHeight > 0 ? this.localPoint.y : 0;
            if (xScroll == 0) {
                this.x = -(this.viewPortWidth / 2 - (this.viewPortWidth - this.localPoint.x));
            } else {
                this.x = -xScroll + this.viewPortWidth / 2;
            }
            if (this.x < (this.viewPortWidth - this.mapWidth)) {
                this.x = this.viewPortWidth - this.mapWidth;
            }
            if (this.x > 0) {
                this.x = 0;
            }
            if (yScroll == 0) {
                if (this.localPoint.y > this.viewPortHeight / 2) {
                    this.y = -(this.localPoint.y - this.viewPortHeight / 2);
                } else {
                    this.y = 0;
                }
            } else {
                this.y = -(this.localPoint.y - this.viewPortHeight) - this.viewPortHeight / 2;
            }
            if (this.y < (this.viewPortHeight - this.mapHeight)) {
                this.y = this.viewPortHeight - this.mapHeight;
            }
        }
        /**
         * @description 调整摄像头，聚焦到某个坐标
         */
        public lookAt(pos: any, duration: number = 1000): void {
            if (pos) {
                this.localPoint.x = pos.x;
                this.localPoint.y = pos.y;
                let xScroll: number = this.localPoint.x - this.viewPortWidth > 0 ? this.localPoint.x : 0;
                let yScroll: number = this.localPoint.y - this.viewPortHeight > 0 ? this.localPoint.y : 0;
                let destX: number;
                let destY: number;
                if (xScroll == 0) {
                    destX = -(this.viewPortWidth / 2 - (this.viewPortWidth - this.localPoint.x));
                } else {
                    destX = -xScroll + this.viewPortWidth / 2;
                }
                if (destX < (this.viewPortWidth - this.mapWidth)) {
                    destX = this.viewPortWidth - this.mapWidth;
                }
                if (destX > 0) {
                    destX = 0;
                }
                if (yScroll == 0) {
                    if (this.localPoint.y > this.viewPortHeight / 2) {
                        destY = -(this.localPoint.y - this.viewPortHeight / 2);
                    } else {
                        destY = 0;
                    }
                } else {
                    destY = -(this.localPoint.y - this.viewPortHeight) - this.viewPortHeight / 2;
                }
                if (destY < (this.viewPortHeight - this.mapHeight)) {
                    destY = this.viewPortHeight - this.mapHeight;
                }
                let self: Scene = this;
                egret.Tween.removeTweens(self);
                egret.Tween.get(this).to({ x: destX, y: destY }, duration).call(function () {
                    egret.Tween.removeTweens(self);
                }, this);
            }
        }
        /**
         * @description 停止移动相机
         */
        public stopLook(): void {
            egret.Tween.removeTweens(this);
        }
        
		/**
		 * @description 设置可视区域
		 */
        public setViewRect(sceneWidth: number, sceneHeight: number, viewPortWidth: number, viewPortHeight: number): void {
            this.mapWidth = sceneWidth;
            this.mapHeight = sceneHeight;
            this.viewRect.x = 0;
            this.viewRect.y = 0;
            this.viewRect.width = viewPortWidth;
            this.viewRect.height = viewPortHeight;
        }

        public setSceneOffset(x:number, y:number):void{
            this.viewRect.x = -x;
            this.viewRect.y = -y;
            this.x = x;
            this.y = y;
        }
        /**
         * @description 物体是否在可视区域内
         */
        public isInViewPort(obj: BaseObject): boolean {
            return true;
            /*this.viewRect.x = -this.x - this.cacheWidth;
            this.viewRect.y = -this.y - this.cacheHeight;
            let isInView: boolean = this.viewRect.contains(obj.x, obj.y);
            obj.isInView(isInView);
            return isInView;*/
        }
        
        /**
         * @description 添加一个baseObject到场景中
         */
        public addObject(obj: BaseObject): void {
            if (this.objList.indexOf(obj) == -1) {
                obj.scene = this;
                this.objList.push(obj);
            }
        }
        /**
         * @description 根据id返回对应的BaseObject
         */
        public findBaseObjectById(id: any): BaseObject {
            for (let item of this.objList) {
                if (lemon.MathUtil.equal(item.id, id)) {
                    return item;
                }
            }
            return null;
        }
        /**
         * @description 移除一个BaseObject通过id,单纯从显示列表移除
         */
        public removeBaseObjectById(id: any): void {
            for (let item of this.objList) {
                if (lemon.MathUtil.equal(id, item.id)) {
                    let index: number = this.objList.indexOf(item);
                    if (index != -1) {
                        this.objList.splice(index, 1);
                        item.dispos();
                        item = null;
                        break;
                    }
                }
            }
        }
        /**
         * @description 移除一个BaseObject,通过引用对象本身,单纯从显示列表移除
         */
        public removeBaseObject(baseObject: BaseObject): void {
            for (let item of this.objList) {
                if (item = baseObject) {
                    let index: number = this.objList.indexOf(item);
                    if (index != -1) {
                        item.dispos();
                        this.objList.splice(index, 1);
                        item = null;
                        break;
                    }
                }
            }
        }
        /**
         * @description 添加显示对象到底部层
         */
        public addToBottom(disPlay: egret.DisplayObject): void {
            this.bottomLayer.addChild(disPlay);
        }

        public getBottomLayer(): egret.DisplayObjectContainer {
            return this.bottomLayer;
        }
        /**
         * @description 添加显示对象到底部层
         */
        public addToMap(disPlay: egret.DisplayObject): void {
            this.mapLayer.addChild(disPlay);
        }
        /**
         * @description 添加显示对象到前景层
         */
        public addToFront(disPlay: egret.DisplayObject): void {
            this.frontLayer.addChild(disPlay);
        }
        /**
         * @description 添加显示对象到阴影层
         */
        public addToShadow(disPlay: egret.DisplayObject): void {
            this.shadowLayer.addChild(disPlay);
        }
        /**
         * @description 添加显示对象到物体前层，比如血条
         */
        public addToObjectFront(disPlay: egret.DisplayObject): void {
            this.objFrontLayer.addChild(disPlay);
        }
        /**
         * @description 显示或隐藏排序对象的前景层
         */
        public showOrHideObjFrontLayer(value: boolean): void {
            this.objFrontLayer.visible = value;
        }
        /**
         * @description 根据类型获取BaseObject列表
         * @param type 物体类型 isSelf 是否包含自己
         */
        public getObjectListByType(type: number, isSelf: boolean = true, isNeedWalkAble: boolean = false): Array<BaseObject> {
            let list: Array<BaseObject> = [];
            for (let object of this.objList) {
                if (type == ActorType.ROLE) {
                    if (object.type == ActorType.ROLE || object.type == ActorType.MONSTER) {
                        if (object.isMaster && !isSelf) {
                            continue;
                        }
                        if (isNeedWalkAble) {
                            list.push(object);
                        } else {
                            list.push(object);
                        }
                    }
                } else {
                    if (object.type == type) {
                        list.push(object);
                    }
                }
            }
            return list;
        }
        
        /**
         * @description 获取obj的物体坐标
         */
        public getObjGlobalPoint(obj: BaseObject): any {
            return this.objLayer.localToGlobal(obj.x, obj.y);
        }
        /**
         * @description 渲染
         */
        private render(): void {
            let self: Scene = this;
            self.renderList.length = 0;
            for (let item of self.objList) {
                if (self.isInViewPort(item)) {
                    self.renderList.push(item);
                } else {
                    if (item.ui != null) {
                        if (item.ui.parent) {
                            item.ui.parent.removeChild(item.ui);
                        }
                    }
                }
            }
            self.renderList = self.renderList.sort(function (a, b): number {
                if (a.sortY > b.sortY) return 1;
                else if (a.sortY == b.sortY) return 0;
                return -1;
            });
            for (let obj of self.renderList) {
                if (obj.ui) {
                    self.objLayer.addChild(obj.ui);
                }
            }
        }
        /**
         * @description 获取物体列表
         */
        public getObjectList(): Array<BaseObject> {
            return this.objList;
        }
        /**
         * @description 获取当前渲染的列表
         */
        public getRenderList(): Array<BaseObject> {
            return this.renderList;
        }
        /**
         * @description 停止渲染场景
         */
        public pause(): void {
            Ticker.getInstance().unRegisterTick(this.render, this);
            if (this.bottomLayer.parent) {
                this.bottomLayer.parent.removeChild(this.bottomLayer);
            }
            if (this.shadowLayer.parent) {
                this.shadowLayer.parent.removeChild(this.shadowLayer);
            }
            if (this.objLayer.parent) {
                this.objLayer.parent.removeChild(this.objLayer);
            }
            if (this.objFrontLayer.parent) {
                this.objFrontLayer.parent.removeChild(this.objFrontLayer);
            }
            if (this.frontLayer.parent) {
                this.frontLayer.parent.removeChild(this.frontLayer);
            }
        }
        /**
         * @description 重新渲染场景
         */
        public resume(): void {
            Ticker.getInstance().registerTick(this.render, this, 600);
            this.addChild(this.bottomLayer);
            this.addChild(this.shadowLayer);
            this.addChild(this.objLayer);
            this.addChild(this.objFrontLayer);
            this.addChild(this.frontLayer);
        }
        /**
         * @description 清除当前场景所有物体
         */
        public clear(): void {
            this.bottomLayer.removeChildren();
            this.frontLayer.removeChildren();
            this.renderList = [];
            this.currentFocusTarget = null;
            this.callBack = null;
            this.thisObject = null;
            if (this.objList) {
                while (this.objList.length > 0) {
                    let item: BaseObject = this.objList.shift();
                    if (!item.isMaster) {
                        item.dispos();
                        item = null;
                    }
                }
            }
        }
    }
}
