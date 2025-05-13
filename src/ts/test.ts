// npx ts-node ts/test.ts
fetch("../contents/web/gacha_card/cardgacha_11003_21_stlv_P9aeRy9P.html")
  .then((res) => res.text())
  .then((html) => {
    // <table class="list_card">...</table> を抽出
    const tableMatch = html.match(/<table class="list_card">[\s\S]*?<\/table>/);
    if (!tableMatch) return;

    let tableContent = tableMatch[0];

    // コメント <!-- ... --> を除去
    tableContent = tableContent.replace(/<!--[\s\S]*?-->/g, "");

    // <card>...</card> の中身をすべて抽出
    const cardContents = [
      ...tableContent.matchAll(/<card>([\s\S]*?)<\/card>/g),
    ].map((m) => m[1]);

    console.log(cardContents);
  })
  .catch(console.error);
