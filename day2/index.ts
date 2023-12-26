import { getInput } from "../utils";
const input = getInput("./input.txt");

const colorRegex = /[0-9]+ (red|green|blue)/g;

interface ColorObj {
  red: number;
  green: number;
  blue: number;
}

type ColorKey = "red" | "green" | "blue";

const doesExceedBounds = (candidate: number, bound: number): boolean => {
  return candidate > bound;
};

const getColorsAndMagnitudes = (game: string): RegExpMatchArray => {
  return game.match(colorRegex) || ([] as unknown as RegExpMatchArray);
};

const Part1 = () => {
  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;
  const gameIdRegex = /Game ([0-9]+)/;

  const colorToMax: ColorObj = {
    red: MAX_RED,
    green: MAX_GREEN,
    blue: MAX_BLUE,
  };

  const isGamePossible = (game: string): boolean => {
    const colorsAndMagnitudes = getColorsAndMagnitudes(game);

    const areBreakingCases = colorsAndMagnitudes.some((set) => {
      const [count, color] = set.split(" ");
      const magnitude = +count;
      const colorKey = color as ColorKey;
      const maxForColor = colorToMax[colorKey];
      return doesExceedBounds(magnitude, maxForColor);
    });
    //   console.log(colorsAndMagnitudes);
    //   console.log(areBreakingCases);
    return !areBreakingCases;
  };

  const getAnswer = (): number => {
    return input
      .filter((game) => isGamePossible(game))
      .map((game) => game.match(gameIdRegex) || [])
      .map((resArr) => +resArr[1])
      .reduce((prev, cur) => prev + cur, 0);
  };

  return { getAnswer };
};

const Part2 = () => {
  const getColors = (game: string): ColorObj => {
    const colorToLocalMax: ColorObj = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const colorToMin: ColorObj = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const colorsAndMagnitudes = getColorsAndMagnitudes(game);
    colorsAndMagnitudes.forEach((set) => {
      const [count, color] = set.split(" ");
      const colorKey = color as "red" | "green" | "blue";
      const magnitude = +count;
      const localMaxForColor = colorToLocalMax[colorKey];

      if (doesExceedBounds(magnitude, localMaxForColor)) {
        colorToLocalMax[colorKey] = magnitude;
        colorToMin[colorKey] = magnitude;
      }

      // console.log(`color: ${color}, magnitude: ${magnitude}`);
    });

    //   console.log(`mincolors:`, colorToMin);

    return colorToMin;
  };

  const getPower = (colorObj: ColorObj): number => {
    const { red, blue, green } = colorObj;
    return red * green * blue;
  };

  const getAnswer = (): number => {
    return input
      .map((game) => getColors(game))
      .map((obj) => getPower(obj))
      .reduce((prev, cur) => prev + cur, 0);
  };
  return { getAnswer };
};

console.log(Part1().getAnswer());
console.log(Part2().getAnswer());
