module wqq
{
	import Vector2D = snake.Vector2;

	function GetTime():number{
		return egret.getTimer()/1000;
	}
	
	class BeanView extends eui.Image
	{
		public constructor(texture:any){
			super();
		}

		public id:number;
		public bornTime:number;
		public beanWidth:number;
		public devoured = false;
		public kill = false;
		public devouredTime:number;
		public devouredTarget:SlitherBody;
		public pos:Vector2D = new Vector2D();
		public initPos:Vector2D = new Vector2D();
		public devouredDistance:number;
		public circlingPeriod:number;
		public circlingRadius:number;

		public Reset()
		{
			this.devoured = false;
			this.kill = false;
		}

		public SetWidth(value:number){
			this.width = value;
		}

		public SetHeight(value:number){
			this.height = value;
		}

		
		public SetPosition(x:number, y:number){
			this.x = x;
			this.y = y;
		}
		
		public dispose()
		{
			this.devoured = false;
			this.kill = false;
		}
	};

	export class GameSceneBeanView extends egret.DisplayObjectContainer
	{
		private _gameScene:GameScene;
		private _beans:Object = new Object;
		private _idleBeans:Array<BeanView> = [];//可重新利用的quad
		private _startScaleTweenDuration = 0.4;
		private _maxDevouredDistance = 100.0;
		private _beanRadius = 0.3;
		private _valueScale = new AnimationCurve();
		private _devouredScale = new AnimationCurve();
		private _devouredSpeed = new AnimationCurve();

		//-----------------------------------------GameSceneBeanView-----------------------------------
		public constructor(gameScene:GameScene)
		{
			super();
			this._gameScene = gameScene;
			this._valueScale.AddKey(0,0.376);
			this._valueScale.AddKey(0.2, 0.8);
			this._valueScale.AddKey(0.3, 0.975);
			this._valueScale.AddKey(0.4, 1.115);
			this._valueScale.AddKey(0.583, 1.284);
			this._valueScale.AddKey(1.0, 1.675);
			this._valueScale.AddKey(1.5, 1.9);
			this._valueScale.AddKey(2.0, 1.985);
			this._valueScale.AddKey(2.5, 2.0);

			this._devouredScale.AddKey(0,0.2);
			this._devouredScale.AddKey(0.2, 0.515);
			this._devouredScale.AddKey(0.4, 0.735);
			this._devouredScale.AddKey(0.6, 0.88);
			this._devouredScale.AddKey(0.8, 0.975);
			this._devouredScale.AddKey(1, 1);

			this._devouredSpeed.AddKey(0,0.73);
			this._devouredSpeed.AddKey(0.05, 0.8);
			this._devouredSpeed.AddKey(0.257, 2.054);
			this._devouredSpeed.AddKey(0.3, 2.48);
			this._devouredSpeed.AddKey(0.4598, 4.983);


			let net = GameNetManager.GetInstance();
			net.AddEventListener(CmdIDs.kRpcBeanRefresh, this.OnRpcBeanRefresh, this);
			net.AddEventListener(CmdIDs.kRpcBeanSpawned, this.OnRpcBeanSpawned, this);
			net.AddEventListener(CmdIDs.kRpcBeanDevoured, this.OnRpcBeanDevoured, this);
			net.AddEventListener(CmdIDs.kRpcReSpawn, this.OnRpcReSpawn, this);
		}

		public dispose()
		{
			let net = GameNetManager.GetInstance();
			net.RemoveEventListener(CmdIDs.kRpcBeanRefresh, this.OnRpcBeanRefresh, this);
			net.RemoveEventListener(CmdIDs.kRpcBeanSpawned, this.OnRpcBeanSpawned, this);
			net.RemoveEventListener(CmdIDs.kRpcBeanDevoured, this.OnRpcBeanDevoured, this);
			net.RemoveEventListener(CmdIDs.kRpcReSpawn, this.OnRpcReSpawn, this);

			this._gameScene = null;
			this._beans = {};
			let idleBeans = this._idleBeans;
			for (let i = 0; i < idleBeans.length; i++)
			{
				idleBeans[i].dispose();
			}
			idleBeans.length = 0;
		}

		public OnRpcBeanSpawned(rpcBeanSpawned:RpcBeanSpawned)
		{
			let size = rpcBeanSpawned.beans.length;
			for (let i = 0; i < size; ++i)
			{
				let beanInfo = rpcBeanSpawned.beans[i];
				this.AddBean(beanInfo.id, beanInfo.value, beanInfo.pos);
			}
		}

		public OnRpcBeanDevoured(rpcBeanDevoured:RpcBeanDevoured)
		{
			let beanIDs = rpcBeanDevoured.beanIDs;
			let size = beanIDs.length;
			for (let i = 0; i < size; i++)
			{
				let slither = this._gameScene.FindSlither(rpcBeanDevoured.slitherIDs[i]);
				this.DevoureBean(beanIDs[i], slither == null ? null : slither.GetBody(), rpcBeanDevoured.kill);
			}
		}

		public OnRpcReSpawn(rpcSceneInitialize:RpcReSpawn)
		{
			let beans = this._beans;
			for (let it in beans)
			{
				let bean = beans[it];
				bean.Reset();
				this._idleBeans.push(bean);
			}
			this._beans = {};
		}

		public Update(deltaTime:number)
		{
			this.removeChildren();

			//Camera3D *camera = SceneManager.GetInstance().GetGameCamera();
			//OrthographicOffCenterLens *lens = static_cast<OrthographicOffCenterLens*>(camera.GetLens().get());
			let rect:egret.Rectangle;
			//rect.x = camera.GetPosition().x + lens.GetMinX();
			//rect.y = camera.GetPosition().y + lens.GetMinY();
			//rect.width = lens.GetMaxX() - lens.GetMinX();
			//rect.height = lens.GetMaxY() - lens.GetMinY();

			let curTime = egret.getTimer()/1000.0;
			let _beans = this._beans;
			let _beanRadius = this._beanRadius;
			let _idleBeans = this._idleBeans;
			let _valueScale = this._valueScale;
			let _startScaleTweenDuration = this._startScaleTweenDuration;
			for (let it in _beans)
			{
				let beanView:BeanView = _beans[it];

				let scale = snake.clamp((curTime - beanView.bornTime) / _startScaleTweenDuration, 0, 1) * _valueScale.Evaluate(beanView.beanWidth);

				if (beanView.devoured)
					scale *= this.DevouredMove(beanView, deltaTime);
				else
					this.LocalCircling(beanView,deltaTime);
				let pos = beanView.pos;
				if (scale > 0.0 && (rect.contains(pos.x, pos.y) || rect.contains(pos.x + beanView.beanWidth * scale, pos.y + beanView.beanWidth * scale)))
				{
					beanView.SetWidth(_beanRadius * 2 * scale);
					beanView.SetHeight(_beanRadius * 2 * scale);
					beanView.SetPosition(pos.x, pos.y);
					this.addChild(beanView);
				}
				if (scale < 0.0)
				{
					_idleBeans.push(beanView);
					beanView.Reset();
					delete _beans[it];
				}
			}
		}

		public DevouredMove(bean:BeanView, deltaTime:number):number
		{
			let t = GetTime() - bean.devouredTime;
			if (bean.devouredTarget == null)
			{
				return snake.min(1.0,1.0 - t / this._startScaleTweenDuration);
			}

			let target = bean.devouredTarget;
			let center:Vector2D = target.GetDevouredCenter();
			let v = center.sub(bean.pos);
			let dist = GetLength(v);

			if (dist > this._maxDevouredDistance)
				return -1.0;
			
			let dir = v.div(dist);
			let upVector = new Vector2D(1, 0);
			if (target.GetHead()) {
				upVector = target.GetHead().GetUpVector();
			}
			let upVector2D = new Vector2D(upVector.x, upVector.y);
			let along = snake.max(Dot(dir, upVector2D),0.0);
			let dirMul = dir.mulAssignment(GetLength(target.GetSpeed()) * 0.5);
			let speedMul:Vector2D = target.GetSpeed().mul(along).addAssignment(dirMul);
			let speed = speedMul.add(this._devouredSpeed.Evaluate(t));
			speed.mulAssignment(deltaTime);
			bean.pos.addAssignment(speed);

			if (dist < GetLength(speed) * deltaTime * 2.0)
			{
				return -1.0;
			}
			else
			{
				let clamp:number = snake.clamp(dist / bean.devouredDistance, 0, 0);
				return this._devouredScale.Evaluate(clamp);
			}
		}

		public LocalCircling(bean:BeanView, deltaTime:number)
		{
			let t = 6.28 * ((egret.getTimer()/1000.0 - bean.bornTime) / bean.circlingPeriod);
			let x = bean.circlingRadius * Math.sin(t);
			let y = bean.circlingRadius * Math.cos(t);
			bean.pos = bean.initPos.add(new Vector2D(x, y));
		}

		
		public OnRpcBeanRefresh(msg:RpcBeanRefresh)
		{
			let beans:Array<BeanInfo> = msg.beans;
			let count = 0;
			let size = beans.length;
			let liveBeans = {};
			for (let i = 0; i < size; i++)
			{
				liveBeans[beans[i].id] = true;
			}
			let _beans = this._beans;
			for (let it in _beans)
			{
				let beanView:BeanView = _beans[it];
				if (!beanView.devoured && (liveBeans[it] == undefined))
				{
					beanView.devoured = true;
					beanView.kill = false;
					beanView.devouredTime = egret.getTimer()/1000.0;
					beanView.devouredTarget = null;
					beanView.devouredDistance = 0.0;
				}
			}
			size = beans.length;
			for (let i = 0; i < size; i++)
			{
				let beanInfo = beans[i];
				if (_beans[beanInfo.id] == undefined)
				{
					this.AddBean(beanInfo.id, beanInfo.value, beanInfo.pos);
				}
			}
		}

		public AddBean(id:number, width:number, pos:Vector2D)
		{
			let beanView:BeanView;
			let _idleBeans = this._idleBeans;
			if (_idleBeans.length > 0)
			{
				beanView = _idleBeans[_idleBeans.length - 1];
				_idleBeans.pop();
			}
			else
			{
				let beanType = Math.ceil(Math.random() * 20) + 1;
				let beanTypeName = "ingame/beans/bean_" + beanType + ".png";
				beanView = new BeanView(beanTypeName);
			}

			this._beans[id] = beanView;

			beanView.bornTime = egret.getTimer()/1000.0;
			beanView.initPos.vec = pos.sub(width * 0.5);
			beanView.pos.vec = pos;
			beanView.beanWidth = width;
			beanView.circlingPeriod = 2.0 + Math.random() * 3.0;
			beanView.circlingRadius = Math.random() * 0.1;
			beanView.devouredTarget = null;
			beanView.devoured = false;
		}

		public DevoureBean(beanID:number, target:SlitherBody, kill:boolean)
		{
			let _beans = this._beans;
			let beanView:BeanView = _beans[beanID];
			if (beanView)
			{
				beanView.devoured = true;
				beanView.kill = kill;
				beanView.devouredTime = egret.getTimer()/1000.0;
				beanView.devouredTarget = target;
				if (target == null)
				{
					beanView.devouredDistance = 0.0;
				}	
				else
				{
					let v = new Vector2D(beanView.pos.x, beanView.pos.y);
					v.subAssignment(target.GetDevouredCenter());
					beanView.devouredDistance = GetLength(v);
				}
			}
		}

		public OnDeleteSlither(slither:Slither)
		{
			let beans = this._beans;
			for (let it in beans)
			{
				let beanView:BeanView = beans[it];
				if (beanView.devouredTarget == slither.GetBody())
				{
					beanView.devouredTarget = null;
				}
			}
		}
	}
}