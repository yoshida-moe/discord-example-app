import { readJson, updateJson } from "../jfs.js";
export class Battle {
    id;
    members;
    /**
     * コンストラクター
     * @param {string} id ID
     * @param {BattleMember[]} members メンバーリスト
     */
    constructor(id, members = []) {
        this.id = id;
        this.members = members;
    }
    /**
     * メンバーの名前を取得
     * @param {*} memberId
     * @returns
     */
    getMemberName(memberId) {
        return this.members.find((member) => member.id === memberId)?.name;
    }
}
export class BattleManager {
    id;
    filePath;
    /**
     * コンストラクター
     * @param {string} id ID
     */
    constructor(id, filePath = "./src/battle/json/battle-member.json") {
        this.id = id;
        this.filePath = filePath;
    }
    /**
     * 項目を取得
     * @returns {Battle} 項目
     */
    get item() {
        const data = readJson(this.filePath);
        const item = data?.items?.find((item) => item.id === this.id);
        return new Battle(this.id, item?.members ?? []);
    }
    /**
     * 項目を設定
     * @param {Battle} value 項目
     */
    set item(value) {
        updateJson(this.filePath, value);
    }
    /**
     * メンバーリストを取得
     * @returns {BattleMember[]} メンバーリスト
     */
    get members() {
        return this.item?.members ?? [];
    }
    /**
     * メンバーリストを設定
     * @param {BattleMember[]} values メンバーリスト
     */
    set members(values) {
        this.item = new Battle(this.id, values);
    }
    getMember(id) {
        return this.members.find((member) => member.id === id);
    }
    /**
     * 参加/キャンセル
     * @param {BattleMember} member メンバー
     * @returns {BattleMember[]} 変更後のメンバーリスト
     */
    join(memberId, memberName) {
        const index = this.members.findIndex((m) => m.id === memberId);
        if (index === -1) {
            this.members = [...this.members, new BattleMember(memberId, memberName)];
        }
        else {
            const updated = [...this.members];
            updated.splice(index, 1);
            this.members = updated;
        }
        return this.members;
    }
}
export class BattleMember {
    id;
    name;
    /**
     * コンストラクター
     * @param {string} id ID
     * @param {string} name 名前
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
