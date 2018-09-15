module lemon {
    /**
     * @description 所有序列帧动画的管理器 draw到300就差不多了
     *
     */
    export class AnimateManager {
        private static instance: AnimateManager;
        private animaDic: any;
        private maxAliveTime: number = 120000;     //2分钟
        public constructor() {
            this.animaDic = {};
        }
        /**
         * @descripion 获取单例
         */
        public static getInstance(): AnimateManager {
            if (AnimateManager.instance == null) {
                AnimateManager.instance = new AnimateManager();
            }
            return AnimateManager.instance;
        }
        /**
         * @description 析对应序列帧动画
         */
        public parseSpriteSheet(resName: string, url: string, jsonData: any, texture: egret.Texture, dir: number = -1, autoParseTexture: boolean = true): void {
            let spriteSheet: egret.SpriteSheet = new egret.SpriteSheet(texture);
            let spriteJson: any;
            for (let movieClipName in jsonData.mc) {
                if (movieClipName != null && movieClipName.length != 0) {
                    spriteJson = jsonData.mc[movieClipName];
                    break;
                }
            }
            if (spriteJson) {
                let anima:any = this.animaDic[resName];
                if (!anima) {
                    anima = {};
                    this.animaDic[resName] = anima;
                }
                anima.url = url;
                anima.sheet = spriteSheet;
                anima.labels = 1;

                if (spriteJson.labels && spriteJson.labels.length > 1) {
                    for (let label of spriteJson.labels) {
                        let animalData: AnimateData = new AnimateData(jsonData.res, spriteSheet, autoParseTexture);
                        animalData.parseClipByStartAndEnd(spriteJson, parseInt(label.frame), (label.end));
                        anima[parseInt(label.name)] = animalData;
                    }
                    anima.labels = spriteJson.labels.length;
                } else {
                    let animalData: AnimateData = new AnimateData(jsonData.res, spriteSheet, autoParseTexture);
                    animalData.parseClip(spriteJson);
                    anima.data = animalData;
                }
            }
        }
        /**
         * @description 根据对应的动画名和标名获取序列帧数据
         * @param resName 资源名
         * @param dir 方向
         */
        public getAnimalData(resName: string, dir: number): AnimateData {
            let anima:any = this.animaDic[resName];
            if (!anima) return null;
            let count: number = anima.count;
            if (count) {
                count += 1;
            } else {
                count = 1;
            }
            anima.count = count;
            anima.useTime = Date.now();//egret.getTimer();
            if (dir > 0 && anima.labels > 1) {
                return anima[dir];
            }
            return anima.data;
        }
        /**
         * @description 释放资源，其实是释放对应animaion的引用计数
         */
        public dispos(resName: string): void {
            let anima:any = this.animaDic[resName];
            if (anima) {
                let count: number = anima.count;
                if (count) {
                    count -= 1;
                } else {
                    count = 0;
                }
                if (count <= 0) {
                    count = 0;
                }
                anima.count = count;
            }
        }
        /**
         * @description 清理过期资源
         */
        public clear(): void {
            let now: number = Date.now();
            for (let key in this.animaDic) {
                let item: any = this.animaDic[key];
                if (item.count == 0) {
                    if (item.useTime) {
                        if (now - item.useTime > this.maxAliveTime) {
                            if (item.sheet) {
                                item.sheet.dispose();
                            }
                            RES.destroyRes(ResLoader.getInstance().getVersionUrl(item.url));
                            lemon.LogUtil.warn("该url被释放了 " + ResLoader.getInstance().getVersionUrl(item.url));
                            this.animaDic[key] = null;
                            delete this.animaDic[key];
                        }
                    }
                }
            }
        }
    }
}
