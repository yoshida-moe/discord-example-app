/**
 * カードクラス
 */
export class Card {
  /**
   * コンストラクター
   * @param {string} id ID
   * @param {boolean} used 使用済み
   */
  constructor(id, used = false) {
    this.id = id;
    this.used = used;
  }

  /**
   * 使用
   */
  use() {
    this.used = true;
  }

  /**
   * 
   */
  reset(){
    this.used = false;
  }
}
