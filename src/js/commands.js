import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import { ApplicationCommand, ApplicationCommandType } from 'discord-api-types';

/**
 * @type {ApplicationCommand} Help command
 */
const HELP_COMMAND = {
  name: 'help',
  description: 'ヘルプ',
  type: ApplicationCommandType.ChatInput,
};

/**
 * @type {ApplicationCommand} Profile command
 */
const PROFILE_COMMAND = {
  name: 'プロフィール',
  description: 'プロフィール編集',
  type: 1,
};

/**
 * @type {ApplicationCommand} Recruit command
 */
const BATTLE_COMMAND = {
  name: 'battle',
  description: 'バトル',
  type: 1,
  options: [
    {
      name: 'type',
      description: '種類',
      type: 3,
      choices: [
        {
          name: 'バトルアリーナ',
          value: 'バトルアリーナ',
        },
        {
          name: 'フリーバトル',
          value: 'フリーバトル',
        },
        {
          name: 'カスタムバトル',
          value: 'カスタムバトル',
        },
      ],
      required: true,
    },
  ],
};

/**
 * @type {ApplicationCommand} Chat command
 */
const CHAT_COMMAND = {
  name: 'chat',
  description: 'チャット編集',
  type: 1,
};

/**
 * @type {ApplicationCommand} Gacha command
 */
const GACHA_COMMAND = {
  name: 'gacha',
  description: 'ガチャ',
  type: 1,
  options: [
    {
      name: 'char',
      description: 'ヒーローガチャ',
      type: 1,
      options: [
        {
          name: 'role',
          description: 'ロール別ガチャ',
          type: 3,
          choices: [
            {
              name: 'アタッカーガチャ',
              value: 'アタッカー'
            },
            {
              name: 'ガンナーガチャ',
              value: 'ガンナー'
            },
            {
              name: 'タンクガチャ',
              value: 'タンク'
            },
            {
              name: 'スプリンターガチャ',
              value: 'スプリンター'
            },
          ]
        },
        {
          name: 'type',
          description: '種類別ガチャ',
          type: 3,
          choices: [
            {
              name: '通常',
              value: '通常'
            },
            {
              name: 'コラボ',
              value: 'コラボ'
            },
          ]
        },
      ]
    },
    {
      name: 'card',
      description: 'カードガチャ',
      type: 1,
      options: [
        {
          name: 'rarity',
          description: 'レアリティ確定ガチャ',
          type: 3,
          choices: [
            {
              name: 'UR',
              value: 'UR',
            },
            {
              name: 'SR',
              value: 'SR',
            },
            {
              name: 'R',
              value: 'R',
            },
            {
              name: 'N',
              value: 'N',
            },
          ]
        },
      ],
    },
    // {
    //   name: 'medal',
    //   description: 'メダルガチャ',
    //   type: 1,
    // },
  ],
};

/**
 * @type {ApplicationCommand} Quiz command
 */
const QUIZ_COMMAND = {
  name: 'quiz',
  description: 'クイズ',
  options: [
    {
      name: 'char',
      description: 'ヒーロークイズ',
      type: 1,
    },
    {
      name: 'card',
      description: 'カードクイズ',
      type: 1,
    },
  ],
};

/**
 * @type {ApplicationCommand} Generator command
 */
const GENERATOR_COMMAND = {
  name: 'generator',
  description: 'Generator command',
  type: 1,
};

/**
 * @type {ApplicationCommand} Point command
 */
const POINT_COMMAND = {
  name: 'point',
  description: 'ポイント',
  type: 1,
};

/**
 * @type {ApplicationCommand} All commands
 */
const ALL_COMMANDS = [
  // HELP_COMMAND,
  PROFILE_COMMAND,
  BATTLE_COMMAND,
  // CHAT_COMMAND,
  GACHA_COMMAND,
  QUIZ_COMMAND,
  // GENERATOR_COMMAND,
  // POINT_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
