module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.12
	 * @description 子弹基类,默认所有子弹都是向上的，然后方向基于这个朝向来旋转
	 *
	 */
	export class BaseBullet extends egret.DisplayObjectContainer{
        protected currentFrame: number;
        protected totalFrame: number;
        private isStopped: boolean;
        private passedTime: number;
        private frameIntervalTime: number;
        private lastTime: number;
        private _frameRate: number;                  //帧频
        private mainClip: lemon.AnimateClip;
		public constructor() {
    		super();
            this.currentFrame = 1;
            this.totalFrame = 0;
            this.isStopped = true;
            this.passedTime = 0;
            this.lastTime = 0;
            this.frameRate = 30;
            this.mainClip = new lemon.AnimateClip(this.onLoaded,this);
		}
		/**
		 * @description 播放特效
		 * @param bulletRes 子弹资源
		 */
        public play(bulletId:number,bulletRes: string): void {
            this.currentFrame = 1;
            this.totalFrame = 0;
            this.mainClip.load(SystemPath.rolePath + bulletId+"/",bulletRes);
            this.addChild(this.mainClip);
        }
		/**
         * @description 资源加载完毕,需被子类继承        */
        protected onLoaded(): void {
            this.totalFrame = this.mainClip.totalFrames;
            this.frameRate = this.mainClip.frameRate;
            this.currentFrame = 1;
            if(this.totalFrame==1){
                this.mainClip.render(1);
                this.setIsStopped(true);
            }else{
                this.setIsStopped(false);
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
            }
            return false;
        }
         /**
         * @description 渲染 需被子类继承*/
        protected render(): void {
            if(this.totalFrame > 0) {
                if(this.currentFrame > this.totalFrame) {
                    this.currentFrame = 1;
                }
                this.mainClip.render(this.currentFrame);
            }
        }
         /**
         * @description 设置帧频         */ 
        public set frameRate(value: number) {
            if(value > 60) {
                value = 60;
            }
            this._frameRate=value;
            this.frameIntervalTime = 1000 / value;
        }
        /**
         * @description 设置timescale
         */ 
        public set timeScale(value:number){
            if(!isNaN(this.frameRate)){
                this.frameIntervalTime = 1000 / this._frameRate*value;
            }
        }
		/**
            * @private
            *
            * @param value
            */
        public setIsStopped(value: boolean) {
            if(this.isStopped == value) {
                return;
            }
            this.isStopped = value;
            if(value) {
                egret.ticker.$stopTick(this.advanceTime,this);
            } else {
                this.lastTime = egret.getTimer();
                egret.ticker.$startTick(this.advanceTime,this);
            }
        }
        /**
         * @description 资源释放 千万不要直接调用        */
        public dispos(): void {
            if(this.mainClip) {
                this.mainClip.dispos();
            }
            this.setIsStopped(true);
            if(this.parent) {
                this.parent.removeChild(this);
            }
        }
	}
}
