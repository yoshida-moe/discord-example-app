import { InteractionResponseType } from 'discord-interactions';

/** 
 * testコマンド実行時のメッセージを取得
 * @param {Object} interaction - interaction
 */
export function getResTest() {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Hello :-)',
    },
  };
};