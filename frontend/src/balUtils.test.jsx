import { describe, it, expect } from "vitest";
import {
  numberArrayToStringArray,
  stringArrayToNumberArray,
} from "./balUtils.js";

describe("balUtils", () => {
  let input1 = ["111111", "13 3 1", "1 2481", "111111"];
  let expectedOutput1 = [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 3, 0, 1],
    [1, 0, 2, 4, 8, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let output1 = stringArrayToNumberArray(input1);

  it("stringArrayToNumberArray", () => {
    expect(JSON.stringify(output1)).toBe(JSON.stringify(expectedOutput1));
  });

  let input2 = [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 3, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 2, 4, 8, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput2 = ["111111", "13 3 1", "1    1", "1 2481", "111111"];
  let output2 = numberArrayToStringArray(input2);

  it("numberArrayToStringArray", () => {
    expect(JSON.stringify(output2)).toBe(JSON.stringify(expectedOutput2));
  });
});
