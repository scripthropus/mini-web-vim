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

const initialState: EditorState = {
  textState: textState,
  mode: "normal"
};

test('i キーでinsert modeに切り替わる', () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "i"});
  expect(handleKeyEvent(keyEvent, textState, "normal")).toStrictEqual({...initialState, mode: "insert"});
});


test('j キーで下に移動', () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "j"});
  
  expect(handleKeyEvent(keyEvent, textState, "normal").textState.cursor.row).toBe(2);
});

test('k キーで上に移動', () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "k"});
  
  expect(handleKeyEvent(keyEvent, textState, "normal").textState.cursor.row).toBe(0);
});

test('h キーで左に移動', () => {
  const keyEvent = new KeyboardEvent("keydown", { key: "h"});
  
  expect(handleKeyEvent(keyEvent, textState, "normal").textState.cursor.col).toBe(0);
});

test('l キーで右に移動', () => {
  const keyEvent = new KeyboardEvent("keydown", {key: "l"});
  
  expect(handleKeyEvent(keyEvent, textState, "normal").textState.cursor.col).toBe(2);
});

test('無効なキーでは何も変わらない', () => {
  const keyEvent = new KeyboardEvent("keydown", { key: ""});
  
  expect(handleKeyEvent(keyEvent, textState, "normal")).toStrictEqual(initialState);
});
