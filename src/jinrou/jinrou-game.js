import { readJson, updateJson } from "../jfs.js";
import { shuffle } from "../../game.js";
import { JinrouPlayer } from "./jinrou-player.js";
import { Role, RoleCard } from "./card/jinrou-role-card.js";
import { Hero, HeroCard } from "./card/jinrou-hero-card.js";
import { BattleManager, BattleMember } from "../battle/battle.js";
/**
 * 人狼ゲームクラス
 */
export class JinrouGame {
    id;
    players;
    roleDeck;
    heroDeck;
    day;
    seerOptions;
    werewolfOptions;
    thiefOptions;
    voteOptions;
    /**
     * コンストラクター
     * @param {string} id バトルID
     * @param {JinrouPlayer[]} players プレイヤーリスト
     * @param {RoleCard[]} roleDeck 中央残り
     * @param {HeroCard[]} heroDeck デッキ
     * @param {number} day n日目
     * @param {BattleMember[]} seerOptions 占い師の選択肢
     * @param {BattleMember[]} werewolfOptions 人狼の選択肢
     * @param {BattleMember[]} thiefOptions 怪盗の選択肢
     * @param {BattleMember[]} voteOptions 投票の選択肢
     */
    constructor(id, players = [], roleDeck = [], heroDeck = [], day = 1, seerOptions = [], werewolfOptions = [], thiefOptions = [], voteOptions = []) {
        this.id = id;
        this.players = players;
        this.roleDeck = roleDeck;
        this.heroDeck = heroDeck;
        this.day = day;
        this.seerOptions = seerOptions;
        this.werewolfOptions = werewolfOptions;
        this.thiefOptions = thiefOptions;
        this.voteOptions = voteOptions;
    }
}
/**
 * JSONファイルパス
 */
const filePath = "./src/jinrou/json/jinrou-game.json";
/**
 * デフォルトデッキ
 */
const defaultDeck = [
    Hero.IgnisWillWisp,
    Hero.MagicalGirlLyrica,
    Hero.Pierre77,
    Hero.MariaSLeonburg,
    Hero.AdamYuriev,
    Hero.MagicalGirlLuruca,
    Hero.JusticeHancock,
    Hero.MegMeg,
    Hero.TadaomiOka,
    Hero.Layer,
    Hero.Istaqa,
    Hero.JeanneDaArc,
    Hero.NikolaTesla,
    Hero.KiraraKiryuin,
    Hero.RinneItomeguri,
    Hero.Thirteen,
    // Hero.Voidoll,
    // Hero.Bugdoll,
    Hero.GustavHeydrich,
    Hero.VenusPororotcho,
    Hero.NohoSobiki,
    Hero.GameBazookaGirl,
    Hero.AlDahabAlqatia,
    Hero.ViolettaNoire,
    Hero.Thomas,
    Hero.HMWA100Nidhogg,
    Hero.LoveyChouchouMarchou,
    // Hero.Nanigashi,
    Hero.ThorneYuriev,
    Hero.AtariJumonji,
];
/**
 * 人狼GMクラス
 * @description ゲームの進行とJSONデータの管理を行う。
 */
export class JinrouGameMaster {
    id;
    roleDeck;
    heroDeck;
    /**
     * コンストラクター
     * @param {string} id ID
     */
    constructor(id) {
        this.id = id;
        this.roleDeck = [];
        this.heroDeck = [];
    }
    /**
     * 項目を取得
     * @returns {JinrouGame} 項目
     */
    get item() {
        const data = readJson(filePath);
        const item = data?.items?.find((item) => item.id === this.id);
        return new JinrouGame(this.id, item?.players ?? [], item?.day ?? 1);
    }
    /**
     * 項目を設定
     * @param {JinrouGame} value 項目
     */
    set item(value) {
        updateJson(filePath, value);
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
     * プレイヤーを設定
     * @param {JinrouPlayer[]} values プレイヤーリスト
     */
    set player(value) {
        this.players = this.players.map((player) => player.id === value.id ? value : player);
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
        return this.players.filter((player) => player.roleCard.id === Role.Seer);
    }
    /**
     * 怪盗を取得
     * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
     */
    get thieves() {
        return this.players.filter((player) => player.roleCard.id === Role.Thief);
    }
    /**
     * 人狼を取得
     * @returns {JinrouPlayer[]} 対象のプレイヤーリスト
     */
    get werewolves() {
        this.players[0].isWerewolf
        return this.players.filter((player) => player.roleCard.id === Role.Werewolf);
    }
    /**
     * 夜時間の回数を取得
     * @returns {number} 夜時間の回数
     */
    get day() {
        return this.item.day;
    }
    /**
     * 夜時間の回数を設定
     * @param {number} value 夜時間の回数
     */
    set day(value) {
        this.item.day = value;
    }
    /**
     * 占い師の選択肢を取得
     * @returns {BattleMember[]} 占い師の選択肢
     */
    get seerOptions() {
    return this.players.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
        return this.item.seerOptions;
    }
    /**
     * 占い師の選択肢を設定
     * @param {BattleMember[]} values 占い師の選択肢
     */
    set seerOptions(values) {
        this.item.seerOptions = values;
    }
    /**
     * 人狼の選択肢を取得
     * @returns {BattleMember[]} 人狼の選択肢
     */
    get werewolfOptions() {
    return this.players.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
        return this.item.werewolfOptions;
    }
    /**
     * 人狼の選択肢を設定
     * @param {BattleMember[]} values 人狼の選択肢
     */
    set werewolfOptions(values) {
        this.item.werewolfOptions = values;
    }
    /**
     * 怪盗の選択肢を取得
     * @returns {BattleMember[]} 怪盗の選択肢
     */
    get thiefOptions() {
    return this.players.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
        return this.item.thiefOptions;
    }
    /**
     * 怪盗の選択肢を設定
     * @param {BattleMember[]} values 怪盗の選択肢
     */
    set thiefOptions(values) {
        this.item.thiefOptions = values;
    }
    /**
     * 投票の選択肢を取得
     * @returns {BattleMember[]} 投票の選択肢
     */
    get voteOptions() {
    return this.players.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
        return this.item.voteOptions;
    }
    /**
     * 投票の選択肢を設定
     * @param {BattleMember[]} values 投票の選択肢
     */
    set voteOptions(values) {
        this.item.voteOptions = values;
    }
    /**
     * プレイヤーか
     * @param {string} userId プレイヤーID
     * @returns {boolean}
     */
    isPlayer(userId) {
        return this.players.map((player) => player.id).includes(userId);
    }
    /**
     * プレイヤーの名前を取得
     * @param {string} userId プレイヤーID
     * @returns {string} プレイヤー名
     */
    getPlayerName(userId) {
        return this.players.find((player) => player.id === userId)?.name;
    }
    /**
     * ゲーム準備
     * @description
     * 役職カードとヒーローカードを用意します。
     * 使用するカードをシャッフルし、参加者に役職カードとヒーローカードを配ります。
     * @param {number} night 夜数
     * @param {number} centerCount 中央残り数
     * @param {Hero[]} heroDeck デッキ
     * @returns
     */
    preparation(night = 1, centerCount = 2, heroDeck = defaultDeck, heroCount = 1) {
        const members = new BattleManager(this.id).members;
        this.players = members.map(({ id, name }) => new JinrouPlayer(id, name));
        this.roleDeck = this.buildRoleDeck(this.players.length + centerCount);
        this.roleDeck = this.distributeRoleCards(this.players.map((player) => player.id), this.roleDeck);
        this.heroDeck = heroDeck;
        for (let i = 0; i < heroCount; i++) {
            this.heroDeck = this.distributeHeroCards(this.players.map((player) => player.id), this.heroDeck);
        }
        this.day = night;
        this.setOptions();
    }
    /**
     * 配役とカード内訳
     * @param {number} count 枚数
     * @param {number} castingSeer 占い師数
     * @param {number} castingThief 怪盗数
     * @param {number} castingWerewolf 人狼数
     * @returns
     */
    buildRoleDeck(count, castingSeer = 1, castingThief = 1, castingWerewolf = 2) {
        const roleDeck = Array(count).fill(Role.Villager);
        const roles = [
            { id: Role.Seer, count: castingSeer },
            { id: Role.Thief, count: castingThief },
            { id: Role.Werewolf, count: castingWerewolf },
        ];
        let index = 0;
        for (const { id, count } of roles) {
            roleDeck.fill(id, index, index + count);
            index += count;
        }
        return roleDeck;
    }
    getPlayer(id) {
        const player = this.players.find((player) => player.id === id);
        if (!player) {
            throw new Error("指定されたプレイヤーが存在しません");
        }
        return new JinrouPlayer(player.id, player.name, player.roleCard, player.heroCards, player.votingRights, player.voted, player.effect);
    }
    /**
     * 役職カードを配布する。
     */
    distributeRoleCards(playerIds, deck) {
        const shuffled = shuffle(deck);
        for (const playerId of playerIds) {
            const player = this.getPlayer(playerId);
            const id = shuffled.pop();
            const card = new RoleCard(id);
            player.roleCard = card;
            this.player = player;
        }
        return shuffled;
    }
    /**
     * ヒーローカードを配布する。
     */
    distributeHeroCards(playerIds, deck) {
        const shuffled = shuffle(deck);
        for (const playerId of playerIds) {
            const player = this.getPlayer(playerId);
            const id = shuffled.pop();
            const card = new HeroCard(id);
            player.heroCards.push(card);
            this.player = player;
        }
        return shuffled;
    }
    /**
     * 役職を確認
     * @param {string} targetId 対象のプレイヤーID
     * @returns {string[]} 役職カードIDリスト
     */
    confirmationRoleIds(targetId) {
        if (targetId.includes("center"))
            return this.roleDeck;
        const players = this.players.filter((player) => player.id.includes(targetId));
        return players.map((player) => player?.roleCard.id);
    }
    /**
     * ヒーローを確認
     * @param {string} targetId 対象のプレイヤーID
     * @returns {string[]} ヒーローカードIDリスト
     */
    confirmationHeroIds(targetId) {
        const user = this.getPlayer(targetId);
        return user?.heroCards.map((card) => card.id) ?? [];
    }
    /**
     * 生存者
     */
    get alivePlayers() {
        return this.players
            // .filter(({ isAlive }) => isAlive)
            .map(({ id, name }) => new BattleMember(id, name));
    }
    /**
     * 選択肢を設定
     */
    setOptions() {
        this.seerOptions = [
            ...this.alivePlayers,
            new BattleMember("center", "中央残り"),
        ];
        this.werewolfOptions = this.alivePlayers;
        this.thiefOptions = this.alivePlayers;
        this.voteOptions = this.alivePlayers;
    }
    /**
     * 役職カードの効果を実行
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetId 指定のプレイヤーID
     * @returns
     */
    performRole(userId, targetIds = []) {
        const user = this.getPlayer(userId);
        // if (!user.canPerformRole) {
        //     throw new Error("行動不可");
        // }
        // if (user.roleCard.used) {
        //     throw new Error("行動済み");
        // }
        // user.roleCard.use();
        user.roleCard.used = true;
        this.player = user;
        switch (user.roleCard.id) {
            case Role.Seer:
                return this.performRoleSeer(userId, targetIds);
            case Role.Werewolf:
                return this.performRoleWerewolf(userId, targetIds);
            case Role.Thief:
                return this.performRoleThief(userId, targetIds);
        }
        return [];
    }
    /**
     * 占い師の効果を実行
     * @description
     * 基本ルール：
     * 【誰か1人の役職カード】または【中央の役職カード2枚】を見ることができます。
     * カスタムルール：
     * 初日．村人を１人お教えします。
     * ２日目以降．【誰か1人の役職カード】を見ることができます。
     *
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetId 指定のプレイヤーID
     * @returns {Role} 指定のプレイヤーの役職カードID
     */
    performRoleSeer(userId, targetIds = []) {
        // if (!this.seerOptions.find((option) => option.id === userId)) {
        //     throw new Error("指定不可");
        // }
        const results = [];
        if (targetIds.length) {
            for (const targetId of targetIds) {
                results.push(this.getPlayer(targetId));
            }
            return results;
        }
        const shuffledVillager = shuffle(this.villager);
        results.push(shuffledVillager.pop());
        return results;
    }
    /**
     * 人狼の効果を実行
     * @description
     * 初日．同じ役職カードを引いた仲間がいるか確認します。
     * ２日目以降．襲撃
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetId 指定のプレイヤーID
     * @returns {string[]} 仲間のプレイヤーIDリスト
     */
    performRoleWerewolf(userId, targetIds = []) {
        // if (!this.werewolfOptions.find((option) => option.id === userId)) {
        //     throw new Error("指定不可");
        // }
        if (targetIds.length) {
            const target = this.getPlayer(targetIds[0]);
            target.attack();
            this.player = target;
            return [target];
        }
        return this.werewolves;
    }
    /**
     * 怪盗の効果を実行
     * @description 自身の役職カードを【誰かの役職カード】と交換することができます。
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetId 指定のプレイヤーID
     * @returns {Role} 指定のプレイヤーの役職カードID
     */
    performRoleThief(userId, targetIds) {
        // if (!this.thiefOptions.find((option) => option.id === userId)) {
        //     throw new Error("指定不可");
        // }
        const user = this.getPlayer(userId);
        const target = this.getPlayer(targetIds[0]);
        [user.roleCard.id, target.roleCard.id] = [
            target.roleCard.id,
            user.roleCard.id,
        ];
        this.player = user;
        this.player = target;
        return [target];
    }
    /**
     * ヒーローカードの効果を実行
     * @param {string} heroId ヒーローカードID
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetId 指定のプレイヤーID
     */
    performHero(heroId, userId, targetIds = []) {
        const user = this.getPlayer(userId);
        const heroCard = user.heroCards
            .filter((card) => !card.used)
            .find((card) => card.id === heroId);
        if (!heroCard) {
            throw new Error("対象のヒーローカードがありません");
        }
        heroCard.use();
        if (user.effect.isTrap)
            this.vote(userId); // TODO: 罠置いた人
        this.player = user;
        switch (heroId) {
            case Hero.IgnisWillWisp:
                return this.performIgnisWillWisp(targetIds);
            case Hero.MagicalGirlLyrica:
                return this.performMagicalGirlLyrica(targetIds);
            case Hero.Pierre77:
                return this.performPierre77(userId);
            case Hero.MariaSLeonburg:
                return this.performMariaSLeonburg(userId);
            case Hero.AdamYuriev:
                return this.performAdamYuriev(targetIds);
            case Hero.MagicalGirlLuruca:
                return this.performMagicalGirlLuruca(targetIds);
            case Hero.JusticeHancock:
                return this.performJusticeHancock(userId, targetIds);
            case Hero.MegMeg:
                return this.performMegMeg(userId);
            case Hero.TadaomiOka:
                return this.performTadaomiOka(targetIds);
            case Hero.Layer:
                return this.performLayer(targetIds);
            case Hero.Istaqa:
                return this.performIstaqa(userId, targetIds);
            case Hero.JeanneDaArc:
                return this.performJeanneDaArc(userId, targetIds);
            case Hero.NikolaTesla:
                return this.performNikolaTesla();
            case Hero.KiraraKiryuin:
                return this.performKiraraKiryuin(userId);
            case Hero.RinneItomeguri:
                return this.performRinneItomeguri(targetIds);
            case Hero.Thirteen:
                return this.performThirteen();
            case Hero.Voidoll:
                return this.performVoidoll();
            case Hero.Bugdoll:
                return this.performBugdoll(userId);
            case Hero.GustavHeydrich:
                return this.performGustavHeydrich(userId);
            case Hero.VenusPororotcho:
                return this.performVenusPororotcho(userId);
            case Hero.NohoSobiki:
                return this.performNohoSobiki(targetIds);
            case Hero.GameBazookaGirl:
                return this.performGameBazookaGirl(targetIds);
            case Hero.AlDahabAlqatia:
                return this.performAlDahabAlqatia(userId, targetIds);
            case Hero.ViolettaNoire:
                return this.performViolettaNoire(targetIds);
            case Hero.Thomas:
                return this.performThomas(userId, targetIds);
            case Hero.HMWA100Nidhogg:
                return this.performHMWA100Nidhogg(userId, targetIds);
            case Hero.LoveyChouchouMarchou:
                return this.performLoveyChouchouMarchou(targetIds);
            case Hero.Nanigashi:
                return this.performNanigashi(targetIds);
            case Hero.ThorneYuriev:
                return this.performThorneYuriev(userId);
            case Hero.AtariJumonji:
                return this.performAtariJumonji(userId);
        }
    }
    /**
     * 「イグニス＝ウィル＝ウィスプ」の効果を発動
     * @param {string[]} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performIgnisWillWisp(targetIds) {
        for (const targetId of targetIds) {
            if (!this.players.find((player) => player.id === targetId)) {
                throw new Error("指定不可");
            }
        }
        return targetIds.map((targetId) => this.confirmationRoleIds(targetId));
    }
    /**
     * 「魔法少女 リリカ」の効果を発動
     * @param {string[]} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performMagicalGirlLyrica(targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.performedByMagicalGirlLyrica();
            this.player = target;
        }
    }
    /**
     * 「ピエール77世」の効果を発動
     * @description 違反した場合に実行すること
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performPierre77(userId) {
        const user = this.getPlayer(userId);
        user.disappearVotingRights();
        this.player = user;
    }
    /**
     * 「マリア＝S＝レオンブルク」の効果を発動
     * @description
     * 占い師・怪盗の効果実行先を自身に固定する。
     * 自身の役職が占い師や怪盗の場合は自由に行動可能となる。
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performMariaSLeonburg(userId) {
        const user = this.getPlayer(userId);
        if (!user.isSeer) {
            this.seerOptions = this.seerOptions.filter((option) => option.id === userId);
        }
        if (!user.isThief) {
            this.thiefOptions = this.thiefOptions.filter((option) => option.id === userId);
        }
    }
    /**
     * 「アダム＝ユーリエフ」の効果を発動
     * @param {string[]} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performAdamYuriev(targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.ice();
            this.player = target;
        }
    }
    /**
     * 「魔法少女 ルルカ」の効果を発動
     * @param {string[]} targetIds 指定のプレイヤーIDリスト
     * @returns {JinrouPlayer} 対象のプレイヤー
     */
    performMagicalGirlLuruca(targetIds) {
        return targetIds.map((targetId) => this.report(targetId));
    }
    /**
     * 「ジャスティス ハンコック」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @param {string[]} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performJusticeHancock(userId, targetIds) {
        for (const targetId of targetIds) {
            const user = this.getPlayer(userId);
            user.voted = user.voted.filter((votedPlayerId) => votedPlayerId !== targetId);
            this.player = user;
        }
    }
    /**
     * 「メグメグ」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performMegMeg(userId) {
        const user = this.getPlayer(userId);
        user.votingRights += 1;
        this.player = user;
    }
    /**
     * 「桜華 忠臣」の効果を発動
     * @param {string[]} targetIds 忠臣に負けたプレイヤーIDリスト
     * @returns
     */
    performTadaomiOka(targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.disappearVotingRights();
            this.player = target;
        }
    }
    /**
     * 「零夜」の効果の選択肢
     * @returns
     */
    getPerformLayerOptions() {
        return this.roleDeck.map((card, index) => new BattleMember(`center-${index}`, `中央残り${index}`));
    }
    /**
     * 「零夜」の効果を発動
     * @param {string[]} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performLayer(targetIds) {
        for (const targetId of targetIds) {
            const options = this.getPerformLayerOptions();
            if (!options.map((option) => option.id).includes(targetId)) {
                throw new Error("指定不可");
            }
        }
        return targetIds.map((targetId) => this.confirmationRoleIds(targetId));
    }
    /**
     * 「イスタカ」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performIstaqa(userId, targetIds) {
        return targetIds.map((targetId) => this.vote(targetId, userId));
    }
    /**
     * 「ジャンヌ ダルク」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performJeanneDaArc(userId, targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.effect.isMinusVotingCount = true;
            this.player = target;
        }
        const user = this.getPlayer(userId);
        user.disappearVotingRights();
        this.player = user;
    }
    /**
     * 「ニコラ テスラ」の効果を発動
     * @description
     * 全プレイヤーの未使用ヒーローカードを回収する。
     * 回収したカードはランダムで再配布する。
     * （本カードは公開済みのステータスとなるため交換の対象とはならない。
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performNikolaTesla() {
        const unusedPlayerIds = [];
        const allUnusedHeroCards = [];
        for (const player of this.players) {
            const unusedHeroCards = player.heroCards.filter((card) => !card.used);
            for (const unusedHeroCard of unusedHeroCards) {
                unusedPlayerIds.push(player.id);
                allUnusedHeroCards.push(unusedHeroCard);
            }
            player.heroCards = player.heroCards.filter((card) => card.used);
            this.player = player;
        }
        this.distributeHeroCards(unusedPlayerIds, allUnusedHeroCards);
    }
    /**
     * 「輝龍院 きらら」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performKiraraKiryuin(userId) {
        this.seerOptions = this.seerOptions.filter((option) => option.id !== userId);
        this.thiefOptions = this.thiefOptions.filter((option) => option.id !== userId);
    }
    /**
     * 「糸廻 輪廻」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performRinneItomeguri(targetIds) {
        // TODO: 効果を発動
        // TODO: カードを指定
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.effect.isTrap = true;
        }
    }
    /**
     * 「13†サーティーン†」の効果を発動
     * @returns
     */
    performThirteen() {
        return this.players.map(({ name, voted }) => ({ name, voted }));
    }
    /**
     * 「Voidoll」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performVoidoll() {
        // TODO: 効果を発動
    }
    /**
     * 「Bugdoll」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performBugdoll(userId) {
        this.distributeHeroCards([userId], this.heroDeck);
    }
    /**
     * 「グスタフ ハイドリヒ」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performGustavHeydrich(userId) {
        const index = this.players.findIndex((player) => player.id === userId);
        const leftTarget = this.players[index - 1];
        this.vote(leftTarget.id, userId);
        this.player = leftTarget;
        const rightTarget = this.players[index + 1];
        this.vote(rightTarget.id, userId);
        this.player = rightTarget;
    }
    /**
     * 「ヴィーナス ポロロッチョ」の効果を発動
     * @description 違反した場合に実行すること
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performVenusPororotcho(userId) {
        const user = this.getPlayer(userId);
        user.disappearVotingRights();
        this.player = user;
    }
    /**
     * 「双挽 乃保」の効果の選択肢を取得
     * @param {*} userId
     * @returns
     */
    getPerformNohoSobikiOptions(userId) {
        const index = this.players.findIndex((player) => player.id === userId);
        const leftTarget = this.players[index - 1];
        const rightTarget = this.players[index + 1];
        return [
            new BattleMember(leftTarget.id, leftTarget.name),
            new BattleMember(rightTarget.id, rightTarget.name),
        ];
    }
    /**
     * 「双挽 乃保」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performNohoSobiki(targetIds) {
        for (const targetId of targetIds) {
            this.report(targetId);
        }
    }
    /**
     * 「ゲームバズーカガール」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performGameBazookaGirl(targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.disappearVotingRights();
            this.player = target;
            this.voteOptions = this.voteOptions.filter((option) => option.id !== targetId);
        }
    }
    /**
     * 「アル・ダハブ=アルカティア」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performAlDahabAlqatia(userId, targetIds) {
        const user = this.getPlayer(userId);
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            user.effect = target.effect; // TODO: 自分の効果も消えないように
            target.resetEffect();
            user.votingRights += target.votingRights;
            target.disappearVotingRights();
            this.player = user;
            this.player = target;
        }
    }
    /**
     * 「ヴィオレッタ ノワール」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performViolettaNoire(targetIds) {
        // TODO: 効果を発動
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.performedByViolettaNoire();
            this.player = target;
        }
    }
    /**
     * 「トマス」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performThomas(userId, targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.performedByThomas(userId);
            this.player = target;
        }
    }
    /**
     * 「HM-WA100 ニーズヘッグ」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performHMWA100Nidhogg(userId, targetIds) {
        for (const targetId of targetIds) {
            const target = this.getPlayer(targetId);
            target.voted.push(userId);
            this.player = target;
        }
    }
    /**
     * 「ラヴィ・シュシュマルシュ」の効果を発動
     * @param {string} targetIds 指定のプレイヤーIDリスト
     * @returns
     */
    performLoveyChouchouMarchou(targetIds) {
        return targetIds.map((targetId) => this.confirmationRoleIds(targetId));
    }
    /**
     * 「某 <なにがし>」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performNanigashi(userId) {
        const index = this.players.findIndex((player) => player.id === userId);
        const leftTarget = this.players[index - 1];
        const rightTarget = this.players[index + 1];
        return [leftTarget, rightTarget];
    }
    /**
     * 「ソーン＝ユーリエフ」の効果を発動
     * @returns
     */
    performThorneYuriev(userId) {
        const index = this.players.findIndex((player) => player.id === userId);
        const leftTarget = this.players[index - 1];
        if (leftTarget.isWerewolf)
            leftTarget.ice();
        const rightTarget = this.players[index + 1];
        if (rightTarget.isWerewolf)
            rightTarget.ice();
    }
    /**
     * 「十文字 アタリ」の効果を発動
     * @param {string} userId 自分のプレイヤーID
     * @returns
     */
    performAtariJumonji(userId) {
        // TODO: 効果を発動
        const user = this.getPlayer(userId);
        user.effect.isWinRPS = true;
        this.player = user;
    }
    /**
     * 投票
     * @param {string} targetId 指定のプレイヤーID
     * @param {string} userId 自分のプレイヤーID
     * @returns {number} 自分の投票権
     */
    vote(targetId, userId = "") {
        const user = this.getPlayer(userId);
        user.votingRights--;
        this.player = user;
        const target = this.getPlayer(targetId);
        if (target.effect.trunk) {
            const newTarget = this.players.find((player) => player.id === target.effect.trunk);
            newTarget?.voted.push(userId);
            this.player = new JinrouPlayer(newTarget?.id, newTarget?.name, newTarget?.roleCard, newTarget?.heroCards, newTarget?.votingRights, newTarget?.voted, newTarget?.effect);
            target.effect.trunk = "";
        }
        else {
            target.voted.push(userId);
        }
        this.player = target;
        return user.votingRights;
    }
    /**
     * 通報
     * @description 一斉投票で最多投票された人が通報されます。通報された方は役職カードを公開します。
     * @returns {JinrouPlayer} 対象のプレイヤー
     */
    report(targetId = "") {
        if (targetId === "") {
            targetId = this.players.reduce((max, player) => {
                return player.votingCount > max.votingCount ? player : max;
            }, this.players[0]).id;
        }
        const target = this.getPlayer(targetId);
        return [target];
    }
}
