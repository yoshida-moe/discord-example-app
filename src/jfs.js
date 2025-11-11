import fs from "fs";
import path from "path";
const READ_ERROR = "読み込みエラー";
const WRITE_ERROR = "書き込みエラー";
/**
 * JSONファイルを更新
 */
export function updateJson(filePath, newItem) {
    const data = readJson(filePath);
    data.items ||= [];
    const index = data.items.findIndex((item) => item.id === newItem.id);
    if (index !== -1) {
        data.items[index] = { ...data.items[index], ...newItem };
    }
    else {
        data.items.push(newItem);
    }
    writeJson(filePath, data);
}
/**
 * JSONファイルを読み込み（なければ空ファイルを作成）
 */
export function readJson(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify({ items: [] }, null, 2), "utf8");
        }
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw);
    }
    catch (err) {
        console.error(READ_ERROR, err);
        return { items: [] };
    }
}
/**
 * JSONファイルに書き込み
 */
export function writeJson(filePath, data) {
    try {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    }
    catch (err) {
        console.error(WRITE_ERROR, err);
    }
}
