import { describe, it, expect } from "vitest";
import {
  numberArrayToStringArray,
  stringArrayToNumberArray,
  checkFalling,
  moveLeft,
  moveRight
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

  let input3a = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 8, 4, 1],
    [1, 0, 0, 0, 4, 1],
    [1, 2, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput3a = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 8, 4, 1],
    [1, 2, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info3a = checkFalling(input3a);
  it("checkFalling A", () => {
    expect(JSON.stringify(input3a)).toBe(JSON.stringify(expectedOutput3a));
  });
  it("checkFalling A falling", () => {
    expect(info3a.falling).toBe(true);
  });
  it("checkFalling A player", () => {
    expect(info3a.player).toBe(false);
  });

  let input3b = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 3, 0, 1],
    [1, 4, 4, 2, 0, 1],
    [1, 0, 0, 0, 8, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput3b = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 3, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 4, 4, 2, 8, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info3b = checkFalling(input3b);
  it("checkFalling B", () => {
    expect(JSON.stringify(input3b)).toBe(JSON.stringify(expectedOutput3b));
  });
  it("checkFalling B falling", () => {
    expect(info3b.falling).toBe(true);
  });
  it("checkFalling B player", () => {
    expect(info3b.player).toBe(true);
  });

  let input3c = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 4, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput3c = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 4, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info3c = checkFalling(input3c);
  it("checkFalling C", () => {
    expect(JSON.stringify(input3c)).toBe(JSON.stringify(expectedOutput3c));
  });
  it("checkFalling C falling", () => {
    expect(info3c.falling).toBe(false);
  });
  it("checkFalling C player", () => {
    expect(info3c.player).toBe(false);
  });

  let input4a = [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput4a = [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info4a = moveLeft(input4a, 1, 1);
  it("moveLeft A", () => {
    expect(JSON.stringify(input4a)).toBe(JSON.stringify(expectedOutput4a));
  });
  it("moveLeft A eating", () => {
    expect(info4a.eating).toBe(false);
  });
  it("moveLeft A player", () => {
    expect(info4a.player).toBe(false);
  });

  let input4b = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 2, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput4b = [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info4b = moveLeft(input4b, 2, 1);
  it("moveLeft B", () => {
    expect(JSON.stringify(input4b)).toBe(JSON.stringify(expectedOutput4b));
  });
  it("moveLeft B eating", () => {
    expect(info4b.eating).toBe(false);
  });
  it("moveLeft B player", () => {
    expect(info4b.player).toBe(true);
  });

  let input4c = [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 2, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput4c = [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info4c = moveLeft(input4c, 2, 1);
  it("moveLeft C", () => {
    expect(JSON.stringify(input4c)).toBe(JSON.stringify(expectedOutput4c));
  });
  it("moveLeft C eating", () => {
    expect(info4c.eating).toBe(true);
  });
  it("moveLeft C player", () => {
    expect(info4c.player).toBe(true);
  });

  let input4d = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 4, 2, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput4d = [
    [1, 1, 1, 1, 1, 1],
    [1, 4, 4, 2, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info4d = moveLeft(input4d, 4, 1);
  it("moveLeft D", () => {
    expect(JSON.stringify(input4d)).toBe(JSON.stringify(expectedOutput4d));
  });
  it("moveLeft D eating", () => {
    expect(info4d.eating).toBe(false);
  });
  it("moveLeft D player", () => {
    expect(info4d.player).toBe(true);
  });

  let input4e = [
    [1, 1, 1, 1, 1, 1],
    [1, 4, 4, 2, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput4e = [
    [1, 1, 1, 1, 1, 1],
    [1, 4, 4, 2, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info4e = moveLeft(input4e, 3, 1);
  it("moveLeft E", () => {
    expect(JSON.stringify(input4e)).toBe(JSON.stringify(expectedOutput4e));
  });
  it("moveLeft E eating", () => {
    expect(info4e.eating).toBe(false);
  });
  it("moveLeft E player", () => {
    expect(info4e.player).toBe(false);
  });

  let input4f = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 4, 4, 4, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput4f = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 4, 4, 4, 2, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  let info4f = moveLeft(input4f, 5, 1);
  it("moveLeft F", () => {
    expect(JSON.stringify(input4f)).toBe(JSON.stringify(expectedOutput4f));
  });
  it("moveLeft F eating", () => {
    expect(info4f.eating).toBe(false);
  });
  it("moveLeft F player", () => {
    expect(info4f.player).toBe(false);
  });

  let input5a = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 0, 2, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput5a = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 0, 2, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info5a = moveRight(input5a, 4, 1);
  it("moveRight A", () => {
    expect(JSON.stringify(input5a)).toBe(JSON.stringify(expectedOutput5a));
  });
  it("moveRight A eating", () => {
    expect(info5a.eating).toBe(false);
  });
  it("moveRight A player", () => {
    expect(info5a.player).toBe(false);
  });

  let input5b = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 2, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput5b = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 0, 2, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info5b = moveRight(input5b, 3, 1);
  it("moveRight B", () => {
    expect(JSON.stringify(input5b)).toBe(JSON.stringify(expectedOutput5b));
  });
  it("moveRight B eating", () => {
    expect(info5b.eating).toBe(false);
  });
  it("moveRight B player", () => {
    expect(info5b.player).toBe(true);
  });

  let input5c = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 2, 3, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput5c = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 4, 0, 2, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info5c = moveRight(input5c, 3, 1);
  it("moveRight C", () => {
    expect(JSON.stringify(input5c)).toBe(JSON.stringify(expectedOutput5c));
  });
  it("moveRight C eating", () => {
    expect(info5c.eating).toBe(true);
  });
  it("moveRight C player", () => {
    expect(info5c.player).toBe(true);
  });

  let input5d = [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 4, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput5d = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 2, 4, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info5d = moveRight(input5d, 1, 1);
  it("moveRight D", () => {
    expect(JSON.stringify(input5d)).toBe(JSON.stringify(expectedOutput5d));
  });
  it("moveRight D eating", () => {
    expect(info5d.eating).toBe(false);
  });
  it("moveRight D player", () => {
    expect(info5d.player).toBe(true);
  });

  let input5e = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 2, 4, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput5e = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 2, 4, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ];
  let info5e = moveRight(input5e, 2, 1);
  it("moveRight E", () => {
    expect(JSON.stringify(input5e)).toBe(JSON.stringify(expectedOutput5e));
  });
  it("moveRight E eating", () => {
    expect(info5e.eating).toBe(false);
  });
  it("moveRight E player", () => {
    expect(info5e.player).toBe(false);
  });

  let input5f = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 4, 4, 4, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  let expectedOutput5f = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 4, 4, 4, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  let info5f = moveRight(input5f, 1, 1);
  it("moveRight F", () => {
    expect(JSON.stringify(input5f)).toBe(JSON.stringify(expectedOutput5f));
  });
  it("moveRight F eating", () => {
    expect(info5f.eating).toBe(false);
  });
  it("moveRight F player", () => {
    expect(info5f.player).toBe(false);
  });











});
