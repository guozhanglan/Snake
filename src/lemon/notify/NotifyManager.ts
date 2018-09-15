module lemon {
	/**
	 * @description 消息通知管理器
	 *
	 */
    export class NotifyManager {
        private static typeDic: any = {};
        private static logDic: any = {};
        public constructor() {
        }
		/**
		 * @description 注册一个消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public static registerNotify(type: string, callBack: Function, thisObject: any): void {
            if (!NotifyManager.typeDic[type]) {
                NotifyManager.typeDic[type] = [{ callback: callBack, thisObject: thisObject }];
            } else {
                let typeList: Array<any> = NotifyManager.typeDic[type];
                let result: boolean = false;
                for (let item of typeList) {
                    if (item.callback == callBack && item.thisObject == thisObject) {
                        result = true;
                        break;
                    }
                }
                if (!result) {
                    typeList.push({ callback: callBack, thisObject: thisObject });
                    NotifyManager.typeDic[type] = typeList;
                }
            }
        }
		/**
		 * @description 取消一个注册消息
		 * @param type 消息类型
		 * @param callBack 回调函数
		 * @param thisObject 当前作用域对象
		 */
        public static unRegisterNotify(type: string, callBack: Function, thisObject: any): void {
            if (NotifyManager.typeDic[type]) {
                let typeList: Array<any> = NotifyManager.typeDic[type];
                for (let item of typeList) {
                    if (item.callback == callBack && item.thisObject == thisObject) {
                        let index: number = typeList.indexOf(item);
                        if (index != -1) {
                            typeList.splice(index, 1);
                        }
                        break;
                    }
                }
                NotifyManager.typeDic[type] = typeList;
            }
        }
		/**
		 * @description 发送一个消息通知
		 */
        public static sendNotification(type: string, params: any = null): void {
            if (NotifyManager.typeDic[type]) {
                let typeList: Array<any> = NotifyManager.typeDic[type];
                for (let item of typeList) {
                    if (item.callback) {
                        if (NotifyManager.logDic[type]) {
                            NotifyManager.logDic[type] = NotifyManager.logDic[type] + 1;
                        } else {
                            NotifyManager.logDic[type] = 1;
                        }
                        item.callback.call(item.thisObject, params);
                    }
                }
            }
        }
		/**
		 * @description 移除对应thisObject的所有消息
		 */
        public static removeThisObjectNofity(thisObject: any): void {
            for (let type in NotifyManager.typeDic) {
                let typeList: Array<any> = NotifyManager.typeDic[type];
                for (let i: number = typeList.length - 1; i >= 0; i--) {
                    if (typeList[i].thisObject == thisObject) {
                        typeList.splice(i, 1);
                    }
                }
                NotifyManager.typeDic[type] = typeList;
            }
        }
        /**
         * @description 打印下
         */
        public static test(): void {
            lemon.LogUtil.warn(NotifyManager.logDic);
        }
    }
}
