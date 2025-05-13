import { Flow, Hero, Role } from "./types";
import { Member } from "./member";

/**
 * ゲームの状態とUIを管理するクラス
 */
export class Game {
  id: string;
  members: Member[];
  flow: Flow = Flow.Preparation;

  /**
   *
   * @param content
   * @param embeds
   * @param components
   */
  constructor(id: string, memberIds: string[] = []) {
    this.id = id;
    this.members = memberIds.map((memberId) => new Member(memberId));
  }

  get memberIds() {
    return this.members.map((member) => member.id);
  }

  /**
   * 人狼か
   */
  getRole(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.role;
  }

  /**
   * 人狼か
   */
  getHero(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.hero;
  }

  /**
   * 人狼か
   */
  isWerewolf(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.isWerewolf;
  }

  /**
   * 村人か
   */
  isVillager(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.isVillager;
  }

  /**
   * 怪盗か
   */
  isThief(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.isThief;
  }

  /**
   * 占い師か
   */
  isSeer(memberId: string) {
    return this.members.find((member) => member.id === memberId)?.isSeer;
  }

  /**
   * 参加
   * @param user Discordユーザー
   */
  join(memberId: string): void {
    const index = this.members.map((member) => member.id).indexOf(memberId);

    if (index === -1) {
      this.members.push(new Member(memberId));
    } else {
      this.members.splice(index, 1);
    }
  }

  /**
   * ゲーム開始処理
   */
  start(): void {
    this.flow = Flow.Night;

    const roles = this.generateRoles(this.members.length);
    const shuffledRoles = this.shuffle(roles);
    const heroes = Object.values(Hero);
    const shuffledHeroes = this.shuffle(heroes);

    this.members.forEach((member, index) => {
      Object.assign(member, {
        role: shuffledRoles[index],
        hero: shuffledHeroes[index],
      });
    });
  }

  /**
   * ゲーム開始処理
   * @param user 開始したユーザー
   */
  watch(userId: string, targetId: string) {
    this.flow = Flow.Night;

    const user = this.getMemberById(userId);

    if (user?.role !== Role.Seer) return;

    if (targetId === "center") {
      const roles = this.generateRoles(this.members.length);
      const assignedRoles = this.members.map((m) => m.role);
      const centerRoles = roles.filter((role) => {
        const index = assignedRoles.indexOf(role);
        if (index === -1) return true;
        assignedRoles.splice(index, 1);
        return false;
      });

      return centerRoles;
    }

    const target = this.getMemberById(targetId);

    return target?.role;
  }

  switch(userId: string, targetId: string) {
    this.flow = Flow.Night;

    const user = this.getMemberById(userId);
    const target = this.getMemberById(targetId);

    if (user?.role !== Role.Thief || !target) return;

    const tempRole = user.role;
    user.role = target.role!;
    target.role = tempRole;

    return target.role;
  }

  vote(userId: string, targetId: string) {
    this.flow = Flow.Night;

    const user = this.getMemberById(userId);
    const target = this.getMemberById(targetId);
    user?.reduceVote();
    target?.addVoted();
  }

  /**
   *
   * @param memberCount
   * @returns
   */
  private generateRoles(memberCount: number): Role[] {
    const baseRoles = [Role.Werewolf, Role.Werewolf, Role.Thief, Role.Seer];
    const totalNeeded = memberCount + 2;
    const villagerCount = totalNeeded - baseRoles.length;

    if (villagerCount < 0) throw new Error("プレイヤーが少なすぎます");

    return [...baseRoles, ...Array(villagerCount).fill(Role.Villager)];
  }

  private getMemberById(id: string) {
    return this.members.find((member) => member.id === id);
  }

  /**
   *
   * @param array
   * @returns
   */
  private shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  rps() {}
}
