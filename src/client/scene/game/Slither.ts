module wqq {
	import Vector2D = snake.Vector2;

	export class Slither {
		public m_Body:SlitherBody;
		public constructor(body:SlitherBody) {
			this.m_Body = body;
		}

		public SetName(name:string){

		}
		
		public GetName():string{
			return null;
		}

		public GetID():number{
			return 0;
		}
		
		public GetScore():number{
			return 0;
		}
		
		public GetBody():any{
			return null;
		}

		public SetArea(area:string){

		}

		public SetController(value:any){
			
		}

		public Sync(id:number){

		}
		
		public SyncPoints(points:Array<Vector2D>){

		}

		public SyncInfo(info:SlitherHeadInfo){

		}

		public SyncPlayerInfo(playerInfo:SlitherPlayerInfo)
		{
			
		}

		public Update(delayTime:number){

		}

		public dispose(){

		}
	}
}