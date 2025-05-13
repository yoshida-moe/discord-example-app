"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRoles = assignRoles;
exports.assignHeroes = assignHeroes;
const types_1 = require("./types");
/**
 * プレイヤーにランダムで役職を割り当てる
 * @param members プレイヤーのDiscordユーザーID配列
 * @returns 各プレイヤーIDに対応する役職のマッピング
 */
function assignRoles(memberIds) {
    const pool = [
        types_1.Role.Werewolf,
        types_1.Role.Werewolf,
        types_1.Role.Thief,
        types_1.Role.Seer,
        ...Array(memberIds.length - 4).fill(types_1.Role.Villager),
    ];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return Object.fromEntries(memberIds.map((id, i) => [id, shuffled[i]]));
}
/**
 * プレイヤーにヒーローカードをランダムで1枚ずつ配布
 * @param members プレイヤーID一覧
 * @returns プレイヤーID => ヒーロー名 のマッピング
 */
function assignHeroes(members) {
    const shuffled = [...Object.values(types_1.Hero)].sort(() => Math.random() - 0.5);
    return Object.fromEntries(members.map((id, i) => [id, shuffled[i]]));
}
// /**
//  * 各プレイヤーにDMで役職とヒーローを通知
//  */
// export async function notifyRoles(client: Client, state: GameState) {
//   for (const id of state.members) {
//     const user = await client.users.fetch(id);
//     const role = state.roles[id];
//     const hero = state.heroes[id];
//     await user.send(
//       `あなたの役職は **${role}**、ヒーローは **${hero}** です。`
//     );
//   }
// }
// /**
//  * 占い師に1人のプレイヤーの役職を確認させる処理
//  */
// export async function handleSeer(
//   client: Client,
//   state: GameState
// ): Promise<void> {
//   const seerId = state.members.find((id) => state.roles[id] === Role.Seer);
//   if (!seerId) return;
//   const seer = await client.users.fetch(seerId);
//   const targets = state.members.filter((id) => id !== seerId);
//   const msg = await seer.send(
//     `誰を占いますか？\n` + targets.map((id) => `<@${id}>`).join("\n")
//   );
//   const collector = msg.channel.createMessageCollector({
//     filter: (m) => m.author.id === seerId,
//     time: 30000,
//     max: 1,
//   });
//   return new Promise((resolve) => {
//     collector.on("collect", (m) => {
//       const target = m.mentions.users.first()?.id;
//       if (target && state.roles[target]) {
//         seer.send(`<@${target}> の役職は **${state.roles[target]}** です。`);
//       } else {
//         seer.send("無効な対象です。");
//       }
//       resolve();
//     });
//     collector.on("end", (_, reason) => {
//       if (reason === "time") {
//         seer.send("時間切れ：占いをスキップしました。");
//         resolve();
//       }
//     });
//   });
// }
// /**
//  * 怪盗に1人のプレイヤーの役職を盗ませる処理
//  */
// export async function handleThief(client: Client, state: GameState) {
//   const thiefId = state.members.find((id) => state.roles[id] === Role.Thief);
//   if (!thiefId) return;
//   const thief = await client.users.fetch(thiefId);
//   const targets = state.members.filter((id) => id !== thiefId);
//   const msg = await thief.send(
//     `誰の役職を盗みますか？\n` + targets.map((id) => `<@${id}>`).join("\n")
//   );
//   const collector = msg.channel.createReactionCollector({
//     filter: (m) => m.author.id === thiefId,
//     time: 30000,
//     max: 1,
//   });
//   return new Promise<void>((resolve) => {
//     collector.on("collect", (m) => {
//       const target = m.mentions.users.first()?.id;
//       if (target && state.roles[target]) {
//         [state.roles[thiefId], state.roles[target]] = [
//           state.roles[target],
//           state.roles[thiefId],
//         ];
//         thief.send(
//           `あなたは <@${target}> の役職を盗みました。現在の役職は **${state.roles[thiefId]}** です。`
//         );
//       } else {
//         thief.send("無効な対象です。");
//       }
//       resolve();
//     });
//     collector.on("end", (_, reason) => {
//       if (reason === "time") {
//         thief.send("時間切れ：怪盗能力未使用。");
//         resolve();
//       }
//     });
//   });
// }
