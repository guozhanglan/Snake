module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2017.06.28
	 * @desc 多语言管理器,包括语言转换和图片资源的转换
	 *
	 */
	export class LanaguageManager{
    	private static instance:LanaguageManager;
        private language:any;        //多语言配置
        private _locale:string;        //当前语言类型
        private callBack:Function;
        private thisObject:any;
		public constructor() {
    		this._locale=LanguageType.ZH_CN;
		}
		/**
		 * @description 获取单例对象
		 */ 
		public static getInstance():LanaguageManager{
		    if(LanaguageManager.instance==null){
		        LanaguageManager.instance = new LanaguageManager();
		    }
		    return LanaguageManager.instance;
		}
		/**
		 * 设置多语言类型
		 */ 
		public set locale(value:string){
		    this._locale = value;
		}
		/**
		 * 获取多语言类型
		 */ 
		public get locale():string{
		    return this._locale;
		}
		/**
		 * 加载多语言文字
		 */ 
		public loadLanguageConfig(callBack:Function,thisObject:any):void{
		    this.callBack = callBack;
		    this.thisObject = thisObject;
		    lemon.ResLoader.getInstance().loadItem(SystemPath.config+this._locale+".pcc",this.onConfigLoaded,this,RES.ResourceItem.TYPE_BIN);
		}
		/**
		 * @description 加载多语言图集
		 */ 
        public loadLanaguageSheet(callBack: Function,thisObject: any):void{
            this.callBack = callBack;
            this.thisObject = thisObject;
            lemon.ResLoader.getInstance().loadItem(SystemPath.language+this._locale+"/language.json",callBack,thisObject,RES.ResourceItem.TYPE_SHEET);
		}
		/**
		 * 配置文件价值完毕
		 */ 
        private onConfigLoaded(data:any):void{
            this.language = data;
            if(this.callBack!=null){
                this.callBack.call(this.thisObject);
            }
        }
        /**
         * @description 翻译字符串 ,会自动根据当前语言类型翻译
         */ 
        public translate(sBeforeTra:string):string{
            var sTranslated: string = "";
            if(!sBeforeTra || sBeforeTra == "") {
                return sBeforeTra;
            }
            for(var key in this.language) {
                if(key == sBeforeTra) {
                    sTranslated = this.language[key];
                    break;
                }
            }
            if(sTranslated.length==0){
                sTranslated = sBeforeTra;
            }
            if(sTranslated==null){
                sTranslated="";
            }
            return sTranslated;
        }

        public GetPriceMonthFormat(price:number):string 
        {
            return "¥" + price + "/月";
        }

        public GetPriceDayFormat(price:number):string 
        {
            return "¥" + price + "/天";
        }

        public GetPriceTimesFormat(price:number):string 
        {
            return "¥" + price + "/次";
        }


        public GetMoneyFormat(price:number):string 
        {
            return "¥" + price;
        }
        
        public GetRoomVisitorFormat(visitor:number):string 
        {
            return "入住过的客人数:" + visitor + "人";
        }
        
        public GetRoomMendFormat(mend:number):string 
        {
            return "房间维护:" + this.GetPriceMonthFormat(mend);
        }
        
        public GetRoomServiceFormat(service:number):string 
        {
            return "房间价格:" + this.GetPriceDayFormat(service);
        }
        
        public GetOtherServiceFormat(service:number):string 
        {
            return "服务价格:" + this.GetPriceTimesFormat(service);
        }
        
        public GetMonthServiceFormat(service:number):string 
        {
            return "上月收入:" + this.GetMoneyFormat(service);
        }
        
        public GetMonthRateFormat(service:number):string 
        {
            return "上月使用频率:" + service + "%";
        }

        public GetSeasonTitle(year:number, month:number):string 
        {
            return year + "年"+ month +"月份财务报表";
        }

		public GetSeasonTableTitles():Array<any> 
        {
            return ["所有员工薪水","所有房间维护费","贷款偿还","所有房间收入","所有服务收入"];
        }
        
        public getLoansMoneyFormat(money:number):string 
        {
            return "贷款额度："+ this.GetMoneyFormat(money);
        }
        
        public getLoansTitleFormat():string 
        {
            return "观看广告获得贷款额度哦";
        }
	}
}
