import type { CursorPosition, EditorState, TextState } from "../types/editor";

export const insertChar = (
	str: string,
	char: string,
	cursor: CursorPosition,
) => {
	const left = str.slice(0, cursor.col);
	const right = str.slice(cursor.col);

	return left + char + right;
};

export const deleteChar = (str: string, cursor: CursorPosition) => {
	const left = str.slice(0, cursor.col - 1);
	const right = str.slice(cursor.col);

	return left + right;
};

export const insertNewLineBelow = (textState: TextState): EditorState => {
	const { buffer, cursor } = textState;
	const newBuffer = buffer.toSpliced(cursor.row + 1, 0, "");
	const newCursor = { row: cursor.row + 1, col: 0 };

	return {
		textState: { buffer: newBuffer, cursor: newCursor },
		mode: "insert",
	};
};
