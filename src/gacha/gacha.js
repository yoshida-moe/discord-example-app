import { readJson } from "../jfs";
export class appearanceRateByPickup {
    pickup;
    usual;
    constructor(pickup) {
        this.pickup = pickup;
        this.usual = 1 - pickup;
    }
}
export class AppearanceRateByRarity {
    ur;
    sr;
    r;
    n;
    constructor(ur, sr, r) {
        this.ur = ur;
        this.sr = sr;
        this.r = r;
        this.n = 1 - (ur + sr + r);
    }
}
export var Rank;
(function (Rank) {
    Rank[Rank["S"] = 0] = "S";
    Rank[Rank["A"] = 1] = "A";
    Rank[Rank["B"] = 2] = "B";
    Rank[Rank["C"] = 3] = "C";
    Rank[Rank["D"] = 4] = "D";
    Rank[Rank["E"] = 5] = "E";
    Rank[Rank["F"] = 6] = "F";
})(Rank || (Rank = {}));
export class CardGacha {
    /**
     * 出現アイテム
     */
    appearanceItems = [];
    /**
     * ピックアップアイテム
     */
    pickupItems = [];
    /**
     * ピックアップ出現率
     */
    appearanceRateByPickup;
    /**
     * レア度別出現割合
     */
    appearanceRateByRarity;
    constructor(appearanceItems, appearanceRateByRarity, pickupItems = [], appearanceRateByPickup = 0) {
        this.appearanceItems = appearanceItems;
        this.pickupItems = pickupItems;
        this.appearanceRateByPickup = appearanceRateByPickup;
        this.appearanceRateByRarity = appearanceRateByRarity;
    }
    /**
     * 連続回数
     * @param rank
     * @returns
     */
    getContinuousTimes(rank) {
        switch (rank) {
            case Rank.S:
                return 60;
            default:
                return 0;
        }
    }
    gacha(rank) {
        this.appearanceItems.filter((item) => item.rank <= rank);
    }
}
export class Card {
    name = "";
    attr = 0;
    rarity = 0;
    word = [];
    type = CardType.Usual;
    skill = "";
    coolDown = 0;
    activation = 0;
    rank = 0;
    constructor(name) {
        const data = readJson("card").find((c) => c.name === name);
        Object.assign(this, data);
    }
}
export var CardAttribute;
(function (CardAttribute) {
    CardAttribute[CardAttribute["Water"] = 0] = "Water";
    CardAttribute[CardAttribute["Fire"] = 1] = "Fire";
    CardAttribute[CardAttribute["Tree"] = 2] = "Tree";
})(CardAttribute || (CardAttribute = {}));
export var CardRarity;
(function (CardRarity) {
    CardRarity[CardRarity["UR"] = 0] = "UR";
    CardRarity[CardRarity["SR"] = 1] = "SR";
    CardRarity[CardRarity["R"] = 2] = "R";
    CardRarity[CardRarity["N"] = 3] = "N";
})(CardRarity || (CardRarity = {}));
export var Word;
(function (Word) {
    Word["Move"] = "\u79FB";
})(Word || (Word = {}));
export var CardType;
(function (CardType) {
    CardType["Usual"] = "\u901A\u5E38";
})(CardType || (CardType = {}));
export var Activation;
(function (Activation) {
    Activation[Activation["Short"] = 0] = "Short";
})(Activation || (Activation = {}));
/**
 * 無料カードガチャレア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_CARD_FREE = new Map([
    [CardRarity.UR, 0.2],
    [CardRarity.SR, 0.18],
    [CardRarity.R, 0.28],
    [CardRarity.R, 0.7],
]);
/**
 * カードガチャレア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_CARD = new Map([
    [CardRarity.UR, 0.2],
    [CardRarity.SR, 0.18],
    [CardRarity.R, 0.8],
]);
/**
 * UR確定カードガチャレア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_OF_UR = new Map([
    [CardRarity.UR, 1],
]);
/**
 * SR以上確定、URカード出現率15%レア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_OF_SR11 = new Map([
    [CardRarity.UR, 0.15],
    [CardRarity.UR, 0.85],
]);
/**
 * ピックアップコラボカード出現率
 */
const APPEARANCE_RATE_BY_PICKUP_COLLABORATION_CARD = 21;
/**
 * 無料カードガチャ
 */
const GcFree = new CardGacha([], APPEARANCE_RATE_BY_RARITY_CARD_FREE);
/**
 * 火属性URチケットカードガチャ
 */
const Gc0535 = new CardGacha([], APPEARANCE_RATE_BY_RARITY_CARD_FREE);
/**
 * SR以上確定、URカード出現率15%カードガチャ
 */
const Gc1324 = new CardGacha([], APPEARANCE_RATE_BY_RARITY_OF_SR11);
/**
 * とある科学の超電磁砲コラボカードガチャ
 */
const Gc1342 = new CardGacha([], APPEARANCE_RATE_BY_RARITY_CARD, [
    new Card("白井黒子"),
    new Card("初春飾利"),
    new Card("佐天涙子"),
    new Card("フレンダ＝セイヴェルン"),
    new Card("【超電磁砲】常盤台の超電磁砲（レールガン）"),
    new Card("【超電磁砲】超能力者（レベル5）の第一位"),
    new Card("【超電磁砲】とある少女たちの物語"),
    new Card("【超電磁砲】幻想殺し (イマジンブレイカー)"),
], APPEARANCE_RATE_BY_PICKUP_COLLABORATION_CARD);
