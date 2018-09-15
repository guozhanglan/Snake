module lemon {
	
	export class DirUtil {
        public static UP: number = 1;                          //向上
        public static RIGHT_UP: number = 2;                  //右上
        public static RIGHT: number = 3;                   //向右
        public static RIGHT_DOWN: number = 4;          //右下
        public static DOWN: number = 5;                    //向下
        public static LEFT_DOWN: number = 6;           //左下
        public static LEFT: number = 7;                 //向左
        public static LEFT_UP: number = 8;             //左上
		public constructor() {
		}
		
		/**
		 * @description 获取真实的5方向
		 */ 
		public static getDir(dir:number):number{
		    if(dir<=5) return dir;
            if(dir == 6) return DirUtil.RIGHT_DOWN;
            if(dir==7) return DirUtil.RIGHT;
            if(dir==8) return DirUtil.RIGHT_UP;
		}
	}
}
