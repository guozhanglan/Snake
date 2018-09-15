module wqq {
	export class AIConfigInfo extends BaseData {
		public SkinIDs:Array<number> = [];
		public AHeadDist:number;
		public AvoidRadius:number;
		public Agressive:number;
		public Agile:number;
		public FindBeanDist:number;
		public DesperateFactor:number;
		public EatBeanFactor:number;
		public MinThinkInterval:number;
		public MaxThinkInterval:number;
		public MinWanderInterval:number;
		public MaxWanderInterval:number;

		public constructor(confId:number,conf:any) {
			super(confId, conf);
			let attrs:Array<string> = conf.split(",");
			let str:string = attrs[0];
			let skins = str.split("|");
			for(let i = 0 ; i < skins.length; i++){
				this.SkinIDs.push(parseInt(skins[i]));
			}
			this.AHeadDist = parseFloat(attrs[1]);
			this.AvoidRadius = parseFloat(attrs[2]);
			this.Agressive = parseFloat(attrs[3]);
			this.Agile = parseFloat(attrs[4]);
			this.FindBeanDist = parseFloat(attrs[5]);
			this.DesperateFactor = parseFloat(attrs[6]);
			this.EatBeanFactor = parseFloat(attrs[7]);
			this.MinThinkInterval = parseFloat(attrs[8]);
			this.MaxThinkInterval = parseFloat(attrs[9]);
			this.MinWanderInterval = parseFloat(attrs[10]);
			this.MaxWanderInterval = parseFloat(attrs[11]);
		}
	}
	export class SkinInfo extends BaseData {
		public name:string;
		public touPath:string;
		public tailPath:string;
		public bodyPath:string;

		public constructor(confId:number,conf:any) {
			super(confId, conf);
			let attrs:Array<string> = conf.split(",");
			this.name = attrs[0];
			this.touPath = attrs[1];
			this.tailPath = attrs[2];
			this.bodyPath = attrs[3];			
		}
	}
	export class LocalResources {
		private static m_Instance:LocalResources = null;
		public static getInstance():LocalResources
		{
			if (LocalResources.m_Instance == null) {
				LocalResources.m_Instance = new LocalResources();
			}
			return LocalResources.m_Instance;
		}
		private m_AiConfigs:Array<AIConfigInfo> = [];
		private m_Skins:Array<SkinInfo> = [];
		private m_Names:Array<string> = [];
		public constructor() {
		}

		public initCfg(){
			this.initAiConfigData();
			this.initRandomNameData();
			this.initSkinData();
		}

		public initAiConfigData(){
			let aiconf = JsonDataManager.getInstance().getJSONData(JsonDataName.CFG_AIS);
			if (aiconf){
				for (let i in aiconf.items){
					let item = aiconf.items[i];
					this.m_AiConfigs.push(new AIConfigInfo(item.id, item.data));
				}
			}
		}

		public initRandomNameData(){
			let aiconf = JsonDataManager.getInstance().getJSONData(JsonDataName.CFG_RNAME);
			if (aiconf){
				let item = aiconf.items[0];
				this.m_Names = item.cn.split("|");
			}
		}

		public initSkinData(){
			let skinsConf = JsonDataManager.getInstance().getJSONData(JsonDataName.CFG_SKINS);
			if (skinsConf){
				for(let i in skinsConf.items){
					let item = skinsConf.items[i];
					this.m_Skins.push(new SkinInfo(item.id, item.data));
				}
			}
		}

		public getAIConfigList():Array<AIConfigInfo>{
			return this.m_AiConfigs;
		}
		
		public getNameList():Array<string>{
			return this.m_Names;
		}
	}
}