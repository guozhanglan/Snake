module lemon {
    /**
     * @description 动画片段
     *
     */
    export class AnimateClip extends egret.Bitmap {
        private animateData: AnimateData;
        private jsonData: any;
        private path: string;
        private resName: string;
        private offset: any;
        private callBack: Function;
        private thisObject: any;
        private dir: number;
        private isDirLoad: boolean;                  //是否是分方向加载
        private actList: Array<string>;                        //该动画片段包含的动作组
        public isBody:boolean;                   //是否是裸体部件
        public constructor(callBack: Function = null, thisObject: any = null) {
            super();
            this.callBack = callBack;
            this.thisObject = thisObject;
            this.isDirLoad = false;
            this.actList = [];
            this.isBody=false;
            this.pixelHitTest = true;
        }
        /**
         * @description 动态设置是否是分方向加载
         */
        public setIsDirLoad(value: boolean): void {
            this.isDirLoad = value;
        }
        /**
         * @description 获取是否是分方向加载
         */
        public getIsDirLoad(): boolean {
            return this.isDirLoad;
        }
        /**
         * @description 设置该动画片段包含的动作组
         */
        public setActs(acts: string): void {
            this.actList = acts.split(",");
        }
        /**
         * @description 该动画片段是否包含该动作
         */
        public containsAct(act: string): boolean {
            if (this.actList.length == 0) {
                return true;
            }
            for (let key of this.actList) {
                if (key == act) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @description 加载
         * @param path 文件的相对路径
         * @param resName 当前动画片段的名字
         * @param animationName 动画片段属于的动画的名字
         * @param dir 有些动画会带方向的
          @param act 动作名
         */
        public load(path: string, resName: string, dir: number = -1): void {
            let self: AnimateClip = this;
            this.path = path;
            this.dir = dir;
            if (this.animateData && this.resName) {
                AnimateManager.getInstance().dispos(this.resName);
            }
            if (this.isDirLoad) {
                this.resName = resName + "_" + dir;
            } else {
                this.resName = resName;
            }
            let teampAnimataData: AnimateData;
            if (this.isDirLoad) {
                teampAnimataData = AnimateManager.getInstance().getAnimalData(this.resName, -1);
            } else {
                teampAnimataData = AnimateManager.getInstance().getAnimalData(this.resName, dir);
            }
            if (teampAnimataData) {
                this.animateData = teampAnimataData;
                if (this.callBack) {
                    this.callBack.call(this.thisObject, true,resName);
                }
            } else {
                let onJsonLoaded: Function = function (jsonData: any) {
                    let localJsonData: any = jsonData;
                    let onTextureLoaded: Function = function (texture: egret.Texture, url: string) {
                        if (texture) {
                            if (self.isDirLoad) {
                                AnimateManager.getInstance().parseSpriteSheet(resName + "_" + dir, url, localJsonData, texture, dir);
                                if (resName + "_" + dir == self.resName) {
                                    self.animateData = AnimateManager.getInstance().getAnimalData(resName + "_" + dir, -1);
                                }
                            } else {
                                AnimateManager.getInstance().parseSpriteSheet(resName, url, localJsonData, texture);
                                if (resName == self.resName) {
                                    self.animateData = AnimateManager.getInstance().getAnimalData(resName, dir);
                                }
                            }
                            if (self.callBack) {
                                self.callBack.call(self.thisObject, false,resName);
                            }
                        } else {
                            self.reset();
                        }
                    }
                    if (jsonData) {
                        let tempTexture: egret.Texture;
                        let pngKey:string = "_png";
                        if (self.isDirLoad) {
                            tempTexture = RES.getRes(resName + "_" + dir + pngKey);
                        } else {
                            tempTexture = RES.getRes(resName + pngKey);
                        }
                        if (tempTexture) {
                            if (self.isDirLoad) {
                                onTextureLoaded(tempTexture, resName + "_" + dir + pngKey);
                            } else {
                                onTextureLoaded(tempTexture, resName + pngKey);
                            }
                        } else {
                            let black:boolean;
                            if (self.isDirLoad) {
                                //判断如果32位贴图加载不到，进入黑名单，改加载8位贴图
                                ResLoader.getInstance().loadItem(path + resName + "_" + dir + ".png", onTextureLoaded, self, RES.ResourceItem.TYPE_IMAGE);   
                                
                            } else {
                                ResLoader.getInstance().loadItem(path + resName + ".png", onTextureLoaded, self, RES.ResourceItem.TYPE_IMAGE);
                            }
                        }
                    } else {
                        self.reset();
                    }
                }
                /*if(this.isBody){
                    this.texture=RES.getRes("defaultBody_png");
                    this.x=-this.texture.textureWidth/2;
                    this.y=-this.texture.textureHeight;
                }*/
                let data: any = RES.getRes(this.resName + "_json");
                if (data) {
                    onJsonLoaded(data);
                } else {
                    ResLoader.getInstance().loadItem(path + this.resName + ".json", onJsonLoaded, self, RES.ResourceItem.TYPE_JSON);
                }
            }
        }
        /**
         * @description 重置，防止夸帧
         */
        public reset(): void {
            if (this.animateData) {
                this.texture = null;
                this.animateData = null;
            }
        }
        /**
         * @description 渲染第几帧
         */
        public render(frame: number): void {
            let self: AnimateClip = this;
            if (self.animateData != null) {
                self.offset = self.animateData.getOffset(frame);
                self.texture = self.animateData.getTextureByFrame(frame);
                if (self.offset) {
                    self.x = self.offset.x;
                    self.y = self.offset.y;
                }
            }
        }
        /**
         * @description 获取第一帧的高度
         */
        public get firstFrameHeight():number{
            if(this.animateData){
                return this.animateData.getTextureByFrame(1).textureHeight;
            }
            return 0;
        }
        /**
         * @description 获取总帧数         */
        public get totalFrames(): number {
            if (this.animateData != null) {
                return this.animateData.totalFrames;
            }
            return 0;
        }
        /**
         * @description 获取帧频         */
        public get frameRate(): number {
            if (this.animateData != null) {
                return this.animateData.frameRate;
            }
            return 0;
        }
        /**
         * @description 资源释放         */
        public dispos(): void {
            if (this.parent) {
                this.reset();
                AnimateManager.getInstance().dispos(this.resName);
                this.parent.removeChild(this);
            }
        }
    }
}
