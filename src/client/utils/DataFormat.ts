/** 
 * 该类主要是用来 同意解析 配置表对应字段，不再在界面里面进行各种重复解析获取值的操作
 */
module wqq {
	export class DataFormat {
		public constructor() {
		}
		/**
		 * 解析  配置表 物品信息
		 * @param itemdata = "itemid_number|itemid_number|itemid_number|itemid_number|..."
		 * */
		public static readItemInfo(itemdata:string):Array<{itemDataId:number,itemNum:number}>{
			let formatdata = [];
			let itemId_num;
			itemdata.split("|").forEach((value,key)=>{
				itemId_num = value.split("_");
				formatdata.push({itemDataId:+itemId_num[0],itemNum:+itemId_num[1]});
			});
			return formatdata;
		}

		/**
		 * 解析  配置表中的 属性格式
		 * @param attrdata = "attr_number|attr_number|attr_number|attr_number|..."
		 */
		public static readAttrInfo(attrdata:string):Array<{attrId:number,attrValue:number}>{
			let formatdata = [];
			let itemId_num;
			if(!attrdata || attrdata == "0") return formatdata;

			attrdata.split("|").forEach((value,key)=>{
				itemId_num = value.split("_");
				formatdata.push({attrId:+itemId_num[0],attrValue:+itemId_num[1]});
			});
			return formatdata;
		}
		/**
		 * @descption 获取attr中某个属性的值
		 */
		public static readAttrValue(attr:string,attrType:number):number{
			let attrList:Array<string>=attr.split("|");
			for(let item of attrList){
				let subItem:number = parseInt(item.split("_")[0]);
				if(subItem==attrType){
					return parseInt(item.split("_")[1])
				}
			}
			return 0;
		}
	}
}