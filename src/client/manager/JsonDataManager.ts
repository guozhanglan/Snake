module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.09
	 * @description json数据配置管理器
	 *
	 */
	export class JsonDataManager {
		private static instance: JsonDataManager;
		private jsonDic: any;
		private zip:JSZip;
		public constructor() {
			this.jsonDic = {};
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): JsonDataManager {
			if (JsonDataManager.instance == null) {
				JsonDataManager.instance = new JsonDataManager();
			}
			return JsonDataManager.instance;
		}
		/**
		 * @description 解析配置,只解析必须的
		 */
		public parseConfig(name: string): void {
			this.zip = new JSZip(RES.getRes(name));
			SingleModel.getInstance().initAllModel();
		}
		
		/**
		 * @description 解析配置,只解析必须的
		 */
		public loadConfig(): void {
			this.loadSingleJSON(JsonDataName.CFG_AIS);
			this.loadSingleJSON(JsonDataName.CFG_i18);
			this.loadSingleJSON(JsonDataName.CFG_RNAME);
			this.loadSingleJSON(JsonDataName.CFG_SKINS);
		}

		/**
		 * @description 解析对应的单个配置
		 */
		private parseSingleConfig(jsonName: string): void {
			lemon.LogUtil.warn(jsonName);
			if (!this.zip)return;
			let data:any = this.zip.file(jsonName+".pcc").asArrayBuffer();
			let plain: Uint8Array = new Uint8Array(data);
			let inflate = new Zlib.Inflate(plain);
			let deplain: Uint8Array = inflate.decompress();
			let byte: egret.ByteArray = new egret.ByteArray(deplain.buffer);
			var content: string = byte.readUTFBytes(byte.bytesAvailable);
			this.jsonDic[jsonName] = JSON.parse(content);
		}
		/**
		 * @description 加载单个配置文件
		 */
		public loadSingleConfig(jsonName: string, callBack: Function, thisObject: any): void {
			let fileName: string = jsonName + ".json";
			console.log(fileName);
			lemon.ResLoader.getInstance().loadItem(SystemPath.config + fileName, function (data: any) {
				this.jsonDic[jsonName] = data;
				if (callBack) {
					callBack.call(thisObject);
				}
			}, this, "json");
		}
		/**
		 * @description 加载单个配置文件
		 */
		public loadSingleJSON(jsonName: string): void {
			let fileName: string = jsonName + "_json";
			console.log("loadJsonConfig:"+fileName);
			this.jsonDic[jsonName] = RES.getRes(fileName);
		}
		/**
		 * @description 根据Id获取当前行数对象
		 */
		public getConf(jsonName: string, confId: number): any {
			let conf: any;
			if(!this.jsonDic[jsonName]){
				this.parseSingleConfig(jsonName);
			}
			conf = this.jsonDic[jsonName];
			if (conf) {
				for (let index in conf.items) {
					let confObj = conf.items[index];
					if (confObj["id"] == confId) {
						return confObj;
					}
				}
			}
			return null;
		}
		
		/**
		 * @description 根据配置名，获取当前配置的所有数据
		 */
		public getRows(jsonName: string): Array<any> {
			let tab: Array<any> = [];
			if(!this.jsonDic[jsonName]){
				this.parseSingleConfig(jsonName);
			}
			let conf: any = this.jsonDic[jsonName];
			if (conf) {
				for (let index in conf.items) {
					tab.push(conf.items[index]);
				}
			}
			return tab;
		}
		/**
		 * @description 根据配置名 value
		 */
		public getRow(jsonName: string, value: any): any {
			if(!this.jsonDic[jsonName]){
				this.parseSingleConfig(jsonName);
			}
			let conf: any = this.jsonDic[jsonName];
			if (conf) {
				for (let index in conf) {
					let confObj = conf.items[index];
					if (confObj["id"] == value) {
						return confObj;
					}
				}
			}
			return null;
		}

		/**
		 * @description 根据配置名 value
		 */
		public getJSONData(jsonName: string): any {
			if(!this.jsonDic[jsonName]){
				this.parseSingleConfig(jsonName);
			}
			let conf: any = this.jsonDic[jsonName];
			if (conf) {
				return conf;
			}
			return null;
		}
	}
}
