module wqq {
	export class DateUtil {
		public static S_PER_MINUTE: number = 60;
		public static S_PER_HOUR: number = 60 * 60;
		public static S_PER_DAY: number = 24 * 60 * 60;
		public constructor() {
		}
		/** 
		 * @ param time number 时间段 单位为秒
		 * @ return "##:##:##"
		 */
		public static format_1(time: number): string {
			let num = 0;
			let minute = 0;
			let second = 0;
			let format = "##:##:##";
			if (time <= 0) return "00:00:00";
			if(time <= this.S_PER_DAY) {
				num = Math.floor(time / this.S_PER_HOUR);
				format = format.replace("##", this.formatTimeNum(num));

				time = time - this.S_PER_HOUR * num;
				num = Math.floor(time / this.S_PER_MINUTE);
				format = format.replace("##", this.formatTimeNum(num));

				num = time - this.S_PER_MINUTE * num;
				format = format.replace("##", this.formatTimeNum(num));
			} else {
				num = Math.floor(time / this.S_PER_DAY);
				format = format.replace("##", num+"");

				time = time - this.S_PER_DAY * num;
				num = Math.floor(time / this.S_PER_HOUR);
				format = format.replace("##", this.formatTimeNum(num));

				num = time - this.S_PER_HOUR * num;
				format = format.replace("##", this.formatTimeNum(num));
			}

			return format;
		}
		/**
		 * @ param time 为时间戳 毫秒
		 * @ return year-month-date hour:minute:second
		 */
		public static format_2(time: number): string {
			let date = new Date(time);
			let hourTime = this.formatTimeNum(date.getHours());
			let minuteTime = this.formatTimeNum(date.getMinutes());
			let secondsTime = this.formatTimeNum(date.getSeconds());
			return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "  " + hourTime + ":" + minuteTime + ":" + secondsTime
		}
		/**
		 * @ param time  时间段
		 * @ return "minute:second"
		 */
		public static format_3(time: number): string {
			if (time < 0) return "00:00";
			let format = this.format_1(time);
			return format.substr(format.indexOf(":") + 1);
		}
		/**
		 * @ param time 时间段
		 * return  "XX[分钟|小时|天]前"
		 */
		public static format_4(time: number): string {
			return time < this.S_PER_HOUR ? Math.floor(time / this.S_PER_MINUTE) + "分钟前" : time < this.S_PER_DAY ? Math.floor(time / this.S_PER_HOUR) + "小时前" : Math.floor(time / this.S_PER_DAY) + "天前";
		}
		/**
		 * @ param time 时间段
		 * @ param len  显示到 天，时，分，秒
		 * return  "XX[分钟|小时|天]前"
		 */
		public static format_5(time: number, len: number = 2, isNeedDoubleZero: boolean = true): string {
			len = Math.max(len, 4);

			let format = "";
			let timeType = ["天", "时", "分", "秒"];
			let timeNum = [];

			//天
			let num = Math.floor(time / this.S_PER_DAY);
			timeNum[0] = num;
			//时
			time = time - num * this.S_PER_DAY;
			num = Math.floor(time / this.S_PER_HOUR);
			timeNum[1] = num;
			//分
			time = time - num * this.S_PER_HOUR;
			num = Math.floor(time / this.S_PER_MINUTE);
			timeNum[2] = num;
			//秒
			time = time - num * this.S_PER_MINUTE;
			timeNum[3] = time;

			for (let i = 0; i < len; i++) {
				format += this.formatTimeNum(timeNum[i], isNeedDoubleZero) + timeType[i];
			}
			return format;
		}
		/**
		 * @ param time number 时间戳
		 * return  "时|分|秒"
		 */
		public static format_6(time: number): string {
			var e = new Date(time);
			return this.formatTimeNum(e.getHours()) + ":" + this.formatTimeNum(e.getMinutes()) + ":" + this.formatTimeNum(e.getSeconds());
		}
		/**
		 * @ param time number 时间段
		 * @ return "<1小时"|"x小时"|"x天"
		 */
		public static format_7(time: number): string {
			return time < this.S_PER_HOUR ? "<1小时" : time < this.S_PER_DAY ? Math.floor(time / this.S_PER_HOUR) + "小时" : Math.floor(time / this.S_PER_DAY) + "天"
		}
		/**
		 * @ param time number 时间段
		 * @ return "x小时:x分钟:x秒"
		 */
		public static format_8(time: number): string {
			var e = Math.floor(time / this.S_PER_HOUR);
			time -= e * this.S_PER_HOUR;
			var i = Math.floor(time / this.S_PER_MINUTE);
			time -= i * this.S_PER_MINUTE;
			return e + "小时" + this.formatTimeNum(i) + "分钟" + this.formatTimeNum(time) + "秒";
		}
		//@des 当没有小时和分钟时不显示
		public static format_9(time: number): string {
			let num = 0;
			let minute = 0;
			let second = 0;
			let format = "##:##:##";

			num = Math.floor(time / this.S_PER_HOUR);
			if (num) {
				format = format.replace("##", this.formatTimeNum(num));
			} else {
				format = format.replace("##:", "");
			}

			time = time - this.S_PER_HOUR * num;
			num = Math.floor(time / this.S_PER_MINUTE);
			if (num) {
				format = format.replace("##", this.formatTimeNum(num));
			} else {
				format = format.replace("##:", "");
			}
			num = time - this.S_PER_MINUTE * num;
			format = format.replace("##", this.formatTimeNum(num, false));
			return format;
		}
		//time 时间戳，返回格式  YYYY-MM-DD  HH:MM:SS
		public static format_10(time: number): string {
			let date = new Date(time);
			return date.getFullYear() + "-" + this.formatTimeNum((date.getMonth() + 1)) + "-" + this.formatTimeNum(date.getDate()) + " " + this.formatTimeNum(date.getHours()) + ":" + this.formatTimeNum(date.getMinutes()) + ":" + this.formatTimeNum(date.getSeconds());
		}
		/**
		 * @ param time 时间段
		 * @ param len  显示到 天，时，分，秒
		 * return  "XX[分钟|小时|天]前"
		 */
		public static format_11(time: number, len: number = 2, isNeedDoubleZero: boolean = true): string {
			len = Math.max(len, 3);

			let format = "";
			let timeType = ["天", "时", "分"];
			let timeNum = [];

			//天
			let num = Math.floor(time / this.S_PER_DAY);
			timeNum[0] = num;
			//时
			time = time - num * this.S_PER_DAY;
			num = Math.floor(time / this.S_PER_HOUR);
			timeNum[1] = num;
			//分
			time = time - num * this.S_PER_HOUR;
			num = Math.floor(time / this.S_PER_MINUTE);
			timeNum[2] = num;

			for (let i = 0; i < len; i++) {
				format += this.formatTimeNum(timeNum[i], isNeedDoubleZero) + timeType[i];
			}
			return format;
		}
		/**
		 * @ param time 时间段
		 * @ param len  显示到 天
		 * return  "天"
		 */
		public static format_12(time: number): string {
			let format = "";
			let timeType = ["天"];
			let timeNum = [];
			//天
			let num = Math.floor(time / this.S_PER_DAY) + 1;
			timeNum[0] = num;
			format = this.formatTimeNum(timeNum[0]) + timeType[0];
			return format;
		}
		public static formatTimeNum(time: number, isNeedDoubleZero: boolean = true): string {
			if (!isNeedDoubleZero) {
				if (time <= 0) return "0";
			}
			return (time < 10 ? "0" : "") + time;
		}
		/** 
		 * @ param time number 时间段 单位为秒
		 * @ return "##天:##时:##分" |"##时:##分:##秒"
		 */
		public static format_13(time: number): string {
			let num = 0;
			let minute = 0;
			let second = 0;
			let format = "##:##:##";
			if (time <= 0) return "00:00:00";
			if(time <= this.S_PER_DAY) {
				format = "##时##分##秒";
				num = Math.floor(time / this.S_PER_HOUR);
				format = format.replace("##", this.formatTimeNum(num));

				time = time - this.S_PER_HOUR * num;
				num = Math.floor(time / this.S_PER_MINUTE);
				format = format.replace("##", this.formatTimeNum(num));

				num = time - this.S_PER_MINUTE * num;
				format = format.replace("##", this.formatTimeNum(num));
			} else {
				format = "##天##时##分";
				num = Math.floor(time / this.S_PER_DAY);
				format = format.replace("##", num+"");

				time = time - this.S_PER_DAY * num;
				num = Math.floor(time / this.S_PER_HOUR);
				format = format.replace("##", this.formatTimeNum(num));

				time = time - this.S_PER_HOUR * num;
				num = Math.floor(time / this.S_PER_MINUTE);
				format = format.replace("##", this.formatTimeNum(num));
			}

			return format;
		}
	}
}