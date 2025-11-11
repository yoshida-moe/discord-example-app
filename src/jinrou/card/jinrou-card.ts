/**
 * カードクラス
 */
export class Card<T> {
  id: T;
  used: boolean;

  /**
   * コンストラクター
   * @param {T} id ID
   * @param {boolean} used 使用済み
   */
  constructor(id: T, used = false) {
    this.id = id;
    this.used = used;
  }

  /**
   * カードを使用する。
   */
  use() {
    this.used = true;
  }

  /**
   * カードの使用状態をリセットする。
   */
  reset() {
    this.used = false;
  }
}
