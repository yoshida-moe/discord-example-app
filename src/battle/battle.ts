import { readJson, updateJson } from "../jfs";

export class Battle {
  id: string;
  members: BattleMember[];

  /**
   * コンストラクター
   * @param {string} id ID
   * @param {BattleMember[]} members メンバーリスト
   */
  constructor(id: string, members: BattleMember[] = []) {
    this.id = id;
    this.members = members;
  }

  /**
   * メンバーの名前を取得
   * @param {*} memberId
   * @returns
   */
  getMemberName(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.name;
  }
}

export class BattleManager {
  id: any;
  filePath: string;
  /**
   * コンストラクター
   * @param {string} id ID
   */
  constructor(id: string, filePath = "./src/battle/json/battle-member.json") {
    this.id = id;
    this.filePath = filePath;
  }

  /**
   * 項目を取得
   * @returns {Battle} 項目
   */
  get item(): Battle {
    const data = readJson(this.filePath);
    const item = data?.items?.find(
      (item: { id: string }) => item.id === this.id
    );
    return new Battle(this.id, item?.members ?? []);
  }

  /**
   * 項目を設定
   * @param {Battle} value 項目
   */
  set item(value: Battle) {
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
  set members(values: BattleMember[]) {
    this.item = new Battle(this.id, values);
  }

  getMember(id: string) {
    return this.members.find((member) => member.id === id);
  }

  /**
   * 参加/キャンセル
   * @param {BattleMember} member メンバー
   * @returns {BattleMember[]} 変更後のメンバーリスト
   */
  join(memberId: string, memberName: string) {
    const index = this.members.findIndex((m) => m.id === memberId);

    if (index === -1) {
      this.members = [...this.members, new BattleMember(memberId, memberName)];
    } else {
      const updated = [...this.members];
      updated.splice(index, 1);
      this.members = updated;
    }

    return this.members;
  }
}

export class BattleMember {
  id: any;
  name: any;
  /**
   * コンストラクター
   * @param {string} id ID
   * @param {string} name 名前
   */
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
