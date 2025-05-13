import 'dotenv/config';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
  TextStyleTypes,
} from 'discord-interactions';
import { Client } from 'discord.js';
import { randomItem } from './game';

const client = new Client({ intents: [1] });

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
client.on('interactionCreate', async res => {
  const { type, data } = appPost(res);
  if (type === InteractionResponseType.PONG) res.ping(data);
  if (type === InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE) res.reply(data);
  if (type === InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE) res.reply(data);
  if (type === InteractionResponseType.DEFERRED_UPDATE_MESSAGE) res.update(data);
  if (type === InteractionResponseType.UPDATE_MESSAGE) res.update(data);
  if (type === InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT) res.reply(data);
  if (type === InteractionResponseType.MODAL) res.showModal(data);
});

export function appPost(req) {
  // Interaction type and data
  const { type } = req;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return ({ type: InteractionResponseType.PONG });
  };

  /**
   * Handle slash command requests
   * @see https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { commandName, options: { _subcommand, _hoistedOptions } } = req;

    // "help" command
    if (commandName === 'help') {
      // コマンドを取得
      // title/descriptionをEmbedsのfieldsのname/valueに格納
    };

    // "profile" command
    if (commandName === 'profile') {
    };

    // "battle" command
    if (commandName === 'battle') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '@everyone',
          embeds: [
            {
              color: 0xff8808,
              title: 'チームメンバー募集',
              description: `${_subcommand}で マッチング中です`,
              fields: [
                {
                  name: 'メンバー一覧',
                  value: '',
                },
              ],
            },
          ],
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  style: ButtonStyleTypes.SUCCESS,
                  label: '参加',
                  custom_id: 'battle_join',
                },
              ],
            },
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  style: ButtonStyleTypes.PRIMARY,
                  label: '自動マッチング',
                  custom_id: 'battle_matching',
                },
              ],
            },
          ],
        },
      };
    };

    // "chat" command
    if (commandName === 'chat') {
      const buttonConfigs = {
        role: ['アタ', 'ガン', 'タン', 'スプ'],
        skill1: ['近', '遠', '周', '連', '罠'],
        skill2: ['癒', '防', '返', '破', '移'],
        portal: ['A', 'B', 'C', 'D', 'E'],
        number: ['1', '2', '3', '4', '5'],
      };

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: buttonConfigs[_subcommand].map(button => ({
                type: MessageComponentTypes.BUTTON,
                label: button,
                style: ButtonStyleTypes.PRIMARY,
                custom_id: button,
              })),
            },
          ],
        },
      };
    };

    // "gacha" command
    if (commandName === 'gacha') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: gacha(_subcommand, _hoistedOptions[0]),
      };
    };

    // "quiz" command
    if (commandName === 'quiz') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: quiz(_subcommand),
      };
    };

    // "generator" command
    if (commandName === 'generator') {
    };

    // "point" command
    if (commandName === 'point') {
    };

    // UNION ARENA

    // "union" command
    if (commandName === 'union') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '',
          embeds: [
            {
              title: 'UNION ARENA',
              description: '',
              fields: [
                {
                  name: 'ターン数',
                  value: '',
                },
                {
                  name: '先攻/後攻',
                  value: '',
                },
              ],
              image: {
                url: '',
              },
            },
            {
              title: '',
              description: '',
              fields: [
                {
                  name: 'フロントライン',
                  value: ['- ', '- ', '- ', '- '].join('\n'),
                },
                {
                  name: 'エナジーライン',
                  value: ['- ', '- ', '- ', '- '].join('\n'),
                },
                {
                  name: 'ライフエリア',
                  value: 7,
                },
                {
                  name: 'APエリア',
                  value: 0,
                },
                {
                  name: '山札',
                  value: 50,
                },
                {
                  name: '場外',
                  value: 0,
                },
                {
                  name: 'リムーブエリア',
                  value: 0,
                },
              ],
              image: {
                url: '',
              },
            },
            {
              title: '',
              description: '',
              fields: [
                {
                  name: 'フロントライン',
                  value: ['- ', '- ', '- ', '- '].join('\n'),
                },
                {
                  name: 'エナジーライン',
                  value: ['- ', '- ', '- ', '- '].join('\n'),
                },
                {
                  name: 'ライフエリア',
                  value: 7,
                },
                {
                  name: 'APエリア',
                  value: 0,
                },
                {
                  name: '山札',
                  value: 50,
                },
                {
                  name: '場外',
                  value: 0,
                },
                {
                  name: 'リムーブエリア',
                  value: 0,
                },
              ],
              image: {
                url: '',
              },
            },
          ],
          attachments: [
            {
              id: '',
              url: '',
            }
          ]
        },
      };
    };

    // "moving-phase" command
    if (commandName === 'moving-phase') {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Mason is looking for new arena partners. What classes do you play?",
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: "remove",
                  options: [
                    {
                      label: "Rogue",
                      value: "GIM-1-001",
                      description: "Sneak n stab",
                    },
                    {
                      label: "Mage",
                      value: "GIM-1-002",
                      description: "Turn 'em into a sheep",
                    },
                    {
                      label: "Priest",
                      value: "GIM-1-003",
                      description: "You get heals when I'm done doing damage",
                    }
                  ],
                  placeholder: "Choose a class",
                  min_values: 0,
                  max_values: 4,
                  disabled: true,
                }
              ]
            }
          ]
        },
      };
    };
  };

  /**
   * Handle requests from interactive components
   * @see https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { customId, user, message: { components, embeds } } = req;

    if (customId.startsWith('chat')) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: customId.split('_')[1],
      };
    };

    if (customId.startsWith('battle')) {
      const memberList = embeds[0].fields[0].value.split('\n');

      if (customId.startsWith('battle_join')) {
        const index = memberList.indexOf(`1. <@${user.id}>`);
        if (index === -1) {
          memberList.push(`1. <@${user.id}>`);
        } else {
          memberList.splice(index, 1);
        };
        embeds[0].fields[0].value = memberList.join('\n');
      };

      if (customId.startsWith('battle_matching')) {
        for (let i = memberList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [memberList[i], memberList[j]] = [memberList[j], memberList[i]];
        };

        for (let i = 0; i < memberList.length / 3; i++) {
          embeds[0].fields[i + 1] = {
            name: `TEAM${i + 1}`,
            value: memberList.slice(3 * i, 3 * i + 3).join('\n'),
            inline: true,
          };
        };
      };

      if (customId.startsWith('battle_manual')) {
        // メンバーのボタンを設定
        for (let i = 0; i < memberList.length; i++) {
          components[i + 1] = {
            type: MessageComponentTypes.ACTION_ROW,
            components: memberList.slice(3 * i, 3 * i + 3).map(member => ({
              type: MessageComponentTypes.BUTTON,
              style: ButtonStyleTypes.SECONDARY,
              label: member,
              custom_id: member,
            })),
          };
        };

        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: embeds,
          },
        };
      };

      return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          embeds: embeds,
        },
      };
    };

    if (customId.startsWith('gacha')) {
      return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: gacha(customId.split('_')[1]),
      };
    };

    if (customId.startsWith('quiz')) {
      return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: quiz(customId.split('_')[1]),
      };
    };

    if (customId.startsWith('result')) {
      embeds[0].fields[0].value = customId.split('_')[1];
      return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          embeds: embeds,
        },
      };
    };

    if (customId.startsWith('point')) {
      // 理想：トナメル
      // メンバー登録。ボタン押下でEmbedsのfieldsに追加
      // battleの手動マッチングとしてやってもいい
      // 自分のチームのポータル数を入力
      return {
        // メンバーを選択、ポイント追加。
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }
  };

  /**
   * Handle modal submissions
   */
  if (type === InteractionType.MODAL_SUBMIT) {
    const { customId, user, fields: { fields } } = req;

    const components = [];

    if (fields.get('TwitterID').value) {
      components = [
        {
          type: MessageComponentTypes.BUTTON,
          style: ButtonStyleTypes.LINK,
          label: '🕊️ 見に行く',
          url: `https://twitter.com/${fields.get('TwitterID').value}`,
        },
      ];
    };

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [
          {
            color: 0xff8808,
            title: customId,
            description: `<@${user.id}>`,
            fields: Array.from(fields.entries()).filter(([key]) => key !== 'TwitterID').map(([key, { value, customId }]) => ({
              name: customId,
              value: value,
            })),
          },
        ],
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: components,
          },
        ],
      },
    };
  };
};

client.login(process.env.DISCORD_TOKEN);

/**
 * Get the message of gacha.
 * @param {string} type
 * @returns {Message}
 */
function gacha(type) {
  const { name, path } = randomItem(items[type].filter(item => item.type == '通常' || item.type == 'コラボ'));

  return {
    embeds: [
      {
        color: 0xff8808,
        title: 'ガチャ',
        description: '探しものが 見つかるといいですね',
        fields: [
          {
            name: 'ガチャ結果',
            value: name,
          },
        ],
        image: { url: path }
      },
    ],
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            label: 'ヒーロー',
            style: ButtonStyleTypes.SECONDARY,
            custom_id: 'gacha_char',
          },
        ],
      },
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            label: 'カード',
            style: ButtonStyleTypes.SECONDARY,
            custom_id: 'gacha_card',
          },
        ],
      },
    ],
  };
};

/**
 * Get the message of quiz.
 * @param {string} type 
 * @returns {Message}
 */
function quiz(type) {
  const { name, path } = randomItem(items[type].filter(item => item.type == '通常' || item.type == 'コラボ'));

  return {
    embeds: [
      {
        color: 0xff8808,
        title: 'クイズ',
        description: '',
        fields: [
          {
            name: '名前',
            value: '',
          },
        ],
        image: {
          url: path,
        },
      },
    ],
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            label: '答え',
            style: ButtonStyleTypes.DANGER,
            custom_id: `result_${name}`,
          },
        ],
      },
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            label: 'ヒーロー',
            style: ButtonStyleTypes.SECONDARY,
            custom_id: 'quiz_char',
          },
          {
            type: MessageComponentTypes.BUTTON,
            label: 'カード',
            style: ButtonStyleTypes.SECONDARY,
            custom_id: 'quiz_card',
          },
        ],
      },
    ],
  };
};
