import 'dotenv/config';
import { Client } from 'discord.js';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { responseTestCommand } from './src/js/test.js';
import { responseRecruitCommand, responseRecruitComponent } from './recruit.js';
import { responseGachaCommand } from './src/js/gacha_old.js';

const client = new Client({ intents: [1] });

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
client.on('interactionCreate', async res => {
  // Interaction type and data
  const { type } = res;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    res.ping({ type: InteractionResponseType.PONG });
  };

  /**
   * Handle slash command requests
   * @see https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { commandName } = res;

    if (commandName === 'test') {
      await res.reply(responseTestCommand(res).data);
    };

    if (commandName === 'recruit') {
      await res.reply(responseRecruitCommand(res).data);
    };

    if (commandName === 'gacha') {
      await res.reply(responseGachaCommand(res).data);
    };
  };

  /**
   * Handle requests from interactive components
   * @see https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { commandName } = res.message.interaction;

    if (commandName === 'recruit') {
      await res.update(responseRecruitComponent(res).data);
    };
  };
});

client.login(process.env.DISCORD_TOKEN);
