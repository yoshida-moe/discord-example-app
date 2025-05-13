import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  ActionRow,
  Button,
  ButtonStyleTypes,
  InteractionResponseFlags,
  MessageComponent,
  MessageComponentTypes,
  StringSelect,
  StringSelectOption,
  TextStyleTypes,
  InputText,
} from "discord-interactions";
import { VerifyDiscordRequest } from "./utils";
import type { Request, Response } from "express";
import { Game } from "./jinrou";
import { CommandName, CustomId, Flow } from "./types";
import { readJson, updateJson } from "./writeJson";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (
  req: Request,
  res: Response
): Promise<Response> {
  // Interaction type and data
  const { type, member, data, message } = req.body;

  const body = new ResBody();

  switch (type) {
    /**
     * Handle verification requests
     */
    case InteractionType.PING:
      return res.send({ type: InteractionResponseType.PONG });

    /**
     * Handle slash command requests
     * @see https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    case InteractionType.APPLICATION_COMMAND:
      return res.send(body.command(data));

    /**
     * Handle requests from interactive components
     * @see https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
     */
    case InteractionType.MESSAGE_COMPONENT:
      try {
        await res.send(body.message(data, message, member.user));
      } catch (err) {
        console.error("Error sending message:", err);
      }
  }
  return res.sendStatus(400);
} as unknown as express.RequestHandler);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

const defaultGachaResultFields = {
  name: "ガチャ結果",
  value: "",
};
const defaultFlowFields = { name: "フロー", value: "" };

/**
 *
 */
class ResBody {
  /**
   *
   * @param data
   * @returns
   */
  command(data: {
    type: number;
    name: string;
    id: number;
    options: { type: number; name: string; value: string }[];
  }) {
    const { name, options } = data;

    switch (name) {
      // テストコマンド
      case CommandName.Test: {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Hello :-)",
          },
        };
        break;
      }

      // プロフィールコマンド
      case CommandName.Profile: {
        return {
          type: InteractionResponseType.MODAL,
          data: {
            custom_id: "プロフィール",
            title: "プロフィール",
            components: [
              this.createActionRow([
                this.createInputText(`${name}_${"ランク"}`, "ランク"),
              ]),
              this.createActionRow([
                this.createInputText(`${name}_${"ヒーロー"}`, "ヒーロー"),
              ]),
              this.createActionRow([
                this.createInputText(`${name}_${"コメント"}`, "コメント"),
              ]),
              this.createActionRow([
                this.createInputText(`${name}_${"応援コード"}`, "応援コード"),
              ]),
              this.createActionRow([
                this.createInputText(`${name}_${"TwitterID"}`, "TwitterID"),
              ]),
            ],
          },
        };
      }

      // 募集コマンド
      case CommandName.Recruit: {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "@everyone",
            embeds: [this.createMemberEmbed()],
            components: [
              this.createActionRow([
                this.createButton(`${name}_${CustomId.Join}`, "参加"),
                this.createButton(
                  `${CustomId.Jinrou}_${CustomId.Start}`,
                  "人狼開始",
                  ButtonStyleTypes.SUCCESS
                ),
              ]),
              // this.createActionRow([
              //   ...options.map((option) =>
              //     this.createButton(`${option.name}_${CustomId.Join}`, "参加")
              //   ),
              // ]),
              // this.createActionRow([
              //   ...options.map((option) =>
              //     this.createButton(
              //       `${option.name}_${CustomId.Start}`,
              //       "開始",
              //       ButtonStyleTypes.SUCCESS
              //     )
              //   ),
              // ]),
            ],
          },
        };
      }

      // ガチャコマンド
      case CommandName.Gacha: {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                color: 0xff8808,
                title: "ガチャ",
                description: "探しものが 見つかるといいですね",
                fields: [defaultGachaResultFields],
              },
            ],
            components: [
              this.createActionRow([
                this.createButton(`${name}_${CustomId.Char}`, "ヒーロー"),
                this.createButton(`${name}_${CustomId.Card}`, "カード"),
              ]),
            ],
          },
        };
      }

      // チャットコマンド
      case CommandName.Chat: {
        const buttonConfigs = [
          ["アタ", "ガン", "タン", "スプ"],
          ["近", "遠", "周", "連", "罠"],
          ["癒", "防", "返", "破", "移"],
          ["A", "B", "C", "D", "E"],
          ["1", "2", "3", "4", "5"],
        ];

        const type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
        const data = {
          components: buttonConfigs.map((buttonConfig) =>
            this.createActionRow(
              buttonConfig.map((label) =>
                this.createButton(`${name}_${label}`, label)
              )
            )
          ),
        };
        return this.createInteractionResponse(type, data);
      }

      default:
        return;
    }
  }

  /**
   *
   * @param data
   * @param message
   * @param user
   * @returns
   */
  message(
    data: { custom_id: string; values: string[] },
    message: any,
    user: { id: string }
  ) {
    const messages: any[] = [];

    const { custom_id, values } = data;
    const { id, components, embeds } = message;
    const [mainId, subId, ...optionId] = custom_id.split("_");

    switch (mainId) {
      /**
       * 参加ボタン押下時
       */
      case CustomId.Join: {
        const memberIds: string[] = embeds[0].fields.map(
          (field: { name: string; value: string }) => field.value
        );

        memberIds.push(user.id);

        const updateMessage = {
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            embeds: [[this.createMemberEmbed(memberIds)], ...embeds],
            components,
          },
        };

        messages.push(updateMessage);

        break;
      }

      /**
       * 人狼ボタン押下時
       */
      case CustomId.Jinrou: {
        const memberIds: string[] = embeds[0].fields.map(
          (field: { name: string; value: string }) => field.value
        );
        const [targetId] = values;
        const jsonName = "game";
        const { items } = readJson(jsonName);

        const game: Game =
          items.find((item: { id: string }) => item.id === id) ||
          new Game(id, memberIds);

        switch (subId) {
          /**
           * 参加ボタン押下時
           */
          case CustomId.Join: {
            game.join(user.id);
            break;
          }

          /**
           * 開始セレクトボックス押下時
           */
          case CustomId.Start: {
            if (game.memberIds.length > 4) return;

            game.start();

            messages.push();

            components[1] = this.createActionRow([
              this.createButton(CustomId.Confirmation, "確認"),
            ]);

            components[2] = this.createActionRow([
              this.createSelect(CustomId.Watch, "見る", [
                ...game.members.map((member) =>
                  this.createSelectOption(`<@${member.id}>`, member.id)
                ),
                this.createSelectOption("中央", "center"),
              ]),
            ]);
            break;
          }

          /**
           * 見るセレクトボックス押下時
           */
          case CustomId.Watch: {
            if (user.id !== targetId || !game.isSeer(user.id)) return;

            game.watch(user.id, targetId);

            const notifyMessage = {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: game.getRole(targetId),
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
            messages.push(notifyMessage);

            components[2] = this.createActionRow([
              this.createSelect(
                CustomId.Switch,
                "交換",
                game.members.map((member) =>
                  this.createSelectOption(`<@${member.id}>`, member.id)
                )
              ),
            ]);

            break;
          }

          /**
           * 交換セレクトボックス押下時
           */
          case CustomId.Switch: {
            if (!game.isThief(user.id)) return;

            game.switch(user.id, values[0]);

            const notifyMessage = {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: game.getRole(targetId),
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
            messages.push(notifyMessage);

            components[2] = this.createActionRow([
              this.createSelect(
                CustomId.Vote,
                "投票",
                game.members.map((member) =>
                  this.createSelectOption(`<@${member.id}>`, member.id)
                )
              ),
            ]);

            break;
          }

          /**
           * 確認ボタン押下時
           */
          case CustomId.Confirmation: {
            const confirmUserIds = game.memberIds.includes(user.id)
              ? [user.id]
              : game.memberIds;
            const notifyMessage = {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                embeds: [
                  {
                    title: "確認",
                    fields: confirmUserIds.map((memberId) => ({
                      name: `<@${memberId}>`,
                      value: `ロール：${game.getRole(
                        memberId
                      )}\nヒーロー：${game.getHero(memberId)}`,
                    })),
                  },
                ],
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
            messages.push(notifyMessage);

            break;
          }
        }

        updateJson(jsonName, game);

        const updateMessage = {
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            embeds: [
              this.createMemberEmbed(game.memberIds),
              {
                title: "コンパス人狼",
                fields: [{ name: "フロー", value: game.flow }],
              },
            ],
            components,
          },
        };
        messages.push(updateMessage);

        break;
      }

      default:
        break;
    }

    return messages;
  }

  private createMemberEmbed(memberIds: string[] = []) {
    return {
      color: 0xff8808,
      title: "メンバー一覧",
      description: `で マッチング中です`,
      fields: memberIds.map((memberId, index) => ({
        name: index,
        value: `<@${memberId}>`,
      })),
    };
  }

  private createInteractionResponse(type: InteractionResponseType, data: any) {
    return { type, data };
  }

  private createActionRow(
    components: Exclude<MessageComponent, ActionRow>[]
  ): ActionRow {
    return {
      type: MessageComponentTypes.ACTION_ROW,
      components,
    };
  }

  private createButton(
    custom_id: string,
    label: string,
    style: ButtonStyleTypes = ButtonStyleTypes.PRIMARY
  ): Button {
    return {
      type: MessageComponentTypes.BUTTON,
      style,
      custom_id,
      label,
    };
  }

  private createSelect(
    custom_id: string,
    placeholder: string,
    options: StringSelectOption[]
  ): StringSelect {
    return {
      type: MessageComponentTypes.STRING_SELECT,
      custom_id,
      placeholder,
      options,
    };
  }

  private createInputText(
    custom_id: string,
    label: string,
    style: TextStyleTypes = TextStyleTypes.SHORT
  ): InputText {
    return {
      type: MessageComponentTypes.INPUT_TEXT,
      style,
      custom_id,
      label,
    };
  }

  private createSelectOption(label: string, value: string): StringSelectOption {
    return { label, value };
  }

  private createLabel() {}
}
