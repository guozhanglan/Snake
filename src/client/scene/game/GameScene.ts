module wqq
{
	import Vector2D = snake.Vector2;

	export enum InGameEvent
	{
		kInGamePlayerRespawn = 30000,
		kInGamePlayerPlayerDead = 30001,
		kInGameEndlessRankPlayer = 30002
	};

	export class AnimationCurve
	{
		private m_keys:Array<number> = [];
		private m_Values:Array<number> = [];
		public constructor(){

		}

		public AddKey(t:number, v:number){
			this.m_keys.push(t);
			this.m_Values.push(v);
		}
		public Evaluate(t:number):number{
			let m_Values = this.m_Values;
			let m_keys = this.m_keys;
			if (t >= m_keys[m_keys.length-1]) {
				return m_Values[m_Values.length-1];
			}
			else if (t <= m_keys[0]) {
				return this.m_Values[0];
			}

			for (let i = 0; i < m_keys.length - 1; i++)
			{
				let key = m_keys[i];
				let nextKey = m_keys[i + 1];
				if (t >= key && t < nextKey)
				{
					let val = m_Values[i];
					let nextVal = m_Values[i + 1];
					let value = val + (nextVal - val) * (t - key) / (nextKey - key);
					return value;
				}
			}

			return m_Values[m_Values.length - 1];
		}
		public Length():number {
			return this.m_keys.length;
		}
		public GetKeys(i:number):number {
			return this.m_keys[i];
		}
		public GetValues(i:number):number {
			return this.m_Values[i];
		}
	};

	export class GameScene extends BaseGameScene
	{
		public static Inst:GameScene = null;
		private widths:Array<number> = [];
		private m_Playerlength:number;
		private m_WidthToView:AnimationCurve = new AnimationCurve();
		private m_PlayerInfo:SlitherPlayerInfo = new SlitherPlayerInfo();
		private m_SlitherContainer:egret.DisplayObjectContainer;
		private m_FlyBeanContainer:egret.DisplayObjectContainer;
		private m_TileBackground:TiledBackground;
		private m_AllSlithers:Array<Slither> = [];
		private m_ActivityFlyBeanName:Array<string> = [];

		private m_GameOver:boolean;
		private m_FirstSynced:boolean;
		private m_SortingOrderCounter:number;
		private m_ExtraViewSize:number;
		private m_LastOrthoSizeTarget:number;
		private m_CurrOrthoSizeTarget:number;
		private m_CameraViewAnimDuration:number = 1.0;
		private m_CameraViewFactor:number = 1.0;
		protected m_Time:number;
		protected m_Radius:number;
		protected allNames:Object = new Object();
		protected m_PlayerNameInfo:NameInfo = new NameInfo();

		protected m_PlayerID:number;
		protected m_EnemyID:number;
		
		private m_BeanView:GameSceneBeanView;
		private m_CamaraViewFactor:number;
	
		public constructor()
		{
			super(SceneType.kSceneGame)
			GameScene.Inst = this;
			this.m_CamaraViewFactor=1.0;
			this.m_CameraViewAnimDuration=1.0;
			this.m_ExtraViewSize = 1.0;
			this.m_GameOver = false;
			this.m_SortingOrderCounter = 0;
			this.m_FirstSynced = false;
			this.m_PlayerID = 0;
			this.m_LastOrthoSizeTarget = 3.2;
			this.m_CurrOrthoSizeTarget = 3.2;
			this.m_Time = 0.0;
			this.m_BeanView = null;
			this.m_TileBackground = null;
			
			this.m_WidthToView.AddKey(0.0, 3.675);
			this.m_WidthToView.AddKey(0.4, 3.675);
			this.m_WidthToView.AddKey(0.5, 4.1);
			this.m_WidthToView.AddKey(0.65, 4.633);
			this.m_WidthToView.AddKey(0.75, 4.841);
			this.m_WidthToView.AddKey(0.8, 4.91);
			this.m_WidthToView.AddKey(1.0, 5.25);
			this.m_WidthToView.AddKey(1.5, 6.0);
			this.m_WidthToView.AddKey(1.971, 6.471);
			this.m_WidthToView.AddKey(2.654, 2.801);
			this.m_WidthToView.AddKey(3.2, 6.868);
			
			let gameLayer = this;

			this.m_SlitherContainer = new egret.DisplayObjectContainer();
			this.m_FlyBeanContainer = new egret.DisplayObjectContainer();
			this.m_TileBackground = new TiledBackground(this);
			this.m_BeanView = new GameSceneBeanView(this);

			gameLayer.addChild(this.m_TileBackground);
			gameLayer.addChild(this.m_BeanView);
			gameLayer.addChild(this.m_FlyBeanContainer);
			gameLayer.addChild(this.m_SlitherContainer);

			this.m_Radius = MainEnterGame.GetInstance().SceneInitialize.sceneRadius;

			let net = GameNetManager.GetInstance();
			net.AddEventListener(CmdIDs.kRpcSlitherBirthDeathSync, this.OnSlitherBirthDeathSync, this);
			net.AddEventListener(CmdIDs.kRpcPlayerInfoSync, this.OnPlayerInfoSync, this);
			net.AddEventListener(CmdIDs.kRpcReSpawn, this.OnReSpawn, this);
			net.AddEventListener(CmdIDs.kRpcSlitherHeadSync, this.OnSlitherHeadSync, this);
			net.AddEventListener(CmdIDs.kRpcSlitherBodySync, this.OnSlitherBodySync, this);
			//net.AddEventListener(CmdIDs.kRpcKiller, this.OnRpcKiller, this);
			//net.AddEventListener(CmdIDs.kRpcKilled, this.OnRpcKilled, this);
		}

		public InvokeGameOver() { this.m_GameOver = true; }
		public IsGameOver():boolean { return this.m_GameOver; }

		public GetPlayerInfo():SlitherPlayerInfo { return this.m_PlayerInfo; }
		public GetPlayerScore():number { 
			let score = this.m_PlayerInfo.score;
			if (score < 0){
				score = 0;
			}
			return score; 
		}
		public GetPlayerLength():number { return this.m_Playerlength; }
		public GetSlithers():Array<Slither> { return this.m_AllSlithers; }
		public GetEnemyID():number { return this.m_EnemyID; }
		public GetPlayerID():number { return this.m_PlayerID; }
		public GetRadius():number { return this.m_Radius; }
		
		public GetPlayerNameInfo():NameInfo { return this.m_PlayerNameInfo; }
		
		public dispose()
		{
			GameScene.Inst = null;

			this.StopTweenCamera();
			
			let net = GameNetManager.GetInstance();
			net.RemoveEventListener(CmdIDs.kRpcSlitherBirthDeathSync, this.OnSlitherBirthDeathSync, this);
			net.RemoveEventListener(CmdIDs.kRpcPlayerInfoSync, this.OnPlayerInfoSync, this);
			net.RemoveEventListener(CmdIDs.kRpcReSpawn, this.OnReSpawn, this);
			net.RemoveEventListener(CmdIDs.kRpcSlitherHeadSync, this.OnSlitherHeadSync, this);
			net.RemoveEventListener(CmdIDs.kRpcSlitherBodySync, this.OnSlitherBodySync, this);

			this.DestroyAllSlithers();

			let gameLayer = this;
			gameLayer.removeChild(this.m_TileBackground);
			gameLayer.removeChild(this.m_BeanView);
			gameLayer.removeChild(this.m_FlyBeanContainer);
			gameLayer.removeChild(this.m_SlitherContainer);

			this.allNames = {};
			this.m_TileBackground = null;
			this.m_BeanView = null;
			this.m_FlyBeanContainer = null;
			this.m_SlitherContainer = null;
		}

		public StopTweenCamera()
		{
			
		}

		public LateUpdate(deltaTime:number)
		{
			/*let UIWidth = SceneManager.GetInstance().GetUIViewWidth();
			let UIHeight = SceneManager.GetInstance().GetUIViewHeight();
			Camera3D *gameCamera = SceneManager.GetInstance().GetGameCamera();
			
			if (PlayerController.Ins && !IsGameOver())
			{
				Vector2D headPos = PlayerController.Ins.GetSlitherBody().GetHeadPos();
				gameCamera.SetPosition(Vector3D(headPos.x, headPos.y, 0));
				
				v:numberiewHalfHeight = this.m_WidthToView.Evaluate(PlayerController.Ins.GetSlitherBody().GetWidth());
				viewHalfHeight *= this.m_ExtraViewSize;

				if (UIWidth > UIHeight) {
					SetOrthoSize(this.m_CamaraViewFactor * viewHalfHeight);
				}  else  {
					SetOrthoSize(this.m_CamaraViewFactor * viewHalfHeight / (UIWidth / UIHeight));
				}
			}
			// all slither update
			for (auto slither : this.m_AllSlithers)
			{
				slither.LateUpdate();
			}*/
		}

		public SetOrthoSize(size)
		{
			
		}

		public ContainesSlitherID(data:Array<SlitherHeadInfo>, id:number):boolean
		{
			for (let i = 0; i < data.length; ++i)
			{
				if (data[i].id == id)
				{
					return true;
				}
			}
			return false;
		}
		
		public OnReSpawn(msg:RpcReSpawn)
		{
			this.m_PlayerID = msg.playerID;
			this.m_PlayerNameInfo = msg.playerNameInfo;
			this.AddNameInfo(this.m_PlayerNameInfo);
			this.m_FirstSynced = false;
			this.DestroyAllSlithers();

			//SceneManager.GetInstance().GetGameCamera().SetPosition(Vector3D(msg.initialPos.x, msg.initialPos.y, 0));

			//DispatchEvent(InGameEvent.kInGamePlayerRespawn);
		}
		
		public IsNpc(id:number):boolean
		{
			let it = this.allNames[id];
			if (it) {
				return it.npc;
			}
			return false;
		}

		public FindSlither(name:string):Slither;
		public FindSlither(name:number):Slither;
		
		public FindSlither(name:any):Slither
		{
			let attr = (typeof name == "number")?"GetID":"GetName";
			let size = this.m_AllSlithers.length;
			for (let i = 0; i < size; ++i) {
				let slither = this.m_AllSlithers[i];
				if (slither[attr]() == name) {
					return slither;
				}		
			}
			return null;
		}

		public AddNameInfo(name:NameInfo)
		{
			this.allNames[name.id] = name;
		}

		public SendSlitherCmd(targetDirection:Vector2D, accelarating:boolean)
		{
			
		}

		public SetSlitherNameInfo(slither:Slither, id:number)
		{
			let info = this.allNames[id];
			if (!info) {
				return;
			}
			slither.SetName(info.name);
			slither.GetBody().SetSkinID(info.skinID);
			slither.GetBody().SetDecorationID(info.decorationID);
			slither.GetBody().SetNameInfo(info);
			slither.SetArea(info.publicInfo.area);
		}
		
		public OnSlitherBirthDeathSync(msg:RpcSlitherBirthDeathSync)
		{
			let foundPlayer = false;
			let count = msg.slithers.length;
			for (let i = 0; i < count; i++)
			{
				let info = msg.slithers[i];
				let slither = this.FindSlither(info.id);
				let isPlayer = info.id == this.m_PlayerID;

				if (isPlayer) {
					foundPlayer = true;
				}
				if (info.type == SlitherBirthDeath.EnterView)
				{
					//进视野
					if (slither == null)
					{
						if (isPlayer)
						{
							let slitherBody = SlitherNodeBody.CreateSlither(SlitherType.kSlitherPlayerMP);
							slitherBody.SetAsMainPlayer();
							slither = new Slither(slitherBody);
							slither.SetController(new PlayerController(slitherBody, slither));
						}
						else
						{
							let slitherBody = SlitherNodeBody.CreateSlither(SlitherType.kSlitherOtherMP);
							slither = new Slither(slitherBody);
						}
						this.SetSlitherNameInfo(slither, info.id);
						this.m_AllSlithers.push(slither);
						this.m_SlitherContainer.addChild(slither.GetBody());
					}
					slither.Sync(info.id);
				}
				else if (info.type == SlitherBirthDeath.ExitView)
				{
					//出视野
					if (slither != null)
					{
						for (let m = 0; m < this.m_AllSlithers.length; ++m) {
							if (this.m_AllSlithers[m] == slither) {
								this.m_AllSlithers.splice(m, 1);
								break;
							}
						}
						this.m_BeanView.OnDeleteSlither(slither);

						if (slither.GetBody().GetVisible()) {
							slither.GetBody().Die();
							egret.setTimeout((slither)=>{
								slither.dispose();
							}, this, slither.GetBody().DieDestroyDelay * 1000 + 100, slither);
						}
						else
						{
							slither.dispose();
						}
					}
					else
					{
						console.log("Slither exit game but not found slither entity.\n");
					}
				}
			}
			// 如果第一次同步没有玩家信息，则判定死亡
			if (this.m_PlayerID != 0 && !this.m_FirstSynced) {
				this.m_FirstSynced = true;
			}
		}
		
		public OnSlitherHeadSync(msg:RpcSlitherHeadSync)
		{
			for (let i = 0; i < msg.slithers.length; ++i)
			{
				let info = msg.slithers[i];
				let slither = this.FindSlither(info.id);
				if (slither != null)
				{
					if (this.m_PlayerID == info.id) {//记录成绩
						this.m_Playerlength = info.length;
					}
					slither.SyncInfo(info);
				}
			}
		}
		
		public OnPlayerInfoSync(msg:RpcPlayerInfoSync)
		{
			this.m_PlayerInfo = msg.playerInfo;
			if (PlayerController.Ins) {
				PlayerController.Ins.GetSlither().SyncPlayerInfo(this.m_PlayerInfo);
			}
		}

		public OnSlitherBodySync(msg:RpcSlitherBodySync)
		{
			for (let i = 0; i < msg.slithers.length; ++i)
			{
				let info = msg.slithers[i];
				let slither = this.FindSlither(info.id);
				if (slither != null)
				{
					slither.SyncPoints(info.points);
				}
			}
		}

		public DestroyAllSlithers()
		{
			let list = this.m_AllSlithers;
			let size = list.length;
			for (let i = 0; i < size; ++i) {
				list[i].dispose();
				delete list[i];
			}
			this.m_AllSlithers.length = 0;
			//this.m_BodyDataMgr.DestroyAllSlithers();
		}

		public DoGameOver()
		{
			this.m_GameOver = true;

			//SoundManager.GetInstance().StopBackgroundMusic();

			for (let i = 0; i < this.m_AllSlithers.length; i++) {
				let slither = this.m_AllSlithers[i];
				if (slither) {
					let speed = slither.GetBody().GetSpeed();
					speed.Normalize();
					speed.x *= 0.001;
					speed.y *= 0.001;
					slither.m_Body.SetSpeed(speed);
				}
			}

			// 隐藏游戏主界面
			//SceneManager.GetInstance().HideApp(AppModuleType.kAppInGameMainUI);
			//SceneManager.GetInstance().ShowApp(AppModuleType.kAppInGameTimeOver,true);
		}

		public Update(deltaTime:number)
		{
			if (this.m_GameOver) {
				return;
			}

			this.m_Time += deltaTime;

			for (let i = 0; i < this.m_AllSlithers.length; ++i) {
				this.m_AllSlithers[i].Update(deltaTime);
			}

			this.m_BeanView.Update(deltaTime);

			this.LateUpdate(deltaTime);
		}

		public GetTimeLeft():number
		{
			return 0;	
		}

		public GetNameInfo(id:number):NameInfo
		{
			return this.allNames[id];
		}

		public Enter()
		{
			//SceneManager.GetInstance().ShowApp(AppModuleType.kAppInGameMainUI, false, false, false);
			//SoundManager.GetInstance().PlayBackgroundMusic("sound/music/GameScene");
		}
		
		public BackToLobby()
		{
			//SceneManager.GetInstance().HideAll();
			//SoundManager.GetInstance().StopBackgroundMusic();
			
			//EnterMainGame.Ins().BackToLobby();
		}
		
		public Leave()
		{
			GameScene.Inst = null;
		}
		
	}
}