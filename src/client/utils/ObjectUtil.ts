module wqq {
	export class ObjectUtil {
		public constructor() {
		}
		/**
		 * @des 拷贝一个数据
		 */
		public static clone(sourceData:any):any{
			let cloneData:any={};
			for(let key in sourceData){
				cloneData[key]=sourceData[key];
			}
			return cloneData;
		}
	}
}