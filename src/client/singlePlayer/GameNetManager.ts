module wqq 
{
	import Vector2D = snake.Vector2;

	export class ByteArray{
		private m_buff:Array<number>;
		private m_size:number;
		private m_pos:number;

		public constructor(buff:Array<number>,size:number){
			this.m_buff = buff;
			this.m_size = size;
			this.m_pos = 0;
		}

		public ReadByte():number{
			return this.m_buff[this.m_pos++];
		}

		public ReadUnsignedInt():number{
			return this.m_buff[this.m_pos++];
		}

		public ReadFloat():number{
			return this.m_buff[this.m_pos++];
		}

		public set position(p:number){
			this.m_pos = p;
		}
	}

	export enum CmdIDs
	{
		kRpcSlitherHeadSync = 10001,
		kRpcSlitherBodySync = 10002,
		kRpcPlayerInfoSync = 10003,
		kRpcBeanRefresh = 10004,
		kRpcBeanSpawned = 10005,
		kRpcBeanDevoured = 10006,
		kRpcRankSync = 10007,
		kRpcMiniMapSync = 10008,
		kRpcReSpawn = 10009,
		kRpcSlitherBirthDeathSync = 10010,
		kRpcSceneInitialize = 10011
	};

	export class NameInfo
	{
		public id:number = 0;
		public roleID:number = 0;
		public name:string;
		public area:string;
		public icon:string;
		public npc:boolean = false;
		public skinID:number = 0;
		public hangWidgetID:number = 0;
		public decorationID:number = 0;
		public tailPipeID:number = 0;
		public wingsID:number = 0;
		public defaultSkinID:number = 0;

		public ParseData(bytes:ByteArray){

		}
	};

	export class MiniSlitherInfo
	{
		public id:number;
		public head:Vector2D = new Vector2D();
		public totalKill:number;

		public ParseData(data:ByteArray){
			this.id = data.ReadUnsignedInt();
			this.head.x = data.ReadFloat();
			this.head.y = data.ReadFloat();
			this.totalKill = data.ReadByte();
		}
	};

	export class MiniFlyBeanInfo
	{
		public id:number;
		public type:number;
		public teamOrderId:number;
		public position:Vector2D = new Vector2D();

		public ParseData(data:ByteArray){
			this.id = data.ReadUnsignedInt();
			this.type = data.ReadByte();
			this.teamOrderId = data.ReadByte();
			this.position.x = data.ReadFloat();
			this.position.y = data.ReadFloat();
		}
	};

	export class SlitherPlayerInfo
	{
		public playerRank:number;
		public continueKillCount:number;
		public totalKillCount:number;
		public score:number;
		public length:number;
		public ParseData(data:ByteArray){
			this.playerRank = data.ReadByte();
			this.continueKillCount = data.ReadByte();
			this.totalKillCount = data.ReadByte();
			this.score = data.ReadFloat();
		}
	};

	export enum SlitherBirthDeath
	{
		EnterView = 1,
		ExitView = 2,
	};

	export class SlitherBirthDeathInfo
	{
		public type:SlitherBirthDeath;//1表示进视野，2表示出视野
		public id:number;

		public ParseData(data:ByteArray){
			this.type = data.ReadByte();
			this.id = data.ReadUnsignedInt();
		}
	};

	export class BeanInfo
	{
		public id:number;
		public pos:Vector2D = new Vector2D();
		public value:number;

		public ParseData(bytes:ByteArray){
			this.id = bytes.ReadByte();
			this.pos.x = bytes.ReadByte();
			this.pos.y = bytes.ReadByte();
			this.value = bytes.ReadByte();
		}
	};

	export class RankInfo
	{
		public id:number;
		public score:number;
		public slitherNum:number;
		public winningMultiplier:number;
		public ParseData(data:ByteArray){
			this.id = data.ReadUnsignedInt();
			this.score = data.ReadFloat();
			this.slitherNum = data.ReadByte();
			this.winningMultiplier = data.ReadByte();
		}
	};

	export class SlitherBodyInfo
	{
		public id:number;
		public points:Array<Vector2D> = [];

		public ParseData(bytes:ByteArray){
			this.id = bytes.ReadUnsignedInt();
			let count = bytes.ReadByte();
			let points = this.points;
			points.length = count;
			for (let i = 0; i < count; ++i) {
				points[i] = new Vector2D(bytes.ReadByte(), bytes.ReadByte());
			}
		}
	};

	export class SlitherHeadInfo
	{
		public ParseData(data:ByteArray){
			this.id = data.ReadUnsignedInt();
			this.speed.x = data.ReadByte();
			this.speed.y = data.ReadByte();
			this.head.x = data.ReadByte();
			this.head.y = data.ReadByte();
			this.length = data.ReadFloat();
			this.width = data.ReadByte();
		}
		public id:number;
		public speed:Vector2D = new Vector2D();
		public head:Vector2D = new Vector2D();
		public length:number;
		public width:number;
	};

	export class CMDRecvBase
	{
		public msgID:number = 0;
		public constructor(msg_id:number){ 
			this.msgID = msg_id;
		}
		public ParseData(bytes:ByteArray) { }
	};

	export class RpcReSpawn extends CMDRecvBase
	{
		public playerID:number;
		public playerNameInfo:NameInfo = new NameInfo();
		public initialPos:Vector2D = new Vector2D(); 

		public constructor(){
			super(CmdIDs.kRpcReSpawn);
		}
	};

	export class RpcSlitherBirthDeathSync extends CMDRecvBase
	{
		public slithers:Array<SlitherBirthDeathInfo> = [];
		public constructor(){
			super(CmdIDs.kRpcSlitherBirthDeathSync);
		}
		public ParseData(data:ByteArray){
			let count = data.ReadByte();
			let slithers = this.slithers;
			slithers.length = count;
			for (let i = 0; i < count; ++i) {
				slithers[i] = new SlitherBirthDeathInfo();
				slithers[i].ParseData(data);
			}
		}

	};

	export class RpcBeanSpawned extends CMDRecvBase
	{
		public beans:Array<BeanInfo> = [];
		public constructor(){
			super(CmdIDs.kRpcBeanSpawned);
		}
		public ParseData(bytes:ByteArray){
			let count = bytes.ReadByte();
			let beans = this.beans;
			beans.length = count;
			for (let i = 0; i < count; ++i) {
				beans[i] = new BeanInfo();
				beans[i].ParseData(bytes);
			}
		}

	};

	export class RpcBeanDevoured extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcBeanDevoured);
		}
		public ParseData(bytes:ByteArray){
			this.kill = bytes.ReadByte() == 1 ? true : false;
			let count = bytes.ReadByte();
			let beanIDs = this.beanIDs;
			beanIDs.length = count;
			for (let i = 0; i < count; ++i) {
				beanIDs[i] = bytes.ReadByte();
			}
			count = bytes.ReadByte();
			let slitherIDs = this.slitherIDs;
			slitherIDs.length = count;
			for (let i = 0; i < count; ++i) {
				slitherIDs[i] = bytes.ReadUnsignedInt();
			}
		}
		public kill:boolean; // 是否为击杀吃豆
		public beanIDs:Array<number> = [];
		public slitherIDs:Array<number> = [];
	};
	
	export class RpcPlayerInfoSync extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcPlayerInfoSync);
		}
		public ParseData(data:ByteArray){
			this.playerInfo.ParseData(data);
		}

		public playerInfo:SlitherPlayerInfo = new SlitherPlayerInfo();
	};

	export class RpcSlitherHeadSync extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcSlitherHeadSync);
		}
		public ParseData(bytes:ByteArray){
			let count = bytes.ReadByte();
			let slithers = this.slithers;
			slithers.length = count;
			for (let i = 0; i < count; ++i) {
				slithers[i] = new SlitherHeadInfo();
				slithers[i].ParseData(bytes);
			}
		}

		public slithers:Array<SlitherHeadInfo> = [];
	};
	
	export class RpcSlitherBodySync extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcSlitherBodySync);
		}
		public ParseData(bytes:ByteArray){
			let count = bytes.ReadByte();
			let slithers = this.slithers;
			slithers.length = (count);
			for (let i = 0; i < count; ++i) {
				slithers[i] = new SlitherBodyInfo();
				slithers[i].ParseData(bytes);
			}
		}

		public slithers:Array<SlitherBodyInfo> = [];
	};

	export class RpcBeanRefresh extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcBeanRefresh);
		}
		public ParseData(bytes:ByteArray){
			let count = bytes.ReadByte();
			let beans = this.beans;
			beans.length = (count);
			for (let i = 0; i < count; ++i) {
				beans[i] = new BeanInfo();
				beans[i].ParseData(bytes);
			}
		}

		public beans:Array<BeanInfo> = [];
	};

	export class RpcRankSync extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcRankSync);
		}
		public ParseData(bytes:ByteArray){
			let count = bytes.ReadByte();
			let topRanks = this.topRanks;
			topRanks.length = (count);
			for (let i = 0; i < count; ++i) {
				topRanks[i] = new RankInfo();
				topRanks[i].ParseData(bytes);
			}
			this.totalPlayerNum = bytes.ReadByte();
		}
		public topRanks:Array<RankInfo> = [];
		public totalPlayerNum:number;
	};

	export class RpcMiniMapSync extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcMiniMapSync);
		}
		public ParseData(data:ByteArray){
			let count = data.ReadByte();
			let slithers = this.slithers;
			slithers.length = (count);
			for (let i = 0; i < count; ++i) {
				slithers[i] = new MiniSlitherInfo();
				slithers[i].ParseData(data);
			}

			count = data.ReadByte();//slithersRed
			count = data.ReadByte();//slithersGreen
			count = data.ReadByte();//slithersYellow
			count = data.ReadByte();//slithersNpc
			count = data.ReadByte();//flyBeans
		}

		public slithers:Array<MiniSlitherInfo> = [];
		public slithersRed:Array<MiniSlitherInfo> = [];
		public slithersGreen:Array<MiniSlitherInfo> = [];
		public slithersYellow:Array<MiniSlitherInfo> = [];
		public slithersNpc:Array<MiniSlitherInfo> = [];
		public flyBeans:Array<MiniFlyBeanInfo> = [];
	};

	/** 开始场景配置 */
	export class RpcSceneInitialize extends CMDRecvBase
	{
		public constructor(){
			super(CmdIDs.kRpcSceneInitialize);
		}
		public sceneRadius = 0;
		public timeTotal = 0;
		public timeLeft = 0;
		public doubleTimeFromStart = 0;//游戏开始多少秒后进入双倍时间
		public bossFromStart = 0;//游戏开始多少秒后出现boss
		public collisionDistance = 0; // 客户端死亡判定的起始距离（从蛇头开始算）
		public playMode = 0; // 游戏模式GamePlayMode
		public frameStep = 0; // 缩圈系数
		public EnterGameTime = 0; // 开始游戏时间
	};

	export class GameNetManager {
		private static m_Instance:GameNetManager = null;
		public static GetInstance():GameNetManager{
			if (GameNetManager.m_Instance == null){
				GameNetManager.m_Instance = new GameNetManager();
			}
			return GameNetManager.m_Instance;
		}
		private m_LocalRpcMsgs:Array<CMDRecvBase> = [];
		private m_started:boolean;
		public constructor() {
		}

		public StartInfinite(){
			if (this.m_started){
				return;
			}
			this.m_LocalRpcMsgs.length = 0;
			this.m_started = true;
			egret.startTick(this.UpdateInfinite, this);
		}

		public StopInfinite(){
			this.m_LocalRpcMsgs.length = 0;
			this.m_started = false;
			egret.stopTick(this.UpdateInfinite, this);
		}

		public UpdateInfinite(timeStamp:number):boolean{
			while (this.m_LocalRpcMsgs.length > 0)
			{
				let msg = this.m_LocalRpcMsgs.shift();
				lemon.NotifyManager.sendNotification("GameNet_" + msg.msgID, msg);
			}
			return true;
		}

		public LocalRpc(cmd:CMDRecvBase){
			this.m_LocalRpcMsgs.push(cmd);
		}

		public AddEventListener(type:number, callback:Function, thisObj:any){
			lemon.NotifyManager.registerNotify("GameNet_" + type, callback, thisObj);
		}

		public RemoveEventListener(type:number, callback:Function, thisObj:any){
			lemon.NotifyManager.unRegisterNotify("GameNet_" + type, callback, thisObj);
		}
	}
}