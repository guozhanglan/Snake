module wqq
{
	export enum SceneType
	{
		kSceneLobby,
		kSceneGame,
		kSceneTotal
	};

	export class BaseGameScene extends egret.DisplayObjectContainer
	{
		protected m_SceneType:SceneType;
		public constructor(type:SceneType)
		{
			super();
			this.m_SceneType = type;
		}

		public ShowElements() { }
		public HideElements() { }
		public Update(deltaTime:number) { }
		public Enter() { }
		public Leave() { }
		public Resize() { }
		public dispose() { }

		public GetSceneType():SceneType { return this.m_SceneType; }
	
	};
}