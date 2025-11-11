/**
 * ゲームの進行フェーズ
 */
export enum Flow {
  /**
   * A.ゲーム準備
   */
  GamePreparation = "A",

  /**
   * B.夜時間 能力
   */
  Night = "B",

  /**
   * C.昼時間 議論
   */
  Dat = "C",

  /**
   * D.投票
   */
  vote = "D",

  /**
   * 結果/終了
   */
  Result = "E",
}
