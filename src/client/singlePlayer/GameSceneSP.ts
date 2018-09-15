module wqq
{
	import Vector2 = snake.Vector2;
	export class AIRatio
	{
		public time:number;
		public configs:Array<number> = [];
	};

	export class Params
	{
		public emptySize = 5.0;
		public    tryFitCount = 30;
		public  rankCount = 10;
		public    aiCount = 40;
		public aiOutsideRatio = 0.7;
		public initialScore = 0.2;
		public posSyncInterval = 0.05;
		public rankSyncInterval = 1.0;
		public minimapSyncInterval = 1.0;
		public compensateAIInterval = 0.5;
		public refreshBeanInterval = 5.0;
		public frameInterval = 0.016;
		public testing = false;
		public aiRatio:Array<AIRatio> = [];
	};

	export class GameSceneSPParams
	{
		public radius = 50.0;
		public physicsTimeStep = 0.05;
		public frameStep = 0.7;
		public collisionThreshold = 0.7;
		public initialBeanSigma = 5.0;
		public initialBeanMin = 0.2;
		public initialBeanMax = 0.2;
		public  initialRunTime = 180;
		public  initialBeanCount = 1000;
		public accelarateScoreInterval = 0.2;
		public accelarateScoreLost = 0.1;
		public accelarateScoreRatio = 1;
		public baseScore = 0.2;
		public scoreScale = 100.0;
		public scoreVisualScale = 1.1;
		public devourBase = 0.5;
		public devourScale = 1.5;
		public devourDegree = 120.0;
		public dieScoreBase = 2.5;
		public dieScoreCountRatio = 2.5;
		public dieScorePercent = 0.6;
		public dieScoreRandOffset = 1.5;
		public dieScoreVisualScale = 0.7;
		public   headTestStart = 1;
		public headTestEndFactor = 0.8;
		public linearAccelartion = 10.0;
		public linearDeccelartion = 6.6;
		public linearSpeedNormal = 3.0;
		public linearSpeedFast = 5.3;
		public   killBeanCount = 10;
		public   killBeanMaxPoint = 30;
		public killBeanScoreRatio = 0.1;
		public   compensateBeanCount = 2;
		public compensateBeanThreshold = 30.0;
		public compensateBeanDistance = 1.0;
		public compensateBeanRadius = 3.0;
		public compensateBeanInterval = 2.0;
		public aiAccelarateMinScore = 10.0;
		public aiKillMinScore = 30.0;
		public scoreLengthSize = 22;
		public scoreWidthSize = 21;
		public widthRotateSize = 30;
		public widthToViewSize = 11;
		public scoreLength:Array<Vector2> = [];
		public scoreWidth:Array<Vector2> = [];
		public widthRotateNormal:Array<Vector2> = [];
		public widthRotateFast:Array<Vector2> = [];
		public widthToView:Array<Vector2> = [];
	};

	export class GameSceneSPSettings
	{
		public serverParams:Params = new Params();
		public ingameSceneParams:GameSceneSPParams = new GameSceneSPParams();
	};

	export class GameSceneSP extends GameScene
	{
		private m_Settings:GameSceneSPSettings;
		public SetSlitherNameInfo(slither:Slither, id:number){
			let nameInfo = this.GetNameInfo(id);
			slither.SetName(nameInfo.name);
			slither.GetBody().SetSkinID(LocalServerSP.Ins().GetAISkinID(id));
			slither.GetBody().SetNameInfo(nameInfo);
		}

		public constructor(){
			super();
			this.m_Settings = new GameSceneSPSettings();
			let aiRatios = this.m_Settings.serverParams.aiRatio;
			let aiRatio = new AIRatio();
			aiRatio.time = 30;
			aiRatio.configs = [12,0,0,0,0,0,0,0,0];
			aiRatios.push(aiRatio);

			aiRatio = new AIRatio();
			aiRatio.time = 60;
			aiRatio.configs = [2,3,3,0,0,0,0,0,0];
			aiRatios.push(aiRatio);

			aiRatio = new AIRatio();
			aiRatio.time = 120;
			aiRatio.configs = [2,2,3,3,0,0,0,0,0];
			aiRatios.push(aiRatio);

			aiRatio = new AIRatio();
			aiRatio.time = 240;
			aiRatio.configs = [2,2,2,2,1.85,1.85,0.15,0.15,0];
			aiRatios.push(aiRatio);

			aiRatio = new AIRatio();
			aiRatio.time = 420;
			aiRatio.configs = [2,1,1,1,1.75,1.75,0.25,0.25,0];
			aiRatios.push(aiRatio);

			aiRatio = new AIRatio();
			aiRatio.time = 600;
			aiRatio.configs = [1,3,3,3,7,7,1,1,0];
			aiRatios.push(aiRatio);
			
			//init AnimationCurve data
			let scoreLength = this.m_Settings.ingameSceneParams.scoreLength;
			let scoreWidth = this.m_Settings.ingameSceneParams.scoreWidth;
			let widthRotateNormal = this.m_Settings.ingameSceneParams.widthRotateNormal;
			let widthRotateFast = this.m_Settings.ingameSceneParams.widthRotateFast;
			let widthToView = this.m_Settings.ingameSceneParams.widthToView;

			scoreLength[0] = new Vector2(0.2, 1.3);
			scoreLength[1] = new Vector2(5.0, 5.7);
			scoreLength[2] = new Vector2(8.0, 8.0);
			scoreLength[3] = new Vector2(10.0, 9.3);
			scoreLength[4] = new Vector2(25.0, 15.9);
			scoreLength[5] = new Vector2(50.0, 22.5);
			scoreLength[6] = new Vector2(80.0, 27.5);
			scoreLength[7] = new Vector2(100.0, 29.9);
			scoreLength[8] = new Vector2(150.0, 34.6);
			scoreLength[9] = new Vector2(200.0, 37.8);
			scoreLength[10] = new Vector2(300.0, 42.3);
			scoreLength[11] = new Vector2(400.0, 45.4);
			scoreLength[12] = new Vector2(500.0, 47.6);
			scoreLength[13] = new Vector2(700.0, 50.9);
			scoreLength[14] = new Vector2(1183.9, 57.3);
			scoreLength[15] = new Vector2(1186.9, 57.3);
			scoreLength[16] = new Vector2(1190.2, 57.4);
			scoreLength[17] = new Vector2(1192.6, 57.4);
			scoreLength[18] = new Vector2(10276.2, 148.2);
			scoreLength[19] = new Vector2(10307.7, 148.5);
			scoreLength[20] = new Vector2(23589.9, 227.6);
			scoreLength[21] = new Vector2(101305.9, 334.8);

			scoreWidth[0] = new Vector2(0.2,0.3);
			scoreWidth[1] = new Vector2(5.0,0.4);
			scoreWidth[2] = new Vector2(10.0,0.5);
			scoreWidth[3] = new Vector2(25.0,0.6);
			scoreWidth[4] = new Vector2(50.0,0.7);
			scoreWidth[5] = new Vector2(80.0,0.8);
			scoreWidth[6] = new Vector2(100.0,0.8);
			scoreWidth[7] = new Vector2(150.0,0.9);
			scoreWidth[8] = new Vector2(180.0,1.0);
			scoreWidth[9] = new Vector2(200.0,1.0);
			scoreWidth[10] = new Vector2(300.0,1.2);
			scoreWidth[11] = new Vector2(500.0,1.4);
			scoreWidth[12] = new Vector2(700.0,1.6);
			scoreWidth[13] = new Vector2(1118.2,2.0);
			scoreWidth[14] = new Vector2(1123.8, 2.0);
			scoreWidth[15] = new Vector2(1130.0, 2.0);
			scoreWidth[16] = new Vector2(1196.8, 2.0);
			scoreWidth[17] = new Vector2(1394.9, 2.0);
			scoreWidth[18] = new Vector2(10300.1,2.5);
			scoreWidth[19] = new Vector2(16575.5,2.6);
			scoreWidth[20] = new Vector2(100000.0,2.8);

			widthRotateNormal[0] = new Vector2(0.0,3.1);
			widthRotateNormal[1] = new Vector2(0.4,3.1);
			widthRotateNormal[2] = new Vector2(0.4,3.2);
			widthRotateNormal[3] = new Vector2(0.5, 3.2);
			widthRotateNormal[4] = new Vector2(0.5, 3.4);
			widthRotateNormal[5] = new Vector2(0.5, 3.4);
			widthRotateNormal[6] = new Vector2(0.5, 3.5);
			widthRotateNormal[7] = new Vector2(0.6, 3.5);
			widthRotateNormal[8] = new Vector2(0.6, 3.6);
			widthRotateNormal[9] = new Vector2(0.7, 3.6);
			widthRotateNormal[10] = new Vector2(0.7, 3.7);
			widthRotateNormal[11] = new Vector2(0.8, 3.7);
			widthRotateNormal[12] = new Vector2(0.8, 3.8);
			widthRotateNormal[13] = new Vector2(0.8, 3.8);
			widthRotateNormal[14] = new Vector2(0.8, 3.9);
			widthRotateNormal[15] = new Vector2(0.9, 3.9);
			widthRotateNormal[16] = new Vector2(0.9, 4.0);
			widthRotateNormal[17] = new Vector2(1.0, 4.0);
			widthRotateNormal[18] = new Vector2(1.0, 4.3);
			widthRotateNormal[19] = new Vector2(1.3, 4.3);
			widthRotateNormal[20] = new Vector2(1.3, 4.5);
			widthRotateNormal[21] = new Vector2(1.6, 4.5);
			widthRotateNormal[22] = new Vector2(1.6, 4.6);
			widthRotateNormal[23] = new Vector2(1.8, 4.6);
			widthRotateNormal[24] = new Vector2(1.8, 4.8);
			widthRotateNormal[25] = new Vector2(2.0, 4.8);
			widthRotateNormal[26] = new Vector2(2.0, 4.9);
			widthRotateNormal[27] = new Vector2(2.2, 4.9);
			widthRotateNormal[28] = new Vector2(2.2, 5.0);
			widthRotateNormal[29] = new Vector2(3.0, 5.0);

			widthRotateFast[0] = new Vector2(0.0, 5.5);
			widthRotateFast[1] = new Vector2(0.4, 5.5);
			widthRotateFast[2] = new Vector2(0.4, 5.7);
			widthRotateFast[3] = new Vector2(0.5, 5.7);
			widthRotateFast[4] = new Vector2(0.5, 5.9);
			widthRotateFast[5] = new Vector2(0.5, 5.9);
			widthRotateFast[6] = new Vector2(0.5, 6.2);
			widthRotateFast[7] = new Vector2(0.6, 6.2);
			widthRotateFast[8] = new Vector2(0.6, 6.4);
			widthRotateFast[9] = new Vector2(0.7, 6.4);
			widthRotateFast[10] = new Vector2(0.7, 6.6);
			widthRotateFast[11] = new Vector2(0.8, 6.6);
			widthRotateFast[12] = new Vector2(0.8, 6.7);
			widthRotateFast[13] = new Vector2(0.8, 6.7);
			widthRotateFast[14] = new Vector2(0.8, 6.9);
			widthRotateFast[15] = new Vector2(0.9, 6.9);
			widthRotateFast[16] = new Vector2(0.9, 7.1);
			widthRotateFast[17] = new Vector2(1.0, 7.1);
			widthRotateFast[18] = new Vector2(1.0, 7.5);
			widthRotateFast[19] = new Vector2(1.3, 7.5);
			widthRotateFast[20] = new Vector2(1.3, 8.0);
			widthRotateFast[21] = new Vector2(1.6, 8.0);
			widthRotateFast[22] = new Vector2(1.6, 8.2);
			widthRotateFast[23] = new Vector2(1.8, 8.2);
			widthRotateFast[24] = new Vector2(1.8, 8.4);
			widthRotateFast[25] = new Vector2(2.0, 8.4);
			widthRotateFast[26] = new Vector2(2.0, 8.6);
			widthRotateFast[27] = new Vector2(2.2, 8.6);
			widthRotateFast[28] = new Vector2(2.2, 8.8);
			widthRotateFast[29] = new Vector2(3.0, 8.8);

			widthToView[0] = new Vector2(0.0, 3.675);
			widthToView[1] = new Vector2(0.4, 3.675);
			widthToView[2] = new Vector2(0.5, 4.1);
			widthToView[3] = new Vector2(0.65, 4.633);
			widthToView[4] = new Vector2(0.75, 4.841);
			widthToView[5] = new Vector2(0.8, 4.91);
			widthToView[6] = new Vector2(1.0, 5.25);
			widthToView[7] = new Vector2(1.5, 6.0);
			widthToView[8] = new Vector2(1.971, 6.471);
			widthToView[9] = new Vector2(2.654, 2.801);
			widthToView[10] = new Vector2(3.2, 6.868);

			this.m_Time = 0;
			this.m_Radius = this.m_Settings.ingameSceneParams.radius;
			this.m_PlayerID = LocalPlayerDatabase.GetInstance().LoginInfo.roleID;//>1234000
		}

		public GetSetting():GameSceneSPSettings {
			return this.m_Settings;
		}
		public GetPlayerID():number{
			return this.m_PlayerID;
		}
		public BackToLobby(){
			LocalServerSP.Ins().Stop();
			super.BackToLobby();
		}

		public IsPaused(){

		}

		public Pause(pause:boolean){
			LocalServerSP.Ins().SetPause(pause);
		}

		public GetNameInfo(id:number):NameInfo{
			let it = this.allNames[id];
			if (!it) {
				let nameInfo = new NameInfo();
				nameInfo.id = id;
				nameInfo.npc = true;
				nameInfo.name = LocalServerSP.Ins().GetAIName(id);
				nameInfo.area = LocalServerSP.Ins().GetAICountry(id);
				this.allNames[id] = nameInfo;
				return nameInfo;
			}
			return it;
		}

		public GetTimeLeft():number{
			let ElapseTS = LocalServerSP.Ins().GetRunTime();
			//float TimeLeftSec = m_Settings.ingameSceneParams.initialRunTime - ElapseTS;
			return ElapseTS;
		}

		public SendSlitherCmd(targetDirection:Vector2, accelarating:boolean){
			let turnDir:Vector2 = new Vector2(targetDirection.x, targetDirection.y);
			let cmd = new SlitherPlayerCmd();
			cmd.playerID = this.GetPlayerID();
			cmd.accelarating = accelarating;
			cmd.turnDir = turnDir;
			LocalServerSP.Ins().AddCmd(cmd);
		}
	};
}
