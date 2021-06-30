/**
 * @jest-environment jsdom
 */

import GameOfLifeGL from "../index";

it("Runs without crashing", () => {
  new GameOfLifeGL({});
});
