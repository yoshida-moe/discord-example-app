import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { getReqComponents, getReqSubCommand } from '../../app.js';
import { heros, cards, medals } from './cps.js';

/**
 * @type {Object} 初期メッセージ
 */
const defaultResEmbeds = [
  {
    color: 0xff8808,
    title: 'ガチャ',
    fields: [
      {
        name: 'ガチャ結果',
        value: '',
      }
    ],
  },
];

/**
 * @type {Object} ヒーローボタン
 */
const HERO_BUTTON = {
  type: MessageComponentTypes.BUTTON,
  custom_id: 'gacha-heros',
  label: 'ヒーロー',
  style: ButtonStyleTypes.PRIMARY,
  disabled: false,
};

/**
 * @type {Object} カードボタン
 */
const CARD_BUTTON = {
  type: MessageComponentTypes.BUTTON,
  custom_id: 'gacha-cards',
  label: 'カード',
  style: ButtonStyleTypes.PRIMARY,
  disabled: false,
};

/**
 * @type {Object} Embeds.fieldsのインデックス
 */
const GACHA_FIELDS_INDEX = {
  result: 0,
}

/**
 * @type {Object} バナーURL
 */
const BANNER_URL = {
  heros: 'https://cps-down.hangame.co.jp/web/img/banner_Gc1129_1_amst_J5gg5s5J.jpg',
  cards: 'https://cps-down.hangame.co.jp/web/img/banner_Gc1052_1_chng_V2D3Bv2V.jpg',
};

/** 
 * ガチャコマンド実行時のレスポンスを取得
 * @return {Object}
 */
export function getResGacha() {
  let list;
  
  switch (getReqSubCommand()) {
    case 'heros':
      list = heros;
      break;
    case 'cards':
      list = cards;
      break;
    default:
      break;
  };
  
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: getResEmbedsRandomItem(list),
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            HERO_BUTTON,
            CARD_BUTTON,
          ],
        }
      ],
    }
  };
};

/** 
 * ヒーローガチャ実行時のレスポンスを取得
 * @return {Object}
 */
export function getResGachaHero() {
  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      embeds: getResEmbedsRandomItem(heros),
      components: getReqComponents(),
    },
  };
}

/** 
 * カードガチャ実行時のレスポンスを取得
 * @return {Object}
 */
export function getResGachaCard() {
  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      embeds: getResEmbedsRandomItem(cards),
      components: getReqComponents(),
    },
  };
}

/** 
 * カードガチャ実行時のメッセージを設定
 * @return {Object}
 */
function getResEmbedsRandomItem(list) {
  // 初期化
  let resData = defaultResEmbeds;

  // ガチャを実行
  const { name, image } = list[Math.floor(Math.random() * list.length)];

  // フィールドにガチャ結果を設定
  resData[0].fields[GACHA_FIELDS_INDEX.result].value = name;

  // 画像にガチャ結果を設定
  resData[0].image = image;

  return resData;
};
