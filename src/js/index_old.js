"use strict";
// // npx ts-node src/index.ts
// import {
//   Client,
//   GatewayIntentBits,
//   Events,
//   Message,
//   TextChannel,
// } from 'discord.js';
// const TOKEN = 'YOUR_DISCORD_BOT_TOKEN';
// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//     GatewayIntentBits.DirectMessages,
//   ],
// });
// type Flow = 'waiting' | 'night' | 'day' | 'voting' | 'result';
// let Flow: Flow = 'waiting';
// let players = new Set<string>();
// let roles: Record<string, string> = {};
// let votes: Record<string, string> = {};
// let mainChannel: TextChannel | null = null;
// client.once(Events.ClientReady, () => {
//   console.log(`✅ Logged in as ${client.user?.tag}`);
// });
// client.on(Events.MessageCreate, async (message: Message) => {
//   if (message.author.bot) return;
//   if (!message.content.startsWith('!')) return;
//   const [cmd] = message.content.slice(1).split(' ');
//   switch (cmd) {
//     case '募集':
//       if (Flow !== 'waiting') return message.reply('ゲーム中です。');
//       mainChannel = message.channel as TextChannel;
//       players.clear();
//       roles = {};
//       votes = {};
//       Flow = 'waiting';
//       players.add(message.author.id);
//       message.channel.send('人狼ゲーム募集を開始します！`!参加` で参加、`!開始` でスタート！');
//       break;
//     case '参加':
//       if (Flow !== 'waiting') return message.reply('募集フェーズではありません。');
//       players.add(message.author.id);
//       message.channel.send(`<@${message.author.id}> が参加しました（${players.size}人）`);
//       break;
//     case '開始':
//       if (players.size < 3) return message.reply('最低3人必要です。');
//       startGame([...players]);
//       break;
//   }
// });
// function shuffle<T>(arr: T[]): T[] {
//   return [...arr].sort(() => Math.random() - 0.5);
// }
// async function startGame(playerList: string[]) {
//   Flow = 'night';
//   const rolePool = ['人狼', '怪盗', ...Array(playerList.length - 2).fill('村人')];
//   const shuffledRoles = shuffle(rolePool);
//   roles = {};
//   playerList.forEach((id, i) => (roles[id] = shuffledRoles[i]));
//   // DM役職通知
//   for (const id of playerList) {
//     const user = await client.users.fetch(id);
//     await user.send(`あなたの役職は **${roles[id]}** です。`);
//   }
//   // 怪盗処理
//   const thiefId = playerList.find(id => roles[id] === '怪盗');
//   if (thiefId) {
//     await handleThief(thiefId, playerList);
//   }
//   // 昼フェーズへ
//   Flow = 'day';
//   mainChannel?.send('🌞 昼フェーズに入りました。議論を開始してください。（1分）');
//   setTimeout(() => {
//     startVoting(playerList);
//   }, 60000);
// }
// async function handleThief(thiefId: string, players: string[]) {
//   const thief = await client.users.fetch(thiefId);
//   const options = players.filter(id => id !== thiefId);
//   const msg = await thief.send(
//     `夜フェーズ：誰の役職を盗みますか？\n` +
//       options.map(id => `<@${id}>`).join('\n')
//   );
//   const collector = msg.channel.createMessageCollector({
//     filter: m => m.author.id === thiefId,
//     time: 30000,
//     max: 1,
//   });
//   return new Promise<void>((resolve) => {
//     collector.on('collect', m => {
//       const targetId = m.mentions.users.first()?.id;
//       if (targetId && roles[targetId]) {
//         [roles[thiefId], roles[targetId]] = [roles[targetId], roles[thiefId]];
//         thief.send(`あなたは <@${targetId}> の役職を盗み、今は **${roles[thiefId]}** です。`);
//       }
//       resolve();
//     });
//     collector.on('end', collected => {
//       if (collected.size === 0) {
//         thief.send('時間切れ。怪盗能力は未使用です。');
//         resolve();
//       }
//     });
//   });
// }
// async function startVoting(players: string[]) {
//   Flow = 'voting';
//   votes = {};
//   mainChannel?.send('🗳️ 投票フェーズ開始！各自DMにて投票してください。');
//   for (const id of players) {
//     const user = await client.users.fetch(id);
//     const msg = await user.send(
//       `誰に投票しますか？以下から1人をメンションで返信してください。\n` +
//         players.map(pid => `<@${pid}>`).join('\n')
//     );
//     const collector = msg.channel.createMessageCollector({
//       filter: m => m.author.id === id,
//       time: 30000,
//       max: 1,
//     });
//     collector.on('collect', m => {
//       const targetId = m.mentions.users.first()?.id;
//       if (targetId && players.includes(targetId)) {
//         votes[id] = targetId;
//         user.send(`あなたは <@${targetId}> に投票しました。`);
//       }
//     });
//   }
//   setTimeout(() => {
//     tallyVotes(players);
//   }, 31000);
// }
// function tallyVotes(players: string[]) {
//   const count: Record<string, number> = {};
//   Object.values(votes).forEach(id => {
//     count[id] = (count[id] || 0) + 1;
//   });
//   const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
//   const [topVotedId] = sorted[0] || [];
//   if (!topVotedId) {
//     mainChannel?.send('投票が成立しませんでした。ゲーム無効。');
//     Flow = 'waiting';
//     return;
//   }
//   mainChannel?.send(`⛓️ 最多得票は <@${topVotedId}>（${count[topVotedId]}票）でした。`);
//   const executedRole = roles[topVotedId];
//   const result =
//     executedRole === '人狼' ? '🌟 村人陣営の勝利！' : '🩸 人狼陣営の勝利！';
//   mainChannel?.send(`処刑されたのは **${executedRole}** でした。\n${result}`);
//   Flow = 'waiting';
// }
