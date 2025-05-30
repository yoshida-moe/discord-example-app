import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

export const CommandId = {
  Test: 'test',
  Battle: 'battle',
}

const tmp = [
  {
    mainId: 'test',
  },
  {
    mainId: 'battle',
    optionName: 'object',
    customId: []
  },
  {
    mainId: 'jinrou',
    option: [
      {
        id: 'preparation',
        option: ['base'],
      },
    ]
  },
];

export const CustomBattleId = {
  Join: "join",
  Char: "char",
  Card: "card",
  Jinrou: "jinrou",
  Show: "show",
  Preparation: "preparation",
  Watch: "watch",
  Switch: "switch",
  Vote: "vote",
  Confirmation: "confirmation",
};

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [
    { name: 'バトルアリーナ', value: 'arena' },
    { name: 'フリーバトル', value: 'free' },
    { name: 'カスタムバトル', value: 'custom' },
    { name: 'コンパス人狼', value: 'jinrou' },
  ];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: CommandId.Test,
  description: 'Basic command',
  type: 1,
};

// Command containing options
const BATTLE_COMMAND = {
  name: CommandId.Battle,
  description: 'バトル',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [
  TEST_COMMAND,
  BATTLE_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);