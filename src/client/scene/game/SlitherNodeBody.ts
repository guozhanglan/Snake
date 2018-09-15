module wqq {
	export enum SlitherType
	{
		kSlitherOtherMP = 0,
		kSlitherPlayerMP = 1
	};

	export class SlitherNodeBody extends SlitherBody {
		public constructor(type:SlitherType) {
			super();
		}

		public SetAsMainPlayer():void{

		}

		public static CreateSlither(type:SlitherType):SlitherNodeBody{
			return new SlitherNodeBody(type);
		}
	}
}