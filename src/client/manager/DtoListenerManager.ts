module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2018.2.05
	 * @description dto监听管理器
	 *
	 */
	export class DtoListenerManager {
		private static instance: DtoListenerManager;
		private listenerDic: any = {};
		public constructor() {
			this.listenerDic = {};
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): DtoListenerManager {
			if (DtoListenerManager.instance == null) {
				DtoListenerManager.instance = new DtoListenerManager();
			}
			return DtoListenerManager.instance;
		}
		/**
		 * @description 注册一个dtoListener
		 */
		public registerDtoListener(name: string, listener: lemon.BaseDtoListener): void {
			this.listenerDic[name] = listener;
		} 
		/**
		 * @description 移除一个dtolistener
		 */
		public removeDtoListener(name: string): void {
			let listener: lemon.BaseDtoListener = this.listenerDic[name];
			if (listener) {
				listener.removeAllListener();
			}
			delete this.listenerDic[name];
		}
		/**
		 * @description 启动时需要做的操作
		 */
		public startUp(): void {
			
			/*this.registerDtoListener(LoginListener.name, new LoginListener());
			this.registerDtoListener(SceneListener.name, new SceneListener());
			this.registerDtoListener(TaskListener.name, new TaskListener());
			this.registerDtoListener(ChatListener.name, new ChatListener());
			this.registerDtoListener(EmailListener.name, new EmailListener());
			this.registerDtoListener(PackListener.name, new PackListener());
			this.registerDtoListener(EquipListener.name, new EquipListener());
			this.registerDtoListener(SkillListener.name, new SkillListener());
			this.registerDtoListener(HorseListener.name, new HorseListener());
			this.registerDtoListener(RankListener.name, new RankListener());
			this.registerDtoListener(ShopListener.name, new ShopListener());
			this.registerDtoListener(LookUpListener.name, new LookUpListener());
			this.registerDtoListener(BossListener.name, new BossListener());
			this.registerDtoListener(ArenaListener.name, new ArenaListener());
			this.registerDtoListener(UnionListener.name, new UnionListener());
			this.registerDtoListener(DailyCopyListener.name, new DailyCopyListener());
			this.registerDtoListener(ActivityListener.name, new ActivityListener());
			this.registerDtoListener(BuffListener.name, new BuffListener());
			this.registerDtoListener(RechargeListener.name, new RechargeListener());
			this.registerDtoListener(SocialListener.name, new SocialListener());
			this.registerDtoListener(RedPacketListener.name, new RedPacketListener());
			this.registerDtoListener(VipListener.name, new VipListener());
			this.registerDtoListener(TaobaoListener.name, new TaobaoListener());
			this.registerDtoListener(PlayingWayListener.name, new PlayingWayListener());
			this.registerDtoListener(KingwarListener.name, new KingwarListener());
			this.registerDtoListener(BeautyListener.name, new BeautyListener());
			this.registerDtoListener(TitleListener.name, new TitleListener());
			this.registerDtoListener(HideWeaponListener.name, new HideWeaponListener());
			this.registerDtoListener(TerritoryWarListener.name, new TerritoryWarListener());
			this.registerDtoListener(VariousRoleListener.name, new VariousRoleListener());*/
		}
	}
}
