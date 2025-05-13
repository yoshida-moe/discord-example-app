import { Role, Hero, Flow } from "./types";

export class Member {
  id: string;
  role: Role | null;
  hero: Hero | null;
  vote: number;
  voted: number;

  /**
   * コンストラクター
   * @param id
   * @param role
   * @param hero
   * @param vote
   * @param voted
   */
  constructor(
    id: string,
    role: Role | null = null,
    hero: Hero | null = null,
    vote: number = 0,
    voted: number = 0
  ) {
    this.id = id;
    this.role = role;
    this.hero = hero;
    this.vote = vote;
    this.voted = voted;
  }

  /**
   * 人狼か
   */
  get isWerewolf() {
    return this.role === Role.Werewolf;
  }

  /**
   * 村人か
   */
  get isVillager() {
    return this.role === Role.Villager;
  }

  /**
   * 怪盗か
   */
  get isThief() {
    return this.role === Role.Thief;
  }

  /**
   * 占い師か
   */
  get isSeer() {
    return this.role === Role.Seer;
  }

  /**
   * ヒーローカードの効果を実行可能か
   */
  canPerformHeroCardEffect(flow: Flow) {}

  /**
   * ヒーローカードの効果を実行
   */
  performHeroCardEffect() {}

  addVote() {
    this.vote++;
  }

  reduceVote() {
    this.vote--;
  }

  addVoted() {
    this.voted++;
  }
}
