module lemon {
	/**
	 * @desc 滤镜工具类
	 */
	export class FilterUtil {
		public static colorFlilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		]);
	}
}