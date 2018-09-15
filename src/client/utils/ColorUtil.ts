module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2017.01.05
	 * @desc 颜色工具类
	 */
	export class ColorUtil {
		/**
		 * @desc 根据品质返回对应颜色
		 */
		public static getColorByQuality(quality: number): number {
			switch (quality) {
				case 1:
					return ColorConst.COLOR_WHITE;
				case 2:
					return ColorConst.COLOR_GREEN;
				case 3:
					return ColorConst.COLOR_BLUE;
				case 4:
					return ColorConst.COLOR_VIOLET;
				case 5:
					return ColorConst.COLOR_CADMIUM;
				case 6:
					return ColorConst.COLOR_RED;
			}
		}
		public static getMeirenColor(quality: number): number {
			switch (quality) {
				case 1:
					return ColorConst.COLOR_SKILLW;
				case 2:
					return ColorConst.COLOR_SKILLG;
				case 3:
					return ColorConst.COLOR_SKILLB;
				case 4:
					return ColorConst.COLOR_SKILLP;
				case 5:
					return ColorConst.COLOR_SKILLO;
				case 6:
					return ColorConst.COLOR_SKILLR;
			}
		}
	}
}