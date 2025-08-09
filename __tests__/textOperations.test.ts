import { test, expect} from "vitest";
import { insertString, deleteCharAtCursor} from "../src/utils/textOperations.ts";
import { EditorState, TextState } from "../src/types/editor.ts";
import { ddCommand } from "../src/utils/clipboard.ts";

test("文字を挿入することができる", () => {
const textState: TextState = {
  buffer: ["line1", "line2", "line3"],
  cursor: { row: 1, col: 1}
};

  const expected: TextState = { buffer: ["line1", "laine2", "line3"],
  cursor: { row: 1, col: 2}
  }
  
  expect(insertString( "a", textState)).toStrictEqual(expected);
})

test("カーソル上の文字を消すことができる", () => {
  const textState: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 1}
  };

  const expected : TextState = {
    buffer: ["line1", "lne2", "line3"],
    cursor: { row: 1, col: 1}
  };
  expect(deleteCharAtCursor(textState)).toStrictEqual(expected);
});

test("文字を削除する際にカーソルが文字列の終端であったらカーソル位置が一つ前へ移動する", () => {
  const textState: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 4}
  };

  const expected : TextState = {
    buffer: ["line1", "line", "line3"],
    cursor: { row: 1, col: 3}
  };
  expect(deleteCharAtCursor(textState)).toStrictEqual(expected);
});