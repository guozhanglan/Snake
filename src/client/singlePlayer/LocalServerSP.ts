module wqq
{
	import Vector2 = snake.Vector2;
	import SlitherInfo = snake.SlitherInfo;


	let INT_MAX:number = 2147483647;
	let INT_MIN:number = -2147483647;
	let Vector2_zero:Vector2 = new Vector2();
	let Vector2_right:Vector2 = new Vector2(1.0, 0.0);
	
	export class AIServerInfo
	{
		public name:string;
		public area:string;
		public skinID:number;
		public configID:number;
	};

	export class TimerCallback
	{
		public cb:Function = null;
		public interval:number = 0;
		public lastTime:number = 0;
		public thisObj:any = null;

		public Update(time:number){
			let value = time - this.lastTime;
			if (value > this.interval)
			{
				if (this.cb != null){
					this.cb.call(this.thisObj);
				}
				this.lastTime = time;
			}
		}
	};

	export class Random
	{
		private m_min:number;
		private m_max:number;
		public constructor() {
			this.m_min = 0;
			this.m_max = INT_MAX;
		}
		public SetValue(min:number, max:number) {
			this.m_min = min;
			this.m_max = max;
		}
		public NextDouble():number {
			return Math.random();
		}
		public Next():number {
			return this.m_min + (Math.random()*(this.m_max - this.m_min));
		}
		public NextValue(min:number, max:number):number {
			return min + (Math.random()*(max - min));
		}
	};

	export class Cmd
	{
		public Execute(){
		}
	};

	export class SlitherPlayerCmd extends Cmd
	{
		public turnDir:Vector2;
		public accelarating:boolean;
		public playerID:number;

		public Execute(){
			snake.SetSlitherPlayerCmd(LocalServerSP.Ins().GetSceneID(), this.playerID, this.turnDir, this.accelarating);
		}
	};

	export class GenerateBeanCmd extends Cmd
	{
		public pos:Vector2;
		public val:number;
		public Execute(){
			snake.SnakeGenerateBean(LocalServerSP.Ins().GetSceneID(), this.pos, this.val, this.val);
		}
	};

	export class CreatePlayerCmd extends Cmd
	{
		public initialScore:number;
		public playerID:number;
		public skinID:number;
		public firstInCenter:boolean;

		public Execute(){
			let pos:Vector2 = new Vector2();
			let outPos:Vector2 = new Vector2();
			let info:SlitherInfo = null;

			LocalServerSP.Ins().SetPlayerID(this.playerID);
			let m_Params = LocalServerSP.Ins().GetParams();
			let m_SceneParams = LocalServerSP.Ins().GetSceneParams();
			if (this.firstInCenter){
				pos.SetTo(m_SceneParams.radius - 20.0, m_SceneParams.radius);
			}
			else{
				info = snake.GetSlitherInfo(LocalServerSP.Ins().GetSceneID(), this.playerID);
				if (info && info.lastKillerID != 0){
					pos.vec = info.head;
				}
			}
			let m_SceneID = LocalServerSP.Ins().GetSceneID();
			snake.FindBestFitPosition(m_SceneID, m_Params.emptySize, m_Params.tryFitCount, true, pos, outPos);
			snake.CreateSlitherPlayer(m_SceneID, this.playerID, this.initialScore, this.skinID, outPos, Vector2_right);
			snake.DeleteView(m_SceneID, LocalServerSP.Ins().GetViewID());
			let viewID = snake.CreateView(m_SceneID, this.playerID);
			LocalServerSP.Ins().SetViewID(viewID);

			let spawn:RpcReSpawn = new RpcReSpawn();
			spawn.playerID = this.playerID;
			spawn.initialPos.x = outPos.x;
			spawn.initialPos.y = outPos.y;
			spawn.playerNameInfo.id = this.playerID;
			spawn.playerNameInfo.name = LocalPlayerDatabase.GetInstance().PlayerInfo.name;
			spawn.playerNameInfo.skinID = LocalPlayerDatabase.GetInstance().PlayerInfo.currentSkin.skinID;
			spawn.playerNameInfo.npc = false;

			GameNetManager.GetInstance().LocalRpc(spawn);
		}
	};

	export class Stopwatch {
		private m_CurTime:number;
		private m_SumTime:number;
		private m_StartTime:number;
		private m_StopTime:number;
		public IsRunning:boolean;

		public constructor() {
			this.IsRunning = false;
			this.m_StopTime = this.m_SumTime = 0;
			this.m_CurTime = this.m_StartTime = Math.ceil(egret.getTimer()/1000);
		}
		public TotalSeconds():number {
			if (this.IsRunning) {
				this.m_CurTime = Math.ceil( (egret.getTimer()/1000) - this.m_SumTime);
			}
			return this.m_CurTime;
		}
		public Start() {
			this.IsRunning = true;
			this.m_StartTime = egret.getTimer()/1000;
			this.m_SumTime += (this.m_StartTime - this.m_StopTime);
		}
		public Stop() {
			this.IsRunning = false;
			this.m_StopTime = egret.getTimer()/1000;
		}
		public ReStart() {
			this.m_SumTime = 0;
			this.m_StopTime = 0;
			this.IsRunning = false;
		}
	};

	export class LocalServerSP
	{
		private static m_Instance:LocalServerSP;
		private m_Pause:boolean;
		private m_CanRevive:boolean;
		private m_SceneID:number = 0;
		private m_ViewID:number = 0;
		private m_PlayerID:number = 0;
		private m_RunTime:number = 0;
		private m_SceneParams:snake.SceneParams = new snake.SceneParams();
		private m_Params:Params;
		private m_CmdQueue:Array<Cmd> = [];
		private m_TimerCallback:Array<TimerCallback> = [];
		private m_AIServerInfo:Object = new Object();//<uint, AIServerInfo>;
		private m_Time:Stopwatch = new Stopwatch();
		private m_Random:Random = new Random();
		private m_CurrentAIRatio:AIRatio = new AIRatio();
		private m_Bytes:Array<number>;
		private m_Buffer:ByteArray;
		private m_BufferLength:number = 1024 * 256;

		public constructor(){
			this.m_Bytes = new Array<number>(this.m_BufferLength);
			this.m_Buffer = new ByteArray(this.m_Bytes, this.m_BufferLength);
		}

		public static Ins():LocalServerSP
		{
			if (LocalServerSP.m_Instance == null) {
				LocalServerSP.m_Instance = new LocalServerSP();
			}
			return LocalServerSP.m_Instance;
		}

		public GetViewID():number {
			return this.m_ViewID;
		}

		public GetSceneID():number {
			return this.m_SceneID;
		}

		public GetSceneParams():snake.SceneParams {
			return this.m_SceneParams;
		}

		public GetParams():Params {
			return this.m_Params;
		}
		
		public SetPlayerID(id:number) {
			this.m_PlayerID = id;
		}

		public SetViewID(id:number) {
			this.m_ViewID = id;
		}

		public AddAIServerInfo(id:number, info:AIServerInfo) {
			this.m_AIServerInfo[id] = info;
		}

		public SetPlayerScore(score:number){

		}
		
		public GetRunTime():number{
			if (this.m_Time.IsRunning) {
				return this.m_Time.TotalSeconds();
			}
			return 1;
		}
		public NextDouble():number {
			return this.m_Random.NextDouble();
		}

		public Next(min:number, max:number):number {
			return this.m_Random.NextValue(min, max);
		}

		public InvokeRepeating(cb:Function, thisObj:any, interval:number)
		{
			let item = new TimerCallback();
			item.cb = cb;
			item.interval = interval;
			item.thisObj = thisObj;
			this.m_TimerCallback.push(item);
		}

		public ParseCMDRecvData(msg:CMDRecvBase)
		{
			this.m_Buffer.position = 0;
			msg.ParseData(this.m_Buffer);
			GameNetManager.GetInstance().LocalRpc(msg);
		}

		public Update(){
			while (this.m_CmdQueue.length > 0)
			{
				let cmd = this.m_CmdQueue.shift()
				cmd.Execute();
			}

			let time = this.m_Time.TotalSeconds();
			snake.UpdateScene(this.m_SceneID, time);

			if (this.m_PlayerID != 0 && !snake.IsPlayerAlive(this.m_SceneID, this.m_PlayerID))
			{
				this.m_PlayerID = 0; 
				this.m_CanRevive = !this.m_CanRevive;
				
				egret.setTimeout((a)=> {
					//打开复活面板
					//SceneManager.GetInstance().HideApp(AppModuleType.kAppSettingUI);
					//SceneManager.GetInstance().ShowApp(AppModuleType.kAppEndlessReviveUI, true);
				}, this, 1000);
			}
			
			if (snake.QueryPlayerBirthDeath(this.m_SceneID, this.m_ViewID, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcSlitherBirthDeathSync();
				this.ParseCMDRecvData(msg);
			}
			if (snake.QueryPlayerBeanSpawnData(this.m_SceneID, this.m_ViewID, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcBeanSpawned();
				this.ParseCMDRecvData(msg);
			}
			if (snake.QueryPlayerBeanDevouredData(this.m_SceneID, this.m_ViewID, true, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcBeanDevoured();
				this.ParseCMDRecvData(msg);
			}
			if (snake.QueryPlayerBeanDevouredData(this.m_SceneID, this.m_ViewID, false, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcBeanDevoured();
				this.ParseCMDRecvData(msg);
			}
		}

		public PositionSync(){
			if (snake.QueryPlayerHeadSyncData(this.m_SceneID, this.m_ViewID, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcSlitherHeadSync();
				this.ParseCMDRecvData(msg);
			}
			if (snake.QueryPlayerInfoSyncData(this.m_SceneID, this.m_ViewID, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcPlayerInfoSync();
				this.ParseCMDRecvData(msg);
			}
			if (snake.QueryPlayerBodySyncData(this.m_SceneID, this.m_ViewID, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcSlitherBodySync();
				this.ParseCMDRecvData(msg);
			}
		}

		public CompensateAI(){
			if (snake.GetAICount(this.m_SceneID) < this.m_Params.aiCount)
			{
				let pos:Vector2;
				let outsideFirst:boolean = this.m_Random.NextDouble() < this.m_Params.aiOutsideRatio ? true : false;
				snake.FindBestFitPosition(this.m_SceneID, this.m_Params.emptySize, this.m_Params.tryFitCount, outsideFirst, Vector2_zero, pos);
				let aiConfig = this.RandomAIConfig();
				let skinID = this.RandomAISKinID(aiConfig);
				let id = snake.CreateSlitherAI(this.m_SceneID, this.m_Params.initialScore, skinID, this.ConvertAIParams(aiConfig), pos, Vector2_right);

				let info = new AIServerInfo();
				let nameList = LocalResources.getInstance().getNameList();
				info.name = nameList[LocalServerSP.Ins().Next(0, nameList.length - 1)];
				info.area = "CN";
				info.skinID = skinID;
				info.configID = aiConfig.confId;
				this.AddAIServerInfo(id, info);
			}
		}

		public RefreshBean(){
			if (snake.QueryPlayerBeanRefreshData(this.m_SceneID, this.m_ViewID, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcBeanRefresh();
				this.ParseCMDRecvData(msg);
			}
		}

		public QueryRank(){
			if (snake.QueryRankSyncData(this.m_SceneID, this.m_Params.rankCount, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcRankSync();
				this.ParseCMDRecvData(msg);
			}
		}

		public QueryMinimap(){
			if (snake.QueryMiniMapSyncData(this.m_SceneID, this.m_Params.rankCount, this.m_Bytes, this.m_BufferLength) > 0)
			{
				let msg = new RpcMiniMapSync();
				this.ParseCMDRecvData(msg);
			}
		}

		public InitServer(sceneParam:GameSceneSPParams, param:Params){
			this.m_SceneParams.radius = sceneParam.radius;
			this.m_SceneParams.physicsTimeStep = sceneParam.physicsTimeStep;
			this.m_SceneParams.frameStep = sceneParam.frameStep;
			this.m_SceneParams.collisionThreshold = sceneParam.collisionThreshold;
			this.m_SceneParams.initialBeanSigma = sceneParam.initialBeanSigma;
			this.m_SceneParams.initialBeanMin = sceneParam.initialBeanMin;
			this.m_SceneParams.initialBeanMax = sceneParam.initialBeanMax;
			this.m_SceneParams.initialBeanCount = sceneParam.initialBeanCount;
			this.m_SceneParams.accelarateScoreInterval = sceneParam.accelarateScoreInterval;
			this.m_SceneParams.accelarateScoreLost = sceneParam.accelarateScoreLost;
			this.m_SceneParams.accelarateScoreRatio = sceneParam.accelarateScoreRatio;
			this.m_SceneParams.baseScore = sceneParam.baseScore;
			this.m_SceneParams.scoreScale = sceneParam.scoreScale;
			this.m_SceneParams.scoreVisualScale = sceneParam.scoreVisualScale;
			this.m_SceneParams.devourBase = sceneParam.devourBase;
			this.m_SceneParams.devourScale = sceneParam.devourScale;
			this.m_SceneParams.devourDegree = sceneParam.devourDegree;
			this.m_SceneParams.dieScoreBase = sceneParam.dieScoreBase;
			this.m_SceneParams.dieScoreCountRatio = sceneParam.dieScoreCountRatio;
			this.m_SceneParams.dieScorePercent = sceneParam.dieScorePercent;
			this.m_SceneParams.dieScoreRandOffset = sceneParam.dieScoreRandOffset;
			this.m_SceneParams.dieScoreVisualScale = sceneParam.dieScoreVisualScale;
			this.m_SceneParams.headTestStart = sceneParam.headTestStart;
			this.m_SceneParams.headTestEndFactor = sceneParam.headTestEndFactor;
			this.m_SceneParams.linearAccelartion = sceneParam.linearAccelartion;
			this.m_SceneParams.linearDeccelartion = sceneParam.linearDeccelartion;
			this.m_SceneParams.linearSpeedNormal = sceneParam.linearSpeedNormal;
			this.m_SceneParams.linearSpeedFast = sceneParam.linearSpeedFast;
			this.m_SceneParams.killBeanCount = sceneParam.killBeanCount;
			this.m_SceneParams.killBeanMaxPoint = sceneParam.killBeanMaxPoint;
			this.m_SceneParams.killBeanScoreRatio = sceneParam.killBeanScoreRatio;
			this.m_SceneParams.compensateBeanCount = sceneParam.compensateBeanCount;
			this.m_SceneParams.compensateBeanThreshold = sceneParam.compensateBeanThreshold;
			this.m_SceneParams.compensateBeanDistance = sceneParam.compensateBeanDistance;
			this.m_SceneParams.compensateBeanRadius = sceneParam.compensateBeanRadius;
			this.m_SceneParams.compensateBeanInterval = sceneParam.compensateBeanInterval;
			this.m_SceneParams.aiAccelarateMinScore = sceneParam.aiAccelarateMinScore;
			this.m_SceneParams.aiKillMinScore = sceneParam.aiKillMinScore;
			this.m_SceneParams.randSeed = this.m_Random.Next();
			this.m_SceneParams.scoreLength = sceneParam.scoreLength;
			this.m_SceneParams.scoreLengthCount = sceneParam.scoreLengthSize;
			this.m_SceneParams.scoreWidth = sceneParam.scoreWidth;
			this.m_SceneParams.scoreWidthCount = sceneParam.scoreWidthSize;
			this.m_SceneParams.widthView = sceneParam.widthToView;
			this.m_SceneParams.widthViewCount = sceneParam.widthToViewSize;
			this.m_SceneParams.widthRotateNormal = sceneParam.widthRotateNormal;
			this.m_SceneParams.widthRotateNormalCount = sceneParam.widthRotateSize;
			this.m_SceneParams.widthRotateFast = sceneParam.widthRotateFast;
			this.m_SceneParams.widthRotateFastCount = sceneParam.widthRotateSize;
			
			this.InvokeRepeating(this.Update, this, param.frameInterval);
			this.InvokeRepeating(this.PositionSync, this, param.posSyncInterval);
			this.InvokeRepeating(this.QueryRank, this, param.rankSyncInterval);
			this.InvokeRepeating(this.QueryMinimap, this, param.minimapSyncInterval);
			this.InvokeRepeating(this.CompensateAI, this, param.compensateAIInterval);
			this.InvokeRepeating(this.RefreshBean, this, param.refreshBeanInterval);

			this.m_Pause = false;
			this.m_CanRevive = false;
			this.m_SceneID = snake.CreateScene(this.m_SceneParams);
			this.m_Params = param;
			this.m_Time.ReStart();
			this.m_RunTime = sceneParam.initialRunTime;
			egret.startTick(this.Run, this);
			
			console.log("LocalServer running\n");
		}
		
		public ReStart(){
			let i = 0;
			snake.DeleteAllSlithers(this.m_SceneID);
			snake.DeleteAllBeans(this.m_SceneID);
			snake.DeleteView(this.m_SceneID, this.m_ViewID);
			snake.DeleteScene(this.m_SceneID);
			for (i = this.m_CmdQueue.length - 1; i >= 0; i--) {
				delete this.m_CmdQueue[i];
			}
			this.m_CmdQueue.length = 0;
			for (i = this.m_TimerCallback.length - 1; i >= 0; i--) {
				this.m_TimerCallback[i].lastTime = 0;
			}
			
			this.m_AIServerInfo = new Object();
			this.m_ViewID = 0;
			this.m_PlayerID = 0;
			this.m_Pause = false;
			this.m_CanRevive = false;
			this.m_Time.ReStart();
			this.m_SceneID = snake.CreateScene(this.m_SceneParams);
			GameNetManager.GetInstance().StartInfinite();
			this.CreatePlayer(this.m_Params.initialScore, true);
		}

		public Run(delay:number):boolean{
			if (!this.m_Pause){
				if (!this.m_Time.IsRunning){
					this.m_Time.Start();
				}
				let time = this.m_Time.TotalSeconds();
				let count = this.m_TimerCallback.length;
				for (let i = 0; i < count; ++i){
					this.m_TimerCallback[i].Update(time);
				}
			}
			else if (this.m_Time.IsRunning){
				this.m_Time.Stop();
			}
			return true;
		}

		public Stop(){
			egret.stopTick(this.Run, this);
			GameNetManager.GetInstance().StopInfinite();
			snake.DeleteAllSlithers(this.m_SceneID);
			snake.DeleteAllBeans(this.m_SceneID);
			snake.DeleteView(this.m_SceneID, this.m_ViewID);
			snake.DeleteScene(this.m_SceneID);
			let i = 0;
			for (i = this.m_TimerCallback.length - 1; i >= 0; i--) {
				delete this.m_TimerCallback[i];
			}
			for (i = this.m_CmdQueue.length - 1; i >= 0; i--) {
				delete this.m_CmdQueue[i];
			}
			this.m_Time.Stop();
			this.m_AIServerInfo = new Object();
			this.m_TimerCallback.length = 0;
			this.m_CmdQueue.length = 0;
			this.m_ViewID = 0;
			this.m_SceneID = 0;
			this.m_PlayerID = 0;
			console.log("LocalServer Stopped\n");
		}

		public CreatePlayer(initialScore:number, firstInCenter:boolean){
			if (this.m_SceneID == 0)return;
			let cmd = new CreatePlayerCmd();
			cmd.initialScore = initialScore;
			cmd.firstInCenter = firstInCenter;
			cmd.playerID = LocalPlayerDatabase.GetInstance().LoginInfo.roleID;
			cmd.skinID = LocalPlayerDatabase.GetInstance().PlayerInfo.currentSkin.skinID;
			this.AddCmd(cmd);
		}

		public UpdateCurrentAIRatio():AIRatio{
			let time = this.m_Time.TotalSeconds();
			let right = this.m_Params.aiRatio.length - 1;
			for (let i = 0; i < this.m_Params.aiRatio.length; ++i)
			{
				if (this.m_Params.aiRatio[i].time >= time)
				{
					right = i;
					break;
				}
			}
			if (right == 0)
			{
				this.m_CurrentAIRatio.configs.length = 0;
				this.m_CurrentAIRatio.configs = this.m_Params.aiRatio[0].configs.slice();
			}
			else
			{
				let k = (time - this.m_Params.aiRatio[right - 1].time) / (this.m_Params.aiRatio[right].time - this.m_Params.aiRatio[right - 1].time);
				let count = this.m_Params.aiRatio[right - 1].configs.length;
				this.m_CurrentAIRatio.configs.length = count;
				for (let j = 0; j < count; ++j)
				{
					this.m_CurrentAIRatio.configs[j] = snake.lerp(this.m_Params.aiRatio[right - 1].configs[j], this.m_Params.aiRatio[right].configs[j], k);
				}
			}
			let sum = 0.0;
			for (let j = 0; j < this.m_CurrentAIRatio.configs.length; ++j)
			{
				sum += this.m_CurrentAIRatio.configs[j];
			}
			for (let j = 0; j < this.m_CurrentAIRatio.configs.length; ++j)
			{
				this.m_CurrentAIRatio.configs[j] /= sum;
			}
			return this.m_CurrentAIRatio;
		}

		public RandomAIConfig():AIConfigInfo{
			let ratio = this.UpdateCurrentAIRatio();
			let rnd = this.m_Random.NextDouble();
			let accum = 0.0;
			let list = LocalResources.getInstance().getAIConfigList();
			for (let i = 0; i < ratio.configs.length; ++i)
			{
				accum += ratio.configs[i];
				if (rnd < accum)
				{
					return list[i];
				}
			}
			return list[0];
		}

		public ConvertAIParams(info: AIConfigInfo):snake.AIParams{
			let param = new snake.AIParams();
			param.agile = info.Agile;
			param.agressive = info.Agressive;
			param.aHeadDist = info.AHeadDist;
			param.avoidRadius = info.AvoidRadius;
			param.configID = info.confId;
			param.desperateFactor = info.DesperateFactor;
			param.findBeanDist = info.FindBeanDist;
			param.eatBeanFactor = info.EatBeanFactor;
			param.maxThinkInterval = info.MaxThinkInterval;
			param.minThinkInterval = info.MinThinkInterval;
			param.maxWanderInterval = info.MaxWanderInterval;
			param.minWanderInterval = info.MinWanderInterval;
			return param;
		}

		public RandomAISKinID(info:AIConfigInfo):number
		{
			return info.SkinIDs[this.m_Random.NextValue(0, info.SkinIDs.length - 1)];
		}

		public SetPause(pause:boolean)
		{
			this.m_Pause = pause;
		}

		public IsPaused():boolean
		{
			return this.m_Pause;
		}
		
		public CanRevive():boolean
		{
			return this.m_CanRevive;
		}

		public AddCmd(cmd:Cmd)
		{
			this.m_CmdQueue.push(cmd);
		}

		public GetAIName(id:number):string
		{
			let it = this.m_AIServerInfo[id];
			if (!it)
			{
				return "";
			}
			return it.name;
		}

		public GetAICountry(id:number):string
		{
			let it = this.m_AIServerInfo[id];
			if (!it)
			{
				return "CN";
			}
			return it.area;
		}

		public GetAISkinID(id:number):number
		{
			let it = this.m_AIServerInfo[id];
			if (!it)
			{
				return LocalPlayerDatabase.GetInstance().PlayerInfo.currentSkin.skinID;
			}
			return it.skinID;
		}
	};
}


