import { describe, it, expect } from "vitest";
import { fixUserData, validateUserData } from "./utils";

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

});
