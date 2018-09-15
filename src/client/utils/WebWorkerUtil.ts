module wqq {
	/**
	 * @description 多线程JS的实现,目前做成单例的
	 */
	export class WebWorkerUtil {
		private static instance:WebWorkerUtil;
		private webWorker:Worker;
		public constructor() {
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance():WebWorkerUtil{
			if(WebWorkerUtil.instance ==null){
				WebWorkerUtil.instance = new WebWorkerUtil();
			}
			return WebWorkerUtil.instance;
		}
		/**
		 * @description 启动webworker
		 */
		public startUp(jsUrl:string):void{
			if(!this.webWorker){
				this.webWorker = new Worker(jsUrl);
				this.webWorker.addEventListener("message",this.onReceiveMessage);
			}
		}
		/**
		 * @description 当收到信息
		 */
		private onReceiveMessage(data:any):void{
			
		}
		/**
		 * @description 调用外部线程的方法
		 */
		public invoke():void{

		}
		/**
		 * @description 杀掉worker线程
		 */
		public terminateWorker():void{
			if(this.webWorker){
				this.webWorker.terminate();
			}
		}
	}
}