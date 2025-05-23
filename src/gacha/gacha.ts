import { readJson } from "../jfs";

export class appearanceRateByPickup {
  readonly pickup: number;
  readonly usual: number;

  constructor(pickup: number) {
    this.pickup = pickup;
    this.usual = 1 - pickup;
  }
}

export class AppearanceRateByRarity {
  readonly ur: number;
  readonly sr: number;
  readonly r: number;
  readonly n: number;

  constructor(ur: number, sr: number, r: number) {
    this.ur = ur;
    this.sr = sr;
    this.r = r;
    this.n = 1 - (ur + sr + r);
  }
}

export enum Rank {
  S,
  A,
  B,
  C,
  D,
  E,
  F,
}

export class CardGacha {
  /**
   * 出現アイテム
   */
  appearanceItems: Card[] = [];
  /**
   * ピックアップアイテム
   */
  pickupItems: Card[] = [];
  /**
   * ピックアップ出現率
   */
  appearanceRateByPickup: number;
  /**
   * レア度別出現割合
   */
  appearanceRateByRarity: Map<CardRarity, number>;

  constructor(
    appearanceItems: Card[],
    appearanceRateByRarity: Map<CardRarity, number>,
    pickupItems: Card[] = [],
    appearanceRateByPickup: number = 0
  ) {
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
  getContinuousTimes(rank: Rank): number {
    switch (rank) {
      case Rank.S:
        return 60;
      default:
        return 0;
    }
  }

  gacha(rank: Rank) {
    this.appearanceItems.filter((item) => item.rank <= rank);
  }
}

export class Card {
  name: string = "";
  attr: CardAttribute = 0;
  rarity: CardRarity = 0;
  word: Word[] = [];
  type: CardType = CardType.Usual;
  skill: string = "";
  coolDown: number = 0;
  activation: Activation = 0;
  rank: Rank = 0;

  constructor(name: string) {
    const data = readJson("card").find((c: any) => c.name === name);
    Object.assign(this, data);
  }
}

export enum CardAttribute {
  Water,
  Fire,
  Tree,
}

export enum CardRarity {
  UR,
  SR,
  R,
  N,
}

export enum Word {
  Move = "移",
}

export enum CardType {
  Usual = "通常",
}

export enum Activation {
  Short,
}

/**
 * 無料カードガチャレア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_CARD_FREE = new Map<CardRarity, number>([
  [CardRarity.UR, 0.2],
  [CardRarity.SR, 0.18],
  [CardRarity.R, 0.28],
  [CardRarity.R, 0.7],
]);

/**
 * カードガチャレア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_CARD = new Map<CardRarity, number>([
  [CardRarity.UR, 0.2],
  [CardRarity.SR, 0.18],
  [CardRarity.R, 0.8],
]);

/**
 * UR確定カードガチャレア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_OF_UR = new Map<CardRarity, number>([
  [CardRarity.UR, 1],
]);

/**
 * SR以上確定、URカード出現率15%レア度別出現割合
 */
const APPEARANCE_RATE_BY_RARITY_OF_SR11 = new Map<CardRarity, number>([
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
const Gc1342 = new CardGacha(
  [],
  APPEARANCE_RATE_BY_RARITY_CARD,
  [
    new Card("白井黒子"),
    new Card("初春飾利"),
    new Card("佐天涙子"),
    new Card("フレンダ＝セイヴェルン"),
    new Card("【超電磁砲】常盤台の超電磁砲（レールガン）"),
    new Card("【超電磁砲】超能力者（レベル5）の第一位"),
    new Card("【超電磁砲】とある少女たちの物語"),
    new Card("【超電磁砲】幻想殺し (イマジンブレイカー)"),
  ],
  APPEARANCE_RATE_BY_PICKUP_COLLABORATION_CARD
);
