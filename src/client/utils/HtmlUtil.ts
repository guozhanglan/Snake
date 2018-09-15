module wqq {
	/**
	 * @author guoqing.wen
	 * @date 2017.01.06
	 * @desc html工具类
	 */
	export class HtmlUtil {
		public static htmlParse:egret.HtmlTextParser = new egret.HtmlTextParser();
		public constructor() {
		}
		/**
		 * @desc 返回对应颜色的html字符串
		 */
		public static getHtmlText(msg:string,color:number,isUnderLine:boolean = false,href?:string):string{
			if(href && isUnderLine) return '<font color='+color+" href=event:"+href+" u='true'>"+msg+'</font>';
			if(href) return '<font color='+color+" href=event:"+href+">"+msg+'</font>';
			if(isUnderLine) return '<font color='+color+" u='true'>"+msg+'</font>';
			return '<font color='+color+">"+msg+'</font>';
		}
		/**
		 * @desc 返回对应颜色的html字符串
		 */
		public static getHtmlTexts(data:Array<Array<any>>):any{
			var temp = [];
			for(let i=0; i<data.length;i++) {
				temp.push(this.getHtmlText(data[i][1],data[i][0],data[i][2],data[i][3]));
			}
			return temp.join("");
		}
		
	}
}