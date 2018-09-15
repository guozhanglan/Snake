module wqq {
	import AnimateClip = lemon.AnimateClip;
	import DirUtil = lemon.DirUtil;
	import ActorPart = lemon.ActorPart;
	import ActorPartResourceDic = lemon.ActorPartResourceDic;
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.08
	 * @description 基础的场景中怪物和人物的动画的基类
	 *
	 */
    export class BaseActor extends egret.DisplayObjectContainer {
        protected currentFrame: number;
        protected totalFrame: number;
        private isStopped: boolean;
        private passedTime: number;
        private frameIntervalTime: number;
        private lastTime: number;
        private eventDic: any;                       //事件字典
        private actDic: any;                          //记录当前动作是否加载完毕的
        private act: string;                          //当前的动作
        private dir: number;                          //当前朝向
        protected partDic: any;                         //角色身上的部件
        private partIdDic: any;                       //角色身上部件对应的Id
        private resourcePath: string;                 //资源的相对路径
        private isDirLoaded: boolean;                 //是否是分方向下载
        private _frameRate: number;                   //当前帧频
        private loopCallBack: Function;               //当前循环播放完毕
        private thisObject: any;                      //当前循环播放作用域对象
        private loadCallBack: Function;               //加载完毕后的回调函数,只针对裸体和坐骑
        private loadThisObject: any;                  //加载完毕后的回调函数作用域对象
        private _timeScale: number;                   //帧频速度,越大越快
        public constructor(resourcePath: string, loadCallBack: Function, loadThisObject: any, defaultAct: string = "idle") {
            super();
            this.resourcePath = resourcePath;
            this.loadCallBack = loadCallBack;
            this.loadThisObject = loadThisObject;
            this.currentFrame = 1;
            this.totalFrame = 0;
            this.isStopped = true;
            this.isDirLoaded = false;
            this.passedTime = 0;
            this.lastTime = 0;
            this._timeScale = 1;
            this.act = defaultAct;
            this.frameRate = 30;
            this.eventDic = {};
            this.actDic = {};
            this.partDic = {};
            this.partIdDic = {};
        }
        /**
         * @description 设置是否是分方向加载
         */
        public setIsDirLoad(value: boolean): void {
            this.isDirLoaded = value;
            for (let part in this.partDic) {
                let animalClip: AnimateClip = this.partDic[part];
                animalClip.setIsDirLoad(value);
            }
        }
		/**
		 * @description 添加部件
		 * @param part部件位置，参考ActorPart
		 * @param partId 部件的Id
		 * @param partIndex 部件层级位置,数字越大层级越高
		 */
        public addPartAt(part: number, partId: number, partIndex: number = -1, dir: number = 1, isDirLoad: boolean = false): void {
            if (partId) {
                this.partIdDic[part] = partId;
                this.dir = dir;
                let resPre:string = partId + "_";
                if (this.partDic[part]) {
                    let animalClip: AnimateClip = this.partDic[part];
                    if (partIndex != -1) {
                        this.addChildAt(animalClip, partIndex);
                    } else {
                        this.addChild(animalClip);
                    }
                    animalClip.setIsDirLoad(isDirLoad);
                    let tempAct: string = this.act;
                    if (!animalClip.containsAct(tempAct)) {
                        tempAct = Status.IDLE;
                    }
                    if (ActorPartResourceDic.getInstance().partDic[part]) {
                        animalClip.load(ActorPartResourceDic.getInstance().partDic[part] + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    } else {
                        animalClip.load(this.resourcePath + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    }
                } else {
                    let animalClip: AnimateClip;
                    if (part == ActorPart.BODY) {
                        animalClip = new AnimateClip(this.onLoaded, this);
                        animalClip.isBody = true;
                    } else {
                        animalClip = new AnimateClip(this.onLoadedOther, this);
                    }
                    animalClip.setIsDirLoad(isDirLoad);
                    if (partIndex != -1) {
                        this.addChildAt(animalClip, partIndex);
                    } else {
                        this.addChild(animalClip);
                    }
                    let tempAct: string = this.act;
                    if (!animalClip.containsAct(tempAct)) {
                        tempAct = Status.IDLE;
                    }
                    this.partDic[part] = animalClip;
                    if (ActorPartResourceDic.getInstance().partDic[part]) {
                        animalClip.load(ActorPartResourceDic.getInstance().partDic[part] + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    } else {
                        animalClip.load(this.resourcePath + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    }
                }
            }
        }
		/**
		 * @description 移除部件
		 * @param part部件位置，参考ActorPart
		 */
        public removePart(part: number): void {
            if (this.partDic[part]) {
                let animalClip: AnimateClip = this.partDic[part];
                if (animalClip) {
                    animalClip.dispos();
                }
                delete this.partDic[part];
                delete this.partIdDic[part];
            }
        }
		/**
		 * @description 设置坐骑
         * @param isDirLoad 是否是分方向加载
		 */
        public setHorse(horseId: number,isDirLoad:boolean=false): void {
            this.removePart(ActorPart.HORSE);
            this.addPartAt(ActorPart.HORSE, horseId, 0, this.dir,isDirLoad);
        }
		/**
		 * @description 取消坐骑
		 */
        public cancelHorse(): void {
            this.removePart(ActorPart.HORSE);
        }
        /**
         * @description 设置该部位包含的动作
         */
        public setPartActs(part: number, acts: string): void {
            for (let key in this.partDic) {
                if (parseInt(key) == part) {
                    let animalClip: AnimateClip = this.partDic[part];
                    if (animalClip) {
                        animalClip.setActs(acts);
                    }
                }
            }
        }
		/**
		 * @description 跳转并播放
		 */
        public gotoAndPlay(act: string, dir: number, loopCallBack: Function = null, thisObject: any = null, force: boolean = false): void {
            this.loopCallBack = loopCallBack;
            this.thisObject = thisObject;
            if (!force) {
                if (this.act == act) return;
            }
            this.actDic[act] = false;
            this.act = act;
            this.dir = dir;
            this.currentFrame = 1;
            let currentScale:number=Math.abs(this.scaleX);
            if (dir <= 5) {
                this.scaleX = currentScale;
            } else {
                this.scaleX = -currentScale;
            }
            this.setIsStopped(true);
            for (let part in this.partDic) {
                let animalClip: AnimateClip = this.partDic[part];
                if (animalClip) {
                    let tempAct: string = this.act;
                    if (!animalClip.containsAct(tempAct)) {
                        tempAct = Status.IDLE;
                    }
                    let partId:number = this.partIdDic[part];
                    let resPre:string = partId + "_";
                    if (ActorPartResourceDic.getInstance().partDic[part]) {
                        animalClip.load(ActorPartResourceDic.getInstance().partDic[part] + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    } else {
                        animalClip.load(this.resourcePath + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    }
                    if (parseInt(part) == ActorPart.BODY) {
                        this.totalFrame = animalClip.totalFrames;
                    }
                }
            }
        }
        /**
         * @description 清除回调
         */
        public clearCallBack(): void {
            this.loopCallBack = null;
        }
		/**
		 * @description 调整方向
		 */
        public changeDir(dir: number): void {
            if (this.dir == dir) return;
            this.dir = dir;
             let currentScale:number=Math.abs(this.scaleX);
            if (dir <= 5) {
                this.scaleX = currentScale;
            } else {
                this.scaleX = -currentScale;
            }
            for (let part in this.partDic) {
                let animalClip: AnimateClip = this.partDic[part];
                if (animalClip) {
                    let tempAct: string = this.act;
                    if (!animalClip.containsAct(tempAct)) {
                        tempAct = Status.IDLE;
                    }
                    let partId:number = this.partIdDic[part];
                    let resPre:string = ActorPartResourceDic.PartResPre?partId + "_":"";
                    if (ActorPartResourceDic.getInstance().partDic[part]) {
                        animalClip.load(ActorPartResourceDic.getInstance().partDic[part] + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    } else {
                        animalClip.load(this.resourcePath + partId + "/", resPre + tempAct, DirUtil.getDir(dir));
                    }
                    if (parseInt(part) == ActorPart.BODY) {
                        this.totalFrame = animalClip.totalFrames;
                    }
                }
            }
        }
		/**
		 * @description 跳转并停止在某一帧
		 */
        public gotoAndStop(frame: number): void {
            this.currentFrame = frame;
            this.render();
            this.setIsStopped(true);
        }
        /**
       * @description 资源加载完毕*/
        private onLoaded(isFromCache: boolean, resName: string): void {
            if (resName.indexOf(this.act) == -1) return;
            let animalClip: AnimateClip = this.partDic[ActorPart.BODY];
            let self: BaseActor = this;
            if (animalClip) {
                self.totalFrame = animalClip.totalFrames;
                self.frameRate = animalClip.frameRate;
            } else {
                self.totalFrame = 0;
            }
            if (self.totalFrame > 0) {
                self.actDic[self.act] = true;
                self.setIsStopped(false);
                if (self.loadCallBack) {
                    self.loadCallBack.call(self.loadThisObject);
                }
            } else {
                self.gotoAndPlay(self.act, self.dir);
            }
        }
        /**
         * @description 获取第一帧裸体的高度
         */
        public get firstBodyFrameHeight(): number {
            let animalClip: AnimateClip = this.partDic[ActorPart.BODY];
            if (animalClip) {
                return animalClip.firstFrameHeight;
            }
            return 0;
        }
        /**
         * @description 坐骑加载完毕
         */
        private onHorseLoaded(isFromCache: boolean): void {
            if (!isFromCache) {
                this.changeDir(this.dir);
            }
            if (this.loadCallBack) {
                this.loadCallBack.call(this.loadThisObject);
            }
        }
        /**
         * @description 其它部位加载完毕
         */
        private onLoadedOther(isFromCache: boolean): void {
            if (!isFromCache) {
                this.changeDir(this.dir);
            }
        }
        /**
         * @description 注册一个帧事件         */
        public registerFrameEvent(frame: number, callBack: Function, thisObject: any): void {
            this.eventDic[frame] = { callBack: callBack, thisObject: thisObject };
        }
        /**
         * @description 取消一个帧事件         */
        public unRegisterFrameEvent(frame: number): void {
            if (this.eventDic[frame]) {
                this.eventDic[frame] = null;
                delete this.eventDic[frame];
            }
        }
        /**
         * @description 清除帧事件注册
         */
        public clearFrameEvent(): void {
            for (let key in this.eventDic) {
                this.eventDic[key] = null;
                delete this.eventDic[key];
            }
        }
        /**
         * @description 帧频调用         */
        private advanceTime(timeStamp: number): boolean {
            let self = this;
            let advancedTime: number = timeStamp - self.lastTime;
            self.lastTime = timeStamp;
            let frameIntervalTime: number = self.frameIntervalTime;
            let currentTime = self.passedTime + advancedTime;
            self.passedTime = currentTime % frameIntervalTime;
            let num: number = currentTime / frameIntervalTime;
            if (num < 1) {
                return false;
            }
            this.render();
            while (num >= 1) {
                num--;
                this.currentFrame++;
                if (this.actDic[this.act]) {
                    this.checkFrameEvent();
                }
            }
            return false;
        }
        /**
         * @description 检测帧事件         */
        private checkFrameEvent(): void {
            if (this.eventDic[this.currentFrame]) {
                let obj: any = this.eventDic[this.currentFrame];
                if (obj.callBack) {
                    obj.callBack.call(obj.thisObject);
                }
            }
        }
        /**
         * @description 渲染*/
        private render(): void {
            if (this.totalFrame > 0) {
                if (this.currentFrame > this.totalFrame) {
                    this.currentFrame = 1;
                    if (this.loopCallBack) {
                        this.loopCallBack.call(this.thisObject);
                    }
                }
                for (let part in this.partDic) {
                    let animalClip: AnimateClip = this.partDic[part];
                    if (animalClip) {
                        animalClip.render(this.currentFrame);
                    }
                }
            }
        }
        /**
         * @description 设置帧频         */
        public set frameRate(value: number) {
            if (value > 60) {
                value = 60;
            }
            this._frameRate = value;
            this.frameIntervalTime = 1000 / (value * this._timeScale);
        }
        /**
         * @description 获取总帧数
         */
        public getTotalFrame(): number {
            return this.totalFrame;
        }
        /**
         * @description 设置timescale
         */
        public set timeScale(value: number) {
            if (value <= 0) {
                value = 1;
            }
            this._timeScale = value;
            this.frameIntervalTime = 1000 / (this._frameRate * value);
        }
        /**
         * @description 获取timescale
         */
        public get timeScale(): number {
            return this._timeScale;
        }
        /**
            * @private
            *
            * @param value
            */
        public setIsStopped(value: boolean) {
            if (this.isStopped == value) {
                return;
            }
            this.isStopped = value;
            if (value) {
                egret.ticker.$stopTick(this.advanceTime, this);
            } else {
                this.lastTime = egret.getTimer();
                egret.ticker.$startTick(this.advanceTime, this);
            }
        }
        /**
         * @description 清除资源
         */
        public clear(): void {
            this.setIsStopped(true);
            this.clearFrameEvent();
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
        /**
         * @description 资源释放         */
        public dispos(isRemoveFromParent: boolean = true): void {
            this.setIsStopped(true);
            this.clearFrameEvent();
            for (let part in this.partDic) {
                this.removePart(parseInt(part + ""));
            }
            if (this.parent && isRemoveFromParent) {
                this.parent.removeChild(this);
            }
        }
    }
}