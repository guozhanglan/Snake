module lemon {
	/**
	 * @description 全局配置类
	 *
	 */
	export class GlobalConfig {
		public static plat: string = "";							//当前的第三方平台
		public static loginServer: string = "";					//登陆服务器
		public static loginPort: number;                        		   //登陆服务器端口
		public static platType: number;							//当前的平台
		public static platHost: string = "";							//平台服务器
		public static gmHost: string = "";		//gm后台服务器
		public static gameid: string = "10000";						 		//游戏Id
		public static channelid: string = "";					     //渠道Id
		public static createRoleServerId: number = 0;	              //创建角色的服务器ID
		public static gameServer: string = "";                         //游戏服服务器
		public static gameServerName: string = "";                     //游戏服务器名称
		public static gamePort: number;                              //游戏服端口
		public static accessToken: string = "";				//token验证码
		public static sdkToken: string = "";					//sdk平台的token
		public static nickName: string;						//sdk登陆返回自带的昵称
		public static userId: string = "";					//玩家的账号
		public static time: string = "";						//时间戳
		public static isDebug: boolean = false;			   //是否是调试状态
		public static isWhilePlayer: number;			//是否是白名单用户
		public static sdkReturnParams: any;				//sdk登陆返回
		public static code: string;						//第三方登陆带来的code
		public static wxScene: string;				 //微信特有的场景唯一id
		public static redirectUrl: string;				//重定向的地址,QQ登陆用
		public static wxWebAppId: string = "wx11cf3a29fc017f51";				//微信网站应用授权的appid
		public static qqWebClientId: string = "1106571859";					//QQ网站应用授权clientId
		public static secret_key: string = "josuer3*%*3jd&#$^#dade";		//秘钥
		public static adchannelid: string = "";				//渠道来源
		public static version: string = "version:2.0";				//游戏版本号
		public static isWebGL: boolean = false;					//是否是webgl模式运行
		public static supportPVR: boolean = false;				//是否支持pvr
		public static imgTag: string = "jpg";
		public static configVersion: string = "201708111553";				//version配置文件的版本号

	}
}
