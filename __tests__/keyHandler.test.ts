import {test, expect, vi } from 'vitest';
import { handleKeyEvent } from '../src/utils/keyHandler';
import type { TextState, EditorState } from '../src/types/editor';

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

test('i キーでinsert modeに切り替わる', async () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "i"});
  const result = await handleKeyEvent(keyEvent, editorState);
  expect(result).toStrictEqual({...editorState, mode: "insert"});
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

test('無効なキーでは何も変わらない', async () => {
  const keyEvent = new KeyboardEvent("keydown", { key: ""});
  const result = await handleKeyEvent(keyEvent, editorState);
  
  expect(result).toStrictEqual(editorState);
});
