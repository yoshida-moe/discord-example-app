// import { capitalize } from './utils.js';

// export function getResult(p1, p2) {
//   let gameResult;
//   if (RPSChoices[p1.objectName] && RPSChoices[p1.objectName][p2.objectName]) {
//     // o1 wins
//     gameResult = {
//       win: p1,
//       lose: p2,
//       verb: RPSChoices[p1.objectName][p2.objectName],
//     };
//   } else if (
//     RPSChoices[p2.objectName] &&
//     RPSChoices[p2.objectName][p1.objectName]
//   ) {
//     // o2 wins
//     gameResult = {
//       win: p2,
//       lose: p1,
//       verb: RPSChoices[p2.objectName][p1.objectName],
//     };
//   } else {
//     // tie -- win/lose don't
//     gameResult = { win: p1, lose: p2, verb: 'tie' };
//   }

//   return formatResult(gameResult);
// }

// function formatResult(result) {
//   const { win, lose, verb } = result;
//   return verb === 'tie'
//     ? `あいこ`
//     : `<@${lose.id}>の負け`;
// }

// // this is just to figure out winner + verb
// const RPSChoices = {
//   fire: {
//     tree: 'lose',
//   },
//   tree: {
//     water: 'lose',
//   },
//   water: {
//     fire: 'lose',
//   },
// };

// export function getRPSChoices() {
//   return Object.keys(RPSChoices);
// }

// // Function to fetch shuffled options for select menu
// export function getShuffledOptions() {
//   const allChoices = getRPSChoices();
//   const options = [];

//   for (let c of allChoices) {
//     // Formatted for select menus
//     // https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
//     options.push({
//       label: capitalize(c),
//       value: c.toLowerCase(),
//     });
//   }

//   return shuffle(options);
// }

export function shuffle(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
