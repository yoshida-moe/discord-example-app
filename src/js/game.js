let cardJson;

document.addEventListener("DOMContentLoaded", async function () {
  cardJson = await getJSON('card.json');
  // const { items } = cardJson;
  // showList(items);
  // filterItems(items);
  // const filterElement = document.getElementById('filter-button');
  // filterElement.style.display = 'none';
});

/**
 * get JSON
 **/
function getJSON(fileName) {
  return fetch(`./web/json/${fileName}`)
    .then(res => {
      if (!res.ok) { throw new Error(res.statusText) }
      return res.json();
    })
    .catch(error => { throw error });
}

/**
 * カードガチャを実行
 * @param {Object[]} items items
 * @returns {Object} random item
 **/
function cardGacha(filters = {}) {
  const { items } = cardJson;
  return getRandomItem(filterItems(items, filters));
}

/**
 * ヒーローガチャを実行
 * @param {Object[]} items items
 * @returns {Object} random item
 **/
function charGacha(filters = {}) {
  const { items } = charJson;
  return getRandomItem(filterItems(items, filters));
}

/**
 * ランダムなアイテムを取得
 * @param {Object[]} items items
 * @returns {Object} random item
 **/
function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * filter items
 * @param {Object[]} items items
 * @param {Object} filters filters
 * @returns {Object} random item
 **/
function filterItems(items, filters = {}) {
  return items.filter((item) => Object.entries(filters).every(([key, value]) => value.includes(item[key])));
}

/**
 * Appearance rate by rarity
 * @param {Object[]} items items
 * @returns {Object} random item
 **/
function appearanceRateByRarity() {
  // const weightMap = new Map(
  //   [
  //     ['UR', 0.002],
  //     ['SR', 0.018],
  //     ['R', 0.28],
  //     ['N', 0.7],
  //   ]
  // );
  // weightMap.forEach((weight) => items.filter(item => item.rarity === weight))
  const weightMap = [0.002, 0.018, 0.28, 0.7];
  const bosuu = weightMap // の合計
  const tmp = Math.floor(Math.random() * bosuu);
}

function getPath(dir, fileName) {
  return `web/img/${dir}/${fileName}`;
}

// /**
//  * show the list
//  * @param {Object[]} items items
//  **/
// function showList(items) {
//   const listElement = document.getElementById("list");
//   while (listElement.firstChild) {
//     listElement.removeChild(listElement.firstChild);
//   }
//   items.forEach(item => {
//     listElement.appendChild(createDisplayItem(item));
//   });
// }

// /**
//  * create display item
//  * @param {Object} item item
//  * @returns {HTMLDivElement} item div element
//  **/
// function createDisplayItem(item) {
//   const itemElement = document.createElement("li");
//   itemElement.className = 'item';

//   // TODO: img/char/char/${id}_1240.png
//   const imgElement = document.createElement("div");
//   imgElement.className = 'item-img';
//   imgElement.style.backgroundImage = `url(img/${item.path})`;
//   itemElement.appendChild(imgElement);

//   const featureElement = document.createElement("div");
//   featureElement.className = 'feature';
//   Object.keys(item)
//     .filter(key => key !== 'path')
//     .forEach(key => {
//       const keyElement = document.createElement("p");
//       keyElement.className = key;
//       keyElement.textContent = item[key];
//       featureElement.appendChild(keyElement);
//     });
//   // itemElement.appendChild(featureElement);

//   return itemElement;
// }

// /**
//  * filter items
//  * @param {Object[]} items items
//  **/
// function filterItems(items) {
//   Object.keys(items[0]).forEach(key => {
//     const elements = document.getElementsByName(key);
//     elements.forEach(element => {
//       element.addEventListener("change", () => {
//         showList(items.filter(item => element.value ? item[key].includes(element.value) : item));
//       });
//     })
//   });
// };

// /**
//  * click "caret"
//  **/
// function onClickCaretIcon() {
//   const filterElement = document.getElementById('filter-button');
//   filterElement.style.display = filterElement.style.display !== 'none' ? 'none' : 'flex';
//   const arrowElement = document.getElementById('caret');
//   arrowElement.textContent = arrowElement.textContent === '▲' ? '▼' : '▲';
// };

/**
 * 水属性URカードガチャボタン押下
 */
function onClickWaterURCardGacha() {
  const filters = {
    rarity: ['UR'],
    type: ['通常'],
    attribute: ['水'],
  };
  showDialog(filters);
}

/**
 * show card gacha result dialog
 */
function showDialog(filters = null) {
  if (!filters) {
    filters = {
      type: ['通常'],
    };
  }
  // TODO: レアリティ抽選
  const { name, skill, path } = cardGacha(filters);

  const resultImg = document.getElementById("result-img");
  resultImg.src = path;
  resultImg.alt = name;

  const resultExplanation = document.getElementById("result-explanation");
  resultExplanation.textContent = `スキル > ${skill}`;

  const dialog = document.querySelector("dialog");
  dialog.showModal();
}

/**
 * close dialog
 */
function closeDialog() {
  const dialog = document.querySelector("dialog");
  dialog.close();
}

/**
 * close dialog
 */
function createCardModal() {
  const dialog = document.querySelector("dialog");
  dialog.close();
}
