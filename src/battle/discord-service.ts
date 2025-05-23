import { formatMention, buildUpdateMessage } from "../../discord-service.js";
import { BattleManager } from "./battle.js";

export class BattleApp {
  userId: string;
  message: any;
  gameId: string;
  battleManager: BattleManager;
  /**
   * コンストラクター
   * @param {string} userId
   * @param {string} message
   */
  constructor(userId, message, gameId) {
    this.userId = userId;
    this.message = message;
    this.gameId = gameId;
    this.battleManager = new BattleManager(gameId);
  }

  /**
   * 参加
   * @returns
   */
  join(memberId, memberName) {
    const members = this.battleManager.join(memberId, memberName);
    const { embeds } = this.message;
    embeds[0].fields = members.map((member, i) => ({
      name: i + 1,
      value: formatMention(member.id),
      inline: true,
    }));
    return buildUpdateMessage(this.message, undefined, embeds);
  }
}
