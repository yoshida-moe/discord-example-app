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
  name: string;
  attr: CardAttribute;
  rarity: CardRarity;
  word: Word[];
  type: CardType;
  skill: string;
  coolDown: number;
  activation: Activation;
  rank: Rank;
  path: string;

  constructor(name: string) {
    this.name = name;
    const data = {};
    // this = ...data;
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

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname 相当を作る
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.resolve(
  __dirname,
  "../contents/web/gacha_card/cardgacha_11003_21_stlv_P9aeRy9P.html"
);
const html = fs.readFileSync(filePath, "utf-8");

// すべての <table class="list_card">〜</table> を取得
const tableMatches = [
  ...html.matchAll(/<table class="list_card">[\s\S]*?<\/table>/g),
];

if (tableMatches.length === 0) {
  console.error("list_card テーブルが見つかりません");
  process.exit(1);
}

// 各テーブルに対してカード抽出
const allCards = tableMatches.flatMap((match) => {
  const tableContent = match[0].replace(/<!--[\s\S]*?-->/g, ""); // コメント削除
  const rankMatch = [
    ...tableContent.matchAll(
      /<th colspan="3">([\s\S]*?)ランクで入手可能なカード<\/th>/g
    ),
  ];
  const rank = rankMatch.length > 0 ? rankMatch[0][1].trim() : null;
  const items = [...tableContent.matchAll(/<card>([\s\S]*?)<\/card>/g)]
    .map((m) => m[1])
    .map((name) => ({
      name,
      rank,
    }));
  return items;
});
