import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

// TODO: JSON書き換えまで

try {
  // URLからHTMLを取得
  const response = await fetch('https://app.nhn-playart.com/compass/hero.nhn');
  const htmlText = await response.text();

  // HTMLをパースしてDOMを生成
  const dom = new JSDOM(htmlText);
  const document = dom.window.document;

  // 必要なデータを抽出
  const result = [];

  document.querySelectorAll('.hero-area').forEach(heroArea => {
    const getGraphValue = (selector) => Number(heroArea.querySelector(selector).textContent.match(/\d+/));
    const getSkillValue = (selector) => heroArea.querySelector(selector).textContent.replace(/\s+/g, ' ');
    result.push({
      name: heroArea.querySelector('.hero .ttl').textContent.trim(),
      g01: getGraphValue('.graph.-g01 .num'),
      g02: getGraphValue('.graph.-g02 .num'),
      g03: getGraphValue('.graph.-g03 .num'),
      s01: getSkillValue('.skill.-s01 .txt'),
      s02: getSkillValue('.skill.-s02 .txt'),
      s03: getSkillValue('.skill.-s03 .txt'),
    });
  });

  // JSONに変換
  const jsonResult = JSON.stringify(result, null, 2);
  console.log(jsonResult);

} catch (error) {
  console.error('Error fetching or parsing HTML:', error);
}
