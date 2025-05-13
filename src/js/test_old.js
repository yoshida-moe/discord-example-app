
// // 画像の結合
// const imageUrls = [
//   'https://example.com/image1.jpg',
//   'https://example.com/image2.jpg',
//   'https://example.com/image3.jpg'
//   ];
  
//   async function loadImage(url) {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = 'anonymous'; // CORS対応
//       img.onload = () => resolve(img);
//       img.onerror = reject;
//       img.src = url;
//     });
//   }
  
//   async function combineImages() {
//     const images = await Promise.all(imageUrls.map(url => loadImage(url)));
  
//     // 高さを基準に（仮にすべて同じ高さと仮定）
//     const totalWidth = images.reduce((sum, img) => sum + img.width, 0);
//     const maxHeight = Math.max(...images.map(img => img.height));
  
//     const canvas = document.getElementById('canvas');
//     canvas.width = totalWidth;
//     canvas.height = maxHeight;
//     const ctx = canvas.getContext('2d');
  
//     let x = 0;
//     for (const img of images) {
//       ctx.drawImage(img, x, 0);
//       x += img.width;
//     }
  
//     // 結合画像をデータURLとして取得（表示やダウンロード用）
//     const finalImageUrl = canvas.toDataURL('image/png');
//     return finalImageUrl;
//   }

// node js/test.js

/**
 * HTMLから入手可能なカードの一覧を取得
 */

// test.mjs または test.js（package.jsonに "type": "module" 前提）
import fs from "fs";

const jsonPath = './json/data.json';

fs.readFile(jsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('読み込みエラー:', err);
    return;
  }

  let json = {};
  try {
    json = JSON.parse(data);
  } catch (e) {
    console.error('パースエラー:', e);
    return;
  }

  // members を初期化（存在しない場合）
  json.members = json.members || [];

  const member = 'aaa';

  const index = json.members.indexOf(member);

  if (index === -1) {
    json.members.push(member);
  } else {
    json.members.splice(index, 1);
  }

  fs.writeFile(jsonPath, JSON.stringify(json, null, 2), (err) => {
    if (err) {
      console.error('書き込みエラー:', err);
    } else {
      console.log('一括更新成功');
    }
  });
});