"use strict";
// import { Client, TextChannel } from 'discord.js';
// import { GameState, Flow, Role } from './types';
// import { assignRoles, notifyRoles, handleSeer, handleThief, assignHeroes } from './roleManager';
// import { startVoting, tallyVotes } from './voteManager';
// /**
//  * ゲーム開始処理。役職割り振りと夜フェーズの処理を行う。
//  */
// export async function startGame(client: Client, state: GameState) {
//   const channel = state.mainChannelId ? await client.channels.fetch(state.mainChannelId) : null;
//   if (!channel || !channel.isTextBased()) return;
//   state.phase = Flow.Night;
//   state.roles = assignRoles(state.players);
//   state.heroes = assignHeroes(state.players);
//   await notifyRoles(client, state);
//   await handleSeer(client, state);
//   await handleThief(client, state);
//   state.phase = Flow.Discussion;
//   await channel.send('🌞 昼フェーズ（議論タイム）開始！');
//   setTimeout(() => startVotingPhase(client, state), 60000); // 1分後に投票へ
// }
// /**
//  * 投票フェーズの処理と勝敗判定
//  */
// async function startVotingPhase(client: Client, state: GameState) {
//   const channel = state.mainChannelId ? await client.channels.fetch(state.mainChannelId) : null;
//   if (!channel || !channel.isTextBased()) return;
//   state.phase = Flow.Vote;
//   await channel.send('🗳️ 投票フェーズ！各自DMで投票を行ってください。');
//   await startVoting(client, state);
//   setTimeout(async () => {
//     const resultId = tallyVotes(state);
//     if (!resultId) {
//       await channel.send('投票が成立しませんでした。ゲーム無効。');
//       state.phase = Flow.Preparation;
//       return;
//     }
//     const role = state.roles[resultId];
//     await channel.send(`最多投票は <@${resultId}>（${role}）でした。`);
//     const win = role === Role.Werewolf ? '【村人陣営】の勝利！' : '【人狼陣営】の勝利！！';
//     await channel.send(`🎉 ${win}`);
//     state.phase = Flow.Preparation;
//   }, 31000);
// }
