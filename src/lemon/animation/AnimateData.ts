module lemon {
    /**
     * @description 动画片段数据，比如某个动画组中的待机动画
     *
     */
    export class AnimateData {
        private _totalFrames: number;
        private _frameRate: number;
        private framesList: Array<any>;
        private resJson: any;
        private spriteSheet: egret.SpriteSheet;
        private autoParseTexture: boolean;       //是否自动解析纹理
        public constructor(resJson: any,spriteSheet: egret.SpriteSheet,autoParseTexture: boolean = false) {
            this.resJson = resJson;
            this.spriteSheet = spriteSheet;
            this.autoParseTexture = autoParseTexture;
            this.framesList = [];
        }
        /**
         * @description 解析数据
         */
        public parseClip(spriteJson: any): void {
            this._frameRate = parseInt(spriteJson.frameRate);
            let index: number = 0;
            for(let item of spriteJson.frames) {
                let duraton: number = parseInt(item.duration);
                if(isNaN(duraton)) duraton = 1;
                for(let i: number = 1;i <= duraton;i++) {
                    index += 1;
                    this.framesList.push(item);
                }
            }
            if(this.autoParseTexture) {
                for(let frameJson of this.framesList) {
                    if(!this.spriteSheet.getTexture(frameJson.res)) {
                        this.spriteSheet.createTexture(frameJson.res,this.resJson[frameJson.res].x,this.resJson[frameJson.res].y,this.resJson[frameJson.res].w,this.resJson[frameJson.res].h);
                    }
                }
            }
            this._totalFrames = this.framesList.length;
        }
        /**
         * @description 通过起始帧解析数据
         */ 
        public parseClipByStartAndEnd(spriteJson: any,start:number,end:number):void{
            this._frameRate = parseInt(spriteJson.frameRate);
            let index: number = 0;
            for(let item of spriteJson.frames) {
                let duraton: number = parseInt(item.duration);
                if(isNaN(duraton)) duraton = 1;
                for(let i: number = 1;i <= duraton;i++) {
                    index += 1;
                    if(index>=start&&index<=end){
                        this.framesList.push(item);
                    }
                }
            }
            /*if(this.autoParseTexture) {
                for(let frameJson of this.framesList) {
                    if(!this.spriteSheet.getTexture(frameJson.res)) {
                     //   this.spriteSheet.createTexture(frameJson.res,this.resJson[frameJson.res].x,this.resJson[frameJson.res].y,this.resJson[frameJson.res].w,this.resJson[frameJson.res].h);
                    }
                }
            }*/
            this._totalFrames = this.framesList.length;
        }
        /**
         * @description 获取某一帧texture
         */
        public getTextureByFrame(frame: number): egret.Texture {
            let frameJson: any;
            if(frame <= this.framesList.length) {
                frameJson = this.framesList[frame - 1];
            } else {
                return null;
            }
            let texture: egret.Texture = this.spriteSheet.getTexture(frameJson.res);
            if(!texture) {
                texture = this.spriteSheet.createTexture(frameJson.res,this.resJson[frameJson.res].x,this.resJson[frameJson.res].y,this.resJson[frameJson.res].w,this.resJson[frameJson.res].h);
            }
            return texture;
        }
        /**
         * @description 获取某一帧偏移值
         */
        public getOffset(frame: number): any {
            let offset: any;
            if(frame <= this.framesList.length) {
                offset = this.framesList[frame - 1];
            } else {
                offset = this.framesList[this.framesList.length - 1];
            }
            return offset;
        }
        /**
         * @description 获取总的帧数
         */
        public get totalFrames(): number {
            return this._totalFrames;
        }
        /**
         * @description 获取帧频         */ 
        public get frameRate(): number {
            return this._frameRate;
        }
        /**
         * @description 资源释放
         */ 
        public dispos():void{
            this.framesList.length=0;
            this.framesList=null;
        }
    }
}
