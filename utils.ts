import { readFileSync } from "fs";

const isNotEmpty = (str: string): boolean => str?.length > 0;

export const getInput = (filename: string) =>
  readFileSync(filename)
    .toLocaleString()
    .split("\n")
    .filter((line) => isNotEmpty(line));
