import type { CursorPosition, EditorState } from "../types/editor";
import { insertString } from "./textOperations";

export const readClipboardAndInsert = async (
	editorState: EditorState,
): Promise<EditorState> => {
	try {
		const text = await navigator.clipboard.readText();
		const textState = insertString(text, editorState.textState);
		return { ...editorState, textState: textState };
	} catch (e) {
		console.error("クリップボードの読み取りに失敗:", e);
	}
	return editorState;
};

export const copyLineToClipboard = async (editorState: EditorState) => {
	try {
		const cursorRow = editorState.textState.cursor.row;
		const line = editorState.textState.buffer[cursorRow];
		await navigator.clipboard.writeText(line);
	} catch (e) {
		console.error("クリップボードへの書き込みに失敗:", e);
	}
};

export const ddCommand = async (
	editorState: EditorState,
): Promise<EditorState> => {
	await copyLineToClipboard(editorState);
	const { buffer, cursor } = editorState.textState;
	const filteredBuffer = buffer.filter((_, idx) => idx !== cursor.row);
	const newBuffer = filteredBuffer.length === 0 ? [""] : filteredBuffer;
	const newCursorRow = Math.max(
		0,
		buffer.length - 1 === cursor.row ? cursor.row - 1 : cursor.row,
	);
	const newCursorCol =
		buffer[cursor.row].length > newBuffer[newCursorRow].length
			? Math.max(0, newBuffer[newCursorRow].length - 1)
			: cursor.col;
	const newCursor: CursorPosition = { row: newCursorRow, col: newCursorCol };
	const newState: EditorState = {
		textState: {
			buffer: newBuffer,
			cursor: newCursor,
		},
		pendingOperator: "",
		operatorCount: 1,
		mode: "normal",
	};

	return newState;
};
