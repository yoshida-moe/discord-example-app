/**
 * カードクラス
 */
export class Card {
    id;
    used;
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
