module lemon {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.28
	 * @description 各个部位对应的资源加载地址
	 *
	 */
	export class ActorPartResourceDic {
        private static instance:ActorPartResourceDic;
        /** 客户端对应该处理类 */
        public static PartPathClass:string = "qmr.SystemPath";
        public static PartResPre:boolean = false;
        public static PartRes32Png:boolean = true;
        
        public partDic:any = {};
		public constructor() {
			/*let systemPathClass:any = egret.getDefinitionByName(ActorPartResourceDic.PartPathClass);
    		
    		this.partDic[ActorPart.WEAPON]= systemPathClass.weaponPath;
            this.partDic[ActorPart.WING] = systemPathClass.wingPath;
            this.partDic[ActorPart.HORSE] = systemPathClass.horsePath;
            this.partDic[ActorPart.HORSE_UP] = systemPathClass.horsePath;
			this.partDic[ActorPart.SHIELD] = systemPathClass.shieldPath;*/
		}
		/**
		 * @description 获取单例
		 */ 
		public static getInstance():ActorPartResourceDic{
            if(ActorPartResourceDic.instance==null){
                ActorPartResourceDic.instance = new ActorPartResourceDic();
            }
            return ActorPartResourceDic.instance;
		}
	}
}
