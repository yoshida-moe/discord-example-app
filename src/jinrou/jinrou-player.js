import { BattleMember } from "../battle/battle.js";
import { Role, RoleCard } from "./card/jinrou-role-card.js";

const initialEffect = {
    isIce: false,
    isSilent: false,
    isTrap: false,
    trunk: "",
    isWinRPS: false,
    isMinusVotingCount: false,
};

/**
 * 人狼プレイヤークラス
 */
export class JinrouPlayer extends BattleMember {
    #roleCard;
    #heroCards;
    votingRights;
    voted;
    effect;
    /**
     * コンストラクター
     * @param {string} id プレイヤーID
     * @param {string} name プレイヤー名
     * @param {RoleCard} roleCard 役職カードID
     * @param {HeroCard[]} heroCards ヒーローカードID
     * @param {string[]} votingRights 投票権
     * @param {string[]} voted 投票数
     * @param {boolean} effect 効果
     */
    constructor(id, name, roleCard = new RoleCard(Role.NataDeCoCo), heroCards = [], votingRights = 1, voted = [], effect = initialEffect) {
        super(id, name);
        this.#roleCard = roleCard;
        this.#heroCards = heroCards;
        this.votingRights = votingRights;
        this.voted = voted;
        this.effect = effect;
    }
    /**
     * 村人を取得
     * @returns {boolean}
     */
    get isVillager() {
        return this.#roleCard.id === Role.Villager;
    }
    /**
     * 占い師を取得
     * @returns {boolean}
     */
    get isSeer() {
        return this.#roleCard.id === Role.Seer;
    }
    /**
     * 怪盗を取得
     * @returns {boolean}
     */
    get isThief() {
        return this.#roleCard.id === Role.Thief;
    }
    /**
     * 人狼を取得
     * @returns {boolean}
     */
    get isWerewolf() {
        return this.#roleCard.id === Role.Werewolf;
    }
    /**
     * 生存しているか
     */
    get isAlive() {
        return this.#roleCard.id !== Role.NataDeCoCo;
    }
    /**
     * 投票カウント
     */
    get votingCount() {
        return this.voted.length - (this.effect.isMinusVotingCount ? 0 : 2);
    }
    /**
     * 通報
     */
    report() {
        this.#roleCard = new RoleCard(Role.NataDeCoCo);
    }
    /**
     * 襲撃
     */
    attack() {
        this.#roleCard = new RoleCard(Role.NataDeCoCo);
    }
    /**
     * プレイヤーにかかっている全ての効果
     */
    resetEffect() {
        this.effect = initialEffect;
    }
    /**
     * 投票権剥奪
     */
    disappearVotingRights() {
        this.votingRights = 0;
    }
    /**
     *
     */
    performedByMagicalGirlLyrica() {
        this.votingRights *= 2;
    }
    /**
     * 凍らせる
     */
    ice() {
        this.effect.isIce = true;
    }
    /**
     *
     */
    performedByViolettaNoire() {
        this.effect.isSilent = true;
    }
    /**
     *
     */
    performedByThomas(id) {
        this.effect.trunk = id;
    }
    /**
     *役職カードの効果の実行可能状態
     */
    get canPerformRole() {
        return !this.effect.isIce;
    }
    /**
     *ヒーローカードの効果の実行可能状態
     */
    get canPerformHeroAtDay() {
        return !this.effect.isSilent;
    }
}
