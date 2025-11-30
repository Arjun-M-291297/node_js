const sumNums = require("./index");
describe("Get sum out of 2 number", () => {
  test("expected sum to be 3", () => {
    let out = sumNums(1, 2);
    expect(out).toBe(4);
  });
});
describe("Get sum out of 2 number", () => {
  test("expected sum to be 3", () => {
    let out = sumNums(2, 2);
    expect(out).toBe(4);
  });
});
