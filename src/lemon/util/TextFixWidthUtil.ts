module lemon
{
	/**
	 * 功能：文本框显示宽度固定。
	 * 根据字符数量控制文本框的宽度和scale
	 * @author beiyuan
	 */
    export class TextFixWidthUtil 
	{
        private static _instance: TextFixWidthUtil
    	
		public constructor() 
		{
    		
		}
		
        public static getInstance(): TextFixWidthUtil
		{
		    if(this._instance == null)
		    {
                this._instance = new TextFixWidthUtil();
		    }
            return this._instance;
		}
        public strlen(str:string): number
        {
            var len = 0;
            for(var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1   
                if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        }
		public fixTextBox(fixWidth:number,label:eui.Label):boolean
		{
            if(label.textWidth > fixWidth)
            {
                var scale = (fixWidth) / label.textWidth;
                label.width = Math.ceil(label.textWidth);
                label.scaleX = scale;
                return true;
            }
            return false;
		}
	}
}
