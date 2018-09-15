module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.05
	 * @description 系统路径类枚举
	 *
	 */
    export class SystemPath {
        public static root: string = "resource/";                                                  //资源根目录
        public static config: string = SystemPath.root + "config/";                               //配置文件目录
        public static language: string = SystemPath.root + "language/";                          //多语言图集目录
        public static uieffect: string = SystemPath.root + "animation/uieffect/";                 //ui特效目录
        public static rolePath: string = SystemPath.root + "animation/role/";                    //角色资源目录
        public static roomPath: string = SystemPath.root + "res/rooms/";                    //角色资源目录
        public static buff_icon: string = SystemPath.root + "icon/buff/";                          //buff的icon目录
        public static bg_music: string = SystemPath.root + "sound/music/";                        //背景引用
        public static effect_music: string = SystemPath.root + "sound/effect/";                   //特效音乐

    }
}
