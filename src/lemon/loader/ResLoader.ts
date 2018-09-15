module lemon {
	/**
	 * @description loader加载器，包含了版本管理
	 *
	 */
    export class ResLoader {
        private static instance: ResLoader;
        private versionJson: any;                //版本管理配置json
        private versionCache: any;                //版本缓存
        private groupDic: any;
        private queueDic: any;
        public static currentProgress: number = 0;       //当前进度
        public static maxProgress: number = 100;         //最大进度
        private tid: number;
        public vitureLoadCallBack: Function;
        public vitureThisObject: any;
        public waitCount: number = 0;
        public constructor() {
            this.versionJson = {};
            this.versionCache = {};
            this.groupDic = {};
            this.queueDic = {};
            RES.setMaxLoadingThread(2);
            RES.setMaxRetryTimes(1);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceILoadError, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
		/**
		 * @description 获取单例对象
		 */
        public static getInstance(): ResLoader {
            if (ResLoader.instance == null) {
                ResLoader.instance = new ResLoader();
            }
            return ResLoader.instance;
        }
        /**
         * @description 虚拟loading进度条
         */
        public showVitureLoading(tips: string): void {
            window["Gametext"](tips);
            if (!this.tid) {
                this.tid = setInterval(this.showAutoLoading, 20)
            }
            this.waitCount=0;
            this.showAutoLoading();
        }
        /**
         * @description 关闭进度条
         */
        public closeTimeWait(): void {
            if (this.tid) {
                clearInterval(this.tid);
                this.tid = null;
            }
        }
        /**
         * @description 虚拟loading进度条
         */
        private showAutoLoading(): void {
            let self:ResLoader = ResLoader.getInstance();
            if (ResLoader.currentProgress < ResLoader.maxProgress) {
                ResLoader.currentProgress++;
            } else {
                ResLoader.currentProgress = 1;
                if (self.vitureLoadCallBack) {
                    self.vitureLoadCallBack.call(self.vitureThisObject);
                }
                self.unregisterVitureCallBack();
                if (self.waitCount >= 8) {
                    window["showRenewText"]();
                }
                self.waitCount++;
            }
            window["GameProgress"](ResLoader.currentProgress, ResLoader.maxProgress);
        }
        /**
         * @description 注册虚拟加载回调
         */
        public registerVitureCallBack(callBack: Function, thisObject: any): void {
            this.vitureLoadCallBack = callBack;
            this.vitureThisObject = thisObject;
        }
        /**
         * @description 取消注册虚拟加载回调
         */
        public unregisterVitureCallBack(): void {
            this.vitureLoadCallBack = null;
            this.vitureThisObject = null;
        }
		/**
         * @description 当资源加载完毕
         */
        private onResourceLoadComplete(evt: RES.ResourceEvent): void {
            for (let groupName in this.groupDic) {
                if (groupName == evt.groupName) {
                    let groupLoader: GroupLoader = this.groupDic[groupName];
                    if (groupLoader && groupLoader.callback) {
                        groupLoader.callback.call(groupLoader.thisObject, evt);
                    }
                    delete this.groupDic[groupName];
                }
            }
        }
        /**
         * @description 资源加载进度
         */
        private onResourceProgress(evt: RES.ResourceEvent): void {
            for (let groupName in this.groupDic) {
                if (groupName == evt.groupName) {
                    let groupLoader: GroupLoader = this.groupDic[groupName];
                    if (groupLoader && groupLoader.progressCallBack) {
                        groupLoader.progressCallBack.call(groupLoader.thisObject, evt);
                    }
                }
            }
        }
        /**
         * @description 资源加载出错
         */
        private onResourceILoadError(evt: RES.ResourceEvent): void {
            for (let groupName in this.groupDic) {
                if (groupName == evt.groupName) {
                    let groupLoader: GroupLoader = this.groupDic[groupName];
                    if (groupLoader && groupLoader.failCallBack) {
                        groupLoader.failCallBack.call(groupLoader.thisObject, evt);
                    }
                    delete this.groupDic[groupName];
                }
            }
        }

        /**
         * 资源组加载出错 加入黑名单
         *  The resource group loading failed
         */
        private onItemLoadError(event: RES.ResourceEvent): void {
            ResLoaderBlacklist.setBlacklist(event.resItem.url);
        }

		/**
		 * @description 加载版本号文件
		 */
        public loadVersionConfig(url: string, callBack: Function, thisObject: any): void {
            if (url.indexOf("?") == -1) {
                url = url + "?" + lemon.GlobalConfig.configVersion;
            }
            let self: ResLoader = this;
            RES.getResByUrl(url, function (data: any) {
                self.versionJson = data.files;
                if (callBack) {
                    callBack.call(thisObject);
                }
            }, this, RES.ResourceItem.TYPE_JSON);
        }

        public getVersionUrl(url:string):string{
            if (url in this.versionCache){
                return this.versionCache[url];
            }
            let version:any = this.versionJson[url];
            if (version) {
                this.versionCache[url] = url + "?" + version;
                url = url + "?" + version;
            }
            return url;
        }

		/**
		 * @description 加载资源配置文件
		 */
        public loadConfig(url: string, callBack: Function, thisObject: any): void {
            let self: ResLoader = this;
            let listener:any = null;
            url = this.getVersionUrl(url);
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, listener = function (evt: RES.ResourceEvent) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,listener,self);
                if (evt && callBack) {
                    callBack.call(thisObject);
                }
            }, this);
            RES.loadConfig(url, "resource/");
        }
		/**
		 * @description 加载资源组
		 */
        public loadGroup(groupName: string, callback: Function, progressCallBack: Function, failCallBack: Function, thisObject: any, priority: number = 1): void {
            if (RES.isGroupLoaded(groupName)) {
                if (callback) {
                    callback.call(thisObject);
                }
            } else {
                let groupLoader: GroupLoader = new GroupLoader(groupName, callback, progressCallBack, failCallBack, thisObject, priority);
                this.groupDic[groupLoader.groupName] = groupLoader;
                RES.loadGroup(groupName);
            }
        }

		/**
		 * @description 加载其它资源
         * @return 是否进入黑名单
		 */
        public loadItem(url: string, callBack: Function, thisObject: any, type: string): boolean {
            url = this.getVersionUrl(url);
            if (ResLoaderBlacklist.getBlacklist(url)){
                return true;
            }
            else{
                RES.getResByUrl(url, callBack, thisObject, type);
                return false;
            }
        }

        /**
         * @description 顺序加载资源
         */
        private isLoading: boolean = false;
        private allLoading: boolean = false;
        public loadItemQueue(url: string, callback: Function, thisObject: any, type: string): void {
            if (!!RES.getRes(url)) {
                if (callback) {
                    callback.call(thisObject, RES.getRes(url));
                }
                return;
            }
            url = this.getVersionUrl(url);
            this.queueDic[url] = { callback: callback, thisObject: thisObject, type: type };
            if (this.allLoading && !this.isLoading) {
                this.loadQueueProgress();
            }
        }
        public loadQueueProgress(): void {
            this.allLoading = true;
            this.isLoading = true;
            let currentUrl: string = "";
            for (let url in this.queueDic) {
                this.allLoading = false;
                currentUrl = url;
                break;
            }
            if (this.allLoading) {
                this.isLoading = false;
                return;
            };
            RES.getResByUrl(currentUrl, () => {
                this.queueDic[currentUrl].callback.call(this.queueDic[currentUrl].thisObject);
                delete this.queueDic[currentUrl];
                this.loadQueueProgress();
            }, this.queueDic[currentUrl].thisObject, this.queueDic[currentUrl].type)
        }

		/**
		 * @description 销毁资源
		 */
        public destoryRes(res: any): void {
            RES.destroyRes(res, true);
        }
    }
	/**
	 * @description 组加载器
	 */
    class GroupLoader {
        private _groupName: string;
        private _priority: number;
        public callback: Function;
        public progressCallBack: Function;
        public failCallBack: Function;
        public thisObject: any;
        public constructor(groupName: string, callback: Function, progressCallBack: Function, failCallBack: Function, thisObject: any, priority: number) {
            this._groupName = groupName;
            this._priority = priority;
            this.callback = callback;
            this.progressCallBack = progressCallBack;
            this.failCallBack = failCallBack;
            this.thisObject = thisObject;
        }
        /**
         * @description 获取组名
         */
        public get groupName(): string {
            return this._groupName;
        }
    }
}
