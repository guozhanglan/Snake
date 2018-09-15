module wqq {
	export class LocalPlayerDatabase {
		public PlayerInfo:any = {};
		public LoginInfo:any = {};
		public constructor() {
			this.initLogin();
		}
		private static m_Instance:LocalPlayerDatabase = null;
		public static GetInstance():LocalPlayerDatabase
		{
			if (LocalPlayerDatabase.m_Instance == null) {
				LocalPlayerDatabase.m_Instance = new LocalPlayerDatabase();
			}
			return LocalPlayerDatabase.m_Instance;
		}

		public initLogin(){
			let info:any = {};
			info.roleID = 1234001;
			info.platform = "wx";
			this.LoginInfo = info;
			let playerInfo:any = {};
			playerInfo.currentSkin = {skinID:100001,name:"xxx"};//SkinID
			playerInfo.name = "文国清";
			this.PlayerInfo = playerInfo;
		}
	}
}