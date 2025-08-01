import {test, expect, vi } from 'vitest';
import { handleKeyEvent } from '../src/utils/keyHandler';
import type { TextState, EditorState, CursorPosition  } from '../src/types/editor';

const mockKeyboardEvent = vi.fn().mockImplementation((type, options) => ({
  type,
  key: options?.key || '',
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
}));

global.KeyboardEvent = mockKeyboardEvent as any;

const textState: TextState = {
  buffer: ["line1", "line2", "line3"],
  cursor: { row: 1, col: 1}
};

const editorState: EditorState = {
  textState: textState,
  pendingOperator: "",
  operatorCount: 1,
  mode: "normal"
};

test("0キーで行頭へ移動する", async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "0"});
  const cursor: CursorPosition = {
    row: editorState.textState.cursor.row,
    col: 0,
  };
  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual({...editorState, textState: {...editorState.textState, cursor: cursor}});
})

test('i キーでinsert modeに切り替わる', async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "i"});
  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual({...editorState, mode: "insert"});
});

test('a キーでカーソルの後ろでinsert modeに切り替わる', async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "a"});
  const expected: EditorState = {
    ...editorState,
    textState:{
      buffer: ["line1", "line2", "line3"],
      cursor: { row: 1, col: 2}
    },
    mode: "insert"
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual(expected);
});

test('A キーで行末でinsert modeに切り替わる', async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "A"});
  const expected: EditorState = {
    ...editorState,
    textState:{
      buffer: ["line1", "line2", "line3"],
      cursor: { row: 1, col: 5}
    },
    mode: "insert"
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual(expected);
});


test('j キーで下に移動', async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "j"});
  const result = await handleKeyEvent(keyEvent, editorState);
  
  expect(result.textState.cursor.row).toBe(2);
});

test('k キーで上に移動', async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "k"});
  const result = await handleKeyEvent(keyEvent, editorState); 
  
  expect(result.textState.cursor.row).toBe(0);
});

test('h キーで左に移動', async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "h"});
  const result = await handleKeyEvent(keyEvent, editorState); 
  
  expect(result.textState.cursor.col).toBe(0);
});

test('l キーで右に移動', async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "l"});
  const result = await handleKeyEvent(keyEvent, editorState);
  
  expect(result.textState.cursor.col).toBe(2);
});

test("o キーで下に行を挿入してinsertモードになる", async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "o"});

  const expected: EditorState = {  
    textState:{
      buffer: ["line1", "line2", "", "line3"],
      cursor: { row: 2, col: 0}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "insert"
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual(expected);
});

test("大文字の O キーで上に行を挿入してinsertモードになる", async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "O"});

  const expected: EditorState = {  
    textState:{
      buffer: ["line1", "", "line2", "line3"],
      cursor: { row: 1, col: 0}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "insert"
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual(expected);
});

test("Gキーで行末へ移動", async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "G"});
  const cursor: CursorPosition = {
    row: 2,
    col: 1
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual({ ...editorState, textState: { ...editorState.textState, cursor: cursor}});
});

test("Gキーでカーソル位置よりも，最終行が短い場合は最終行の行末末へ移動", async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "G"});

  const editorState: EditorState = {
    textState:{
      buffer: ["line1", "line2-line2", "line3"],
      cursor: { row: 1, col: 10}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal"
  };

  const expected: EditorState = {  
    textState:{
      buffer: ["line1", "line2-line2", "line3"],
      cursor: { row: 2, col: 4}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal"
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual(expected);
});

test("Gキーでカーソル位置よりも，最終行が長い場合は最終行のカーソルの位置へ移動", async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "G"});

  const editorState: EditorState = {
    textState:{
      buffer: ["line1", "line2", "line3-line3"],
      cursor: { row: 1, col: 4}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal"
  };

  const expected: EditorState = {  
    textState:{
      buffer: ["line1", "line2", "line3-line3"],
      cursor: { row: 2, col: 4}
    },
    pendingOperator: "",
    operatorCount: 1,
    mode: "normal"
  };

  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual(expected);
});

test('無効なキーでは何も変わらない', async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: ""});
  const result = await handleKeyEvent(keyEvent, editorState);
  
  expect(result).toStrictEqual(editorState);
});
