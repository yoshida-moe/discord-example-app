"use strict";
// import { Client } from 'discord.js';
// import { GameState } from './types';
// export async function startVoting(client: Client, state: GameState) {
//   state.votes = {};
//   for (const id of state.players) {
//     const user = await client.users.fetch(id);
//     const msg = await user.send(
//       `誰に投票しますか？\n` +
//         state.players.map(pid => `<@${pid}>`).join('\n')
//     );
//     const collector = msg.channel.createMessageCollector({
//       filter: m => m.author.id === id,
//       time: 30000,
//       max: 1,
//     });
//     collector.on('collect', m => {
//       const target = m.mentions.users.first()?.id;
//       if (target && state.players.includes(target)) {
//         state.votes[id] = target;
//         user.send(`<@${target}> に投票しました。`);
//       }
//     });
//   }
// }
// export function tallyVotes(state: GameState): string | null {
//   const count: Record<string, number> = {};
//   for (const v of Object.values(state.votes)) {
//     count[v] = (count[v] || 0) + 1;
//   }
//   const [top] = Object.entries(count).sort((a, b) => b[1] - a[1]);
//   return top?.[0] || null;
// }
