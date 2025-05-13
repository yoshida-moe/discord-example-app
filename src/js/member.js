"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const types_1 = require("./types");
class Member {
    /**
     * コンストラクター
     * @param id
     * @param role
     * @param hero
     */
    constructor(id, role = null, hero = null) {
        this.id = id;
        this.role = role;
        this.hero = hero;
    }
    /**
     * 人狼か
     */
    get isWerewolf() {
        return this.role === types_1.Role.Werewolf;
    }
    /**
     * 村人か
     */
    get isVillager() {
        return this.role === types_1.Role.Villager;
    }
    /**
     * 怪盗か
     */
    get isThief() {
        return this.role === types_1.Role.Thief;
    }
    /**
     * 占い師か
     */
    get isSeer() {
        return this.role === types_1.Role.Seer;
    }
    /**
     * ヒーローカードの効果を実行可能か
     */
    canPerformHeroCardEffect(flow) { }
    /**
     * ヒーローカードの効果を実行
     */
    performHeroCardEffect() { }
}
exports.Member = Member;
