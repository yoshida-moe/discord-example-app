/**
 * プレイヤーの役職
 */
export enum CommandName {
  Test = "test",
  Help = "help",
  Profile = "profile",
  Recruit = "recruit",
  Chat = "chat",
  Gacha = "gacha",
  Quiz = "quiz",
}

/**
 * プレイヤーの役職
 */
export enum CustomId {
  Join = "join",
  Char = "char",
  Card = "card",
  Jinrou = "jinrou",
  Show = "show",
  Start = "start",
  Watch = "watch",
  Switch = "switch",
  Vote = "vote",
  Confirmation = "confirmation",
}

/**
 * ゲームの進行フェーズ
 */
export enum Flow {
  Preparation = "A.ゲーム準備",
  Night = "B.夜時間 能力",
  Discussion = "C.昼時間 議論",
  Vote = "D.投票",
  Result = "結果/終了",
}

/**
 * プレイヤーの役職
 */
export enum Role {
  Villager = "01",
  Seer = "02",
  Thief = "03",
  Werewolf = "04",
}

export enum Hero {
  Ignis = "イグニス=ウィル=ウィスプ",
  Pierre77 = "ピエール 77世",
  Luluca = "魔法少女ルルカ",
  Reiya = "零夜",
  MegMeg = "メグメグ",
  Adam = "アダム=ユーリエフ",
  Maria = "マリア=S=レオンブルク",
  Tadaomi = "桜華 忠臣",
  Ririka = "魔法少女リリカ",
  Justice = "ジャスティス ハンコック",
  Bugdoll = "Bugdoll",
  Rinne = "糸廻 輪廻",
  Poro = "ヴィーナス ポロロッチョ",
  Kirara = "輝龍院 きらら",
  Iztaka = "イスタカ",
  Thirteen = "13 †サーティーン†",
  Tesla = "ニコラ テスラ",
  Gustav = "グスタフ ハイドリヒ",
  Voidoll = "Voidoll",
  Jeanne = "ジャンヌ ダルク",
  Nanigashi = "某 <なにがし>",
  Al = "アル・ダハブ＝アルカティア",
  Ravi = "ラヴィ・シュシュマルシュ",
  GBG = "ゲームバズーカガール",
  Nidhogg = "HM-WA100 ニーズヘッグ",
  Tomas = "トマス",
  Thorn = "ソーン=ユーリエフ",
  Violetta = "ヴィオレッタ ノワール",
  Noho = "双挽 乃保",
  Atari = "十文字 アタリ",
}
