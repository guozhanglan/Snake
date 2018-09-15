module wqq {
    /**
     * @author 吕雪
     * @description 初始化装备图片工具类 
     */
    export class ImageUtil {
        
        /**
         * @description 给图片设置滤镜变灰的效果
         */
        public static setFilter(img: Array<any>): void {
            let colorMaxtrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ]
            let colorFilter = new egret.ColorMatrixFilter(colorMaxtrix);
            for (let i = 0; i < img.length; i++) {
                img[i].filters = [colorFilter];
            }
        }
        /**
         * @description 根据排名，获取排名图片
         */
        public static getRankImg(rank: number): string {
            return "rank_num" + rank + "_png";
        }
        /**
         * @descriptiono 根据排名，获取排名背景图片
         */
        public static getRankBgImg(rank: number): string {
            if (rank >= 4) {
                return "rank_bgd_4_png";
            } else {
                return "rank_bgd_" + rank + "_png";
            }
        }
        /**
         * @descrition 根据vip等级，获取vip等级数字图片
         */
        public static getVipLevelImg(vipLevel: number): string {
            return "vip" + vipLevel + "_png";
        }
        
    }
}