
//游戏中用到一些常量
enum GameConst {
	HERO_FIND_DISTANCE = 150,	//人物寻怪的距离
	MONSTER_HITBACK_DISTANCE = 100,//怪物被击退的距离
	PUBLIC_CD = 1500,				//公共CD,1500毫秒
	MIN_TIME_SCALE = 850,			//角色最小的频率时间
	FOLLOW_DISTANCE = 120,				//跟随的距离
	FOLLOW_SPEED_RATE = 1.1,           //式神跟随速度的倍率
	FIELD_BOSS_MAX_COUNT_LINE = 50,	//野外BOSS线路，每条线路最多人数(客户端用)
	GATHER_DISTANCE = 100			//采集距离
}
//颜色值常量
enum ColorConst {
	COLOR_WHITE = 0xffffff,	//白色
	COLOR_WHITEYELLOW = 0xFFFFCD,//白杏仁
	COLOR_BLACK = 0x0,		//黑色
	COLOR_VIOLET = 0xff00ff,	//淡紫色
	COLOR_PURPLE = 0xA020F0,//紫色
	COLOR_GREEN = 0x00ff00,	//翠绿色
	COLOR_GOLDEN = 0xFFD700,	//金黄
	COLOR_CADMIUM = 0xFF9000, //镉黄色
	COLOR_RED = 0xFF0000,		//红色
	COLOR_SKYBLUE = 0x87CEEB,   //天蓝
	COLOR_BLUE = 0x2289fe,		//孔雀蓝
	COLOR_SLIGHT_YELLOW = 0xF5DEB3,    //淡黄色
	COLOR_ORANGE = 0xFF6100,     //橙色
	COLOR_GETITEM = 0xff9b00,      //获取物品颜色
	COLOR_EQUIPLEVEL = 0xffdb8d,   //装备等级颜色
	COLOR_EQUIPSTAR = 0x00fcff,   //装备星级颜色
	COLOR_PLAYERNAME = 0x008aff,   //其他玩家名字颜色
	COLOR_MYNAME = 0xff8400,  //自己名字颜色
	COLOR_SKILL = 0x00FFFF,   //技能名字前面的描述
	COLOR_SKILLNAME = 0xFFDE00,  //技能名字
	COLOR_SKILLW = 0X89A0AC,     //式神白
	COLOR_SKILLG = 0X8FBE6C,     //式神绿
	COLOR_SKILLB = 0X7DABC5,     //式神蓝
	COLOR_SKILLP = 0XC47FC2,     //式神紫
	COLOR_SKILLO = 0XD6B592,     //式神橙
	COLOR_SKILLR = 0XCC8B74,     //式神红
	COLOR_GUILD = 0x5696ff		//场景中同帮派名字
}

enum ActorType{
	ROLE = 1,
	MONSTER = 2
}
