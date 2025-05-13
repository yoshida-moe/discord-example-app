import { CardGachaTimes } from './card-gacha-times.enum.js';
import { Type } from './type.enum.js';
import { Attribute } from './attributes.enum.js';
import {
  getRank,
  getContinuousByRank,
  getCollaboId,
  getCardGachaResult,
  getAppearanceRateByPickUp,
  getAppearanceRateByPickUpOfDecision,
} from './game.js';

/**
 * カードガチャレアリティ別出現確率
 */
const APPEARANCE_RATE_BY_RARITY = {
  'R': 80,
  'SR': 18,
  'UR': 2,
}

/**
 * UR確定カードガチャレアリティ別出現確率
 */
const APPEARANCE_RATE_BY_RARITY_OF_UR_TICKET = {
  'UR': 1,
}

/**
 * 無料カードガチャレアリティ別出現確率
 */
const APPEARANCE_RATE_BY_RARITY_OF_FREE = {
  'N': 700,
  'R': 280,
  'SR': 18,
  'UR': 2,
}

/**
 * カードガチャフィルター
 */
const FILTERS = {
  type: Type.Usual,
};

/**
 * 水属性URチケットカードガチャフィルター
 */
const FILTERS_WATER = {
  ...FILTERS,
  attr: Attribute.Water,
};

/**
 * 火属性URチケットカードガチャフィルター
 */
const FILTERS_FIRE = {
  ...FILTERS,
  attr: Attribute.Fire,
};

/**
 * 木属性URチケットカードガチャフィルター
 */
const FILTERS_TREE = {
  ...FILTERS,
  attr: Attribute.Tree,
};

const filtersOfCollabo = {
  id: getCollaboId(rank),
};

const rank = getRank();
const single = CardGachaTimes.Single;
const continuous = getContinuousByRank(rank);

/**
 * コラボカードガチャ連続ボタンクリック
 */
function onClickCollaboCardGachaContinuous() {
  handleCardGachaClick(
    continuous,
    FILTERS,
    filtersOfCollabo,
    getAppearanceRateByPickUp(),
    APPEARANCE_RATE_BY_RARITY,
  );
}

/**
 * コラボカードガチャシングルボタンクリック
 */
function onClickCollaboCardGachaSingle() {
  handleCardGachaClick(
    single,
    FILTERS,
    filtersOfCollabo,
    getAppearanceRateByPickUp(),
    APPEARANCE_RATE_BY_RARITY,
  );
}

/**
 * カードガチャ連続ボタンクリック
 */
function onClickCardGachaContinuous() {
  handleCardGachaClick(
    continuous,
    FILTERS,
    FILTERS,
    getAppearanceRateByPickUp(),
    APPEARANCE_RATE_BY_RARITY,
  );
}

/**
 * カードガチャシングルボタンクリック
 */
function onClickCardGachaSingle() {
  handleCardGachaClick(
    single,
    FILTERS,
    FILTERS,
    getAppearanceRateByPickUp(),
    APPEARANCE_RATE_BY_RARITY,
  );
}

/**
 * 水属性URチケットカードガチャボタンクリック
 */
function onClickWaterURTicketCardGacha() {
  handleCardGachaClick(
    single,
    FILTERS,
    FILTERS_WATER,
    getAppearanceRateByPickUpOfDecision(),
    APPEARANCE_RATE_BY_RARITY_OF_UR_TICKET,
  );
}

/**
 * 火属性URチケットカードガチャボタンクリック
 */
function onClickFireURTicketCardGacha() {
  handleCardGachaClick(
    single,
    FILTERS,
    FILTERS_FIRE,
    getAppearanceRateByPickUpOfDecision(),
    APPEARANCE_RATE_BY_RARITY_OF_UR_TICKET,
  );
}

/**
 * 木属性URチケットカードガチャボタンクリック
 */
function onClickTreeURTicketCardGacha() {
  handleCardGachaClick(
    single,
    FILTERS,
    FILTERS_TREE,
    getAppearanceRateByPickUpOfDecision(),
    APPEARANCE_RATE_BY_RARITY_OF_UR_TICKET,
  );
}

/**
 * 無料カードガチャ連続ボタンクリック
 */
function onClickFreeCardGachaContinuous() {
  handleCardGachaClick(
    continuous,
    FILTERS,
    FILTERS,
    getAppearanceRateByPickUp(),
    APPEARANCE_RATE_BY_RARITY_OF_FREE,
  );
}

/**
 * 無料カードガチャシングルボタンクリック
 */
function onClickFreeCardGachaSingle() {
  handleCardGachaClick(
    single,
    FILTERS,
    FILTERS,
    getAppearanceRateByPickUp(),
    APPEARANCE_RATE_BY_RARITY_OF_FREE,
  );
}

/**
 * 戻るボタンクリック
 */
function onClickReturn() {
  closeDialog();
}

/**
 * カードガチャ実行
 */
function handleCardGachaClick(
  appearanceRateByRarity,
  appearanceRateByPickUp,
  pickUpFilters,
  times,
) {
  const resultItems = getCardGachaResult(
    appearanceRateByRarity,
    appearanceRateByPickUp,
    pickUpFilters,
    times,
  );
  showDialog(resultItems);
}

/**
 * ダイアログを開く
 */
function showDialog(resultItems) {
  const title = document.getElementById("result-title");
  const content = document.getElementById("result-content");

  if (title === null || content === null) {
    return;
  }

  while (content?.firstChild) {
    content.removeChild(content.firstChild);
  }

  title.textContent = 'カードガチャ結果';
  title.className = 'left';

  if (resultItems.length === 1) {
    const img = document.createElement("img");
    const p = document.createElement("p");

    const { name, skill, path } = resultItems[0];

    img.src = path;
    img.alt = name;
    img.width = 320;
    img.className = 'center';
    content.appendChild(img);

    p.textContent = `スキル > ${skill}`;
    p.className = 'left';
    content.appendChild(p);

  } else {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    let tr = document.createElement("tr");

    const items = Object.values(
      resultItems.reduce((acc, item) => {
        acc[item.name] = acc[item.name] || { ...item, number: 0 };
        acc[item.name].number++;
        return acc;
      }, {})
    );

    items.forEach(
      (item, index) => {
        const { name, path, number } = item;
        const tdIcon = document.createElement("td");
        const img = document.createElement("img");
        const tdLeft = document.createElement("td");

        tdIcon.className = 'td_icon';
        img.src = path;
        img.alt = name;
        img.className = 'imgIcon';
        tdIcon.appendChild(img);
        tr.appendChild(tdIcon);

        tdLeft.textContent = `獲得枚数\n${number}枚`;
        tdLeft.className = 'td_left';
        tr.appendChild(tdLeft);

        if (index % 2) {
          tbody.appendChild(tr);
          tr = document.createElement("tr");
        }

      }
    );

    table.className = 'list_note';
    table.appendChild(tbody);
    content.appendChild(table);
  }

  const dialog = document.querySelector("dialog");

  if (dialog === null) {
    return;
  }

  dialog.showModal();
}

/**
 * ダイアログを閉じる
 */
function closeDialog() {
  const dialog = document.querySelector("dialog");

  if (dialog === null) {
    return;
  }

  dialog.close();
}

class Gacha {
  constructor(
    items,
    usualFilters,
    appearanceRateByRarity,
    appearanceRateByPickUp,
    pickUpFilters,
    times,
  ) {
    this.items = items;
    this.usualFilters = usualFilters;
    this.appearanceRateByRarity = appearanceRateByRarity;
    this.appearanceRateByPickUp = appearanceRateByPickUp;
    this.pickUpFilters = pickUpFilters;
    this.times = times;
  }

  /**
   * get JSON
   **/
  getJSON(fileName) {
    return fetch(`../json/${fileName}`)
      .then(res => {
        if (!res.ok) { throw new Error(res.statusText) }
        return res.json();
      })
      .catch(error => { throw error });
  }

  /**
   * filter items
   * @param {Object[]} items items
   * @param {Object} filters filters
   * @returns {Object[]} filter items
   **/
  filterItems(items, filters) {
    return items.filter(
      (item) =>
        Object.entries(filters).every(
          ([key, value]) => item[key] && value.includes(item[key])
        )
    );
  }

  /**
   * ランダムなアイテムを取得
   * @param {Object[]} items items
   * @returns {Object} random item
   **/
  getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  /**
   * 
   * @param {Object[]} appearanceRate appearance rate
   * @returns {Object} item
   **/
  getItemByAppearanceRate(appearanceRate) {
    const probabilities = [];
    let cumulative = 0;
    for (const [rarity, rate] of Object.entries(appearanceRate)) {
      cumulative += rate;
      probabilities.push({ rarity, cumulative });
    }

    const sumRate = Object.values(appearanceRate).reduce((sum, value) => sum + value, 0);
    const random = Math.random() * sumRate;

    for (const { rarity, cumulative } of probabilities) {
      if (random < cumulative) {
        return rarity;
      }
    }
  }

  /**
   * カードガチャランク別連続回数取得
   */
  getContinuousByRank(rank) {
    switch (rank) {
      case Rank.F:
        return CardGachaTimes.ContinuousF;
      case Rank.E:
        return CardGachaTimes.ContinuousE;
      case Rank.D:
        return CardGachaTimes.ContinuousD;
      case Rank.C:
        return CardGachaTimes.ContinuousC;
      case Rank.B:
        return CardGachaTimes.ContinuousB;
      case Rank.A:
        return CardGachaTimes.ContinuousA;
      case Rank.S:
        return CardGachaTimes.ContinuousS;
      default:
        return CardGachaTimes.ContinuousS;
    }
  }

  /**
   * コラボガチャ取得
   */
  getCollaboId(rank) {
    if (rank < Rank.C) {
      return CardTypeId.HatsuneMiku;
    }

    return CardTypeId.HatsuneMiku;
  }

  getRank() {
    return Rank.S;
  }

  getGachaResult() {
    const resultItems = [];
    for (let i = 0; i < times; i++) {
      const rarity = getItemByAppearanceRate(appearanceRateByRarity);
      const usualItems = filterItems(items, { ...usualFilters, rarity });
      const pickUpItems = filterItems(items, { ...pickUpFilters, rarity });
      if (pickUpItems.length) {
        switch (getItemByAppearanceRate(appearanceRateByPickUp)) {
          case 'usual':
            resultItems.push(getRandomItem(usualItems));
            break;
          case 'pickUp':
            resultItems.push(getRandomItem(pickUpItems));
            break;
          default:
            break;
        };
      } else {
        resultItems.push(getRandomItem(usualItems));
      }
    }

    return resultItems;
  }
}

class CardGacha extends Gacha {
  constructor(
    appearanceRateByRarity,
    appearanceRateByPickUp,
    pickUpFilters,
    times,
  ) {
    this.items = cardJson.items;
    this.usualFilters = {
      type: Type.Usual,
    }
    super(
      this.items,
      this.usualFilters,
      appearanceRateByRarity,
      appearanceRateByPickUp,
      pickUpFilters,
      times,
    );
  }

  /**
   * カードガチャレアリティ別出現確率
   */
  getAppearanceRateByRarity() {
    return {
      'R': 80,
      'SR': 18,
      'UR': 2,
    }
  }

  /**
   * UR確定カードガチャレアリティ別出現確率
   */
  getAppearanceRateByRarityOfURTicket() {
    return {
      'UR': 1,
    }
  }

  /**
   * 無料カードガチャレアリティ別出現確率
   */
  getAppearanceRateByRarityOfFree() {
    return {
      'N': 700,
      'R': 280,
      'SR': 18,
      'UR': 2,
    }
  }

  /**
   * カードガチャピックアップ出現確率
   */
  getAppearanceRateByPickUp() {
    return {
      'pickUp': 18,
      'usual': 1,
    }
  }

  /**
   * 確定カードガチャピックアップ出現確率
   */
  getAppearanceRateByPickUpOfDecision() {
    return {
      'pickUp': 1,
    }
  }
}