module wqq {
    export class NumUtil {
        public constructor() {

        }
        public static calFightNum(dataAttrArray: Array<any>, AttributeList?: Array<any>): number {
            let MaxHP: number = 0; //生命值
            let attack: number = 0; //攻击力
            let defense: number = 0;//防御力
            let attackSpeed: number = 0;//攻击速度
            let moveSpeed: number = 0; //移动速度
            let crit: number = 0;//暴击
            let critHarm: number = 0; //暴击伤害
            let defCrit: number = 0;//抗爆
            let hit: number = 0;//命中、
            let dodge: number = 0;//闪避
            let ignoreDef: number = 0;//无视防御
            let addDamage: number = 0;//伤害增加
            let redDamage: number = 0;//伤害避免
            let fightNum: number = 0;
            if (dataAttrArray.length) {
                for (let i = 0; i < dataAttrArray.length; i++) {
                    let basicType;
                    let basicValue;
                    if (typeof (dataAttrArray[i]) == "object") {
                        if (dataAttrArray[i]) {
                            basicType = dataAttrArray[i].attrId;
                            basicValue = dataAttrArray[i].attrValue;
                        }
                    } else {
                        basicType = parseInt(dataAttrArray[i].split("_")[0]);
                        basicValue = parseInt(dataAttrArray[i].split("_")[1]);
                    }
                    switch (basicType) {
                        case 1:
                            MaxHP += basicValue;
                            break;
                        case 2:
                            attack += basicValue;
                            break;
                        case 3:
                            defense += basicValue;
                            break;
                        case 4:
                            attackSpeed += basicValue;
                            break;
                        case 5:
                            moveSpeed += basicValue;
                            break;
                        case 6:
                            critHarm += critHarm;
                            break;
                        case 7:
                            crit += basicValue;
                            break;
                        case 8:
                            defCrit += basicValue;
                            break;
                        case 9:
                            hit += basicValue;
                            break;
                        case 10:
                            dodge += basicValue;
                            break;
                        case 11:
                            ignoreDef += basicValue;
                            break;
                        case 12:
                            addDamage += basicValue;
                            break;
                        case 13:
                            redDamage += basicValue;
                            break;

                    }
                }
            }

            if (AttributeList) {
                for (let i = 0; i < AttributeList.length; i++) {
                    let AttributeType = AttributeList[i].type;
                    let AttributeValue = AttributeList[i].value;
                    switch (AttributeType) {
                        case 1:
                            MaxHP += AttributeValue;
                            break;
                        case 2:
                            attack += AttributeValue;
                            break;
                        case 3:
                            defense += AttributeValue;
                            break;
                        case 4:
                            attackSpeed += AttributeValue;
                            break;
                        case 5:
                            moveSpeed += AttributeValue;
                            break;
                        case 6:
                            critHarm += critHarm;
                            break;
                        case 7:
                            crit += AttributeValue;
                            break;
                        case 8:
                            defCrit += AttributeValue;
                            break;
                        case 9:
                            hit += AttributeValue;
                            break;
                        case 10:
                            dodge += AttributeValue;
                            break;
                        case 11:
                            ignoreDef += AttributeValue;
                            break;
                        case 12:
                            addDamage += AttributeValue;
                            break;
                        case 13:
                            redDamage += AttributeValue;
                            break;
                    }
                }
            }
            fightNum = Math.ceil(MaxHP * 0.1 + attack * 1.3 + defense * 1.9 + hit*5 + dodge*5 + defCrit*5 + crit * 5 + addDamage*30 + redDamage*30 + ignoreDef * 20 + attackSpeed * 2 + moveSpeed * 0.2 + critHarm * 0);
            return fightNum;
        }
    }
}