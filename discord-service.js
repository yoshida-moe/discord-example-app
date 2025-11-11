import { InteractionResponseType, InteractionResponseFlags, } from "./node_modules/discord-interactions/dist/index.js";
/**
 * フォーマット
 * @param {string} message
 * @param {string} prefix 接頭辞
 * @param {string} suffix 接尾辞
 * @returns
 */
export function format(message, prefix, suffix) {
    return `${prefix}${message}${suffix}`;
}
/**
 * メンションへフォーマット
 * @param {string} message
 * @returns
 */
export function formatMention(message) {
    const prefix = "<@";
    const suffix = ">";
    return format(message, prefix, suffix);
}
/**
 * コードブロックへフォーマット
 */
export function formatCodeBlock(message) {
    const codeBlock = "```";
    return format(message, codeBlock, codeBlock);
}
/**
 * メッセージをビルド
 * @param {InteractionResponseType} type
 * @param {string} content
 * @param {*} embeds
 * @param {*} components
 * @returns
 */
export function buildMessage(type, content = "", embeds = [], components = [], isEphemeral = false) {
    if (isEphemeral) {
        return {
            type,
            data: {
                content,
                embeds,
                components,
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        };
    }
    return { type, data: { content, embeds, components } };
}
/**
 * チャンネルメッセージをビルド
 * @param {string} content
 * @param {*} embeds
 * @param {*} components
 * @returns
 */
export function buildChannelMessage(content = "", embeds = [], components = [], isEphemeral = false) {
    const type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
    return buildMessage(type, content, embeds, components, isEphemeral);
}
/**
 * 更新メッセージをビルド
 * @param {string} content
 * @param {*} embeds
 * @param {*} components
 * @returns
 */
export function buildUpdateMessage(message, content = "", embeds = [], components = []) {
    if (content === "") {
        content = message.content;
    }
    if (embeds.length === 0) {
        embeds = message.embeds;
    }
    if (components.length === 0) {
        components = message.components;
    }
    const type = InteractionResponseType.UPDATE_MESSAGE;
    return buildMessage(type, content, embeds, components);
}
