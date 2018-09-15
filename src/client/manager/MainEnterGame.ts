module wqq {
	export class MainEnterGame {
		public SceneInitialize:RpcSceneInitialize;
		public constructor() {
		}

		private static m_Instance:MainEnterGame = null;
		public static GetInstance():MainEnterGame{
			if (MainEnterGame.m_Instance == null){
				MainEnterGame.m_Instance = new MainEnterGame();
			}
			return MainEnterGame.m_Instance;
		}

		public start(){
			let now = egret.getTimer();
			let params:GameSceneSPParams = new GameSceneSPParams();
			let rpcSceneInitialize:RpcSceneInitialize = new RpcSceneInitialize();
			rpcSceneInitialize.sceneRadius = params.radius;
			rpcSceneInitialize.timeTotal = params.initialRunTime;//3*60s=3minutes
			rpcSceneInitialize.timeLeft = params.initialRunTime;
			rpcSceneInitialize.doubleTimeFromStart = 300;//游戏开始多少秒后进入双倍时间
			rpcSceneInitialize.bossFromStart = 999999;//游戏开始多少秒后出现boss
			rpcSceneInitialize.collisionDistance = 3.0; // 客户端死亡判定的起始距离（从蛇头开始算）
			rpcSceneInitialize.playMode = 0
			rpcSceneInitialize.frameStep = params.frameStep; // 缩圈系数
			rpcSceneInitialize.EnterGameTime = now;
			
			this.SceneInitialize = rpcSceneInitialize;
			
			let inGameScene = new GameSceneSP();
			let setting = inGameScene.GetSetting();
			LayerManager.getInstance().ReplaceScene(inGameScene);
			GameNetManager.GetInstance().StartInfinite();
			LocalServerSP.Ins().InitServer(setting.ingameSceneParams, setting.serverParams);
			LocalServerSP.Ins().CreatePlayer(setting.serverParams.initialScore, true);
		}
	}
}