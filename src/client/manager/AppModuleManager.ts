module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.05
	 * @description 模块管理器
	 *
	 */
    export class AppModuleManager {
        private static moduleDic: any = {};
        /** 记录全屏界面开启顺序 */
        //记录当前 在LayerConst.UI_LAYER 打开的界面，LayerConst.UI_LAYER中每一次 只会存在一个唯一的BaseApp
        public static preUIModule: BaseApp;
        public static currentUIModule: BaseApp;
        public static needReturn: boolean = false;
        //新手指引界面是否打开
        public static isGuiding: boolean = false;
        public static guideView: BaseApp;
    	/**
    	 * @description 根据模块名打开一个模块
    	 * @param moudleName 模块名，包含命名空间 比如wqq.app.RoleModule
    	 * @param data 打开模块是传递的数据 {
         *      isGuiding?:boolean, 指引界面，只能从主界面的新手任务打开，需要加上特定标记
         *      type?:number,  打开第几个子界面
         *      index?:number, 打开子界面的 某个次级界面
         *      。。。
         * }
    	 * @param layer 模块所处层级
    	 * @param needReturn 是否需要返回上一个全屏界面
    	 */
        public static openModule(moudleName: string, data: any = null, needReturn: boolean = false, needCenter: boolean = false, layer: number = LayerConst.UI_LAYER): any {
            
            /*if (moudleName != ModuleNameConst.LOGIN_MODULE && moudleName != ModuleNameConst.ServerListSelect_Module) {
                SoundManager.getInstance().loadAndPlayEffect(EffectMusicConst.MODULE_OPEN);
            }*/
            let egretTextarea = document.getElementById("egretTextarea");
            let egretInput = document.getElementById("egretInput");
            if (egretTextarea) egretTextarea.blur();
            if (egretInput) egretInput.blur();

            let baseModule: BaseApp = AppModuleManager.moduleDic[moudleName];
            if (baseModule) {
                if (!baseModule.isShow) {
                    this.setReturnInfo(layer, needReturn, baseModule);
                    baseModule.openModule(false, data, layer, needCenter);
                } else {
                    if (needReturn) {
                        this.setReturnInfo(layer, needReturn, baseModule);
                    }
                    baseModule.openModule(false, data, layer, needCenter);
                }
            } else {
                baseModule = eval("new " + moudleName);
                this.setReturnInfo(layer, needReturn, baseModule);
                AppModuleManager.moduleDic[moudleName] = baseModule;
                baseModule.openModule(true, data, layer, needCenter);
                /* if (baseModule.resName) {
                     GameLoading.getInstance().setProgress(0, 1);
                     lemon.ResLoader.getInstance().loadGroup(baseModule.resName, function () {
                         GameLoading.getInstance().close();
                         baseModule.openModule(true, data, layer);
                     }, function (evt: RES.ResourceEvent) {
                         GameLoading.getInstance().setProgress(evt.itemsLoaded, evt.itemsTotal);
                     }, function () {
                         lemon.LogUtil.warn("资源组 " + baseModule.resName + "加载失败");
                         GameLoading.getInstance().close();
                     }, this, 100);
                 } else {
                     baseModule.openModule(true, data, layer);
                 }*/
            }
            return baseModule;
        }
        /** 弹窗确认界面 */
        public static openConfirmView(data: { desc: string, desc1?: string, cancelDesc?: string, cancelCallBak?: Function, confirmDesc?: string, confirmCallBack?: Function, callTarget?: any }): void {
            //this.openModule(ModuleNameConst.CONFIRM_MODULE, data, LayerConst.POP_LAYER);
        }
       
        /**
         * 设置返回界面信息
         */
        private static setReturnInfo(layer: number, needReturn: boolean, baseModule: any): void {
            if (layer == LayerConst.UI_LAYER) {
                let current:any = this.currentUIModule;
                if (needReturn) {
                    this.preUIModule = current;
                } else {
                    this.preUIModule = null;
                }
                if (current && !current.isEvery) {
                    current.dispos();
                }
                this.needReturn = needReturn;
                this.currentUIModule = baseModule;
            }
        }
        /**
         * 关闭当前UIlayer对象
         */
        public static closeCurrentModule(): void {
            if (this.currentUIModule) {
                this.currentUIModule.dispos();
                this.currentUIModule = null;
            }

            this.returnPreModule();
        }
        /**
         * 返回到上一个全屏界面
         */
        public static returnPreModule(data?: any): void {
            if (this.needReturn && this.preUIModule) {
                for (var moduleName in this.moduleDic) {
                    if (this.moduleDic[moduleName] == this.preUIModule) {
                        this.openModule(moduleName, data);
                        this.needReturn = false;
                        
                        this.preUIModule = null;
                        break;
                    }
                }
            } else {
                
            }
        }
        /**
         * @ param baseModule BaseApp对象
         */
        public static closeModuleBytarget(baseModule: BaseApp): void {
            baseModule.dispos();
        }
    	/**
    	 * @description 关闭一个模块
    	 */
        public static closeModule(moduleName: string): void {
            let baseModule: BaseApp = AppModuleManager.moduleDic[moduleName];
            if (baseModule) {
                baseModule.dispos();
            }
        }
    	/**
    	 * @description 检测模块是否打开
    	 */
        public static isModuleOpen(moduleName: string): boolean {
            let baseModule: BaseApp = AppModuleManager.moduleDic[moduleName];
            if (baseModule) {
                return baseModule.isShow;
            }
            return false;
        }
        /**
		 * @description 获取模块中某个控件在舞台中的位置
		 */
        public static getComponentGlobalPoint(moduleName: string, componentName: string): any {
            let baseModule: BaseApp = AppModuleManager.moduleDic[moduleName];
            if (baseModule) {
                return baseModule.getComponentGlobalPoint(componentName);
            }
            return { x: 0, y: 0 };
        }
        /** 
         * 获得某一个模块
         */
        public static getModule(moduleName: string): any {
            return this.moduleDic[moduleName];
        }
        /**
         * @description 根据模块名删除一个模块引用
         */
        public static deleteModule(moduleName: string): void {
            AppModuleManager.moduleDic[moduleName] = null;
            delete AppModuleManager.moduleDic[moduleName];
        }
        
        /**
         * @description 调整所有模块的尺寸
         */
        public static resize(): void {
            for (let moduleName in this.moduleDic) {
                let baseModule: BaseApp = this.moduleDic[moduleName];
                if (egret.Capabilities.isMobile) {
                    baseModule.width = lemon.StageUtil.stageWidth;
                } else {
                    baseModule.height = lemon.StageUtil.stageHeight;
                    baseModule.width = lemon.StageUtil.stageWidth;
                }
            }
        }
    }
}
