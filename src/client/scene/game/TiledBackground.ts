module wqq
{
	export class TiledBackground extends egret.DisplayObjectContainer
	{
		private m_Background: eui.Image;
		private m_ring: eui.Image;//环形
		private m_ring2: eui.Image;//环形

		public constructor(scene:BaseGameScene)
		{
			super();
			this.m_Background = new eui.Image("resource/res/icons/bg/scenebg1.jpg");
			this.m_Background.x = -500;
			this.m_Background.y = -500;
			scene.x = 500;
			scene.y = 500;
			this.m_Background.width = 1000.0;
			this.m_Background.height = 1000.0;
			//float u = 600.0f;
			//float v = 600.0f;
			this.addChild(this.m_Background);

			
			/*float this.m_Radius = this.m_Radius = GameRuntimeMP::GetInstance().SceneInitialize.sceneRadius;
			StandardMaterial *mat = new StandardMaterial();
			mat.SetDiffuseColor(0xff0000);
			mat.SetAlpha(0.4);
			mat.SetBlendMode(BlendMode::LAYER);
			mat.SetDepthTestEnable(false);

			this._ring = new Mesh(new AnnulusGeometry(1.2f, 1.0f, 60, false), mat);
			this._ring.SetX(this.m_Radius);
			this._ring.SetY(this.m_Radius);
			this._ring.Scale(this.m_Radius);

			mat = new StandardMaterial();
			mat.SetDiffuseColor(0xff0000);
			mat.SetDepthTestEnable(false);
			this._ring2 = new Mesh(new AnnulusGeometry(this.m_Radius + 0.1, this.m_Radius, 60, false), mat);
			this._ring2.SetX(this.m_Radius);
			this._ring2.SetY(this.m_Radius);

			this.addChild(this._ring);
			this.addChild(this._ring2);*/
		}

		public dispose()
		{
			this.removeChild(this.m_Background);
			this.m_Background = null;
		}
	}

}