import { group } from "console";
import { getInput } from "../utils";
const input = getInput("./input.txt");
const sampleInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

enum HandType {
  Five = "Five of a kind",
  Four = "Four of a kind",
  Full = "Full house",
  Three = "Three of a kind",
  Two = "Two pair",
  One = "One pair",
  High = "High card",
}

interface Hand {
  hand: string;
  bid: number;
  type: HandType;
  rank: number;
}

const Part1 = () => {
  const compareTypes = (handA: Hand, handB: Hand, isPart2 = false): number => {
    let aVal = Object.values(HandType).indexOf(handA.type);
    let bVal = Object.values(HandType).indexOf(handB.type);

    for (let i = 0; i <= handA.hand.length; i++) {
      if (aVal !== bVal) {
        return aVal - bVal;
      }
      try {
        // error will be thrown if i === handA.hand.length
        aVal = getCardStatus(handA.hand[i], isPart2);
        bVal = getCardStatus(handB.hand[i], isPart2);
      } catch (e) {
        return 0;
      }
    }

    return 0;
  };

  const getHandTypeHelper = (valuesStr: string) => {
    const { Five, Four, Full, Three, Two, One, High } = HandType;

    const fourStr = JSON.stringify([4, 1]);
    const fullStr = JSON.stringify([3, 2]);
    const threeStr = JSON.stringify([3, 1, 1]);
    const twoStr = JSON.stringify([2, 2, 1]);
    const oneStr = JSON.stringify([2, 1, 1, 1]);

    switch (valuesStr) {
      case fourStr:
        return Four;
      case fullStr:
        return Full;
      case threeStr:
        return Three;
      case twoStr:
        return Two;
      case oneStr:
      default:
        return One;
    }
  };

  const logHand = (hand: Hand) => {
    console.log("Hand:", hand.hand, "->", hand.type);
  };

  const getCardStatus = (card: string, isPart2 = false) => {
    const cardValuesPart1 = [
      "A",
      "K",
      "Q",
      "J",
      "T",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
    ];

    const cardValuesPart2 = [
      "A",
      "K",
      "Q",
      "T",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "J",
    ];

    const cardValues = isPart2 ? cardValuesPart2 : cardValuesPart1;
    return cardValues.indexOf(card);
  };

  const getHandType = (hand: string): HandType => {
    const set = new Set(hand);
    const { Five, Four, Full, Three, Two, One, High } = HandType;

    if (set.size === 1) {
      return Five;
    }

    if (set.size === hand.length) {
      return High;
    }

    interface HashTable<T> {
      [key: string]: T;
    }
    const mapping = hand.split("").reduce((map: HashTable<number>, letter) => {
      const val = map[letter];
      if (!val) {
        map[letter] = 1;
      } else {
        map[letter]++;
      }
      return map;
    }, {});
    //   console.log("mappping:", mapping);

    const reverseSortedValues = Object.values(mapping).sort(
      (a: number, b: number) => b - a
    );

    const valuesStr = JSON.stringify(reverseSortedValues);

    const retval = getHandTypeHelper(valuesStr);
    //   console.log("freq: ", reverseSortedValues, "->", retval);
    //   console.log("Hand:", hand, "->", retval);
    return retval;
  };

  const getSampleAnswer = () => {
    const sampleLines = sampleInput.split("\n");
    let sampleHands = sampleLines.map((line) => {
      const [hand, bid] = line.split(" ");
      return {
        bid: +bid,
        hand,
        rank: -1,
        type: getHandType(hand),
      } as Hand;
    });

    const sampleSorted = sampleHands.sort((a, b) => compareTypes(a, b));
    sampleSorted.forEach((h, index) => {
      h.rank = sampleSorted.length - index;
      //   logHand(h);
    });
    // console.log(sorted);

    const sampleWinnings = sampleSorted.reduce((prev, currentHand) => {
      const { bid, rank } = currentHand;
      return prev + bid * rank;
    }, 0);

    return sampleWinnings;
    // console.log(lines);
    // console.log(hands);
  };

  const createHand = (line: string): Hand => {
    const [hand, bid] = line.split(" ");
    return {
      bid: +bid,
      hand,
      rank: -1,
      type: getHandType(hand),
    } as Hand;
  };

  const assignRank = (hand: Hand, rank: number): Hand => {
    return { ...hand, rank };
  };

  const getAnswer = (input: string[]) => {
    const lines = input;
    let hands = lines.map((line) => createHand(line));

    const sortedHandsBigFirst = hands.sort((a, b) => compareTypes(a, b));
    const handsWithRankAssigned = sortedHandsBigFirst.map((h, index) =>
      assignRank(h, sortedHandsBigFirst.length - index)
    );

    const winnings = handsWithRankAssigned.reduce((prev, currentHand) => {
      const { bid, rank } = currentHand;
      return prev + bid * rank;
    }, 0);

    return winnings;
    // console.log(lines);
    // console.log(hands);
  };

  const answer = getAnswer(input);

  return {
    answer,
    getSampleAnswer,
    createHand,
    assignRank,
    compareTypes,
    getHandType,
    logHand,
  };
};
console.log(Part1().answer);
// const part1Answer = Part1().answer;
// const phrase = part1Answer <= 252293176 ? " (too low)" : " possibly correct";
// console.log(part1Answer + phrase);
// const Part2 = () => {
//   const { assignRank, compareTypes, createHand, getHandType, logHand } =
//     Part1();

//   const upgradeHandType = (handObj: Hand): Hand => {
//     const { hand } = handObj;
//     const currentHandType = getHandType(hand);
//     const numberOfJokers = hand
//       .split("")
//       .filter((letter) => letter === "J").length;

//     const handTypeIndex = Object.values(HandType).indexOf(currentHandType);

//     const newHandTypeIndex = Math.max(handTypeIndex - numberOfJokers, 0);
//     const upgradedHandType = Object.values(HandType)[
//       newHandTypeIndex
//     ] as HandType;

//     // if (numberOfJokers > handTypeIndex || !upgradedHandType) {
//     //   console.log(hand);
//     //   console.log(
//     //     "currentHandType: ->",
//     //     currentHandType,
//     //     // "hand: ",
//     //     // hand,
//     //     // "handTypeIndex:",
//     //     // handTypeIndex,
//     //     "<-numberOfJokers: ->",
//     //     numberOfJokers,
//     //     "<-newHandType:",
//     //     upgradedHandType,
//     //     "newHandTypeIndex: ->",
//     //     newHandTypeIndex
//     //   );
//     // }

//     return { ...handObj, type: upgradedHandType };
//   };

//   const getAnswer = (input: string[]) => {
//     const lines = input;
//     let hands = lines.map((line) => createHand(line));

//     const sortedHandsBigFirst = hands.sort((a, b) => compareTypes(a, b));
//     const handsWithRankAssigned = sortedHandsBigFirst.map((h, index) =>
//       assignRank(h, sortedHandsBigFirst.length - index)
//     );
//     // upgrade types
//     const updatedWithJokerVals = hands.map((h) => upgradeHandType(h));
//     const sortedNew = updatedWithJokerVals.sort((a, b) =>
//       compareTypes(a, b, true)
//     );
//     const sortedNewRanked = sortedNew.map((h, i) =>
//       assignRank(h, sortedNew.length - i)
//     );

//     sortedNew.forEach((h) => logHand(h));
//     const winnings = sortedNewRanked.reduce((prev, currentHand) => {
//       const { bid, rank } = currentHand;
//       return prev + bid * rank;
//     }, 0);

//     return winnings;
//     // console.log(lines);
//     // console.log(hands);
//   };

//   return { getAnswer };
// };

// console.log(Part2().getAnswer(input));
