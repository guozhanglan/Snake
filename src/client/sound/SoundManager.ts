module wqq {
	/**
	 *
	 * @author guoqing.wen
	 * @date 2017.04.12
	 * @desc 音效音乐管理器
	 *
	 */
    export class SoundManager {
        private static instance: SoundManager;
        private _soundPool: any
        private _bgSoundItem: SoundItem;
        private _isEffectSoundOpen: boolean = true;
        private _isMusicSoundOpen: boolean = true;
        private _isbgPlaying: boolean;
        private _lastMusicName: string;  //上一次播放的music的名字是（主要是背景音乐）
        private _musicName: string;
        private _lastMusicPosition: number;
        public constructor() {
            this._lastMusicPosition = 0;
            this._lastMusicName = "";
            this._musicName = "";
            this._soundPool = {};
            this._isMusicSoundOpen = true;
            this._isEffectSoundOpen = true;
        }
        /**
         * @description 获取游戏单例
         */
        public static getInstance(): SoundManager {
            if (SoundManager.instance == null) {
                SoundManager.instance = new SoundManager();
            }
            return SoundManager.instance;
        }
		/**
		 * 获取soundpool
		 */
        public get soundPool(): any {
            return this._soundPool;
        }
		/**
		 * 设置是否打开特效音乐
		 */
        public set isEffectSoundOpen(value: boolean) {
            this._isEffectSoundOpen = value;
            if (!value) {
                for (let key in this._soundPool) {
                    let soundItem: SoundItem = this._soundPool[key];
                    if (soundItem != null && soundItem.sound != null) {
                        if (soundItem.sound.type == egret.Sound.EFFECT) {
                            soundItem.stop();
                        }
                    }
                }
            }
        }
        /**
         * 获取特效音乐是否打开
         */
        public get isEffectSoundOpen(): boolean {
            return this._isEffectSoundOpen;
        }
        /**
		 * 设置是否打开背景音乐
		 */
        public set isMusicSoundOpen(value: boolean) {
            this._isMusicSoundOpen = value;
            if (value) {
                if (this._bgSoundItem != null) {
                    this._bgSoundItem.stop();
                }
                this._bgSoundItem = this._soundPool[this._musicName];
                if (this._bgSoundItem) {
                    this._lastMusicName = this._musicName;
                    this._lastMusicPosition = 0;
                    this._bgSoundItem.play(0);
                } else {
                    this.loadBgMusic(this._musicName);
                }
            } else {
                if (this._bgSoundItem != null) {
                    this._lastMusicPosition = this._bgSoundItem.position;
                    this._bgSoundItem.stop();
                }
            }
        }
        /**
         * 获取背景音乐是否打开
         */
        public get isMusicSoundOpen(): boolean {
            return this._isMusicSoundOpen;
        }
        /**
         * 播放特效
         */
        public loadAndPlayEffect(effectMusicId: number, loops: number = 1): void {
            if (effectMusicId == null || effectMusicId == 0) {
                return;
            }
            let effectName: string = "effect_" + effectMusicId;
            if (this._isEffectSoundOpen && wqq.WebBrowerUtil.isSupportMusic()) {
                var soundItem: SoundItem = this._soundPool[effectName];
                if (soundItem == null) {
                    if (RES.hasRes(effectName)) {
                        soundItem = new SoundItem(RES.getRes(effectName + "_mp3"));
                        this._soundPool[effectName] = soundItem;
                        soundItem.play(0, loops);
                    } else {
                        lemon.ResLoader.getInstance().loadItem(wqq.SystemPath.effect_music + effectName + ".mp3", function (sound: egret.Sound) {
                            var loadSound: SoundItem = new SoundItem(sound);
                            this._soundPool[effectName] = loadSound;
                            if (!egret.Capabilities.isMobile) {
                                loadSound.play(0, loops);
                            }
                        }, this, RES.ResourceItem.TYPE_SOUND);
                    }
                } else {
                    soundItem.play(0, loops);
                }
            }
        }
        /**
         * 播放背景音乐,一般都是无限循环的
         */
        public loadAnPlayMusic(musicName: string): void {
            this._musicName = musicName;
            if (musicName == null || musicName.length == 0) {
                return;
            }
            if (wqq.WebBrowerUtil.isSupportMusic()) {
                if (this._isMusicSoundOpen) {
                    if (this._bgSoundItem != null) {
                        if (this._lastMusicName == musicName) {
                            if (this._bgSoundItem.position <= 0) {
                                this._bgSoundItem.stop();
                                this._bgSoundItem.play(0);
                            }
                            return;
                        } else {
                            if (this._bgSoundItem) {
                                this._bgSoundItem.stop();
                            }
                            this._bgSoundItem = this._soundPool[musicName];
                            if (this._bgSoundItem) {
                                this._lastMusicName = musicName;
                                this._lastMusicPosition = 0;
                                this._bgSoundItem.play(0);
                            } else {
                                this.loadBgMusic(musicName);
                            }
                        }
                    } else {
                        this.loadBgMusic(musicName);
                    }
                }
            }
        }
        /**
         * @description 加载背景音乐
         */
        private loadBgMusic(musicName: string): void {
            this._lastMusicName = musicName;
            let self: SoundManager = this;
            lemon.ResLoader.getInstance().loadItem(wqq.SystemPath.bg_music + musicName, function (sound: egret.Sound) {
                var loadSound: SoundItem = new SoundItem(sound, egret.Sound.MUSIC);
                self._soundPool[musicName] = loadSound;
                self._bgSoundItem = loadSound;
                self._lastMusicPosition = 0;
                if (!egret.Capabilities.isMobile) {
                    self._bgSoundItem.play(0);
                }
            }, this, RES.ResourceItem.TYPE_SOUND);
        }
        /**
         * 关闭背景音乐
         */
        public stopMusic(): void {
            if (wqq.WebBrowerUtil.isSupportMusic()) {
                if (this._bgSoundItem != null) {
                    this._bgSoundItem.stop();
                }
            }
        }
        /**
         * 重新恢复背景音乐
         */
        public reStartMusic(): void {
            this.loadAnPlayMusic(this._lastMusicName);
        }
    }
}
