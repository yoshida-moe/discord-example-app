import 'dotenv/config';
import { InstallGlobalCommands } from '../../utils.js';

/**
 * @type {Object} Test command
 */
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

/**
 * @type {Object} Bio command
 */
const BIO_COMMAND = {
  name: 'bio',
  description: 'Bio command',
  options: [
    {
      name: 'button',
      description: 'Set bio buttons',
      type: 1,
    },
  ],
  type: 1,
};

/**
 * @type {Object} Recruit command
 */
const RECRUITING_COMMAND = {
  name: 'recruit',
  description: 'Recruit member',
  // options: [
  //   {
  //     name: 'battle',
  //     description: '世界中のプレイヤーが あなたを待っています',
  //     type: 3,
  //     choices: [
  //       {
  //         name: 'バトルアリーナ',
  //         value: 'バトルアリーナ',
  //       },
  //       {
  //         name: 'フリーバトル',
  //         value: 'フリーバトル',
  //       },
  //       {
  //         name: 'カスタムバトル',
  //         value: 'カスタムバトル',
  //       },
  //     ],
  //   },
  //   {
  //     name: 'rank',
  //     description: '',
  //     type: 3,
  //     choices: [
  //       {
  //         name: 'S1',
  //         value: 'S1',
  //       },
  //     ],
  //   },
  // ],
  type: 1,
};

/**
 * @type {Object} Gacha command
 */
const GACHA_COMMAND = {
  name: 'gacha',
  description: 'Draw hero or card gacha results',
  options: [
    {
      name: 'hero',
      description: 'Draw hero gacha results',
      type: 1,
      options: [
        {
          name: 'original',
          description: 'include original hero (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'collaboration',
          description: 'include collaboration hero (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'attacker',
          description: 'include attacker hero (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'gunner',
          description: 'include gunner hero (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'tank',
          description: 'include tank hero (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'sprinter',
          description: 'include sprinter hero (default: true)',
          type: 5,
          required: false,
        },
      ],
    },
    {
      name: 'card',
      description: 'Draw card gacha results',
      type: 1,
      options: [
        {
          name: 'original',
          description: 'include original card (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'collaboration',
          description: 'include collaboration card (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'UR',
          description: 'include UR card (default: true)',
          type: 5,
          required: false,
        },
        {
          name: 'SR',
          description: 'include SR card (default: false)',
          type: 5,
          required: false,
        },
        {
          name: 'R',
          description: 'include R card (default: false)',
          type: 5,
          required: false,
        },
        {
          name: 'N',
          description: 'include N card (default: false)',
          type: 5,
          required: false,
        },
      ],
    },
  ],
};

/**
 * @type {Object} Quiz command
 */
const QUIZ_COMMAND = {
  name: 'quiz',
  description: 'Quiz command',
  type: 1,
};

/**
 * @type {Object} Score command
 */
const SCORE_COMMAND = {
  name: 'score',
  description: 'Score command',
  options: [
    {
      name: "uid",
      description: "The type of uid",
      type: 4,
      required: true,
    },
  ],
  type: 1,
};

/**
 * @type {Object} Generator command
 */
const GENERATOR_COMMAND = {
  name: 'generator',
  description: 'Generator command',
  type: 1,
};

/**
 * @type {Object} Point command
 */
const POINT_COMMAND = {
  name: 'point',
  description: 'Point command',
  type: 1,
};

/**
 * @type {Object} Contact command
 */
const CONTACT_COMMAND = {
  name: 'contact',
  description: 'Contact command',
  type: 1,
};

/**
 * @type {Object} Help command
 */
const HELP_COMMAND = {
  name: 'help',
  description: 'Help command',
  type: 1,
};

/**
 * @type {Object} All commands
 */
const ALL_COMMANDS = [
  TEST_COMMAND,
  RECRUITING_COMMAND,
  GACHA_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);