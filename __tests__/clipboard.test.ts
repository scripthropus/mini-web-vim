import { test, expect, vi, beforeEach } from "vitest";
import { copyLineToClipboard, ddCommand } from "../src/utils/clipboard.ts";
import { EditorState } from "../src/types/editor.ts";

const mockWriteText = vi.fn();
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: mockWriteText},
  writable: true,
});

beforeEach(() => {
  mockWriteText.mockReset();
});

test("現在行をクリップボードにコピーする", async () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["line1", "line2", "line3"],
      cursor: { row: 1, col: 1}
    },
    pendingOperator: "y",
    operatorCount: 1,
    mode: "normal",
  };

  await copyLineToClipboard(editorState);
  expect(mockWriteText).toHaveBeenCalledWith("line2");
});


test("ddコマンドで現在行が削除される",  async () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["line1", "line2", "line3"],
      cursor: { row: 2, col: 1}
    },
    pendingOperator: "d",
    operatorCount: 1,
    mode: "normal",
  };

  const expected: EditorState = {
    textState: {
     buffer: ["line1","line2"],
     cursor: { row: 1, col: 1}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal",
  };

  const result = await ddCommand(editorState);
  expect(result).toStrictEqual(expected);
});

test("ddコマンドで現在行が削除された行がクリップボードに入る",  async () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["line1", "line2", "line3"],
      cursor: { row: 2, col: 1}
    },
    pendingOperator: "d",
    operatorCount: 1,
    mode: "normal",
  };


  await ddCommand(editorState);
  expect(mockWriteText).toHaveBeenCalledWith("line3");
});

test("1行のみの場合，ddコマンドで現在行が削除された際に行数がマイナスにならず，空文字だけの行になる",  async () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["line1"],
      cursor: { row: 0, col: 1}
    },
    pendingOperator: "d",
    operatorCount: 1,
    mode: "normal",
  };

  const expected: EditorState = {
    textState: {
     buffer: [""],
     cursor: { row: 0, col: 0}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal",
  };

  const result = await ddCommand(editorState);
  expect(result).toStrictEqual(expected);
});


test("1行のみの場合，ddコマンドで現在行が削除された際に行数がマイナスにならず，空文字だけの行になる",  async () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["line1"],
      cursor: { row: 0, col: 1}
    },
    pendingOperator: "d",
    operatorCount: 1,
    mode: "normal",
  };

  const expected: EditorState = {
    textState: {
     buffer: [""],
     cursor: { row: 0, col: 0}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal",
  };

  const result = await ddCommand(editorState);
  expect(result).toStrictEqual(expected);
});

test("削除された行のcursor.colよりも，次の行の長さが小さい場合，次の行の終端にcursor.colが置かれる",  async () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["line1", "line256", "line3"],
      cursor: { row: 1, col: 7}
    },
    pendingOperator: "d",
    operatorCount: 1,
    mode: "normal",
  };

  const expected: EditorState = {
    textState: {

    buffer: ["line1", "line3"],
     cursor: { row: 1, col: 4}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal",
  };

  const result = await ddCommand(editorState);
  expect(result).toStrictEqual(expected);
});