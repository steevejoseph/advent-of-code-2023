import { getInput } from "../utils";
const input = getInput("./input.txt");

interface NumberObject {
  row: number;
  startIndex: number;
  endIndex: number;
  number: number;
  numberLength: number;
}

interface SymbolObject {
  row: number;
  index: number;
  symbol: string;
  touchingNumbers: number[];
}

const numberRegex = /\d+/g;
const symbolRegex = /([^.a-zA-Z0-9])/g;

const getIsInBounds = (row: number, column: number, input: string[]) => {
  if (row < 0 || row >= input[0].length) {
    return false;
  } else if (column < 0 || column >= input.length) {
    return false;
  }
  return true;
};

const Part1 = () => {
  const createNumberObject = (
    match: RegExpMatchArray,
    row: number
  ): NumberObject => {
    const startIndex = match.index || 0;
    const matchLength = match[0]?.length || 0;
    const endIndex = startIndex + matchLength;
    const number = +match[0] || 0;

    return {
      row,
      startIndex,
      endIndex,
      number,
      numberLength: matchLength,
    } as NumberObject;
  };

  const getNumberObjectFromLine = (inputString: string, row: number) => {
    return Array.from(inputString.matchAll(numberRegex), (match) =>
      createNumberObject(match, row)
    );
  };

  const getNumberObjects = (input: string[]) => {
    const numberObjects: NumberObject[] = [];
    for (let i = 0; i < input.length; i++) {
      const inputString = input[i];
      let numberObjectsFromLine = getNumberObjectFromLine(inputString, i);

      numberObjects.push(...numberObjectsFromLine);
      // matches.forEach((match) => {
      //   console.log(`Index: ${match.startIndex}, Number: ${match.number}`);
      // });
    }

    return numberObjects;
  };

  const matrix = getNumberObjects(input);
  const getIsSymbol = (candidate: string) => symbolRegex.test(candidate);

  const getIsNumberTouchingSymbol = (ele: NumberObject) => {
    const numberLeftCol = ele.startIndex - 1;
    const numberRightCol = ele.endIndex;
    const numberRow = ele.row;

    const isThereSymbolToTheLeft = getIsInBounds(
      numberRow,
      numberLeftCol,
      input
    )
      ? getIsSymbol(input[numberRow][numberLeftCol])
      : false;

    const isThereSymbolToTheRight = getIsInBounds(
      numberRow,
      numberRightCol,
      input
    )
      ? getIsSymbol(input[numberRow][numberRightCol])
      : false;

    //   const range = [...Array(ele.numberLength).keys()].map(
    //     (num) => num + ele.startIndex
    //   );

    let getRange = (start: number, end: number) =>
      Array.from(Array(end + 1).keys()).slice(start);

    const range = getRange(ele.startIndex - 1, ele.endIndex);
    //   console.log("range:", range);
    const above = range.map((item) => {
      const isInBounds = getIsInBounds(numberRow - 1, item, input);
      if (isInBounds) {
        return input[numberRow - 1][item];
      } else {
        return "";
      }
    });
    const below = range.map((item) => {
      const isInBounds = getIsInBounds(numberRow + 1, item, input);
      if (isInBounds) {
        return input[numberRow + 1][item];
      } else {
        return "";
      }
    });
    const isThereSymbolAbove = above.some((e) => getIsSymbol(e));
    const isThereSymbolBelow = below.some((e) => getIsSymbol(e));
    //   console.log(`\nabove: ${above}, isThereSymbolAbove: ${isThereSymbolAbove}`);
    //   console.log(`below: ${below}, isThereSymbolBelow: ${isThereSymbolBelow}\n`);

    return (
      isThereSymbolToTheLeft ||
      isThereSymbolToTheRight ||
      isThereSymbolAbove ||
      isThereSymbolBelow
    );
  };

  let answer = 0;
  matrix.forEach((ele) => {
    const isNumberTouchingSymbol = getIsNumberTouchingSymbol(ele);
    answer += isNumberTouchingSymbol ? ele.number : 0;
  });

  const small = matrix.splice(0, 10);

  return { answer, getNumberObjectFromLine };
};

const Part2 = () => {
  const createSymbolObject = (
    match: RegExpMatchArray,
    row: number
  ): SymbolObject => {
    const index = match.index || 0;
    const symbol = match[0] || "";
    const touchingNumbers: number[] = [];

    return {
      row,
      index,
      symbol,
      touchingNumbers,
    } as SymbolObject;
  };

  const getSymbolObjects = (input: string[]) => {
    const symbolObjects: SymbolObject[] = [];
    for (let i = 0; i < input.length; i++) {
      const inputString = input[i];
      let matches = Array.from(inputString.matchAll(symbolRegex), (match) =>
        createSymbolObject(match, i)
      );

      symbolObjects.push(...matches);
      // matches.forEach((match) => {
      //   console.log(`index: ${match.index}, symbol: ${match.symbol}`);
      // });
    }

    return symbolObjects;
  };

  const symbolObjects = getSymbolObjects(input);

  let inputString =
    "467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..";

  // Split the input string into an array of strings using the newline character
  let arrayFromString = inputString.split("\n");

  // Log the resulting array
  //   console.log(JSON.stringify(arrayFromString, null, 2));

  const exampleSymbolObjects = getSymbolObjects(arrayFromString);
  // console.log(`exampleSymbolObjects:`, exampleSymbolObjects);

  const getIsOverlapping = (
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ) => {
    return startA <= endB && startB <= endA;
  };

  const pushNumberToSymbolArray = (
    number: NumberObject,
    symbol: SymbolObject,
    direction: string
  ) => {
    //   console.log(
    //     `Adding number: ${number.number} from (${direction}) to symbol ${symbol.symbol}`
    //   );
    symbol.touchingNumbers.push(number.number);
  };

  const numberIsTouchingSymbol = (
    number: NumberObject,
    symbol: SymbolObject,
    input: string[]
  ) => {
    if (number.row === symbol.row) {
      // console.log("row:", input[number.row]);
      // console.log("number", number.number);
      // console.log("symbol", symbol);

      const isOverlapping = getIsOverlapping(
        number.startIndex - 1,
        number.endIndex,
        symbol.index,
        symbol.index
      );

      // console.log("number and symbol overlap: ", isOverlapping);

      if (isOverlapping) {
        pushNumberToSymbolArray(number, symbol, "same line");
      }
    }

    if (number.row === symbol.row - 1 || number.row === symbol.row + 1) {
      const isOverlapping = getIsOverlapping(
        number.startIndex - 1,
        number.endIndex,
        symbol.index,
        symbol.index
      );
      // console.log(
      //   `symbol: ${symbol.symbol}, number: ${number.number}, symbol.row: ${symbol.row}, number.row: ${number.row} touching: ${isOverlapping}\n`
      // );
      if (isOverlapping) {
        //   console.log(`\n<${input[symbol.row - 1]}>`);
        //   console.log(`<${input[symbol.row]}>`);
        //   console.log(`<${input[symbol.row + 1]}>\n`);
        //      console.log(
        //       `symbol: ${symbol.symbol} is touching number: ${number.number}`
        //   );

        const direction = number.row < symbol.row ? "above" : "below";
        pushNumberToSymbolArray(number, symbol, direction);
      }
    }
  };

  const getTouchingNumbers = (symbol: SymbolObject, input: string[]) => {
    const { row, index } = symbol;
    const stringAbove = getIsInBounds(row - 1, index, input)
      ? input[row - 1]
      : "";
    const stringBelow = getIsInBounds(row + 1, index, input)
      ? input[row + 1]
      : "";

    // @steevejoseph: find out why remove "" throws error
    const currentRowStr = input[row] || "";
    const stringToLeft = currentRowStr.substring(0, index);
    const stringToRight = currentRowStr.substring(index, currentRowStr.length);

    //   console.log(`above: ${stringAbove}`);
    //   console.log(`below: ${stringBelow}`);
    //   console.log(`left: ${stringToLeft}`);
    //   console.log(`right: ${stringToRight}`);

    const numbersAbove = part1.getNumberObjectFromLine(stringAbove, row - 1);
    //   numbersAbove.forEach((num) => numberIsTouchingSymbol(num, symbol, input));

    const numbersBelow = part1.getNumberObjectFromLine(stringBelow, row + 1);
    //   numbersBelow.forEach((num) => numberIsTouchingSymbol(num, symbol, input));

    const numbersRight = part1.getNumberObjectFromLine(stringToRight, row);
    const numbersLeft = part1.getNumberObjectFromLine(stringToLeft, row);
    const numbersOnSameLine = part1.getNumberObjectFromLine(currentRowStr, row);

    //   console.log(
    //     "symbol:",
    //     symbol.symbol,
    //     "numbers on same line:",
    //     numbersOnSameLine.map((m) => m.number)
    //   );

    [...numbersAbove, ...numbersBelow, ...numbersOnSameLine].forEach((num) =>
      numberIsTouchingSymbol(num, symbol, input)
    );

    //   console.log("numbersAbove: ", numbersAbove);
  };
  let exampleSum = 0;
  let realSum = 0;

  const res = exampleSymbolObjects.forEach((obj) => {
    getTouchingNumbers(obj, arrayFromString);
    const touches = obj.touchingNumbers;
    if (touches.length === 2) {
      exampleSum += touches[0] * touches[1];
    }
  });

  // getTouchingNumbers(exampleSymbolObjects[0], arrayFromString);
  // console.log(exampleSymbolObjects);
  //   console.log("sum:", exampleSum);
  const resReal = symbolObjects.forEach((obj) => {
    getTouchingNumbers(obj, input);
    const touches = obj.touchingNumbers;
    if (touches.length === 2) {
      realSum += touches[0] * touches[1];
    }
  });

  //   const sumInRange = realSum > 58032929 && realSum < 81223595;
  //   console.log(realSum, "is in range:", sumInRange);

  return { answer: realSum };
};

const part1 = Part1();
const part2 = Part2();

console.log(part1.answer);
console.log(part2.answer);
