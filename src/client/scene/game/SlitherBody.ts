module wqq {
	import Vector2D = snake.Vector2;
	import Quad = eui.Image;

	export class SlitherBody {
		public PredictionFactor:number;
		private m_Head:Quad;
		
		public constructor() {
		}

		public IsDead(){

		}

		public GetHead():any{
			return null;
		}

		public GetDevouredCenter():Vector2D
		{
			/*Vector2D ret;
			float radius = m_Width * 0.5f;
			Vector2D offset(1.0, 0.0);
			Vector3D center = m_Head->GetPosition() + m_Head->GetUpVector() * (radius * offset.x + offset.y);
			ret.x = center.x;
			ret.y = center.y;
			return ret;*/
			return null;
		}

		public GetRawPoints():Array<Vector2D>{
			return null;
		}
		
		public GetWidth():number{
			return 0;
		}

		public GetSpeed():Vector2D{
			return null;
		}
		
		public GetHeadPos():Vector2D{
			return null;
		}

		public SetPredictSpeed(value:Vector2D){
			
		}

		public SetSpeed(value:Vector2D){
			
		}
		public SetAccelarating(value:boolean){
			
		}
	}
}