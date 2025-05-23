import { readJson } from "../../jfs";
import { Card } from "./jinrou-card";

/**
 * ヒーローカードID
 * @readonly
 * @enum {string}
 */
export enum Hero {
  /**
   * イグニス＝ウィル＝ウィスプ
   */
  IgnisWillWisp = "01",

  /**
   * 魔法少女 リリカ
   */
  MagicalGirlLyrica = "02",

  /**
   * ピエール77世
   */
  Pierre77 = "03",

  /**
   * マリア＝S＝レオンブルク
   */
  MariaSLeonburg = "04",

  /**
   * アダム＝ユーリエフ
   */
  AdamYuriev = "05",

  /**
   * 魔法少女 ルルカ
   */
  MagicalGirlLuruca = "06",

  /**
   * ジャスティス ハンコック
   */
  JusticeHancock = "07",

  /**
   * メグメグ
   */
  MegMeg = "08",

  /**
   * 桜華 忠臣
   */
  TadaomiOka = "09",

  /**
   * 零夜
   */
  Layer = "10",

  /**
   * イスタカ
   */
  Istaqa = "11",

  /**
   * ジャンヌ ダルク
   */
  JeanneDaArc = "12",

  /**
   * ニコラ テスラ
   */
  NikolaTesla = "13",

  /**
   * 輝龍院 きらら
   */
  KiraraKiryuin = "14",

  /**
   * 糸廻 輪廻
   */
  RinneItomeguri = "15",

  /**
   * 13†サーティーン†
   */
  Thirteen = "16",

  /**
   * Voidoll
   */
  Voidoll = "17",

  /**
   * Bugdoll
   */
  Bugdoll = "18",

  /**
   * グスタフ ハイドリヒ
   */
  GustavHeydrich = "19",

  /**
   * ヴィーナス ポロロッチョ
   */
  VenusPororotcho = "20",

  /**
   * 双挽 乃保
   */
  NohoSobiki = "21",

  /**
   * ゲームバズーカガール
   */
  GameBazookaGirl = "22",

  /**
   * アル・ダハブ=アルカティア
   */
  AlDahabAlqatia = "23",

  /**
   * ヴィオレッタ ノワール
   */
  ViolettaNoire = "24",

  /**
   * トマス
   */
  Thomas = "25",

  /**
   * HM-WA100 ニーズヘッグ
   */
  HMWA100Nidhogg = "26",

  /**
   * ラヴィ・シュシュマルシュ
   */
  LoveyChouchouMarchou = "27",

  /**
   * 某 <なにがし>
   */
  Nanigashi = "28",

  /**
   * ソーン＝ユーリエフ
   */
  ThorneYuriev = "29",

  /**
   * 十文字 アタリ
   */
  AtariJumonji = "30",
}

/**
 * ヒーローカードクラス
 */
export class HeroCard extends Card {
  /**
   * コンストラクター
   * @param {Hero} id ヒーローカードID
   * @param {boolean} used 使用済み
   */
  constructor(id, used = false) {
    super(id, used);
  }

  /**
   * データを取得
   * @returns {*} データ
   */
  get item() {
    const filePath = "./json/jinrou-hero.json";
    const data = readJson(filePath);
    return data.items.find((item) => item.id === this.id);
  }

  /**
   * 名前を取得
   * @returns {string} 名前
   */
  get name() {
    return this.item.name;
  }

  /**
   * 詳細を取得
   * @returns {string} 詳細
   */
  get detail() {
    return this.item.detail;
  }

  /**
   * 使用条件を取得
   * @returns {string} 使用条件
   */
  get timing() {
    return this.item.timing;
  }

  /**
   * 発動条件を取得
   * @returns {string} 発動条件
   */
  get activationConditions() {
    return this.item.activationConditions;
  }

  /**
   * 強制か
   * @returns {boolean}
   */
  get isForced() {
    return this.activationConditions === "強制";
  }
}
