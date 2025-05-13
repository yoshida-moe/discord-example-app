"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const discord_interactions_1 = require("discord-interactions");
const game_1 = require("./game");
const types_1 = require("./types");
const member_1 = require("./member");
const defaultMemberFields = {
    name: "メンバー一覧",
    value: "",
};
const defaultFlowFields = { name: "フロー", value: "" };
class Body {
    command(data) {
        const { name } = data;
        switch (name) {
            case types_1.CommandName.Test: {
                break;
            }
            case types_1.CommandName.Show: {
                break;
            }
            // 募集コマンド
            case types_1.CommandName.Recruit: {
                return {
                    type: discord_interactions_1.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: "@everyone",
                        flags: discord_interactions_1.InteractionResponseFlags.EPHEMERAL,
                        embeds: [
                            {
                                title: "チームメンバー募集",
                                description: "コンパス人狼で マッチング中です",
                                fields: [defaultMemberFields],
                            },
                        ],
                        components: [
                            this.createActionRow([
                                this.createButton("join", "参加"),
                                this.createButton("start", "開始", discord_interactions_1.ButtonStyleTypes.SUCCESS),
                            ]),
                        ],
                    },
                };
            }
            default:
                return;
        }
    }
    message(data, message, user) {
        var _a, _b;
        const { custom_id, values } = data;
        const [mainId, ...subId] = custom_id.split("_");
        const memberIds = message.embeds[0].fields[0].value
            .split("\n")
            .filter(Boolean);
        const members = memberIds.map((id) => new member_1.Member(id));
        const flow = (_b = (_a = message.embeds[0].fields[1]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
        const game = new game_1.Game(flow, members);
        const components = [];
        let updatedMemberField = defaultMemberFields;
        let updatedFlowField = defaultFlowFields;
        const memberSelectOptions = game.memberIds.map((id) => this.createSelectOption(`<@${id}>`, id));
        switch (mainId) {
            /**
             * 参加ボタン押下時
             */
            case types_1.CustomId.Join: {
                game.join(new member_1.Member(user.id));
                updatedMemberField = Object.assign(Object.assign({}, updatedMemberField), { value: game.memberIds.join("\n") });
                break;
            }
            /**
             * 開始ボタン押下時
             */
            case types_1.CustomId.Start: {
                game.start();
                updatedFlowField = Object.assign(Object.assign({}, updatedFlowField), { value: game.flow });
                components.push(this.createActionRow([
                    this.createSelect(types_1.CustomId.Watch, "役職カードを見る", [
                        ...memberSelectOptions,
                        this.createSelectOption("中央", "center"),
                    ]),
                ]));
                break;
            }
            /**
             * 見るボタン押下時
             */
            case types_1.CustomId.Watch: {
                if (!game.isSeer(user.id))
                    return;
                game.watch(values[0]);
                updatedFlowField = Object.assign(Object.assign({}, updatedFlowField), { value: game.flow });
                components.push(this.createActionRow([
                    this.createSelect(types_1.CustomId.Switch, "役職カードを交換", memberSelectOptions),
                ]));
                break;
            }
            /**
             * 交換ボタン押下時
             */
            case types_1.CustomId.Switch: {
                if (!game.isThief(user.id))
                    return;
                game.switch(values[0]);
                updatedFlowField = Object.assign(Object.assign({}, updatedFlowField), { value: game.flow });
                components.push(this.createActionRow([
                    this.createSelect(types_1.CustomId.Vote, "投票", memberSelectOptions),
                ]));
                break;
            }
            default:
                return;
        }
        return {
            type: discord_interactions_1.InteractionResponseType.UPDATE_MESSAGE,
            data: {
                embeds: [
                    {
                        fields: [updatedMemberField, updatedFlowField],
                    },
                ],
                components,
            },
        };
    }
    createActionRow(components) {
        return {
            type: discord_interactions_1.MessageComponentTypes.ACTION_ROW,
            components,
        };
    }
    createButton(custom_id, label, style = discord_interactions_1.ButtonStyleTypes.PRIMARY) {
        return {
            type: discord_interactions_1.MessageComponentTypes.BUTTON,
            style,
            custom_id,
            label,
        };
    }
    createSelect(custom_id, placeholder, options) {
        return {
            type: discord_interactions_1.MessageComponentTypes.STRING_SELECT,
            custom_id,
            placeholder,
            options,
        };
    }
    createSelectOption(label, value) {
        return { label, value };
    }
}
exports.Body = Body;
