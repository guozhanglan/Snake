module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.09
	 * @description 数据配置的基类
	 *
	 */
	export class BaseData {
    	protected  _confId:number;
    	protected  _conf:any;
		public constructor(confId:number,conf:any) {
    		this._confId = confId;
    		this._conf = conf;
		}
		/**
		 * @description 根据key获取对应的值
		 */ 
		public getConfData(key:any):any{
		    if(this._conf){
		        return this._conf[key];
		    }
		    return null;
		}
		/**
		 * @description 获取当前配置id
		 */
		public get confId():number{
			return this._confId;
		}
	}
}
