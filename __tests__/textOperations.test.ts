import { test, expect} from "vitest";
import { insertChar} from "../src/utils/textOperations.ts";
import { CursorPosition } from "../src/types/editor.ts";

test("文字を挿入することができる", () => {
  expect(insertChar("", "a", { row: 0, col: 0})).toBe("a");
  expect(insertChar("test", "-", { row: 0, col: 3} )).toBe("tes-t");
  expect(insertChar("string", "-", { row: 0, col: 6})).toBe("string-");
})