import { getInput } from "../utils";
const input = getInput("./input.txt");
const games = input;

const numberRegex = /[0-9]+/g;

const Part1 = () => {
  const getNumericalArray = (numStr: string): number[] => {
    const stringsArr = numStr.match(numberRegex) || [];
    return stringsArr.map((ele) => +ele);
  };

  const getCardValue = (line: string) => {
    const [partBeforePipe, partAfterPipe] = line.split("|");
    const winningNumbersString = partBeforePipe.split(":")[1];
    const winningNumbers = getNumericalArray(winningNumbersString);
    const actualNumbers = getNumericalArray(partAfterPipe);
    const actualSet = new Set(actualNumbers);

    let winCount = 0;
    for (let i = 0; i < winningNumbers.length; i++) {
      const curWinningNumber = winningNumbers[i];
      if (actualSet.has(curWinningNumber)) {
        winCount++;
      }
    }

    const cardValue = winCount === 0 ? 0 : Math.pow(2, winCount - 1);
    //   console.log("Card value:", retval);
    return cardValue;
  };

  const answer = games
    .map((game) => getCardValue(game))
    .reduce((prev, cur) => prev + cur, 0);

  return { answer };
};

console.log(Part1().answer);
