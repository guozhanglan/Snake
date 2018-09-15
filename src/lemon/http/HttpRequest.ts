module lemon {
	/**
	 * @description 做一些Http请求封装类
	 *
	 */
	export class HttpRequest {
		/**
		 * @description 发送post请求
		 */ 
        public static sendPost(url:string,args: any,callback: Function,thisObject: any):void{
            let requestData: string = "";
            let index:number=0;
            for(let key in args){
                if(index==0){
                    requestData+=key+"="+args[key];
                }else{
                    requestData += "&"+key + "=" + args[key];
                }
                index++;
            }
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url,egret.HttpMethod.POST);
            request.send(requestData);
            request.addEventListener(egret.Event.COMPLETE,function(evt: egret.Event) {
                if(callback){
                    callback.call(request.response);
                }
            },this)
		}
		/**
		 * @description 发送GET请求
		 */ 
        public static sendGet(url: string,callback: Function,thisObject: any):void{
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url,egret.HttpMethod.GET);
            request.send(null);
            request.addEventListener(egret.Event.COMPLETE,function(evt: egret.Event) {
                if(callback) {
                    callback.call(request.response);
                }
            },this)
		}
	}
}
