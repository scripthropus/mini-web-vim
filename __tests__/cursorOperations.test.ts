import { test, expect } from "vitest";
import { moveCursor } from "../src/utils/cursorOperations.ts";
import { TextState } from "../src/types/editor";

test("上に移動", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 0}
  };
  const {buffer, cursor} = state;
  const expected: TextState = {...state, cursor: {...cursor, row: cursor.row -1}};
  expect(moveCursor(state, "up")).toStrictEqual(expected);
});

test("一番上では上に移動できない", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 0, col: 0}
  };
  expect(moveCursor(state, "up")).toStrictEqual(state);
});

test("下に動", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 0}
  };
  const {buffer, cursor} = state;
  const expected: TextState = {...state, cursor: {...cursor, row: cursor.row +1}};
  expect(moveCursor(state, "down")).toStrictEqual(expected);
});

test("一番下は下に移動できない", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 2, col: 0}
  };
  expect(moveCursor(state, "down")).toStrictEqual(state);
});

test("左に移動", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 1}
  };
  const {buffer, cursor} = state;
  const expected: TextState = {...state, cursor: {...cursor, col: cursor.col -1}};
  expect(moveCursor(state, "left")).toStrictEqual(expected);
});

test("一番左は左に移動できない", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 0}
  };
  expect(moveCursor(state, "left")).toStrictEqual(state);
});

test("右移動", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 1}
  };
  const {buffer, cursor} = state;
  const expected: TextState = {...state, cursor: {...cursor, col: cursor.col +1}};
  expect(moveCursor(state, "right")).toStrictEqual(expected);
});

test("一番右は右に移動できない", () => {
  const state: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 4}
  };
  expect(moveCursor(state, "right")).toStrictEqual(state);
});