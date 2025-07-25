import type { EditorState } from "../types/editor";
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
