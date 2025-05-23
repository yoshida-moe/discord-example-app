import { readJson, updateJson } from "./jfs.js";
import { BattleManager, BattleMember } from './battle.js';
import { shuffle } from './game.js';

/**
 * ゲームの進行フェーズ
 */
export const Flow = {
  A_GamePreparation: "A.ゲーム準備",
  B_Night: "B.夜時間 能力",
  C_Day: "C.昼時間 議論",
  D_Vote: "D.投票",
  Result: "結果/終了",
};

/**
 * 役職カードID
 */
export const Role = {
  Villager: '01',
  Seer: '02',
  Thief: '03',
  Werewolf: '04',
};

/**
 * ヒーローカードID
 */
export const Hero = {
  Ignis: '01',
  Pierre77: '02',
  Luluca: '03',
  Reiya: '04',
  MegMeg: '05',
  Adam: '06',
  Maria: '07',
  Tadaomi: '08',
  Ririka: '09',
  Justice: '10',
  Bugdoll: '11',
  Rinne: '12',
  Poro: '13',
  Kirara: '14',
  Iztaka: '15',
  Thirteen: '16',
  Tesla: '17',
  Gustav: '18',
  Voidoll: '19',
  Jeanne: '20',
  Nanigashi: '21',
  Al: '22',
  Ravi: '23',
  GBG: '24',
  Nidhogg: '25',
  Tomas: '26',
  Thorn: '27',
  Violetta: '28',
  Noho: '29',
  Atari: '30',
};

/**
 * 役割カードデータ
 */
export const roleData = [
  {
    id: '01',
    name: '村人',
    detail: '特殊能力はありません。\n積極的に話し合いをし人狼を見つけることが役目です。',
  },
  {
    id: '02',
    name: '占い師',
    detail:
      '夜時間中に誰か1人の役職カードを確認することができる非常に強力な役職です。\n得た情報を仲間に共有し人狼を見つけ出しましょう!!',
  },
  {
    id: '03',
    name: '怪盗',
    detail:
      '夜時間に誰か1人の役職カードと自分の役職カードを交換することができます。（任意） 交換する前に相手のカードを見ることはできません。 交換後に、新しいカードの役職を確認します。自分は交換した後の役職となり、相手は怪盗になるため自分が人狼になる可能性も…。',
  },
  {
    id: '04',
    name: '人狼',
    detail:
      '夜時間に同じカードを引いた人と顔合わせをし仲間を知ることができます。 1人でも通報されたら負けてしまうので嘘をつき村人陣営を欺きましょう。',
  },
];

/**
 * ヒーローカードデータ
 */
export const heroData = [
  {
    id: '01',
    name: 'イグニス＝ウィル＝ウィスプ',
    detail:
      '誰か1人の役職カードを見ることができる。見たカードを公開（表示）することはできない。',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '02',
    name: '魔法少女 リリカ',
    detail:
      'プレイヤー1人を指名する。指名されたプレイヤーは投票権が2倍になる。\n（その他カード効果との併用も可）',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '03',
    name: 'ピエール77世',
    detail:
      'このカードを持つプレイヤーは食べ物の名前しか発言できない。\n（違反した場合はペナルティとして投票権が消滅する。）',
    triggerItem: {
      timing: '夜時間前',
      isForced: true,
    },
  },
  {
    id: '04',
    name: 'マリア＝S＝レオンブルク',
    detail:
      '占い師・怪盗の効果実行先を自身に固定する。\n自身の役職が占い師や怪盗の場合は自由に行動可能となる。',
    triggerItem: {
      timing: '夜時間前',
      isForced: true,
    },
  },
  {
    id: '05',
    name: 'アダム＝ユーリエフ',
    detail: 'プレイヤー1人を凍らせる。凍った人は夜時間全ての行動ができなくなる。',
    triggerItem: {
      timing: '夜時間前',
      isForced: true,
    },
  },
  {
    id: '06',
    name: '魔法少女 ルルカ',
    detail: 'リリカが通報された際、ルルカの独断でもう1人追加で通報する事ができる。',
    triggerItem: {
      timing: '投票後',
      isForced: true,
    },
  },
  {
    id: '07',
    name: 'ジャスティス ハンコック',
    detail:
      '自身へ投票してきたプレイヤーを選択し投票を無効化できる。\n（ヒーロー効果を含むすべてを無効化）',
    triggerItem: {
      timing: '投票後',
      isForced: true,
    },
  },
  {
    id: '08',
    name: 'メグメグ',
    detail:
      '2票投票できる。投票は同時に行うが、まとめて1人に投票も別々の人に投票することも可能。',
    triggerItem: {
      timing: '投票前',
      isForced: false,
    },
  },
  {
    id: '09',
    name: '桜華 忠臣',
    detail: '全員と一斉じゃんけんを行う。忠臣に負けたプレイヤーの投票権が剥奪される。',
    triggerItem: {
      timing: '投票前',
      isForced: true,
    },
  },
  {
    id: '10',
    name: '零夜',
    detail:
      '中央の役職カードを1枚見ることができる。見たカードを公開（表示）することはできない。',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '11',
    name: 'イスタカ',
    detail:
      '指定したプレイヤーへ投票前に1票の事前投票ができる。\n投票時も通常通り投票できる。\n(投票権の剥奪効果を受け付けない、投票時は事前投票と違うプレイヤーへ投票することも可。)',
    triggerItem: {
      timing: '投票前',
      isForced: false,
    },
  },
  {
    id: '12',
    name: 'ジャンヌ ダルク',
    detail:
      'プレイヤー1人の投票カウントをマイナス2の状態にできる。ただし、自身の投票権は剥奪される。',
    triggerItem: {
      timing: '投票前',
      isForced: false,
    },
  },
  {
    id: '13',
    name: 'ニコラ テスラ',
    detail:
      '全プレイヤーの未使用ヒーローカードを回収する。\n回収したカードはランダムで再配布する。\n（本カードは公開済みのステータスとなるため交換の対象とはならない。）',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '14',
    name: '輝龍院 きらら',
    detail: 'ゲーム準備・夜時間・昼時間の役職・カード効果対象にならない。',
    triggerItem: {
      timing: '夜時間前',
      isForced: true,
    },
  },
  {
    id: '15',
    name: '糸廻 輪廻',
    detail:
      '未使用ヒーローカードに罠を設置、罠が設置されたカード効果を使用した場合 使用者に＋1票とする。',
    triggerItem: {
      timing: '夜時間前',
      isForced: false,
    },
  },
  {
    id: '16',
    name: '13†サーティーン†',
    detail:
      '使用者以外は目を伏せたまま投票しようと思っている人を指差しをする。\n投票先を偽ることはできない。\n（投票も同じ人に入れる）',
    triggerItem: {
      timing: '投票前',
      isForced: false,
    },
  },
  {
    id: '17',
    name: 'Voidoll',
    detail:
      '強制効果を含む全ての他プレイヤーのカード効果を無効化する。\n（使用条件：他プレイヤーがカードを公開したタイミング）',
    triggerItem: {
      timing: 'いつでも',
      isForced: false,
    },
  },
  {
    id: '18',
    name: 'Bugdoll',
    detail:
      'プレイヤーに配布されていないヒーローカードからランダムで１枚再取得する。\n入手したカードは発動までは非公開。\n（取得しても使用できないカード：ピエール、ポロロッチョ）',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '19',
    name: 'グスタフ ハイドリヒ',
    detail: '両隣のプレイヤー（生存者）へ２票ずつ与える。\n自身の投票権は消滅する。',
    triggerItem: {
      timing: '投票前',
      isForced: false,
    },
  },
  {
    id: '20',
    name: 'ヴィーナス ポロロッチョ',
    detail:
      'ゲーム終了までポロロッチョの口調でゲーム参加する。\n（違反した場合はその日の投票権が消滅する。）',
    triggerItem: {
      timing: '夜時間前',
      isForced: true,
    },
  },
  {
    id: '21',
    name: '双挽 乃保',
    detail: '自身が通報された際、\n左右どちらかのプレイヤー1人を指定し道連れにする。',
    triggerItem: {
      timing: '投票後',
      isForced: true,
    },
  },
  {
    id: '22',
    name: 'ゲームバズーカガール',
    detail: '他プレイヤー1人を指名し、\n投票権剥奪/これ以降の投票対象から除外する。',
    triggerItem: {
      timing: '投票前',
      isForced: false,
    },
  },
  {
    id: '23',
    name: 'アル・ダハブ=アルカティア',
    detail:
      '他プレイヤー1人指名し、\n現時点で指名したプレイヤーにかかっている全ての効果を盗む。\n※指定先が投票を受けている場合はその投票も自身が引き継ぐ',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '24',
    name: 'ヴィオレッタ ノワール',
    detail: '他プレイヤー1人指名し、\n昼時間中のヒーローカードを使用不可にする。',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '25',
    name: 'トマス',
    detail:
      '他プレイヤー１人を指名しトランクをつける。\nトランクがついているプレイヤーが投票された場合、1票分肩代わりする。',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '26',
    name: 'HM-WA100 ニーズヘッグ',
    detail: '全員とじゃんけん。\n負けたプレイヤーは1票投票される。',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '27',
    name: 'ラヴィ・シュシュマルシュ',
    detail: '他プレイヤー１人を指名しじゃんけん。\n敗者が勝者に役職カードを見せる。',
    triggerItem: {
      timing: '昼時間',
      isForced: false,
    },
  },
  {
    id: '28',
    name: '某 <なにがし>',
    detail:
      '議論開始からｎ分間、某とその隣にいるプレイヤー以外は目を開けることができない。\n※他のヒーローカード発動時も目を開けることができない。',
    triggerItem: {
      timing: '昼時間前',
      isForced: true,
    },
  },
  {
    id: '29',
    name: 'ソーン＝ユーリエフ',
    detail:
      '両隣のプレイヤーは夜時間中【人狼】の時間に顔をあげることができなくなる。\n⇒仲間の人狼の確認ができない',
    triggerItem: {
      timing: '夜時間前',
      isForced: true,
    },
  },
  {
    id: '30',
    name: '十文字 アタリ',
    detail:
      '一度だけじゃんけんに必ず勝てる。\n※何を出しても勝ち判定になる\n※最多得票者が複数いる場合のじゃんけんでも使用可能\n(使用条件:じゃんけんが行われる)',
    triggerItem: {
      timing: 'いつでも',
      isForced: false,
    },
  },
]

/**
 * 人狼プレイヤークラス
 */
export class JinrouPlayer extends BattleMember {
  /**
   * コンストラクター
   * @param {string} id プレイヤーID
   * @param {string} name プレイヤー名
   * @param {Role[]} roleIds 役割カードID
   * @param {Hero[]} heroIds ヒーローカードID
   * @param {string[]} votingRights 投票権
   * @param {boolean} canAction 夜時間の行動
   * @param {boolean} canPerform ヒーロースキル発動
   * @param {boolean} effect 効果
   */
  constructor(id, name, roleIds = [], heroIds = [], votingRights = 1, voted = [], canAction = true) {
    super(id, name);
    this.roleIds = roleIds;
    this.heroIds = heroIds;
    this.votingRights = votingRights;
    this.voted = voted;
    this.canAction = canAction;
    this.effect = {
      targetEffect: '',
      canTargetEffect: true,
      canTargetVoting: true,
      canActAtNight: true,
      canPerformHeroAtDay: true,
      isTrap: false,
      isTrunk: false,
      canAlwaysWinRPS: false,
      minusVotingCount: 0,
    };
  }

  /**
   * 村人か
   * @type {boolean}
   */
  get isVillager() {
    return this.roleIds === Role.Villager;
  }

  /**
   * 占い師か
   * @type {boolean}
   */
  get isSeer() {
    return this.roleIds === Role.Seer;
  }

  /**
   * 怪盗か
   * @type {boolean}
   */
  get isThief() {
    return this.roleIds === Role.Thief;
  }

  /**
   * 人狼か
   * @type {boolean}
   */
  get isWerewolf() {
    return this.roleIds === Role.Werewolf;
  }
}

/**
 * 人狼ゲームクラス
 */
export class JinrouGame {
  /**
   * コンストラクター
   * @param {string} id バトルID
   * @param {JinrouPlayer[]} players プレイヤーリスト
   * @param {number} night 夜時間の回数
   */
  constructor(id, players = [], night = 1) {
    this.id = id;
    this.players = players;
    this.night = night;
  }

  /**
   * 村人を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get villager() {
    return this.players.filter((player) => player.isVillager);
  }

  /**
   * 占い師を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get seers() {
    return this.players.filter((player) => player.isSeer);
  }

  /**
   * 怪盗を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get thieves() {
    return this.players.filter((player) => player.isThief);
  }

  /**
   * 人狼を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get werewolves() {
    return this.players.filter((player) => player.isWerewolf);
  }
}

/**
 * 人狼GMクラス
 * @description ゲームの進行とJSONデータの管理を行う。
 */
export class JinrouGameMaster {
  /**
   * コンストラクター
   * @param {string} id ID
   * @param {string} filePath JSONパス
   */
  constructor(id, filePath = './src/json/jinrou-game.json') {
    this.id = id;
    this.filePath = filePath;
  }

  /**
   * 項目を取得
   * @returns {JinrouGame} 項目
   */
  get item() {
    const data = readJson(this.filePath);
    const item = data?.items?.find(item => item.id === this.id);
    return new JinrouGame(
      this.id,
      item?.players ?? [],
      item?.night ?? 1,
    );
  }

  /**
   * 項目を設定
   * @param {JinrouGame} value 項目
   */
  set item(value) {
    updateJson(this.filePath, value);
  }

  /**
   * プレイヤーリストを取得
   * @returns {JinrouPlayer[]} プレイヤーリスト
   */
  get players() {
    return this.item?.players ?? [];
  }

  /**
   * プレイヤーリストを設定
   * @param {JinrouPlayer[]} values プレイヤーリスト
   */
  set players(values) {
    const newItem = { ...this.item, players: values };
    this.item = newItem;
  }

  /**
   * 村人を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get villager() {
    return this.item.villager;
  }

  /**
   * 占い師を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get seers() {
    return this.item.seers;
  }

  /**
   * 怪盗を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get thieves() {
    return this.item.thieves;
  }

  /**
   * 人狼を取得
   * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
   */
  get werewolves() {
    return this.item.werewolves;
  }

  /**
   * 夜時間の回数を取得
   * @returns {number} 夜時間の回数
   */
  get night() {
    return this.item.night;
  }

  /**
   * 夜時間の回数を設定
   */
  set night(value) {
    this.item.night = value;
  }

  getPlayer(playerId) {
    return this.players.find((player) => player.id === playerId);
  }

  getPlayerName(playerId) {
    return this.players.find((player) => player.id === playerId).name;
  }

  getPlayerRole(playerId) {
    return this.players.find((player) => player.id === playerId).roleIds;
  }

  getPlayerHero(playerId) {
    return this.players.find((player) => player.id === playerId).heroIds;
  }

  canAction(playerId) {
    return this.players.find((player) => player.id === playerId)?.canAction;
  }

  /**
   * カードをセットする。
   * @description
   * 役職カードを［プレイヤー人数5枚＋2枚］、ヒーローカードを［プレイヤー人数5枚］用意します。 
   * 使用するカードをシャッフルし、参加者に役職カードとヒーローカードをそれぞれ1人１枚ずつ配ります。
   */
  start(night = 1, heroIds = ['01', '02', '03', '04', '05', '06']) {
    this.night = night;

    const { members } = new BattleManager(this.id);

    // 基本ルールの場合、中央残りを設定
    if (night) {
      this.players = [
        ...members.map(({ id, name }) => new JinrouPlayer(id, name)),
        new JinrouPlayer('center-1', '中央残り1'),
        new JinrouPlayer('center-2', '中央残り2')
      ];
    }

    const roleDeck = this.buildRoleDeck();
    this.players = this.players.map(player => ({
      ...player,
      roleIds: [...player.roleIds, roleDeck.pop()]
    }));

    const heroDeck = this.buildHeroDeck(heroIds);
    this.players = this.players.map(player => ({
      ...player,
      heroIds: [...player.heroIds, heroDeck.pop()]
    }));
  }

  /**
   * 配役
   * @param {number} seerCount 占い師の人数
   * @param {number} thiefCount 怪盗の人数
   * @param {number} werewolfCount 人狼の人数
   * @returns 
   */
  buildRoleDeck(seerCount = 1, thiefCount = 1, werewolfCount = 2) {
    const deckSize = this.players.length;
    const roleDeck = Array(deckSize).fill(Role.Villager);

    const roles = [
      { id: Role.Seer, count: seerCount },
      { id: Role.Thief, count: thiefCount },
      { id: Role.Werewolf, count: werewolfCount },
    ];

    let index = 0;
    for (const { id, count } of roles) {
      roleDeck.fill(id, index, index + count);
      index += count;
    }

    return shuffle(roleDeck);
  }

  /**
   * ヒーローデッキ構築
   * @param {Hero[]} heroIds デッキに入れるヒーローカードID
   * @returns 
   */
  buildHeroDeck(heroIds) {
    return shuffle(heroIds);
  }

  /**
   * 役職を確認
   * @description 参加者は自分の役職を確認します。
   * @param {string} userId 
   * @returns 
   */
  confirmationRoleIds(userId) {
    return this.players.find(player => player.id === userId)?.roleIds ?? [];
  }

  /**
   * ヒーローを確認
   * @description 参加者は自分のヒーローを確認します。
   * @param {string} userId 
   * @returns 
   */
  confirmationHeroIds(userId) {
    return this.players.find(player => player.id === userId)?.heroIds ?? [];
  }

  canAction(userId) {
    const player = this.players.find(player => player.id === userId);
    return player?.canAction ? player?.roleIds : [];
  }

  get targets() {
    return this.players.map(({ id, name }) => ({ id, name }));
  }

  /**
   * 占い師のカードを引いた方は行動してください。
   * @description 占い師のカードを引いた方は【誰か1人の役職カード】または【中央の役職カード2枚】を見ることができます。
   * @param {string} targetId 誰かのプレイヤーID
   * @returns {Role} 誰かの役職カードID
   */
  actionSeer(userId, targetId) {
    this.players = this.players.map(player => player.id === userId ? { ...player, canAction: false } : player);

    const targetIndex = this.players.findIndex(p => p.id === targetId);

    const target = this.players[targetIndex];

    return target.roleIds;
  }

  /**
   * 人狼のカードを引いた方は行動してください。
   * @description 人狼のカードを引いた方は同じ役職カードを引いた仲間がいるか確認します。
   * @returns {string[]} 同じ役職カードを引いた仲間のプレイヤーIDリスト
   */
  actionWerewolf(userId) {
    this.players = this.players.map(player => player.id === userId ? { ...player, canAction: false } : player);
    return this.players.filter(player => player.roleIds.includes(Role.Werewolf)).map(player => player.id);
  }

  /**
   * 怪盗のカードを引いた方は行動してください。
   * @description 怪盗のカードを引いた方は自身の役職カードを【誰かの役職カード】と交換することができます。
   * @param {string} targetId 誰かのプレイヤーID
   * @returns {Role} 誰かの役職カードID
   */
  actionThief(userId, targetId) {
    this.players = this.players.map(player => player.id === userId ? { ...player, canAction: false } : player);

    const user = this.players.find(player => player.id === userId);
    const target = this.players.find(player => player.id === targetId);

    const newUser = { ...user, roleIds: target.roleIds };
    const newTarget = { ...target, roleIds: user.roleIds };

    this.players = this.players.map(player => player.id === targetId ? newTarget : player);
    this.players = this.players.map(player => player.id === userId ? newUser : player);

    return newUser.roleIds;
  }

  /**
   * 一斉投票してください。
   * @param {string} userId 自分のプレイヤーID
   * @param {string} targetId 指定のプレイヤーID
   * @returns {number} 自分の投票権
   */
  vote(userId, targetId) {
    const updatedPlayers = this.players.map(player => {
      if (player.id === userId) {
        return { ...player, votingRights: player.votingRights - 1 };
      }
      if (player.id === targetId) {
        return { ...player, voted: [...player.voted, userId] };
      }
      return player;
    });

    this.players = updatedPlayers;
    return updatedPlayers.find(p => p.id === userId).votingRights;
  }

  /**
   * 通報
   * @description 一斉投票で最多投票された人が通報されます。通報された方は役職カードを公開します。
   * @returns {JinrouPlayer} 対象のプレイヤー
   */
  report() {
    const mostVotes = this.players.reduce((max, player) => {
      return (player.voted.length > max.voted.length) ? player : max;
    }, this.players[0]);
    return mostVotes;
  }
}
