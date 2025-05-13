import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { getUserId, getReqEmbeds, getReqComponents } from '../../app.js';
import { convertUserIdToUserMention } from './app.service.js';

/**
 * @type {Object} 参加ボタン
 */
const ENTRY_BUTTON = {
  type: MessageComponentTypes.BUTTON,
  custom_id: 'recruiting-entry',
  label: '参加',
  style: ButtonStyleTypes.SUCCESS,
  disabled: false,
};

/**
 * @type {Object} マッチングボタン（活性）
 */
const MATCHING_BUTTON = {
  type: MessageComponentTypes.BUTTON,
  custom_id: 'recruiting-matching',
  label: 'マッチング',
  style: ButtonStyleTypes.PRIMARY,
  disabled: false,
};

/**
 * @type {Object} マッチングボタン（非活性）
 */
const MATCHING_BUTTON_DISABLED = {
  type: MessageComponentTypes.BUTTON,
  custom_id: 'recruiting-matching',
  label: 'マッチング',
  style: ButtonStyleTypes.PRIMARY,
  disabled: true,
};

/**
 * @type {Object} リセットボタン
 */
const RESET_BUTTON = {
  type: MessageComponentTypes.BUTTON,
  custom_id: 'recruiting-reset',
  label: 'リセット',
  style: ButtonStyleTypes.DANGER,
  disabled: false,
};

/**
 * @type {Object} Embeds.fieldsのインデックス
 */
const recruitingFieldsIndex = {
  member: 0,
  team: 1,
}

/** 
 * 募集コマンド実行時のレスポンスを取得
 * @return {Object}
 */
export function getResRecruiting() {
  return { 
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          color: 0xff8808,
          title: 'メンバー募集',
        },
      ],
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            ENTRY_BUTTON,
            MATCHING_BUTTON_DISABLED,
            RESET_BUTTON,
          ],
        },
      ],
    },
  };
};

/** 
 * 参加ボタン押下時のレスポンスを取得
 * @return {Object}
 */
export function getResRecruitingEntry() {
  // レスポンスデータをリクエストボディデータで初期化
  let resEmbeds = getReqEmbeds();

  /**
   * @type {string[]} ユーザーメンション
   */
  const userMention = convertUserIdToUserMention(getUserId());

  /**
   * @type {string[]} メンバー一覧
   */
  const members = getMemberList();

  // ユーザー追加/削除
  const index = members.indexOf(userMention);
  if (index !== -1) {
    members.splice(index, 1);
  } else {
    members.push(userMention);
  };

  // フィールドのメンバー一覧に格納
  resData.embeds[0].fields[recruitingFieldsIndex.member].value = members.join('\n');

  // マッチングボタンの非活性処理
  let resComponents = [
    ENTRY_BUTTON,
    RESET_BUTTON,
  ];
  if (members.length < 6) {
    resComponents.add(MATCHING_BUTTON_DISABLED);
  } else {
    resComponents.add(MATCHING_BUTTON);
  };

  return { 
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      embeds: resEmbeds,
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          resComponents,
        },
      ],
    },
  };
};

/** 
 * マッチングボタン押下時のレスポンスを取得
 * @return {Object}
 */
export function getResRecruitingMatching() {
  // レスポンスデータをリクエストボディデータで初期化
  let resEmbeds = getReqEmbeds();

  /**
   * @type {number} チーム人数
   */
  const teamSize = 3;

  /**
   * @type {string[]} メンバー一覧
   */
  const members = getMemberList();

  /**
   * @type {number} チーム数
   */
  const numTeams = Math.floor(members.length / teamSize);

  // チームマッチング
  let teams = [];
  for (let i=0; i<numTeams; i++) {
    for (let j=0; j<teamSize; j++) {
      let index = Math.floor(Math.random() * members.length);
      teams[i][j] = members[index];
      members.splice(index, 1);
    };
  };

  // フィールドのチームに格納
  teams.forEach((team, i) => {
    resData.embeds[0].fields[recruitingFieldsIndex.team + i] = {
      name: `TEAM${i + 1}`,
      value: team.join('\n'),
      inline: true
    };
  });

  return { 
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      embeds: resEmbeds,
      components: getReqComponents(),
    },
  };
};

/** 
 * リセットボタン押下時のレスポンスを取得
 * @return {Object}
 */
export function getResRecruitingReset() {
  // レスポンスデータをリクエストボディデータで初期化
  let resEmbeds = getReqEmbeds();

  // メンバー一覧をリセット
  resEmbeds.embeds[0].fields[recruitingFieldsIndex.member].value = '';

  return { 
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      embeds: resEmbeds,
      components: [
        ENTRY_BUTTON,
        MATCHING_BUTTON_DISABLED,
        RESET_BUTTON,
      ],
    },
  };
};

/** 
 * メンバー一覧を取得
 * @return {string[]}
 */
function getMemberList() {
  return getReqEmbeds()[0].fields[recruitingFieldsIndex.member].value.split('\n');
};