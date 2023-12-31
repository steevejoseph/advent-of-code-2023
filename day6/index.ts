// formula: distance = speed * time
// d = (x) * ((initialRemaningTime) - (x))
// d = (x * initialRemaningTime) - (x²)
// where 0 <= x <= initialRemainingTime
// Core of algo depends on finding x that leads to  a distance d that is geater than recordDistance
// const initialRemainingTime = 7;
// const recordDistance = 9;
// const multiplier = 0;

import { getInput } from "../utils";

const lines = getInput("input.txt");

interface Race {
  raceIndex: number;
  raceDuration: number;
  recordDistance: number;
}
let races: Race[] = [];

const getNumberOfWaysToWinRace = (
  initialRemainingTime: number,
  recordDistance: number
): number => {
  let winningDistances: number[] = [];
  for (let i = 0; i < initialRemainingTime; i++) {
    const distanceForRace = initialRemainingTime * i - Math.pow(i, 2);
    const distanceBeatsRecord = distanceForRace > recordDistance;

    if (distanceBeatsRecord) {
      winningDistances.push(distanceForRace);
      //   console.log(distanceForRace);
    }
  }
  return winningDistances.length;
};

const logRace = (race: Race) => {
  console.log(
    "race: ",
    race,
    " -> ",
    getNumberOfWaysToWinRace(race.raceDuration, race.recordDistance)
  );
};

const Part1 = () => {
  const [raceDurations, recordDistances] = lines.map((line: string) => {
    return line
      .split(": ")[1] // get the numbers after the colon (as string logline)
      .split(/\s+/) // get an array of numbers from the string version
      .filter((ele) => ele.length > 0); // filter out any whitespace
  });

  for (let index = 0; index < raceDurations.length; index++) {
    races.push({
      raceIndex: index,
      raceDuration: +raceDurations[index],
      recordDistance: +recordDistances[index],
    });
  }

  let waysToWin: number[] = [];

  races.forEach((race) => {
    // logRace(race);
    waysToWin.push(
      getNumberOfWaysToWinRace(race.raceDuration, race.recordDistance)
    );
  });

  const answer = waysToWin.reduce((prev, cur) => prev * cur, 1);
  return { answer };
};
console.log(Part1().answer);

const Part2 = () => {
  const [raceDuration, recordDistance] = lines.map((line: string) => {
    return line
      .split(": ")[1] // get the numbers after the colon (as string logline)
      .replace(/\s+/g, ""); // mash the digits together
  });

  const race: Race = {
    raceIndex: 0,
    raceDuration: +raceDuration,
    recordDistance: +recordDistance,
  };

  const answer = getNumberOfWaysToWinRace(
    race.raceDuration,
    race.recordDistance
  );
  return { answer };
};

console.log(Part2().answer);
