module lemon {
	/**
	 * @description ResLoaderBlacklist，黑名单管理
	 *
	 */
    export class ResLoaderBlacklist {
    	public static BLACK_MAX : number = 3;

    	private static listDic: any = {};
    	public constructor() {
		}

    	public static setBlacklist(key:string):void
    	{
    		let count:any = ResLoaderBlacklist.listDic[key];
    		count = count?count+1:1;
    		ResLoaderBlacklist.listDic[key] = count;
    	}

    	public static getBlacklist(key:string):boolean
    	{
    		let count:any = ResLoaderBlacklist.listDic[key];
    		if (count && count >= ResLoaderBlacklist.BLACK_MAX){
    			return true;
    		}
    		return false;
    	}
    }
}