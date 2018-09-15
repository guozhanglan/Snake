module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2017.03.02
	 * @description 位操作类
	 */
	export class LayerUtils {
		public static SceneLayerWidth:number = 304;
        public static SceneLayerHeight:number = 162;

		public constructor() {
		}
		/**
		 * @description
		 */
		public static getLayer(y:number):number{
			return Math.floor(y/LayerUtils.SceneLayerHeight);
		}
		
	}
}