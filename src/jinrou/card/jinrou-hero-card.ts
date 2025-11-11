import { readJson } from "../../jfs";
import { Card } from "./jinrou-card";
import { Hero } from "./jinrou-hero.enum";

/**
 * ヒーローカードクラス
 */
export class HeroCard extends Card<Hero> {
  /**
   * コンストラクター
   * @param {Hero} id ヒーローカードID
   * @param {boolean} used 使用済み
   */
  constructor(id: Hero, used = false) {
    super(id, used);
  }

  /**
   * データを取得
   * @returns {*} データ
   */
  get item(): {
    id: string;
    name: string;
    detail: string;
    timing: string;
    activationConditions: string;
  } {
    const filePath = "./src/jinrou/json/jinrou-hero.json";
    const data: {
      items: {
        id: string;
        name: string;
        detail: string;
        timing: string;
        activationConditions: string;
      }[];
    } = readJson(filePath);
    return (
      data.items.find((item) => item.id === this.id) ?? {
        id: "",
        name: "",
        detail: "",
        timing: "",
        activationConditions: "",
      }
    );
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
