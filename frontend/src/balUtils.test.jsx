import { describe, it, expect } from "vitest";
import {
  numberArrayToStringArray,
  stringArrayToNumberArray,
  checkFalling,
  moveLeft,
  moveRight,
  jump,
  jumpLeft,
  jumpRight,
  getGameInfo
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

  // ***** JUMP *****

  let input6a = [
    [1, 1, 1, 1, 1],
    [1, 0, 3, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput6a = [
    [1, 1, 1, 1, 1],
    [1, 0, 3, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info6a = jump(input6a, 2, 3);
  it("jump A", () => {
    expect(JSON.stringify(input6a)).toBe(JSON.stringify(expectedOutput6a));
  });
  it("jump A eating", () => {
    expect(info6a.eating).toBe(false);
  });
  it("jump A player", () => {
    expect(info6a.player).toBe(true);
  });

  let input6b = [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 3, 0, 1],
    [1, 0, 2, 4, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput6b = [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 0, 0, 4, 1],
    [1, 1, 1, 1, 1],
  ];
  let info6b = jump(input6b, 2, 3);
  it("jump B", () => {
    expect(JSON.stringify(input6b)).toBe(JSON.stringify(expectedOutput6b));
  });
  it("jump B eating", () => {
    expect(info6b.eating).toBe(true);
  });
  it("jump B player", () => {
    expect(info6b.player).toBe(true);
  });

  let input6c = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 3, 1],
    [1, 2, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput6c = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 3, 1],
    [1, 2, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info6c = jump(input6c, 1, 3);
  it("jump C", () => {
    expect(JSON.stringify(input6c)).toBe(JSON.stringify(expectedOutput6c));
  });
  it("jump C eating", () => {
    expect(info6c.eating).toBe(false);
  });
  it("jump C player", () => {
    expect(info6c.player).toBe(false);
  });

  let input7a = [
    [1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput7a = [
    [1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1],
    [1, 2, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info7a = jumpLeft(input7a, 2, 3);
  it("jumpLeft A", () => {
    expect(JSON.stringify(input7a)).toBe(JSON.stringify(expectedOutput7a));
  });
  it("jumpLeft A eating", () => {
    expect(info7a.eating).toBe(false);
  });
  it("jumpLeft A player", () => {
    expect(info7a.player).toBe(true);
  });

  let input7b = [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 3, 0, 0, 1],
    [1, 0, 2, 4, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput7b = [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 2, 0, 0, 1],
    [1, 0, 0, 4, 1],
    [1, 1, 1, 1, 1],
  ];
  let info7b = jumpLeft(input7b, 2, 3);
  it("jumpLeft B", () => {
    expect(JSON.stringify(input7b)).toBe(JSON.stringify(expectedOutput7b));
  });
  it("jumpLeft B eating", () => {
    expect(info7b.eating).toBe(true);
  });
  it("jumpLeft B player", () => {
    expect(info7b.player).toBe(true);
  });

  let input7c = [
    [1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 2, 4, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput7c = [
    [1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1],
    [1, 2, 0, 0, 1],
    [1, 1, 0, 4, 1],
    [1, 1, 1, 1, 1],
  ];
  let info7c = jumpLeft(input7c, 2, 3);
  it("jumpLeft C", () => {
    expect(JSON.stringify(input7c)).toBe(JSON.stringify(expectedOutput7c));
  });
  it("jumpLeft C eating", () => {
    expect(info7c.eating).toBe(false);
  });
  it("jumpLeft C player", () => {
    expect(info7c.player).toBe(true);
  });

  let input7d = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput7d = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info7d = jumpLeft(input7d, 2, 3);
  it("jumpLeft D", () => {
    expect(JSON.stringify(input7d)).toBe(JSON.stringify(expectedOutput7d));
  });
  it("jumpLeft D eating", () => {
    expect(info7d.eating).toBe(false);
  });
  it("jumpLeft D player", () => {
    expect(info7d.player).toBe(false);
  });

  let input7e = [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput7e = [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info7e = jumpLeft(input7e, 2, 3);
  it("jumpLeft E", () => {
    expect(JSON.stringify(input7e)).toBe(JSON.stringify(expectedOutput7e));
  });
  it("jumpLeft E eating", () => {
    expect(info7e.eating).toBe(false);
  });
  it("jumpLeft E player", () => {
    expect(info7e.player).toBe(false);
  });

  let input8a = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput8a = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 0, 0, 2, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info8a = jumpRight(input8a, 2, 3);
  it("jumpRight A", () => {
    expect(JSON.stringify(input8a)).toBe(JSON.stringify(expectedOutput8a));
  });
  it("jumpRight A eating", () => {
    expect(info8a.eating).toBe(false);
  });
  it("jumpRight A player", () => {
    expect(info8a.player).toBe(true);
  });

  let input8b = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 4, 2, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput8b = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 2, 1],
    [1, 4, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];
  let info8b = jumpRight(input8b, 2, 3);
  it("jumpRight B", () => {
    expect(JSON.stringify(input8b)).toBe(JSON.stringify(expectedOutput8b));
  });
  it("jumpRight B eating", () => {
    expect(info8b.eating).toBe(true);
  });
  it("jumpRight B player", () => {
    expect(info8b.player).toBe(true);
  });

  let input8c = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 0, 0, 0, 1],
    [1, 4, 2, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput8c = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1],
    [1, 0, 0, 2, 1],
    [1, 4, 0, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  let info8c = jumpRight(input8c, 2, 3);
  it("jumpRight C", () => {
    expect(JSON.stringify(input8c)).toBe(JSON.stringify(expectedOutput8c));
  });
  it("jumpRight C eating", () => {
    expect(info8c.eating).toBe(false);
  });
  it("jumpRight C player", () => {
    expect(info8c.player).toBe(true);
  });

  let input8d = [
    [1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 2, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput8d = [
    [1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 2, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  let info8d = jumpRight(input8d, 2, 3);
  it("jumpRight D", () => {
    expect(JSON.stringify(input8d)).toBe(JSON.stringify(expectedOutput8d));
  });
  it("jumpRight D eating", () => {
    expect(info8d.eating).toBe(false);
  });
  it("jumpRight D player", () => {
    expect(info8d.player).toBe(false);
  });

  let input8e = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 2, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  let expectedOutput8e = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 2, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  let info8e = jumpRight(input8e, 2, 3);
  it("jumpRight E", () => {
    expect(JSON.stringify(input8e)).toBe(JSON.stringify(expectedOutput8e));
  });
  it("jumpRight E eating", () => {
    expect(info8e.eating).toBe(false);
  });
  it("jumpRight E player", () => {
    expect(info8e.player).toBe(false);
  });

});
