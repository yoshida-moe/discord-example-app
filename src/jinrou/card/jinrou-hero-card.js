import { readJson } from "../../jfs.js";
import { Card } from "./jinrou-card.js";
/**
 * ヒーローカードID
 * @readonly
 * @enum {string}
 */
export var Hero;
(function (Hero) {
    /**
     * イグニス＝ウィル＝ウィスプ
     */
    Hero["IgnisWillWisp"] = "01";
    /**
     * 魔法少女 リリカ
     */
    Hero["MagicalGirlLyrica"] = "02";
    /**
     * ピエール77世
     */
    Hero["Pierre77"] = "03";
    /**
     * マリア＝S＝レオンブルク
     */
    Hero["MariaSLeonburg"] = "04";
    /**
     * アダム＝ユーリエフ
     */
    Hero["AdamYuriev"] = "05";
    /**
     * 魔法少女 ルルカ
     */
    Hero["MagicalGirlLuruca"] = "06";
    /**
     * ジャスティス ハンコック
     */
    Hero["JusticeHancock"] = "07";
    /**
     * メグメグ
     */
    Hero["MegMeg"] = "08";
    /**
     * 桜華 忠臣
     */
    Hero["TadaomiOka"] = "09";
    /**
     * 零夜
     */
    Hero["Layer"] = "10";
    /**
     * イスタカ
     */
    Hero["Istaqa"] = "11";
    /**
     * ジャンヌ ダルク
     */
    Hero["JeanneDaArc"] = "12";
    /**
     * ニコラ テスラ
     */
    Hero["NikolaTesla"] = "13";
    /**
     * 輝龍院 きらら
     */
    Hero["KiraraKiryuin"] = "14";
    /**
     * 糸廻 輪廻
     */
    Hero["RinneItomeguri"] = "15";
    /**
     * 13†サーティーン†
     */
    Hero["Thirteen"] = "16";
    /**
     * Voidoll
     */
    Hero["Voidoll"] = "17";
    /**
     * Bugdoll
     */
    Hero["Bugdoll"] = "18";
    /**
     * グスタフ ハイドリヒ
     */
    Hero["GustavHeydrich"] = "19";
    /**
     * ヴィーナス ポロロッチョ
     */
    Hero["VenusPororotcho"] = "20";
    /**
     * 双挽 乃保
     */
    Hero["NohoSobiki"] = "21";
    /**
     * ゲームバズーカガール
     */
    Hero["GameBazookaGirl"] = "22";
    /**
     * アル・ダハブ=アルカティア
     */
    Hero["AlDahabAlqatia"] = "23";
    /**
     * ヴィオレッタ ノワール
     */
    Hero["ViolettaNoire"] = "24";
    /**
     * トマス
     */
    Hero["Thomas"] = "25";
    /**
     * HM-WA100 ニーズヘッグ
     */
    Hero["HMWA100Nidhogg"] = "26";
    /**
     * ラヴィ・シュシュマルシュ
     */
    Hero["LoveyChouchouMarchou"] = "27";
    /**
     * 某 <なにがし>
     */
    Hero["Nanigashi"] = "28";
    /**
     * ソーン＝ユーリエフ
     */
    Hero["ThorneYuriev"] = "29";
    /**
     * 十文字 アタリ
     */
    Hero["AtariJumonji"] = "30";
})(Hero || (Hero = {}));
/**
 * ヒーローカードクラス
 */
export class HeroCard extends Card {
    /**
     * コンストラクター
     * @param {Hero} id ヒーローカードID
     * @param {boolean} used 使用済み
     */
    constructor(id, used = false) {
        super(id, used);
    }
    /**
     * データを取得
     * @returns {*} データ
     */
    get item() {
        const filePath = "./src/jinrou/json/jinrou-hero.json";
        const data = readJson(filePath);
        return (data.items.find((item) => item.id === this.id) ?? {
            id: "",
            name: "",
            detail: "",
            timing: "",
            activationConditions: "",
        });
    }
    /**
     * 名前を取得
     * @returns {string} 名前
     */
    get name() {
        return this.item.name;
    }
    /**
     * 詳細を取得
     * @returns {string} 詳細
     */
    get detail() {
        return this.item.detail;
    }
    /**
     * 使用条件を取得
     * @returns {string} 使用条件
     */
    get timing() {
        return this.item.timing;
    }
    /**
     * 発動条件を取得
     * @returns {string} 発動条件
     */
    get activationConditions() {
        return this.item.activationConditions;
    }
    /**
     * 強制か
     * @returns {boolean}
     */
    get isForced() {
        return this.activationConditions === "強制";
    }
}
