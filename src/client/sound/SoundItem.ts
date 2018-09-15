module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2017.04.15
	 * @desc 单个sound存储
	 *
	 */
	export class SoundItem {
		public sound: egret.Sound;
		public soundChannel: egret.SoundChannel;
		public constructor(sound: egret.Sound = null, type: string = egret.Sound.EFFECT) {
			this.sound = sound;
			if(sound!=null){
				this.sound.type = type;
			}
		}
		/**
		 * 播放声音
		 */
		public play(startTime: number, loops: number = 0): void {
			if (this.sound != null) {
				this.soundChannel = this.sound.play(startTime, loops);
				if (this.sound.type == egret.Sound.MUSIC) {
					this.soundChannel.volume = 0.7;
				}
			}
		}
		/**
		 * 停止播放
		 */
		public stop(): void {
			if (this.soundChannel != null) {
				this.soundChannel.stop();
			}
		}
		/**
		 * @desc 当前播放位置
		 */
		public get position(): number {
			if (this.soundChannel) {
				return this.soundChannel.position;
			}
			return 0;
		}
	}
}
