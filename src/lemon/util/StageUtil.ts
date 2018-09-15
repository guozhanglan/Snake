module lemon {
	/**
	 * @description 舞台工具类
	 */
	export class StageUtil {
		private static lastOrientation:string|number;
		public static STAGE_RESIZE: string = "stage_resize";           //舞台尺寸发生变化
		public static STAGE_ACTIVE: string = "stage_active";           //当舞台获得焦点
        public static STAGE_DEACTIVATE: string = "stage_deactivate";   //当舞台失去焦点
		public static stage: egret.Stage;
		/**
		 * @description 获取舞台宽度
		 */
		public static get stageWidth() {
            return StageUtil.stage.stageWidth;
		}
		/**
		 * @description 获取舞台高度
		 */
		public static get stageHeight(): number {
            return StageUtil.stage.stageHeight;
		}
		public static getScaleMode():string{
			let w: number = window.innerHeight / window.innerWidth;
			let minSizeProb = 1.4;
			let maxSizeProb = 2.2;
			let scaleMode = "";

			if(w <= minSizeProb) {
				scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
			} else if (w > minSizeProb && w < maxSizeProb) {
				scaleMode = egret.StageScaleMode.FIXED_WIDTH;
			}
			return scaleMode;
		}
		public static init():void{
			this.changeStageSize();
			window.addEventListener("resize", this.changeStageSize);
		}

		/**
		 * @description 注册舞台事件
		 */
		public static changeStageSize(): void {
			egret.setTimeout(()=>{
				var scaleMode = lemon.StageUtil.getScaleMode();
				//安卓输入框获焦后，禁止设置height为100%,只有横竖屏的时候才做处理，防止因为输入框的获焦，失焦导致无法自适应  2017-04-22 by Don
				if(this.lastOrientation != window.orientation) {
					document.body.style.height = "100%";
					this.lastOrientation = window.orientation;
				}
				StageUtil.stage.scaleMode = scaleMode;
				NotifyManager.sendNotification(StageUtil.STAGE_RESIZE);
			},this,500);
		}
		/**
		 * @description 操作stage的舞台可点事件和非可点事件
		 */
		public static stageEnable(value:boolean):void{
			if(this.stage){
				this.stage.touchChildren=value;
			}
		}
	}
}
