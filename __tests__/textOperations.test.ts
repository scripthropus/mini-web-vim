import { test, expect} from "vitest";
import { insertChar} from "../src/utils/textOperations.ts";
import { CursorPosition, TextState } from "../src/types/editor.ts";




test("文字を挿入することができる", () => {
const textState: TextState = {
  buffer: ["line1", "line2", "line3"],
  cursor: { row: 1, col: 1}
};

  const expected: TextState = { buffer: ["line1", "laine2", "line3"],
  cursor: { row: 1, col: 2}
  }
  
  expect(insertChar( "a", textState)).toStrictEqual(expected);
})