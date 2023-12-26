import { log } from "console";
import { readFileSync } from "fs";
import { wordsToNumbers } from "words-to-numbers";
import * as numbersToWords from "number-to-words";
import { type } from "os";

const isNotEmpty = (str: string): boolean => str?.length > 0;

const input = readFileSync("./input-day1.txt")
  .toLocaleString()
  .split("\n")
  .filter((line) => isNotEmpty(line));

// console.log(input);

const getLiteralNumbersFromLine = (line: string) => {
  return line.replace(/[^0-9]/gi, "");
};

const addNumbers = (numStr: string) => {
  const a = numStr[0];
  const b = numStr[numStr.length - 1];
  return +`${a}${b}`;
};

const getPart1Answer = (): number => {
  return input
    .map(getLiteralNumbersFromLine)
    .map(addNumbers)
    .reduce((prev, cur) => prev + cur, 0);
};

const MAX = 10;
const arrayOfTwoDigitWords = [...Array(MAX).keys()].map((num) =>
  numbersToWords.toWords(num)
);
//   .map((num) => num.replace("-", ""));

// for (let i = 1; i <= 9; i++) {
//   const index = i * 10;
//   const unf = wordsToNumbers(arrayOfTwoDigitWords[index]) as number;
//   const f = numbersToWords.toWords(unf / 10);
//   //   console.log(`unf: ${unf}, f: ${f}`);
//   arrayOfTwoDigitWords[index] = f;
// }
// const getDumbPro = (num: number) => {
//   console.log("in:", num);
//   const str = num.toString();
//   const a = numbersToWords.toWords(str[0]);
//   const b = numbersToWords.toWords(str[1]);
//   return a + b;
// };

// for (let i = 11; i <= MAX; i++) {
//   const unf = wordsToNumbers(arrayOfTwoDigitWords[i]) as number;
//   console.log(getDumbPro(unf));
//   arrayOfTwoDigitWords[i] = getDumbPro(unf);
// }

console.log(arrayOfTwoDigitWords);

const parseNumberFromString = (str: string) => {
  const a = arrayOfTwoDigitWords;
  let returnVal: number[] = [];

  const remaining = str.toString();

  const longRegex = a.reverse().join("|") + "|[0-9]";
  const r = new RegExp(longRegex, "g");
  //   console.log(longRegex);
  const numbersMixedForm = remaining.match(r);
  //   console.log(numbersMixedForm);

  const allNumeric = numbersMixedForm?.map((n) => {
    const castedNumber = +n;

    if (isNaN(castedNumber)) {
      return wordsToNumbers(n);
    } else if (typeof castedNumber === "number") {
      return castedNumber;
    } else {
      throw new Error("Regex parsing failed");
    }
  });

  //   console.log(allNumeric);
  return allNumeric;
};

const set = new Set(arrayOfTwoDigitWords);

// const parseNumbersFromLine = (line: string): number[] => {
//   const arr = arrayOfTwoDigitWords;
//   const splitByLiteralNumbers = line.split(/([0-9])/);
//   const removeEmpties = splitByLiteralNumbers.filter((ele) => isNotEmpty(ele));

//   //   console.log(removeEmpties);

//   return [];
// };

const getPart2Answer = () => {
  const val = input
    .map((line) => parseNumberFromString(line))
    .map((arr) => {
      if (!Array.isArray(arr)) {
        throw Error("sad");
      }
      const a = arr[0];
      const b = arr[arr.length - 1];
      const out = `${a}${b}`;
      //   console.log(+out);
      return +out;
    })
    .reduce((prev, cur) => prev + cur, 0);

  console.log(val);
};

getPart2Answer();
