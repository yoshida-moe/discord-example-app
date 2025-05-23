import {
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { formatMention, formatCodeBlock, buildChannelMessage, buildUpdateMessage } from './../../discord-service.js';
import { BattleApp } from '../battle/discord-service.js';
import { JinrouGameMaster } from './jinrou-game.js';
import { Role } from './card/jinrou-role-card.js';
import { Hero } from './card/jinrou-hero-card.js';

const defaultJinrouComponent = {
  type: MessageComponentTypes.ACTION_ROW,
  components: [{
    type: MessageComponentTypes.BUTTON,
    label: '自分の役職とヒーローを確認',
    style: ButtonStyleTypes.SECONDARY,
    custom_id: 'jinrou_confirmation',
  }, {
    type: MessageComponentTypes.BUTTON,
    label: 'ヒーローカードを公開',
    style: ButtonStyleTypes.SECONDARY,
    custom_id: 'jinrou_show-hero',
  }],
};

export class JinrouApp extends BattleApp {
  constructor(userId, message, gameId) {
    super(userId, message, gameId);
    this.jinrouGameMaster = new JinrouGameMaster(gameId);
  }

  /**
   * 
   * @param {*} userId 
   * @returns 
   */
  isPlayer(userId) {
    return this.jinrouGameMaster.isPlayer(userId);
  }

  /**
   * ゲームを開始する。
   * @returns 
   */
  preparation() {
    this.jinrouGameMaster.preparation();

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
        components: [{
          type: MessageComponentTypes.BUTTON,
          label: '夜時間に移行',
          style: ButtonStyleTypes.PRIMARY,
          custom_id: 'jinrou_to-night',
        }],
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
  showCard(targetId, showRole = false, showHero = false, isEphemeral = true) {
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
        components: [{
          type: MessageComponentTypes.BUTTON,
          label: '行動する',
          style: ButtonStyleTypes.SECONDARY,
          custom_id: `jinrou_action`,
        }],
      },
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [{
          type: MessageComponentTypes.BUTTON,
          label: '議論時間に移行',
          style: ButtonStyleTypes.PRIMARY,
          custom_id: 'jinrou_to-day',
        }],
      },
    ];
    return buildUpdateMessage(this.message, undefined, undefined, components);
  }

  /**
   * 
   * @returns 
   */
  action(userId) {
    const [roleId] = this.jinrouGameMaster.confirmationRoleIds(userId);

    const actionComponents = [];
    switch (roleId) {
      case Role.Seer: {
        actionComponents.push({
          type: MessageComponentTypes.STRING_SELECT,
          custom_id: `jinrou_action-seer_${this.message.id}`,
          placeholder: '役職カードを見る',
          options: this.jinrouGameMaster.seerOptions.map(({id, name}) => ({ label: name, value: id })),
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
          options: this.jinrouGameMaster.thiefOptions.map(({id, name}) => ({ label: name, value: id })),
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
    const [targetId] = targetIds;
    const targetRoleId = this.jinrouGameMaster.performRole(userId, targetId);
    const embeds = this.buildCardEmbeds(targetIds, [targetRoleId]);
    return buildUpdateMessage(this.message, undefined, embeds, []);
  }

  /**
   * 怪盗の行動
   * @param {string} targetId 対象のプレイヤーID
   * @returns 
   */
  actionThief(userId, targetIds) {
    const [targetId] = targetIds;
    const targetRoleId = this.jinrouGameMaster.performRole(userId, targetId);
    const embeds = this.buildCardEmbeds(targetIds, [targetRoleId]);
    return buildUpdateMessage(this.message, undefined, embeds, []);
  }

  /**
   * 人狼の行動
   * @returns 
   */
  actionWerewolf(userId) {
    const targetIds = this.jinrouGameMaster.performRole(userId);
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
              ...this.jinrouGameMaster.voteOptions.map(({id, name}) => ({ label: name, value: id })),
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

  vote(userId, targetIds) {
    const [targetId] = targetIds;
    const votingRights = this.jinrouGameMaster.vote(targetId, userId);
    const content = `投票しました。（残り${votingRights}票）`;
    return buildChannelMessage(content);
  }

  report() {
    const target = this.jinrouGameMaster.report();
    const embeds = [
      {
        title: '投票結果',
        description: `${formatMention(target.id)}が通報されます。`,
        fields: this.jinrouGameMaster.players.map(({ name, voted }) => (
          { name, value: `${voted.length}票` }
        )),
      },
      ...this.buildCardEmbeds([target.id], target.roleIds, target.heroIds),
    ]
    const components = []; // TODO: 勝利条件を満たした場合のみ
    return buildChannelMessage('', embeds, components);
  }

  /**
   * ヒーローカードの効果を発動
   * @returns 
   */
  showHeroCard() {
    // if (this.userId !== optionId[0]) return;
    const playerOptions = this.jinrouGameMaster.players.map(({ id, name }) => ({ label: name, value: id }));

    const components = [];

    switch (this.jinrouGameMaster.confirmationHeroIds(this.userId)[0]) { // TODO
      case Hero.IgnisWillWisp: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_perform-ignis`,
            placeholder: '役職カードを見る',
            options: this.jinrouGameMaster.alivePlayers,
          }],
        })
        break;
      };

      case Hero.MagicalGirlLyrica: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_perform-lyrica`,
            placeholder: 'プレイヤー1人を指名する',
            options: this.jinrouGameMaster.alivePlayers,
          }],
        })
        break;
      };

      case Hero.AdamYuriev: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_perform-adam`,
            placeholder: 'プレイヤー1人を選択',
            options: this.jinrouGameMaster.alivePlayers,
          }],
        })
        break;
      };

      case Hero.JusticeHancock: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_perform-justice`,
            placeholder: '自身へ投票してきたプレイヤーを選択',
            options: playerOptions,
          }],
        })
        break;
      };

      case Hero.TadaomiOka: {
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

      case Hero.Layer: {
        components.push({
          type: MessageComponentTypes.ACTION_ROW,
          components: [{
            type: MessageComponentTypes.STRING_SELECT,
            custom_id: `jinrou_perform-layer`,
            placeholder: '役職カードを見る（未実装）',
            options: this.jinrouGameMaster.getPerformLayerOptions(),
          }],
        })
        break;
      };

      default: break;
    }

    return buildChannelMessage('', [], components);
  }
  /**
   * 
   * @param {*} heroId 
   * @param {*} targetIds 
   */
  performHero(heroId, targetIds) {
    this.jinrouGameMaster.performHero(heroId, this.userId, targetIds)
  }

  // /**
  //  * じゃんけんを仕掛ける。
  //  * @param {*} value 
  //  * @returns 
  //  */
  // rpsReq(value) {
  //   const embeds = [{
  //     title: 'じゃんけん',
  //     fields: this.jinrouGameMaster.targets.map((player) => ({ name: formatMention(player.id), value: '' })),
  //   }]
  //   const components = [{
  //     type: MessageComponentTypes.ACTION_ROW,
  //     components: [{
  //       type: MessageComponentTypes.STRING_SELECT,
  //       custom_id: `jinrou_rps_res`,
  //       placeholder: 'じゃんけん',
  //       options: [
  //         { label: '火', value: value === '水' },
  //         { label: '水', value: value === '木' },
  //         { label: '木', value: value === '火' },
  //       ],
  //     }],
  //   }];
  //   return buildChannelMessage('', embeds, components);
  // }

  // /**
  //  * じゃんけんに挑む。
  //  * @param {*} value 
  //  * @returns 
  //  */
  // rpsRes(value) {
  //   const embed = this.message.embeds?.[0] ?? { fields: [] };

  //   if (value) {
  //     embed.fields.find(field => field.name === formatMention(this.userId) && field.value === '').value = '負け';
  //     const user = this.jinrouGameMaster.targets.find((member) => member.id === this.userId);
  //     user.votingRights = 0;
  //   } else {
  //     embed.fields.find(field => field.name === formatMention(this.userId) && field.value === '').value = '勝ち・あいこ';
  //   }

  //   return buildUpdateMessage(this.message, undefined, embeds);
  // }

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