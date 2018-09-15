module lemon {
	/**
	 * @description 基础vo结构，发送协议和解析协议的时候用到
	 *
	 */
	export class BaseVo {
        private _orderId: number;
        protected data: any;
        protected _byteBuffer: egret.ByteArray;
        protected msgId:number;
        private ProtoMsgIdMap:any;
		public constructor() {
            this.ProtoMsgIdMap = egret.getDefinitionByName("qmr.ProtoMsgIdMap");
		}
		/**
		 * @description 设置发送数据,当发送消息的时候调用,需要被子类调用
		 */ 
        public parseData():void{
            let protoName: string = this.ProtoMsgIdMap.getInstance().msgIdMap[this.msgId];
		}
		/**
		 * @description 解析数据,当收到消息的时候调用,需要被子类继承
		 */
        public parseMsg(dataBuff: ArrayBuffer): void {
            let plain: Uint8Array = new Uint8Array(dataBuff);
            let protoName:string = this.ProtoMsgIdMap.getInstance().msgIdMap[this.msgId];
            
        }
        /**
		 * @description 数据编码
		 */
        public encode(): void {
            this._byteBuffer = new egret.ByteArray(this.data.toArrayBuffer());
            let plain: Uint8Array = new Uint8Array(this._byteBuffer.buffer);
            let length: number = this._byteBuffer.length + 16;
            this._orderId = this._orderId ^ (0x7A << 10);
            this._orderId = this._orderId ^ length;
            let ext: number = this._orderId % 100;
            let timeByte: Array<number> = this.inToBytes(Math.round(Date.now() / 1000));
            let msgIdByte: Array<number> = this.inToBytes(this.msgId);
            let msgByte: Int8Array = new Int8Array(this.data.toArrayBuffer());
            let total: number = this.sumToTotal(timeByte) + this.sumToTotal(msgByte) + this.sumToTotal(msgIdByte);
            this._byteBuffer = new egret.ByteArray();
            this._byteBuffer.writeInt(length);
            this._byteBuffer.writeInt(this._orderId);
            this._byteBuffer.writeInt(total);
            let len : number = timeByte.length;
            timeByte = this.xor(timeByte,ext);
            for(let i: number = 0;i < len;i++) {
                this._byteBuffer.writeByte(timeByte[i]);
            }
            msgIdByte = this.xor(msgIdByte,ext);
            len = msgIdByte.length
            for(let i: number = 0;i < len;i++) {
                this._byteBuffer.writeByte(msgIdByte[i]);
            }
            msgByte = this.xor(msgByte,ext);
            len = msgByte.length;
            for(let i: number = 0;i < len;i++) {
                this._byteBuffer.writeByte(msgByte[i]);
            }
        }
		/**
		 * @description 整型转化为byte数组
		 */
        private inToBytes(value: number): Array<number> {
            let byte: Array<number> = [];
            byte[0] = (value >> 24) & 0xFF;
            byte[1] = (value >> 16) & 0xFF;
            byte[2] = (value >> 8) & 0xFF;
            byte[3] = value & 0xFF;
            return byte;
        }
		/**
		 * @description 对内容每个byte位进行异或
		 */
        private xor(byte: any,ext: number): any {
            let len : number = byte.length;
            for(let i: number = 0;i < len;i++) {
                byte[i] = byte[i] ^ ext;
            }
            return byte;
        }
		/**
		 * @description byte内容进行求和
		 */
        private sumToTotal(byte: any): number {
            let total: number = 0;
            let len : number = byte.length;
            for(let i: number = 0;i < len;i++) {
                let code: number = byte[i];
                if(code < 0) {
                    code = 256 + code;
                }
                total += code;
            }
            return total;
        }
		/**
		 * @description 获取二进制流
		 */
        public get byteBuffer(): egret.ByteArray {
            return this._byteBuffer;
        }
        /**
         * @description 获取msgId
         */ 
        public getMsgId():number{
            return this.msgId;
        }
        /**
         * @description 获取协议名
         */
        public getProtoName():string{
            return this.ProtoMsgIdMap.getInstance().msgIdMap[this.msgId];
        }
        /**
         * @description 转换成字符串
         */ 
        public toString():string{
            return JSON.stringify(this.data);
        }
	}
}
