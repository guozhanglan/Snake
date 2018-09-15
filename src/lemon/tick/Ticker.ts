module lemon {
	/**
	 * @description 一个自定义的tick封装类
	 *
	 */
    export class Ticker {
        private static instance: Ticker;
        private eventList: Array<TickParams>;
        private _running: boolean;
        public constructor() {
            this.eventList = [];
            this._running = false;
            this.start();
        }
		/**
		 * @description 获取单例
		 */
        public static getInstance(): Ticker {
            if (this.instance == null) {
                this.instance = new Ticker();
            }
            return this.instance;
        }
		/**
		 * @description 开始运转
		 */
        public start(): void {
            if (this._running)
                return;
            for (let tick of this.eventList) {
                if (tick) {
                    tick.lastCount = tick.updateInterval;
                    tick.lastTimeStamp = egret.getTimer();
                }
            }
            egret.ticker.$startTick(this.update, this);
            this._running = true;
        }
		/**
         * @private
         * Ticker以60FPS频率刷新此方法
         */
        private update(timeStamp: number): boolean {
            for(let tick of this.eventList) {
                if(tick){
                    let deltaTime = timeStamp - tick.lastTimeStamp;
                    if(deltaTime >= tick.delay) {
                        let num:number = Math.floor(deltaTime/tick.delay);
                        if(num>4){
                            num=4;
                        }
                        while(num>0){
                            num--;
                            tick.currentCount++;
                            let complete = (tick.repeatCount > 0 && tick.currentCount >= tick.repeatCount);
                            if(complete) {
                                if(tick.callBack) {
                                    tick.callBack.call(tick.thisObject);
                                }
                                let index: number = this.eventList.indexOf(tick);
                                if(index != -1) {
                                    this.eventList.splice(index,1);
                                }
                            }
                            if(tick.repeatCount == 0) {
                                if(tick.callBack) {
                                    tick.callBack.call(tick.thisObject);
                                }
                            }
                        }
                        tick.lastTimeStamp = timeStamp;
                        tick.lastCount = tick.updateInterval;
                    }
                    else {
                        tick.lastCount -= 1000;
                        if(tick.lastCount > 0) {
                            continue;
                        }
                        tick.lastCount += tick.updateInterval;
                        tick.lastTimeStamp = timeStamp;
                        tick.currentCount++;
                        let complete = (tick.repeatCount > 0 && tick.currentCount >= tick.repeatCount);
                        if(complete) {
                            if(tick.callBack) {
                                tick.callBack.call(tick.thisObject);
                            }
                            let index: number = this.eventList.indexOf(tick);
                            if(index != -1) {
                                this.eventList.splice(index,1);
                            }
                        }
                        if(tick.repeatCount == 0) {
                            if(tick.callBack) {
                                tick.callBack.call(tick.thisObject);
                            }
                        }
                    }
                }
            }
            return false;
        }
        /**
         * @description 停止
         */
        public stop(): void {
            if (!this._running)
                return;
            egret.ticker.$stopTick(this.update, this);
            this._running = false;
        }
		/**
		 * @description 获取是否正在运转
		 */
        public get running(): boolean {
            return this._running;
        }
        /**
         * @description 注册tick
         */
        public registerTick(callback: Function, thisObject: any, delay: number = 1000, repeatCount: number = 0): void {
            let result: boolean = true;
            for (let tick of this.eventList) {
                if (tick.callBack == callback && tick.thisObject == thisObject) {
                    tick.update(delay, repeatCount);
                    result = false;
                    break;
                }
            }
            if (result) {
                let tickParam: TickParams = new TickParams(delay, repeatCount);
                tickParam.callBack = callback;
                tickParam.thisObject = thisObject;
                this.eventList.push(tickParam);
            }
        }
        /**
         * @description 取消tick
         */
        public unRegisterTick(callback: Function, thisObject: any): void {
            for (let tick of this.eventList) {
                if (tick.callBack == callback && tick.thisObject == thisObject) {
                    let index: number = this.eventList.indexOf(tick);
                    if (index != -1) {
                        this.eventList.splice(index, 1);
                    }
                    break;
                }
            }
        }
    }
	/**
	* @description 具体的tickparams
	*/
    class TickParams {
        public callBack: Function;
        public thisObject: any;
        public updateInterval: number;
        public lastCount: number;
        public lastTimeStamp: number = 0;
        public currentCount: number = 0;
        private _delay: number;
        private _repeatCount: number;
        public constructor(delay: number, repeatCount: number = 0) {
            this.update(delay, repeatCount);
        }
        /**
         * @description 更新delay和repeatCount
         */
        public update(delay: number, repeatCount: number = 0): void {
            this.currentCount = 0;
            if (delay < 1) {
                delay = 1;
            }
            if (this._delay == delay) {
                return;
            }
            this._delay = delay;
            this.lastCount = this.updateInterval = Math.round(60 * delay);
            this.lastTimeStamp = egret.getTimer();
            this._repeatCount = +repeatCount | 0;
        }
        /**
         * @description 获取延时
         */
        public get delay(): number {
            return this._delay;
        }
        /**
         * @description 获取repeatCount
         */
        public get repeatCount(): number {
            return this._repeatCount;
        }
    }
}
