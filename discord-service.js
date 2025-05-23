import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { BattleManager } from './battle.js';

/**
 * フォーマット
 * @param {string} message 
 * @param {string} prefix 接頭辞
 * @param {string} suffix 接尾辞
 * @returns 
 */
export function format(message, prefix, suffix) {
  return `${prefix}${message}${suffix}`;
}

/**
 * メンションへフォーマット
 * @param {string} message 
 * @returns 
 */
export function formatMention(message) {
  const prefix = '<@';
  const suffix = '>';
  return format(message, prefix, suffix);
}

/**
 * コードブロックへフォーマット
 */
export function formatCodeBlock(message) {
  const codeBlock = '```';
  return format(message, codeBlock, codeBlock);
}

/**
 * メッセージをビルド
 * @param {InteractionResponseType} type 
 * @param {string} content 
 * @param {*} embeds 
 * @param {*} components 
 * @returns 
 */
export function buildMessage(type, content = '', embeds = [], components = [], isEphemeral = false) {
  if (isEphemeral) {
    return { type, data: { content, embeds, components, flags: InteractionResponseFlags.EPHEMERAL } };
  }
  return { type, data: { content, embeds, components } };
}

/**
 * チャンネルメッセージをビルド
 * @param {string} content 
 * @param {*} embeds 
 * @param {*} components 
 * @returns 
 */
export function buildChannelMessage(content = '', embeds = [], components = [], isEphemeral = false) {
  const type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
  return buildMessage(type, content, embeds, components, isEphemeral);
}

/**
 * 更新メッセージをビルド
 * @param {string} content 
 * @param {*} embeds 
 * @param {*} components 
 * @returns 
 */
export function buildUpdateMessage(message, content = undefined, embeds = undefined, components = undefined) {
  content ??= message.content;
  embeds ??= message.embeds;
  components ??= message.components;

  const type = InteractionResponseType.UPDATE_MESSAGE;
  return buildMessage(type, content, embeds, components);
}

export class BattleApp {
  /**
   * 
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
   * 
   * @returns 
   */
  join(memberId, memberName) {
    const members = this.battleManager.join(memberId, memberName);
    const { embeds } = this.message;
    embeds[0].fields = members.map((member, i) => (
      { name: i + 1, value: formatMention(member.id), inline: true }
    ));
    return buildUpdateMessage(this.message, undefined, embeds);
  }

}

import { Hero, Role, heroData, roleData, JinrouGameMaster } from "./jinrou.js";

const defaultJinrouComponent = {
  type: MessageComponentTypes.ACTION_ROW,
  components: [{
    type: MessageComponentTypes.BUTTON,
    label: '自分の役職とヒーローを確認',
    style: ButtonStyleTypes.SECONDARY,
    custom_id: 'jinrou_confirmation',
  }, {
    type: MessageComponentTypes.BUTTON,
    label: 'ヒーローを公開',
    style: ButtonStyleTypes.SECONDARY,
    custom_id: 'jinrou_show-hero',
  }],
};

const jinrouDeckEditButton = {
  type: MessageComponentTypes.BUTTON,
  label: 'デッキ編集',
  style: ButtonStyleTypes.SECONDARY,
  custom_id: 'jinrou_deck_edit',
};

const jinrouStartButton = {
  type: MessageComponentTypes.BUTTON,
  label: '基本ルールで開始',
  style: ButtonStyleTypes.PRIMARY,
  custom_id: 'jinrou_start_base',
};

const jinrouHomeButton = {
  type: MessageComponentTypes.BUTTON,
  label: '戻る',
  style: ButtonStyleTypes.PRIMARY,
  custom_id: 'jinrou_home',
};

const jinrouPerformButton = {
  type: MessageComponentTypes.BUTTON,
  label: 'ヒーローカードの効果を実行',
  style: ButtonStyleTypes.SECONDARY,
  custom_id: 'jinrou_perform',
};

const jinrouNightButton = {
  type: MessageComponentTypes.BUTTON,
  label: '夜時間に移行',
  style: ButtonStyleTypes.PRIMARY,
  custom_id: 'jinrou_to-night',
};

const jinrouActionButton = {
  type: MessageComponentTypes.BUTTON,
  label: '行動する',
  style: ButtonStyleTypes.SECONDARY,
  custom_id: `jinrou_action`,
};

const jinrouDayButton = {
  type: MessageComponentTypes.BUTTON,
  label: '議論時間に移行',
  style: ButtonStyleTypes.PRIMARY,
  custom_id: 'jinrou_to-day',
};

/**
 * 
 */
export class JinrouApp extends BattleApp {
  constructor(userId, message, gameId) {
    super(userId, message, gameId);
    this.jinrouGameMaster = new JinrouGameMaster(gameId);
  }

  get user() {
    return this.jinrouGameMaster.getPlayer(this.userId);
  }

  get messageId() {
    return this.message.id;
  }

  get embeds() {
    return this.message.embeds;
  }

  /**
   * ゲームを開始する。
   * @returns 
   */
  start() {
    this.jinrouGameMaster.start();

    const embeds = this.embeds;
    embeds.push({
      color: 0x806993,
      title: "コンパス人狼",
      description: '',
      url: 'https://app.nhn-playart.com/compass/jinrou/howto.nhn'
    });

    const components = [
      defaultJinrouComponent,
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [jinrouNightButton],
      }
    ];

    return buildUpdateMessage(this.message, undefined, embeds, components);
  }

  /**
   * カードを公開する。
   * @param {*} showRole 
   * @param {*} showHero 
   * @param {*} isEphemeral 
   * @returns 
   */
  showCard(targetId = this.userId, showRole = false, showHero = false, isEphemeral = true) {
    const roleIds = showRole ? this.jinrouGameMaster.confirmationRoleIds(targetId) : [];
    const heroIds = showHero ? this.jinrouGameMaster.confirmationHeroIds(targetId) : [];
    const embeds = this.buildCardEmbeds([targetId], roleIds, heroIds);
    return buildChannelMessage('', embeds, [], isEphemeral);
  }

  /**
   * カードの埋め込みオブジェクトを構築
   * @param {*} targetId 
   * @param {*} showRole 
   * @param {*} showHero 
   * @returns 
   */
  buildCardEmbeds(targetIds = [], roleIds = [], heroIds = []) {
    let embeds = [];
    for (const targetId of targetIds) {
      const target = this.jinrouGameMaster.players.find(player => player.id === targetId);
      if (roleIds.length) embeds = [...embeds, ...this.buildCardEmbed(target.name, roleIds, roleData, `img_card${roleIds[0]}.png`)];
      if (heroIds.length) embeds = [...embeds, ...this.buildCardEmbed(target.name, heroIds, heroData, `card_hero${heroIds[0]}.png`)];
    }
    return embeds;
  }

  /**
   * 
   * @param {*} name 
   * @param {*} itemId 
   * @param {*} targetItemDataName 
   * @param {*} fileName 
   * @returns 
   */
  buildCardEmbed(name, itemIds, data, fileName) {
    return itemIds.map(itemId => {
      const item = data.find(item => item.id === itemId);
      const basePath = 'https://s.nhn-playart.com/smartgame/spn/games/compass/jinrou/img';
      const url = `${basePath}/${fileName}`;

      return {
        title: item.name,
        description: formatCodeBlock(item.detail),
        thumbnail: { url },
        author: { name }
      };
    })
  }

  /**
   * 夜時間へ移行する。
   * @returns 
   */
  toNight() {
    const components = [
      defaultJinrouComponent,
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [jinrouActionButton],
      },
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [jinrouDayButton],
      },
    ];
    return buildUpdateMessage(this.message, undefined, undefined, components);
  }

  /**
   * 
   * @returns 
   */
  action() {
    const roleIds = this.jinrouGameMaster.canAction(this.userId);
    if (roleIds.length === 0) {
      return buildChannelMessage('行動済み', [], [], true);
    }

    const actionComponents = [];
    switch (roleIds[0]) {// TODO
      case Role.Seer: {
        actionComponents.push({
          type: MessageComponentTypes.STRING_SELECT,
          custom_id: `jinrou_action-seer_${this.message.id}`,
          placeholder: '役職カードを見る',
          options: this.jinrouGameMaster.targets.map((target) => ({ label: target.name, value: target.id })),
        });
        break;
      }

      case Role.Werewolf: {
        actionComponents.push({
          type: MessageComponentTypes.BUTTON,
          label: '仲間を確認',
          style: ButtonStyleTypes.SECONDARY,
          custom_id: `jinrou_action-werewolf_${this.message.id}`,
        })
        break;
      }

      case Role.Thief: {
        actionComponents.push({
          type: MessageComponentTypes.STRING_SELECT,
          custom_id: `jinrou_action-thief_${this.message.id}`,
          placeholder: '役職カードを見る',
          options: this.jinrouGameMaster.targets.map((player) => ({ label: player.name, value: player.id })),
        });
        break;
      }

      default: break;
    }

    const content = '10秒後に「議論時間へ移行」ボタンを押下してください。';
    const components = [{
      type: MessageComponentTypes.ACTION_ROW,
      components: actionComponents,
    }]
    const isEphemeral = true;

    return buildChannelMessage(content, [], components, isEphemeral)
  }

  /**
   * 占い師の行動
   * @param {string} targetId 対象のプレイヤーID
   * @returns 
   */
  actionSeer(userId, targetIds) {
    const roleIds = this.jinrouGameMaster.canAction(this.userId);
    if (roleIds.length === 0) {
      return buildChannelMessage('行動済み', [], [], true);
    }

    const [targetId] = targetIds;
    const targetRoleIds = this.jinrouGameMaster.actionSeer(userId, targetId);
    const embeds = this.buildCardEmbeds(targetIds, targetRoleIds);
    return buildUpdateMessage(this.message, undefined, embeds, []);
  }

  /**
   * 怪盗の行動
   * @param {string} targetId 対象のプレイヤーID
   * @returns 
   */
  actionThief(userId, targetIds) {
    const roleIds = this.jinrouGameMaster.canAction(this.userId);
    if (roleIds.length === 0) {
      return buildChannelMessage('行動済み', [], [], true);
    }

    const [targetId] = targetIds;
    const targetRoleIds = this.jinrouGameMaster.actionThief(userId, targetId);
    const embeds = this.buildCardEmbeds(targetIds, targetRoleIds);
    return buildUpdateMessage(this.message, undefined, embeds, []);
  }

  /**
   * 人狼の行動
   * @returns 
   */
  actionWerewolf(userId) {
    const roleIds = this.jinrouGameMaster.canAction(this.userId);
    if (roleIds.length === 0) {
      return buildChannelMessage('行動済み', [], [], true);
    }
    
    const targetIds = this.jinrouGameMaster.actionWerewolf(userId);
    const targetRoleIds = [Role.Werewolf];
    const embeds = this.buildCardEmbeds(targetIds, targetRoleIds);
    return buildUpdateMessage(this.message, undefined, embeds, []);
  }

  /**
   * 議論時間へ移行する。
   * @returns 
   */
  toDay() {
    const components = [
      defaultJinrouComponent,
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_vote`,
            placeholder: '投票する',
            options: [
              ...this.jinrouGameMaster.targets.map((player) => ({ label: player.name, value: player.id })),
            ],
          },
          // {
          //   type: MessageComponentTypes.STRING_SELECT,
          //   custom_id: `jinrou_vote-cancel`,
          //   placeholder: '投票を取消',
          //   options: [
          //     ...this.jinrouGameMaster.targets.map((player) => ({ label: player.name, value: player.id })),
          //   ],
          // },
        ],
      },
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            label: '通報する',
            style: ButtonStyleTypes.DANGER,
            custom_id: `jinrou_report`,
          },
        ],
      },
    ]
    return buildUpdateMessage(this.message, undefined, undefined, components);
  }

  vote(targetIds) {
    const [targetId] = targetIds;
    const votingRights = this.jinrouGameMaster.vote(this.userId, targetId);
    const content = `${formatMention(targetId)} に投票しました。（残り${votingRights}票）`;
    return buildChannelMessage(content);
  }

  report() {
    const mostVoted = this.jinrouGameMaster.report();
    const embeds = [
      {
        title: '投票結果',
        description: `${formatMention(mostVoted.id)}が通報されます。`,
        fields: this.jinrouGameMaster.players.map(({ name, voted }) => (
          { name, value: `${voted.length}票` }
        )),
      },
      ...this.buildCardEmbeds(mostVoted.id, mostVoted.roleIds, mostVoted.heroIds),
    ]
    const components = []; // TODO: 勝利条件を満たした場合のみ
    return buildChannelMessage('', embeds, components);
  }

  /**
   * ヒーローカードの効果を実行
   * @returns 
   */
  perform() {
    // if (this.userId !== optionId[0]) return;
    const playerOptions = this.jinrouGameMaster.players.map(({ id, name }) => ({ label: name, value: id }));

    const components = [];

    switch (this.jinrouGameMaster.confirmationHeroIds(this.userId)[0]) { // TODO
      case Hero.Ignis: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_watch`,
            placeholder: '役職カードを見る',
            options: playerOptions,
          }],
        })
        break;
      };

      case Hero.Ririka: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_double-voting-right`,
            placeholder: 'プレイヤー1人を指名する（未実装）',
            options: playerOptions,
          }],
        })
        break;
      };

      case Hero.Adam: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_ice`,
            placeholder: 'プレイヤー1人を選択（未実装）',
            options: playerOptions,
          }],
        })
        break;
      };

      case Hero.Justice: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_ice`,
            placeholder: '自身へ投票してきたプレイヤーを選択（未実装）',
            options: playerOptions,
          }],
        })
        break;
      };

      case Hero.Tadaomi: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_rps_req`,
            placeholder: 'じゃんけん',
            options: [
              { label: '火', value: '火' },
              { label: '水', value: '水' },
              { label: '木', value: '木' },
            ],
          }],
        })
        break;
      };

      case Hero.Reiya: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_watch`,
            placeholder: '役職カードを見る（未実装）',
            options: [{ label: "中央1", value: "center-1" }, { label: "中央2", value: "center-2" }],
          }],
        })
        break;
      };

      default: break;
    }

    return buildChannelMessage('', [], components);
  }

  /**
   * じゃんけんを仕掛ける。
   * @param {*} value 
   * @returns 
   */
  rpsReq(value) {
    const embeds = [{
      title: 'じゃんけん',
      fields: this.jinrouGameMaster.targets.map((player) => ({ name: formatMention(player.id), value: '' })),
    }]
    const components = [{
      type: MessageComponentTypes.ACTION_ROW,
      components: [{
        type: MessageComponentTypes.STRING_SELECT,
        custom_id: `jinrou_rps_res`,
        placeholder: 'じゃんけん',
        options: [
          { label: '火', value: value === '水' },
          { label: '水', value: value === '木' },
          { label: '木', value: value === '火' },
        ],
      }],
    }];
    return buildChannelMessage('', embeds, components);
  }

  /**
   * じゃんけんに挑む。
   * @param {*} value 
   * @returns 
   */
  rpsRes(value) {
    const embed = this.message.embeds?.[0] ?? { fields: [] };

    if (value) {
      embed.fields.find(field => field.name === formatMention(this.userId) && field.value === '').value = '負け';
      const user = this.jinrouGameMaster.targets.find((member) => member.id === this.userId);
      user.votingRights = 0;
    } else {
      embed.fields.find(field => field.name === formatMention(this.userId) && field.value === '').value = '勝ち・あいこ';
    }

    return buildUpdateMessage(this.message, undefined, embeds);
  }

  // TODO: デッキ構築
  // deck() {
  //   if (optionId[0] === 'edit') {
  //     const jinrouHeroItems = readJson(JINROU_HERO_JSON_NAME).items;
  //     const vols = [1, 2, 3];
  //     resBody.data.components = vols.map((vol, index) => ({
  //       type: MessageComponentTypes.ACTION_ROW,
  //       components: [{
  //         type: MessageComponentTypes.STRING_SELECT,
  //         custom_id: `jinrou_deck_${vol}`,
  //         placeholder: `デッキ選択（Vol.${vol}）`,
  //         options: jinrouHeroItems.items.slice(index * 10, (index + 1) * 10).map(
  //           (card) => ({
  //             label: card.name,
  //             value: card.id,
  //             description: card.detail,
  //             default: true,
  //           })
  //         ),
  //         min_values: 0,
  //         max_values: 10,
  //       }]
  //     }));
  //     resBody.data.components.push({
  //       type: MessageComponentTypes.ACTION_ROW,
  //       components: [jinrouHomeButton],
  //     });
  //   } else {
  //     const [vol] = optionId;
  //     battle.setDeck(values);
  //   }
  // }
}