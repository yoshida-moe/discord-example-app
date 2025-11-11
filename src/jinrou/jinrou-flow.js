/**
 * ゲームの進行フェーズ
 */
export var Flow;
(function (Flow) {
    /**
     * A.ゲーム準備
     */
    Flow["GamePreparation"] = "A";
    /**
     * B.夜時間 能力
     */
    Flow["Night"] = "B";
    /**
     * C.昼時間 議論
     */
    Flow["Dat"] = "C";
    /**
     * D.投票
     */
    Flow["vote"] = "D";
    /**
     * 結果/終了
     */
    Flow["Result"] = "E";
})(Flow || (Flow = {}));
