import fs from "fs";

/**
 *
 * @param jsonName
 * @param newItem
 */
export function updateJson(jsonName: string, newItem: { id: string }) {
  const path: fs.PathOrFileDescriptor = `./json/${jsonName}.json`;
  const json: { items: { id: string }[] } = readJson(path);

  json.items = json.items || [];

  const existing = json.items.find((item) => item.id === newItem.id);
  if (existing) {
    Object.assign(existing, newItem);
  } else {
    json.items.push(newItem);
  }

  writeJson(path, json);
}

/**
 *
 * @param path
 */
export function readJson(jsonName: string): any {
  const path: fs.PathOrFileDescriptor = `./json/${jsonName}.json`;
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("読み込みエラー:", err);
      return;
    }

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("パースエラー:", e);
      return;
    }
  });
}

/**
 *
 * @param jsonName
 * @param json
 */
export function writeJson(jsonName: string, json: any) {
  const path: fs.PathOrFileDescriptor = `./json/${jsonName}.json`;

  fs.writeFile(path, JSON.stringify(json, null, 2), (err) => {
    if (err) {
      console.error("書き込みエラー:", err);
    } else {
      console.log("一括更新成功");
    }
  });
}
