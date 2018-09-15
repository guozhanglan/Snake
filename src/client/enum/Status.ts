module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2018.2.08
	 * @description 动作状态枚举
	 */
	export class Status {
		public static IDLE:string        = "idle";            //待机状态
		public static MOVE:string        = "walk";            //行走状态
		public static ATTACK:string      = "action";          //攻击状态
		public static ATTACK_1:string      = "action1";          //攻击状态
	}
}
