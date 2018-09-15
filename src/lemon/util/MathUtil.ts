module lemon {
	/**
	 * @description 数学工具类
	 *
	 */
	export class MathUtil {
    	/**
		 * 曼哈顿启发函数<br/>
		 * 用此启发函数在八向寻路中找到的并不是最优路径,因为它的运算结果可能远远大于开始结点到目标结点的距离,
		 * 但是此启发函数的运算速度非常快
		 * @param x1 节点1x
		 * @param y1 节点1y
		 * @param x2 节点2x
		 * @param y2 节点2y
		 * @return 
		 * 
		 */
		public static manhattan(x1: number, y1: number, x2: number, y2: number): number {
			return (
				(x1 > x2 ? x1 - x2 : x2 - x1)
				+
				(y1 > y2 ? y1 - y2 : y2 - y1)
			) * 100;
		}
		/**
		 * @description 获取两个对象之间的直线距离
		 */
		public static distance(source: any, target: any): number {
			if (target && source) {
				return Math.sqrt(Math.pow(source.x - target.x, 2) + Math.pow(source.y - target.y, 2));
			}
			return 100000;
		}
		/**
		 * @description 比较两个64位的数字是否相等
		 */
		public static equal(a: any, b: any): boolean {
			if (a && b) {
				if (a["high"] && b["high"]) {
					if (a.high == b.high && a.low == b.low) {
						return true;
					}
				} else {
					if (a*1000/1000 == b*1000/1000) {
						return true;
					}
				}
			}
			return false;
		}
		/**
		 * @description 获取两个数之间的
		 */
		public static randomCount(min: number, max: number): number {
			return min + Math.round(Math.random() * (max - min));
		}
		/**
		 * @description 获取目标对象相对源对象之间的方向,八方向
		 */
		public static dir(source: any, target: any): number {
			if (target) {
				if (Math.abs(target.y - source.y) < 10) {
					if (target.x > source.x) {
						return DirUtil.RIGHT;
					} else {
						return DirUtil.LEFT;
					}
				} else {
					if (target.y < source.y) {
						if (Math.abs(target.x - source.x) < 10) {
							return DirUtil.UP;
						} else {
							if (target.x > source.x) {
								return DirUtil.RIGHT_UP;
							} else {
								return DirUtil.LEFT_UP;
							}
						}
					} else {
						if (Math.abs(target.x - source.x) < 10) {
							return DirUtil.DOWN;
						} else {
							if (target.x > source.x) {
								return DirUtil.RIGHT_DOWN;
							} else {
								return DirUtil.LEFT_DOWN;
							}
						}
					}
				}
			}
			return 1;
		}
		//@description 定义几个随机点，用于温泉泡澡的ab区域游泳
		public static getRodomPos(area: number): { x: number, y: number } {
			let arrayA = [[1040,1122], [997,1283], [870,1033], [1124,969], [1216,1407]];
			let arrayB = [[1470,1260], [1394,1068], [1432,1241], [1537,1035,], [1473,1308]];
			let array = (area == 1) ? arrayA : arrayB;
			let random = Math.round(Math.random() * (array.length - 1));
			return { x: array[random][0], y: array[random][1] };
		}
	}
}
