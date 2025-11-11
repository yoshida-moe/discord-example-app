import { readJson } from "../../jfs";
import { Card } from "./jinrou-card";
import { Role } from "./jinrou-role.enum";

/**
 * 役職カードクラス
 */
export class RoleCard extends Card<Role> {
  isTrap: boolean;

  /**
   * コンストラクター
   * @param {Role} id 役職カードID
   * @param {boolean} used 使用済み
   * @param {boolean} isTrap 罠（輪廻のヒーロースキル）
   */
  constructor(id: Role, used = false, isTrap = false) {
    super(id, used);
    this.isTrap = isTrap;
  }

  /**
   * データを取得
   * @returns {*} データ
   */
  get item(): { id: string; name: string; detail: string } {
    const filePath = "./src/jinrou/json/jinrou-role.json";
    const data: { items: { id: string; name: string; detail: string }[] } =
      readJson(filePath);
    return (
      data.items.find((item) => item.id === this.id) ?? {
        id: "",
        name: "",
        detail: "",
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
}
