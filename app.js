import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
// import { getShuffledOptions, getResult } from './game.js';
import { CommandId, CustomBattleId } from "./commands.js";
import { formatMention } from './discord-service.js';
import { BattleApp } from './src/battle/discord-service.js';
import { JinrouApp } from './src/jinrou/discord-service.js';
import { Hero } from './src/jinrou/card/jinrou-hero-card.js';

const MEMBER_JSON_NAME = 'member';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    // "test" command
    if (name === 'test') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Hello :-)',
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
    }

    const resBody = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '',
        embeds: [],
        components: [],
      }
    }

    // "battle" command
    if (name === CommandId.Battle) {
      // const option = options.find(option => option.name === 'object');

      resBody.type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
      // resBody.data.content = '@everyone';
      resBody.data.embeds.push({
        color: 0xff8808,
        title: "メンバー",
        // description: `${option.value}で マッチング中です`,
      });

      const joinButton = {
        type: MessageComponentTypes.BUTTON,
        label: '参加',
        style: ButtonStyleTypes.SUCCESS,
        custom_id: `battle_join`,
      };

      resBody.data.components.push({
        type: MessageComponentTypes.ACTION_ROW,
        components: [joinButton],
      });

      // if (option.value === 'jinrou') {
      resBody.data.components.push({
        type: MessageComponentTypes.ACTION_ROW,
        components: [{
          type: MessageComponentTypes.BUTTON,
          label: '基本ルールで開始',
          style: ButtonStyleTypes.PRIMARY,
          custom_id: 'jinrou_preparation',
          disabled: false, // TODO: 4-6人以外の場合disabled
        }],
      })
      // }
    }

    return res.send(resBody);
  }

  /**
   * Handle requests from interactive components
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { message } = req.body;

    let resBody = {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: message,
    }
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;
    const [mainId, subId, ...optionId] = componentId.split("_");
    const { values } = data;
    // user who clicked button
    const userId = member.user.id;
    const userName = member.user.username;

    console.log(`${formatMention(userId)}が${componentId}を実行`);

    if (mainId === 'battle') {
      const battleService = new BattleApp(userId, message, message.id);

      if (subId === 'join') {
        resBody = battleService.join(userId, userName);
      }
    }

    if (mainId === 'jinrou') {
      const gameId = optionId.length ? optionId[0] : message.id;
      const jinrouService = new JinrouApp(userId, message, gameId);
      if (!(jinrouService.isPlayer(userId) || userId === '404242095814213634')) return;

      if (subId === 'preparation') {
        resBody = jinrouService.preparation();
      }

      if (subId === 'confirmation') {
        resBody = jinrouService.showCard([userId], true, true, true);
      }

      if (subId === 'show-hero') {
        resBody = jinrouService.showCard([userId], false, true, false);
        // resBody.data.components = [{
        //   type: MessageComponentTypes.ACTION_ROW,
        //   components: [{
        //     type: MessageComponentTypes.BUTTON,
        //     label: 'ヒーローカードの効果を実行',
        //     style: ButtonStyleTypes.SECONDARY,
        //     custom_id: `jinrou_perform_${userId}`,
        //   }],
        // }];
      }

      if (subId === 'perform') {
        resBody = jinrouService.showHeroCard();
      };

      if (subId === 'perform-ignis') {
        resBody = jinrouService.performHero(Hero.IgnisWillWisp, values);
      };

      if (subId === 'rps-req') {
        const [value] = values;
        resBody = jinrouService.rpsReq(value);
      }

      if (subId === 'rps-res') {
        const [value] = values;
        resBody = jinrouService.rpsRes(value);
      }

      if (subId === 'to-night') {
        resBody = jinrouService.toNight();
      }

      if (subId === 'action') {
        resBody = jinrouService.action(userId);
      }

      if (subId === 'action-seer') {
        resBody = jinrouService.actionSeer(userId, values);
      }

      if (subId === 'action-werewolf') {
        resBody = jinrouService.actionWerewolf(userId);
      }

      if (subId === 'action-thief') {
        resBody = jinrouService.actionThief(userId, values);
      }

      if (subId === 'to-day') {
        resBody = jinrouService.toDay();
      }

      if (subId === 'vote') {
        resBody = jinrouService.vote(userId, values);
      }

      if (subId === 'report') {
        resBody = jinrouService.report();
      }

      if (subId === 'show-card') {
        resBody = jinrouService.showCard([userId], true, true);
      }
    }

    return res.send(resBody);
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
