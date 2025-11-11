import { readJson } from "../../jfs.js";
import { Card } from "./jinrou-card.js";
/**
 * 役職カードID
 */
export var Role;
(function (Role) {
    /**
     * 村人
     * @summary 特殊能力はありません。積極的に話し合いをし人狼を見つけることが役目です。
     */
    Role["Villager"] = "01";
    /**
     * 占い師
     * @summary 夜時間中に誰か1人の役職カードを確認することができる非常に強力な役職です。得た情報を仲間に共有し人狼を見つけ出しましょう!!
     */
    Role["Seer"] = "02";
    /**
     * 怪盗
     * @summary 夜時間に誰か1人の役職カードと自分の役職カードを交換することができます。（任意） 交換する前に相手のカードを見ることはできません。 交換後に、新しいカードの役職を確認します。自分は交換した後の役職となり、相手は怪盗になるため自分が人狼になる可能性も…。
     *
     */
    Role["Thief"] = "03";
    /**
     * 人狼
     * @summary 夜時間に同じカードを引いた人と顔合わせをし仲間を知ることができます。 1人でも通報されたら負けてしまうので嘘をつき村人陣営を欺きましょう。
     */
    Role["Werewolf"] = "04";
    /**
     * ナタデココ
     * @summary 「B.夜時間」に人狼の襲撃マークとして利用します。
     */
    Role["NataDeCoCo"] = "05";
})(Role || (Role = {}));
/**
 * 役職カードクラス
 */
export class RoleCard extends Card {
    isTrap;
    /**
     * コンストラクター
     * @param {Role} id 役職カードID
     * @param {boolean} used 使用済み
     */
    constructor(id, used = false, isTrap = false) {
        super(id, used);
        this.isTrap = isTrap;
    }
    /**
     * データを取得
     * @returns {*} データ
     */
    get item() {
        const filePath = "./src/jinrou/json/jinrou-role.json";
        const data = readJson(filePath);
        return (data.items.find((item) => item.id === this.id) ?? {
            id: "",
            name: "",
            detail: "",
        });
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
