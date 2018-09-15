module lemon {
    /**
     * @description 序列帧动画基类,所有的序列帧动画都要继承此类
     *
     */
    export class MovieClip extends egret.DisplayObjectContainer {
        protected currentFrame: number;
        protected totalFrame: number;
        private isStopped: boolean;
        private passedTime: number;
        private frameIntervalTime: number;
        private lastTime: number;
        private eventDic: any;                       //事件字典
        private _frameRate: number;                   //帧频
        private playeTimes: number;                  //动画播放次数
        private mainClip: AnimateClip;
        private loopCallBack: Function;
        private thisObject: any;
        private _timeScale: number;
        public constructor() {
            super();
            this.currentFrame = 1;
            this.totalFrame = 0;
            this.isStopped = true;
            this.passedTime = 0;
            this.lastTime = 0;
            this.frameRate = 30;
            this.eventDic = {};
            this._timeScale = 1;
            this.mainClip = new AnimateClip(this.onLoaded, this);
            this.addChild(this.mainClip);
        }
        /**
         * @description 加载素材资源
         */
        public load(path: string, resName: string, loopCallBack: Function, thisObject: any, playeTimes: number = 1): void {
            this.playeTimes = 1;
            this.loopCallBack = loopCallBack;
            this.thisObject = thisObject;
            this.mainClip.load(path, resName);
        }
        /**
         * @description 资源加载完毕,需被子类继承        */
        protected onLoaded(): void {
            this.totalFrame = this.mainClip.totalFrames;
            this.frameRate = this.mainClip.frameRate;
            this.currentFrame = 1;
            this.render();
            this.setIsStopped(false);
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
         * @description 帧频调用         */
        private advanceTime(timeStamp: number): boolean {
             let self = this;
            let advancedTime: number = timeStamp - self.lastTime;
            self.lastTime = timeStamp;
            let frameIntervalTime: number = self.frameIntervalTime;
            let currentTime = self.passedTime + advancedTime;
            self.passedTime = currentTime % frameIntervalTime;
            let num: number = currentTime / frameIntervalTime;
            if(num < 1) {
                return false;
            }
            this.render();
            while(num >= 1) {
                num--;
                this.currentFrame++;
                this.checkFrameEvent();
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
         * @description 清除回调
         */
        public clearCallBack(): void {
            this.loopCallBack = null;
        }
        /**
         * @description 渲染 需被子类继承*/
        protected render(): void {
            if (this.totalFrame > 0) {
                if (this.currentFrame > this.totalFrame) {
                    if (this.loopCallBack) {
                        this.loopCallBack.call(this.thisObject);
                    }
                    this.currentFrame = 1;
                    if (this.playeTimes == 1) {
                        this.setIsStopped(true);
                        return;
                    }
                }
            }
            this.mainClip.render(this.currentFrame);
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
         * @description 设置timescale
         */
        public set timeScale(value: number) {
            if (!isNaN(this.frameRate)) {
                this._timeScale = value;
                this.frameIntervalTime = 1000 / (this._frameRate * value);
            }
        }
        /**
         * @description 获取总帧数
         */
        public get totalFrames(): number {
            return this.totalFrame;
        }
        /**
         * @description 停止在某帧
         */
        public gotoAndStop(frame: number): void {
            this.mainClip.render(frame);
            this.setIsStopped(true);
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
         * @description 清除
         */
        public clear(): void {
            if (this.mainClip) {
                this.mainClip.reset();
            }
        }
        /**
         * @description 资源释放         */
        public dispos(): void {
            if (this.mainClip) {
                this.mainClip.dispos();
            }
            this.setIsStopped(true);
            for (let key in this.eventDic) {
                this.eventDic[key] = null;
                delete this.eventDic[key];
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
    }
}
