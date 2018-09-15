module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2017.02.06
	 * @description 数学转换类
	 */
	export class MathChangeUtil {
		public constructor() {
		}
		/**
		 * @description 阿拉伯数字转中文
		 */
		public static getChineseNum(cnum: number): string {
			let numArray = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];
			return numArray[cnum - 1];
		}
		/**
		 *  < 100000   2小数
		 * 	< 1000000  1小数
		 * 	< 100000000 0小数
		 *  < 1000000000 2小数
		 *  < 10000000000 1小数
		 */
		public static numberFormat(number: number): string {
			if (number < 10000) return number + "";
			if (number < 100000) {
				number = number / 10000;
				number = Math.floor(100 * number) / 100;
				return number + "万";
			}
			if (number < 1000000) {
				number = number / 10000;
				number = Math.floor(10 * number) / 10;
				return number + "万";
			}
			if (number < 100000000) {
				number = Math.floor(number / 10000);
				return number + "万";
			}
			if (number < 100000000) {
				number = number / 100000000;
				number = Math.floor(100 * number) / 100;
				return number + "亿";
			}
			if (number < 1000000000) {
				number = number / 100000000;
				number = Math.floor(10 * number) / 10;
				return number + "亿";
			}
			if (number < 10000000000) {
				number = number / 100000000;
				number = Math.floor(10 * number) / 10;
				return number + "亿";
			}
		}
		/**
	 * @description 通过属性值，获取属性名称
	 */
		public static getAttrName(num: number): string {
			let attrName = "";
			switch (num) {
				case 1:
					attrName = "血量";
					break;
				case 2:
					attrName = "攻击";
					break;
				case 3:
					attrName = "防御";
					break;
				case 4:
					attrName = "攻速";
					break;
				case 5:
					attrName = "移速";
					break;
				case 6:
					attrName = "暴伤率";
					break;
				case 7:
					attrName = "暴击";
					break;
				case 8:
					attrName = "抗暴";
					break;
				case 9:
					attrName = "命中";
					break;
				case 10:
					attrName = "闪避";
					break;
				case 11:
					attrName = "无视防御";
					break;
				case 12:
					attrName = "增伤";
					break;
				case 13:
					attrName = "减伤";
					break;
				case 14:
					attrName = "沉默值";
					break;
				case 15:
					attrName = "防沉默";
					break;
				case 16:
					attrName = "定身等级";
					break;
				case 17:
					attrName = "防定身等级";
					break;
				case 18:
					attrName = "眩晕值";
					break;
				case 19:
					attrName = "防眩晕";
					break;
			}
			return attrName;
		}

		public static getPartNamecn(part: number) {
			if (part < 0 || part > 14) return "";
			return ["武器", "衣服", "护腕", "护腿", "鞋子", "头盔", "项链", "戒指", "配饰", "腰带", "鞍具", "蹬具", "缰绳", "蹄铁"][part - 1];
		}
		public static getCoinName(type: number): string {
			return "金币";
		}

		public static getArenaName(rank: number) {
			let listdata// = JsonDataManager.getInstance().getRows(JsonDataName.ARENADAYREWARD_CFG);
			let maxNumber = [];
			for (let i = 0; i < listdata.length; i++) {
				maxNumber[i] = listdata[i].max;
			}
			let str = "未上榜";
			if (rank <= 0) {
				str = "未上榜";
			} else if (rank <= maxNumber[0]) {
				str = "王者";
			} else if (rank <= maxNumber[1]) {
				str = "钻石";
			} else if (rank <= maxNumber[2]) {
				str = "白金";
			} else if (rank <= maxNumber[3]) {
				str = "黄金";
			} else if (rank <= maxNumber[4]) {
				str = "白银";
			} else if (rank <= maxNumber[5]) {
				str = "黄铜";
			}
			return str;
		}
		/**
		 * @description 根据当前次数和类型获取消耗，对应buynum配置表的解析
		 */
		public static getCostByType(id: number, type: string): { costType: number, costNum: number } {
			let buyNumInfo// = JsonDataManager.getInstance().getRows(JsonDataName.BUYNUM_CFG);
			let costType: number;
			let costNum: number;
			for (let i: number = 0; i < buyNumInfo.length; i++) {
				if ((buyNumInfo[i].id == id) && (buyNumInfo[i].type == type)) {
					let cost = buyNumInfo[i].cost.split("_");
					costType = cost[0];
					costNum = cost[1];
					return { costType: costType, costNum: costNum };
				}
			}
		}
	}
}