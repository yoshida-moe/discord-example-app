import fs from "fs";
import https from "https";
import path from "path";

import charData from '../json/char.json' assert { type: 'json' };
import cardData from '../json/card.json' assert { type: 'json' };
import iconsData from '../json/icons.json' assert { type: 'json' };
import medalsData from '../json/medals.json' assert { type: 'json' };
import bannerData from '../json/banner.json' assert { type: 'json' };

import infoNoteData from '../json/info_note.json' assert { type: 'json' };
import infoSeasonData from '../json/info_season.json' assert { type: 'json' };
import gachaCardData from '../json/gacha_card.json' assert { type: 'json' };
import gachaHeroData from '../json/gacha_hero.json' assert { type: 'json' };

import { Img } from '../enum/json.enum.ts';

// node js/download.js

const type = Img.card;
const data = getData(type);

data.items.forEach((item) => {
  const filePath = buildFilePath(type, item);
  downloadFile(filePath).catch(console.error);
});

/**
 * ファイルのダウンロード
 * @param filePath ファイルパス
 */
async function downloadFile(filePath) {
  const url = `https://cdn-asset.compass-game.jp/${filePath}`;
  const localPath = path.join('./', filePath);

  await fs.promises.mkdir(path.dirname(localPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(localPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(url));
        return;
      }
      response.pipe(writeStream);
      writeStream.on("finish", () => {
        writeStream.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(localPath, () => {});
      reject(err);
    });
  });
}

/**
 * JSONを取得
 * @param type 種別
 * @returns JSON
 */
function getData(type) {
  const dataMap = {
    info_hero: charData,
    info_note: infoNoteData,
    info_season: infoSeasonData,
    gacha_card: gachaCardData,
    gacha_hero: gachaHeroData,
    char: charData,
    card: cardData,
    icons: iconsData,
    medals: medalsData,
    banner: bannerData,
  };
  return dataMap[type];
}

/**
 * 
 * @param {*} type 
 * @param {*} item 
 * @returns 
 */
function buildFilePath(type, item) {
  const basePath = ['contents', 'web', `${type !== 'info_hero' ? type.unshift('img') : ''}/${type}`].join('/');
  return path.join(basePath, type, buildFileName(type, item));
}

/**
 * ファイル名を構築
 * @param {*} type 
 * @param {*} item 
 * @returns 
 */
function buildFileName(type, item) {
  const { id, slug = null, hash = null, seriesId, cardId, atk, def, hp } = item;

  switch (type) {
    case 'char': {
      const size = '1240' | '600_160';
      const parts = [`${id}00`, size];
      if (slug) parts.push(slug);
      if (hash) parts.push(hash);
      return `${basePath}/${parts.join('_')}.png`;
    }

    case 'card': {
      const size = 'deck' | 'skill';
      const parts = ['ui', 'game', size, 'card', seriesId, cardId];
      if (slug) parts.push(slug);
      if (hash) parts.push(hash);
      return `${basePath}/${parts.join('_')}.png`;
    }

    case 'info_hero': {
      const query = buildQuery({ atk, def, hp });
      const parts = ['character', `${id}00`];
      if (fileSlug) parts.push(fileSlug);
      if (fileHash) parts.push(fileHash);
      if (!fileSlug && slug) parts.push(slug);
      if (!fileHash && hash) parts.push(hash);
      return `${basePath}/${parts.join('_')}.html${query ? `?${query}` : ''}`;
    }

    case 'info_note':
    case 'info_update':
    case 'info_season':
    case 'info_grandslam': {
      const parts = [type, id];
      if (slug) parts.push(slug);
      if (hash) parts.push(hash);
      return `${basePath}/${parts.join('_')}.html`;
    }

    case 'gacha_hero':
    case 'gacha_card': {
      const parts = [`${type.split('_')[1]}gacha`, id];
      if (slug) parts.push(slug);
      if (hash) parts.push(hash);
      return `${basePath}/${parts.join('_')}.html`;
    }

    default:
      return;
  }
}

function buildQuery(params) {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}