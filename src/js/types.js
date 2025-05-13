"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hero = exports.Role = exports.Flow = exports.CustomId = exports.CommandName = void 0;
/**
 * プレイヤーの役職
 */
var CommandName;
(function (CommandName) {
    CommandName["Test"] = "test";
    CommandName["Show"] = "show";
    CommandName["Recruit"] = "recruit";
})(CommandName || (exports.CommandName = CommandName = {}));
/**
 * プレイヤーの役職
 */
var CustomId;
(function (CustomId) {
    CustomId["Join"] = "join";
    CustomId["Start"] = "start";
    CustomId["Watch"] = "watch";
    CustomId["Switch"] = "switch";
    CustomId["Vote"] = "vote";
})(CustomId || (exports.CustomId = CustomId = {}));
/**
 * ゲームの進行フェーズ
 */
var Flow;
(function (Flow) {
    Flow["Preparation"] = "A.\u30B2\u30FC\u30E0\u6E96\u5099";
    Flow["Night"] = "B.\u591C\u6642\u9593 \u80FD\u529B";
    Flow["Discussion"] = "C.\u663C\u6642\u9593 \u8B70\u8AD6";
    Flow["Vote"] = "D.\u6295\u7968";
    Flow["Result"] = "\u7D50\u679C/\u7D42\u4E86";
})(Flow || (exports.Flow = Flow = {}));
/**
 * プレイヤーの役職
 */
var Role;
(function (Role) {
    Role["Villager"] = "01";
    Role["Seer"] = "02";
    Role["Thief"] = "03";
    Role["Werewolf"] = "04";
})(Role || (exports.Role = Role = {}));
var Hero;
(function (Hero) {
    Hero["Ignis"] = "\u30A4\u30B0\u30CB\u30B9=\u30A6\u30A3\u30EB=\u30A6\u30A3\u30B9\u30D7";
    Hero["Pierre77"] = "\u30D4\u30A8\u30FC\u30EB 77\u4E16";
    Hero["Luluca"] = "\u9B54\u6CD5\u5C11\u5973\u30EB\u30EB\u30AB";
    Hero["Reiya"] = "\u96F6\u591C";
    Hero["MegMeg"] = "\u30E1\u30B0\u30E1\u30B0";
    Hero["Adam"] = "\u30A2\u30C0\u30E0=\u30E6\u30FC\u30EA\u30A8\u30D5";
    Hero["Maria"] = "\u30DE\u30EA\u30A2=S=\u30EC\u30AA\u30F3\u30D6\u30EB\u30AF";
    Hero["Tadaomi"] = "\u685C\u83EF \u5FE0\u81E3";
    Hero["Ririka"] = "\u9B54\u6CD5\u5C11\u5973\u30EA\u30EA\u30AB";
    Hero["Justice"] = "\u30B8\u30E3\u30B9\u30C6\u30A3\u30B9 \u30CF\u30F3\u30B3\u30C3\u30AF";
    Hero["Bugdoll"] = "Bugdoll";
    Hero["Rinne"] = "\u7CF8\u5EFB \u8F2A\u5EFB";
    Hero["Poro"] = "\u30F4\u30A3\u30FC\u30CA\u30B9 \u30DD\u30ED\u30ED\u30C3\u30C1\u30E7";
    Hero["Kirara"] = "\u8F1D\u9F8D\u9662 \u304D\u3089\u3089";
    Hero["Iztaka"] = "\u30A4\u30B9\u30BF\u30AB";
    Hero["Thirteen"] = "13 \u2020\u30B5\u30FC\u30C6\u30A3\u30FC\u30F3\u2020";
    Hero["Tesla"] = "\u30CB\u30B3\u30E9 \u30C6\u30B9\u30E9";
    Hero["Gustav"] = "\u30B0\u30B9\u30BF\u30D5 \u30CF\u30A4\u30C9\u30EA\u30D2";
    Hero["Voidoll"] = "Voidoll";
    Hero["Jeanne"] = "\u30B8\u30E3\u30F3\u30CC \u30C0\u30EB\u30AF";
    Hero["Nanigashi"] = "\u67D0 <\u306A\u306B\u304C\u3057>";
    Hero["Al"] = "\u30A2\u30EB\u30FB\u30C0\u30CF\u30D6\uFF1D\u30A2\u30EB\u30AB\u30C6\u30A3\u30A2";
    Hero["Ravi"] = "\u30E9\u30F4\u30A3\u30FB\u30B7\u30E5\u30B7\u30E5\u30DE\u30EB\u30B7\u30E5";
    Hero["GBG"] = "\u30B2\u30FC\u30E0\u30D0\u30BA\u30FC\u30AB\u30AC\u30FC\u30EB";
    Hero["Nidhogg"] = "HM-WA100 \u30CB\u30FC\u30BA\u30D8\u30C3\u30B0";
    Hero["Tomas"] = "\u30C8\u30DE\u30B9";
    Hero["Thorn"] = "\u30BD\u30FC\u30F3=\u30E6\u30FC\u30EA\u30A8\u30D5";
    Hero["Violetta"] = "\u30F4\u30A3\u30AA\u30EC\u30C3\u30BF \u30CE\u30EF\u30FC\u30EB";
    Hero["Noho"] = "\u53CC\u633D \u4E43\u4FDD";
    Hero["Atari"] = "\u5341\u6587\u5B57 \u30A2\u30BF\u30EA";
})(Hero || (exports.Hero = Hero = {}));
