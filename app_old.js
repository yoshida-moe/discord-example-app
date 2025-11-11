"use strict";
// import "dotenv/config";
// import express from "express";
// import {
//   InteractionType,
//   InteractionResponseType,
//   ActionRow,
//   Button,
//   ButtonStyleTypes,
//   InteractionResponseFlags,
//   MessageComponent,
//   MessageComponentTypes,
//   StringSelect,
//   StringSelectOption,
//   TextStyleTypes,
//   InputText,
// } from "discord-interactions";
// import { VerifyDiscordRequest } from "./utils";
// import type { Request, Response } from "express";
// import { JinrouGame } from "./src/jinrou/jinrou-game.js";
// import { readJson, updateJson } from "./src/jfs";
// import { CommandId } from "./commands";
// // Create an express app
// const app = express();
// // Get port, or default to 3000
// const PORT = process.env.PORT || 3000;
// // Parse request body and verifies incoming requests using discord-interactions package
// app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
// /**
//  * Interactions endpoint URL where Discord will send HTTP requests
//  */
// app.post("/interactions", async function (
//   req: Request,
//   res: Response
// ): Promise<Response> {
//   // Interaction type and data
//   const { type, member, data, message } = req.body;
//   const body = new ResBody();
//   switch (type) {
//     /**
//      * Handle verification requests
//      */
//     case InteractionType.PING:
//       return res.send({ type: InteractionResponseType.PONG });
//     /**
//      * Handle slash command requests
//      * @see https://discord.com/developers/docs/interactions/application-commands#slash-commands
//      */
//     case InteractionType.APPLICATION_COMMAND:
//       return res.send(body.command(data, member.user));
//     /**
//      * Handle requests from interactive components
//      * @see https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
//      */
//     case InteractionType.MESSAGE_COMPONENT:
//       try {
//         await res.send(body.message(data, member.user, message));
//       } catch (err) {
//         console.error("Error sending message:", err);
//       }
//   }
//   return res.sendStatus(400);
// } as unknown as express.RequestHandler);
// app.listen(PORT, () => {
//   console.log("Listening on port", PORT);
// });
// const defaultGachaResultFields = {
//   name: "ガチャ結果",
//   value: "",
// };
// const defaultFlowFields = { name: "フロー", value: "" };
// /**
//  *
//  */
// class ResBody {
//   /**
//    *
//    * @param data
//    * @returns
//    */
//   command(
//     data: {
//       type: number;
//       name: string;
//       id: number;
//       options: { type: number; name: string; value: string }[];
//     },
//     user: { id: string }
//   ) {
//     const { name, options } = data;
//     switch (name) {
//       // テストコマンド
//       case CommandId.Test: {
//         return {
//           type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//           data: {
//             content: "Hello :-)",
//             flags: InteractionResponseFlags.EPHEMERAL,
//           },
//         };
//       }
//       // プロフィールコマンド
//       // case CommandId.Profile: {
//       //   return {
//       //     type: InteractionResponseType.MODAL,
//       //     data: {
//       //       custom_id: "プロフィール",
//       //       title: "プロフィール",
//       //       components: [
//       //         this.createButtonsActionRow([
//       //           this.createInputText(`${name}_${"ランク"}`, "ランク"),
//       //         ]),
//       //         this.createButtonsActionRow([
//       //           this.createInputText(`${name}_${"ヒーロー"}`, "ヒーロー"),
//       //         ]),
//       //         this.createButtonsActionRow([
//       //           this.createInputText(`${name}_${"コメント"}`, "コメント"),
//       //         ]),
//       //         this.createButtonsActionRow([
//       //           this.createInputText(`${name}_${"応援コード"}`, "応援コード"),
//       //         ]),
//       //         this.createButtonsActionRow([
//       //           this.createInputText(`${name}_${"TwitterID"}`, "TwitterID"),
//       //         ]),
//       //       ],
//       //     },
//       //   };
//       // }
//       // 募集コマンド
//       case CommandId.Recruit: {
//         return {
//           type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//           data: {
//             // content: "@everyone",
//             embeds: [this.createMemberEmbed([`<@${user.id}>`])],
//             components: [
//               this.createButtonsActionRow([
//                 this.createButton(`${name}_${CustomBattleId.Join}`, "参加"),
//                 this.createButton(
//                   `${CustomBattleId.Jinrou}_${CustomBattleId.Start}`,
//                   "人狼開始",
//                   ButtonStyleTypes.SUCCESS
//                 ),
//               ]),
//             ],
//           },
//         };
//       }
//       // ガチャコマンド
//       case CommandId.Gacha: {
//         return {
//           type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//           data: {
//             embeds: [
//               {
//                 color: 0xff8808,
//                 title: "ガチャ",
//                 description: "探しものが 見つかるといいですね",
//                 fields: [defaultGachaResultFields],
//               },
//             ],
//             components: [
//               this.createButtonsActionRow([
//                 this.createButton(`${name}_${CustomBattleId.Char}`, "ヒーロー"),
//                 this.createButton(`${name}_${CustomBattleId.Card}`, "カード"),
//               ]),
//             ],
//           },
//         };
//       }
//       // チャットコマンド
//       case CommandId.Chat: {
//         const buttonConfigs = [
//           ["アタ", "ガン", "タン", "スプ"],
//           ["近", "遠", "周", "連", "罠"],
//           ["癒", "防", "返", "破", "移"],
//           ["A", "B", "C", "D", "E"],
//           ["1", "2", "3", "4", "5"],
//         ];
//         const type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
//         const data = {
//           components: buttonConfigs.map((buttonConfig) =>
//             this.createButtonsActionRow(
//               buttonConfig.map((label) =>
//                 this.createButton(`${name}_${label}`, label)
//               )
//             )
//           ),
//         };
//         return this.createInteractionResponse(type, data);
//       }
//       default:
//         return;
//     }
//   }
//   /**
//    *
//    * @param data
//    * @param message
//    * @param user
//    * @returns
//    */
//   message(
//     data: { custom_id: string; values: string[] },
//     user: { id: string },
//     message: any
//   ) {
//     const userId = user.id;
//     const messages: any[] = [];
//     const { custom_id, values } = data;
//     const { id, components, embeds } = message;
//     const [mainId, subId, ...optionId] = custom_id.split("_");
//     const [targetId] = values;
//     switch (mainId) {
//       /**
//        * 参加ボタン押下時
//        */
//       case CustomBattleId.Join: {
//         const memberIds: string[] = embeds[0].fields.map(
//           (field: { name: string; value: string }) => field.value
//         );
//         const index = memberIds.indexOf(`<@${userId}>`);
//         if (index === -1) {
//           memberIds.push(`<@${userId}>`);
//         } else {
//           memberIds.splice(index, 1);
//         }
//         const updateMessage = {
//           type: InteractionResponseType.UPDATE_MESSAGE,
//           data: {
//             embeds: [[this.createMemberEmbed(memberIds)], ...embeds],
//             components,
//           },
//         };
//         messages.push(updateMessage);
//         break;
//       }
//       /**
//        * 人狼ボタン押下時
//        */
//       case CustomBattleId.Jinrou: {
//         const [memberEmbed] = embeds;
//         const memberIds: string[] = memberEmbed.fields.map(
//           (field: { value: string }) => field.value
//         );
//         const game = this.createGame(id, memberIds);
//         switch (subId) {
//           /**
//            * 開始セレクトボックス押下時
//            */
//           case CustomBattleId.Start: {
//             if (game.memberIds.length > 4) return;
//             game.start();
//             components[1] = this.createButtonsActionRow([
//               this.createButton(
//                 CustomBattleId.Confirmation,
//                 "自分の役職とヒーローを確認"
//               ),
//             ]);
//             components[2] = this.createSelectActionRow(
//               CustomBattleId.Watch,
//               "【占い師】役職カードを見る",
//               [
//                 ...memberIds.map((memberId) =>
//                   this.createSelectOption(`<@${memberId}>`, memberId)
//                 ),
//                 this.createSelectOption("中央", "center"),
//               ]
//             );
//             break;
//           }
//           /**
//            * 見るセレクトボックス押下時
//            */
//           case CustomBattleId.Watch: {
//             if (user.id !== targetId || !game.isSeer(user.id)) return;
//             game.watch(user.id, targetId);
//             const notifyMessage = {
//               type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//               data: {
//                 content: game.getRole(targetId),
//                 flags: InteractionResponseFlags.EPHEMERAL,
//               },
//             };
//             messages.push(notifyMessage);
//             components[2] = this.createSelectActionRow(
//               CustomBattleId.Switch,
//               "交換",
//               game.members.map((member) =>
//                 this.createSelectOption(`<@${member.id}>`, member.id)
//               )
//             );
//             break;
//           }
//           /**
//            * 交換セレクトボックス押下時
//            */
//           case CustomBattleId.Switch: {
//             if (!game.isThief(user.id)) return;
//             game.switch(user.id, values[0]);
//             const notifyMessage = {
//               type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//               data: {
//                 content: game.getRole(targetId),
//                 flags: InteractionResponseFlags.EPHEMERAL,
//               },
//             };
//             messages.push(notifyMessage);
//             components[2] = this.createSelectActionRow(
//               CustomBattleId.Vote,
//               "投票",
//               game.members.map((member) =>
//                 this.createSelectOption(`<@${member.id}>`, member.id)
//               )
//             );
//             break;
//           }
//           /**
//            * 確認ボタン押下時
//            */
//           case CustomBattleId.Confirmation: {
//             const confirmUserIds = game.memberIds.includes(user.id)
//               ? [user.id]
//               : game.memberIds;
//             const notifyMessage = {
//               type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//               data: {
//                 embeds: [
//                   {
//                     title: "確認",
//                     fields: confirmUserIds.map((memberId) => ({
//                       name: `<@${memberId}>`,
//                       value: `ロール：${game.getRole(
//                         memberId
//                       )}\nヒーロー：${game.getHero(memberId)}`,
//                     })),
//                   },
//                 ],
//                 flags: InteractionResponseFlags.EPHEMERAL,
//               },
//             };
//             messages.push(notifyMessage);
//             break;
//           }
//         }
//         updateJson(jsonName, game);
//         const updateMessage = {
//           type: InteractionResponseType.UPDATE_MESSAGE,
//           data: {
//             embeds: [
//               this.createMemberEmbed(game.memberIds),
//               {
//                 title: "コンパス人狼",
//                 fields: [{ name: "フロー", value: game.flow }],
//               },
//             ],
//             components,
//           },
//         };
//         messages.push(updateMessage);
//         break;
//       }
//       default:
//         break;
//     }
//     return messages;
//   }
//   private createGame(id: string, memberIds: string[]): JinrouGame {
//     const jsonName = "game";
//     const { items } = readJson(jsonName);
//     return (
//       items.find((item: { id: string }) => item.id === id) ||
//       new JinrouGame(id, memberIds)
//     );
//   }
//   private createMemberEmbed(members: string[]) {
//     return {
//       color: 0xff8808,
//       title: "メンバー一覧",
//       description: `で マッチング中です`,
//       fields: members.map((member, index) => ({
//         name: index,
//         value: member,
//       })),
//     };
//   }
//   private createInteractionResponse(type: InteractionResponseType, data: any) {
//     return { type, data };
//   }
//   private createButtonsActionRow(components: Button[]): ActionRow {
//     return {
//       type: MessageComponentTypes.ACTION_ROW,
//       components,
//     };
//   }
//   private createButton(
//     custom_id: string,
//     label: string,
//     style: ButtonStyleTypes = ButtonStyleTypes.PRIMARY
//   ): Button {
//     return {
//       type: MessageComponentTypes.BUTTON,
//       style,
//       custom_id,
//       label,
//     };
//   }
//   private createSelectActionRow(
//     custom_id: string,
//     placeholder: string,
//     options: StringSelectOption[]
//   ): ActionRow {
//     return {
//       type: MessageComponentTypes.ACTION_ROW,
//       components: [
//         {
//           type: MessageComponentTypes.STRING_SELECT,
//           custom_id,
//           placeholder,
//           options,
//         },
//       ],
//     };
//   }
//   private createInputText(
//     custom_id: string,
//     label: string,
//     style: TextStyleTypes = TextStyleTypes.SHORT
//   ): InputText {
//     return {
//       type: MessageComponentTypes.INPUT_TEXT,
//       style,
//       custom_id,
//       label,
//     };
//   }
//   private createSelectOption(label: string, value: string): StringSelectOption {
//     return { label, value };
//   }
//   private createLabel() {}
// }
