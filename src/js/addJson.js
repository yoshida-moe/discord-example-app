import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname 相当を作成
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ファイルパスの定義
const jsonPath = './json/card.json';
const relativePath = 'contents/web/gacha_card/cardgacha_11003_21_stlv_P9aeRy9P.html';
const filePath = path.resolve(__dirname, `../${relativePath}`);
const html = fs.readFileSync(filePath, "utf-8");

// --- ヘルパー関数群 ---

// HTMLコメントを除去
const removeHtmlComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

// 対象テーブルを抽出
const extractTables = (html) => {
  const cleanedHtml = removeHtmlComments(html);
  return [...cleanedHtml.match(/<table class="list_card">([\s\S]*?)<\/table>/g)] || [];
};

// <thead> 内のランクを抽出
const extractRank = (table) => {
  const thead = table.match(/<thead>([\s\S]*?)<\/thead>/)?.[1] || '';
  return thead.match(/<th colspan="\d">([\s\S]*?)ランクで入手可能なカード<\/th>/)?.[1].trim() || '';
};

// <td> セルの二次元配列を返す
const extractCells = (table) => {
  const tbody = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] || '';
  const rows = [...tbody.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];

  return rows.map(rowMatch => {
    const row = rowMatch[1];
    return [...row.matchAll(/<td.*?>([\s\S]*?)<\/td>/g)].map(td => td[1]);
  });
};

// 各カード情報をオブジェクト化
const parseCardInfo = (cell, rank) => {
  const attr = cell.find(c =>
    /<span style="color: #\w{6};">/.test(c)
  )?.match(/<span style="color: #\w{6};">(.*?)<\/span>/)?.[1] ?? '';

  const name = cell.find(c => /<card>.*?<\/card>/.test(c))
    ?.replace(/<card>|<\/card>/g, '')
    ?.replace(/&brvbar;/g, '¦') || '';

  const rarity = cell.find(c => ['UR', 'SR', 'R', 'N'].includes(c)) ?? '';

  return {
    name,
    attr,
    rarity,
    word: [],
    type: '通常',
    skill: '',
    coolDown: 0,
    activation: '',
    rank,
  };
};

// --- メイン処理 ---

const tables = extractTables(html);
const items = tables.flatMap(table => {
  const rank = extractRank(table);
  const cellRows = extractCells(table);
  return cellRows.map(cell => parseCardInfo(cell, rank));
});

// JSONファイルを読み込み、マージして書き込み
fs.readFile(jsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('読み込みエラー:', err);
    return;
  }

  let json;
  try {
    json = JSON.parse(data);
  } catch (e) {
    console.error('パースエラー:', e);
    return;
  }

  json.items = json.items || [];

  items.forEach(newItem => {
    const existing = json.items.find(item => item.name === newItem.name);
    if (existing) {
      Object.assign(existing, {
        ...(newItem.attr && { attr: newItem.attr }),
        ...(newItem.rarity && { rarity: newItem.rarity }),
        ...(newItem.rank && { rank: newItem.rank }),
      });
    } else {
      json.items.push(newItem);
    }
  });

  fs.writeFile(jsonPath, JSON.stringify(json, null, 2), (err) => {
    if (err) {
      console.error('書き込みエラー:', err);
    } else {
      console.log('一括更新成功');
    }
  });
});