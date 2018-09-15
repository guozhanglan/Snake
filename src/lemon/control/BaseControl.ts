module lemon {
	/**
	 * @description 和服务器通信的基类,所有的通信类都要继承这个类
	 *
	 */
	export class BaseControl {
		public constructor() {
		}
		/**
		 * @description 发送消息
		 */ 
		public sendCmd(cmd:BaseVo):void{
		    //Rpc.getInstance().sendCmd(cmd);
		}
		/**
		 * @description 发送带回调的消息
		 */ 
        public rpc(eventMsgId:number,cmd: BaseVo,callBack:Function,thisObject:any,timeOutCallBack:Function=null,timeOut:number=null):void{
            //Rpc.getInstance().rpcCMD(eventMsgId,cmd,callBack,thisObject,timeOutCallBack,timeOut);
		}
	}
}
