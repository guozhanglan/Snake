module lemon {
	/**
	 * @description 服务器协议监听器,需被子类继承
	 */
	export class BaseDtoListener {
		public constructor() {
		}
		/**
		 * @description 添加事件监听
		 */ 
		protected registerDtoLsitener(msgId:number,callBack:Function,thisObject:any):void{
            //Rpc.getInstance().addSocketListener(msgId,callBack,thisObject);
		}
		/**
		 * @description 移除监听
		 */ 
        protected unRegisterDtoListener(msgId: number,callBack: Function,thisObject: any):void{
            //Rpc.getInstance().removeSocketListener(msgId,callBack,thisObject);
		}
		/**
		 * @description 移除所有监听
		 */ 
		public removeAllListener():void{
		    
		}
	}
}
