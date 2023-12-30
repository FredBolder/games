import { describe, it, expect } from "vitest";
import { fixUserData, polar, validateUserData } from "./utils";

describe("utils", () => {

const input1 = {
  firstName: "jOhN",
  userName: " herO",
  email: "John@mail.com ",
  password: " 123",
  password2: "123",
};

const expectedOutput1 = {
  firstName: "John",
  userName: "Hero",
  email: "john@mail.com",
  password: "123",
  password2: "123",
};

fixUserData(input1);
it("fixUserData", () => {
  expect(JSON.stringify(input1)).toBe(JSON.stringify(expectedOutput1));
});

const input2 = {x: 100, y: 50};
const expectedOutput2 = {x: 150, y: 50};
const output2 = polar(input2.x, input2.y, 0, 50);
it("polar", () => {
  expect(JSON.stringify(output2)).toBe(JSON.stringify(expectedOutput2));
});

});
