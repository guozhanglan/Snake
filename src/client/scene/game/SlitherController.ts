module wqq 
{
	import Vector2D = snake.Vector2;

	export function Dot(lhs:Vector2D, rhs:Vector2D):number { return lhs.x * rhs.x + lhs.y * rhs.y; }
	export function GetLength(v:Vector2D) :number { return Math.sqrt(Dot(v, v)); }
	export function GetLengthSquared(v:Vector2D) :number { return Dot(v, v); }

	export class SlitherController 
	{
		protected m_SlitherBody:SlitherBody;
		protected m_Slither:Slither;
		protected m_TargetDirection:Vector2D = new Vector2D();
		protected m_IsAccelarating:boolean;
		protected m_LinearSpeed:number;
		protected m_LastPhysicsTime:number;

		public EnableLocalControl:boolean;
		public LinearSpeedNormal:number;
		public LinearSpeedFast:number;
		public LinearAccelartion:number;
		public RotationFactorNormal:number;
		public RotationFactorFast:number;
		public MinAccelarateScore:number;

		public constructor(target:SlitherBody, slither:Slither) {
			this.EnableLocalControl = false;
			this.LinearSpeedNormal = 3.0;
			this.LinearSpeedFast=5.0;
			this.LinearAccelartion=10.0;
			this.RotationFactorNormal=3.0;
			this.RotationFactorFast=6.0;
			this.MinAccelarateScore=20.0;
			this.m_IsAccelarating=false;
			this.m_LinearSpeed=0;
			this.m_LastPhysicsTime=-1;
			this.m_TargetDirection=new Vector2D(1, 0)
			this.m_SlitherBody = target;
			this.m_Slither = slither;
		}

		public Update(deltaTime:number)
		{
			if (this.EnableLocalControl && !this.m_SlitherBody.IsDead() && !GameScene.Inst.IsGameOver()) {
				this.UpdateSpeed(deltaTime);
			}
		}
		
		public UpdateSpeed(deltaTime:number)
		{
			if (this.GetAccelarating()) {
				this.m_LinearSpeed += deltaTime * this.LinearAccelartion;
			} else {
				this.m_LinearSpeed -= deltaTime * this.LinearAccelartion;
			}
			this.m_LinearSpeed = snake.clamp(this.m_LinearSpeed, this.LinearSpeedNormal, this.LinearSpeedFast);
			let k = (this.m_LinearSpeed - this.LinearSpeedNormal) / (this.LinearSpeedFast - this.LinearSpeedNormal);
			let rotationdFactor = snake.lerp(this.RotationFactorNormal, this.RotationFactorFast, k);
			let rotationSpeed = rotationdFactor / this.m_SlitherBody.GetWidth();
			let dir:Vector2D = new Vector2D();
			dir.vec = this.m_SlitherBody.GetSpeed();
			dir = snake.Normalize(dir);
			let newDir = snake.RotateTowards(dir, this.m_TargetDirection, rotationSpeed * deltaTime);
			this.m_SlitherBody.SetSpeed(newDir.mul(this.m_LinearSpeed));
			this.m_SlitherBody.SetAccelarating(this.GetAccelarating());
		}
		
		public SetTargetDirection(dir:Vector2D)
		{
			this.m_TargetDirection.vec = dir;
		}
		
		public SetAccelarating(accelarating:boolean)
		{
			this.m_IsAccelarating = accelarating;
		}
		
		public GetTargetDirection():Vector2D
		{
			return this.m_TargetDirection;
		}
		
		public GetAccelarating():boolean
		{
			return this.m_IsAccelarating && this.m_Slither.GetScore() > this.MinAccelarateScore;
		}
		
		public GetScore():number
		{
			return this.m_Slither.GetScore();
		}

		public GetSlither():Slither
		{
			return this.m_Slither;
		}

		public GetSlitherBody():SlitherBody
		{
			return this.m_SlitherBody;
		}
	}

	export class PlayerController extends SlitherController
	{
		public constructor(target:SlitherBody, slither:Slither){
			super(target, slither);
			PlayerController.Ins = this;
			this.SetDefaultName();
		}
		public dispose(){
			PlayerController.Ins = null;
		}
		public Update(deltaTime:number){
			super.Update(deltaTime);

			if (!this.m_AsyncSpeed && this.m_SlitherBody.GetRawPoints().length != 0) {
				this.m_TargetDirection.vec = this.m_SlitherBody.GetSpeed();
				this.m_TargetDirection = snake.Normalize(this.m_TargetDirection);
				this.m_AsyncSpeed = true;
			}

			if (this.m_SlitherBody.IsDead() || GameScene.Inst.IsGameOver()) {
				this.m_SlitherBody.PredictionFactor = 0.0;
			} else {
				this.PredictSpeed(deltaTime);
			}
		}
		public SetDefaultName(){
			let name = LocalPlayerDatabase.GetInstance().PlayerInfo.name;
			this.m_Slither.SetName(name);
		}
		public OnDie(){
			this.DiePosition.vec = this.m_SlitherBody.GetHeadPos();
			this.HasDiePosition = true;

			/*if (GameScene.Inst && GameScene.Inst.HasEventListener(InGameEvent.kInGamePlayerPlayerDead)) {
				Event gameEvent(InGameEvent.kInGamePlayerPlayerDead);
				GameScene.Inst.DispatchEvent(&gameEvent);
			}*/
		}
		public PredictSpeed(deltaTime:number){
			let vel = GetLength(this.m_SlitherBody.GetSpeed());
			let k = (vel - this.LinearSpeedNormal) / (this.LinearSpeedFast - this.LinearSpeedNormal);
			let rotationdFactor = snake.lerp(this.RotationFactorNormal, this.RotationFactorFast, k);
			let rotationSpeed =  rotationdFactor / this.m_SlitherBody.GetWidth();
			let dir:Vector2D = new Vector2D();
			dir.vec = this.m_SlitherBody.GetSpeed();
			dir = snake.Normalize(dir);
			let targetDir = this.GetTargetDirection();
			let newDir = snake.RotateTowards(dir, targetDir, rotationSpeed * deltaTime);
			this.m_SlitherBody.SetPredictSpeed(newDir.mul(vel));
		}

		public SetAccelarating(accelarating:boolean){
			if (this.m_IsAccelarating != accelarating)
			{
				this.SetAccelarating(accelarating);
				this.SendTurnCMD();
			}
		}
		public SetTargetDirection(dir:Vector2D){
			
			if (GetLength(this.m_TargetDirection.sub(dir)) > 1e-2)
			{
				this.SetTargetDirection(dir);
				this.SendTurnCMD();
			}
		}

		public m_FsmDieEventName:string = "PLAYER DIE";
		public m_DefaultName:string;

		public HasDiePosition:boolean;
		public DiePosition:Vector2D = new Vector2D();

		public static Ins:PlayerController = null;

		private SendTurnCMD(){
			this.m_TargetDirection  = snake.Normalize(this.m_TargetDirection);
			GameScene.Inst.SendSlitherCmd(this.m_TargetDirection, this.m_IsAccelarating);
		}

		private m_AsyncSpeed:boolean = false;
	};
}