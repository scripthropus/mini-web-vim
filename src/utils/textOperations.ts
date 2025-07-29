import type { EditorState, TextState } from "../types/editor";

export const insertChar = (char: string, textState: TextState): TextState => {
	const { buffer, cursor } = textState;
	const currentLine = buffer[cursor.row];
	const left = currentLine.slice(0, cursor.col);
	const right = currentLine.slice(cursor.col);
	const newLine = left + char + right;

	const newBuffer = [...buffer];
	newBuffer[cursor.row] = newLine;

	return { buffer: newBuffer, cursor: { ...cursor, col: cursor.col + 1 } };
};

export const insertString = (str: string, textState: TextState): TextState => {
	const { buffer, cursor } = textState;
	const currentLine = buffer[cursor.row];
	const left = currentLine.slice(0, cursor.col);
	const right = currentLine.slice(cursor.col);
	const newLine = left + str + right;

	const newBuffer = [...buffer];
	newBuffer[cursor.row] = newLine;

	return {
		buffer: newBuffer,
		cursor: { ...cursor, col: cursor.col + str.length },
	};
};

export const deleteChar = (textState: TextState): TextState => {
	const { buffer, cursor } = textState;
	const currentLine = buffer[cursor.row];
	if (cursor.col > 1) {
		const left = currentLine.slice(0, Math.max(0, cursor.col - 1));
		const right = currentLine.slice(cursor.col);
		const newLine = left + right;

		const newBuffer = [...buffer];
		newBuffer[cursor.row] = newLine;

		return { buffer: newBuffer, cursor: { ...cursor, col: cursor.col - 1 } };
	} else {
		const { buffer, cursor } = textState;
		const newLine = currentLine.slice(cursor.col);
		const newBuffer = [...buffer];
		newBuffer[cursor.row] = newLine;

		return { buffer: newBuffer, cursor: { ...cursor, col: 0 } };
	}
};

export const deleteCharAtCursor = (textState: TextState): TextState => {
	const { buffer, cursor } = textState;
	const currentLine = buffer[cursor.row];

	if (cursor.col >= currentLine.length || cursor.col < 0) {
		return textState;
	}

	const left = currentLine.slice(0, cursor.col);
	const right = currentLine.slice(cursor.col + 1);
	const newLine = left + right;

	const newBuffer = [...buffer];
	newBuffer[cursor.row] = newLine;

	const col = cursor.col === newLine.length ? cursor.col - 1 : cursor.col;

	return {
		...textState,
		buffer: newBuffer,
		cursor: { ...cursor, col: Math.max(0, col) },
	};
};

export const insertNewLineBelow = (editorState: EditorState): EditorState => {
	const { textState, pendingOperator, operatorCount } = editorState;
	const { buffer, cursor } = textState;
	const newBuffer = buffer.toSpliced(cursor.row + 1, 0, "");
	const newCursor = { row: cursor.row + 1, col: 0 };

	return {
		textState: { buffer: newBuffer, cursor: newCursor },
		pendingOperator: pendingOperator,
		operatorCount: operatorCount,
		mode: "insert",
	};
};

export const insertNewLineAbove = (editorState: EditorState): EditorState => {
	const { textState, pendingOperator, operatorCount } = editorState;
	const { buffer, cursor } = textState;
	const newBuffer = buffer.toSpliced(cursor.row, 0, "");
	const newCursor = { row: cursor.row, col: 0 };

	return {
		textState: { buffer: newBuffer, cursor: newCursor },
		pendingOperator: pendingOperator,
		operatorCount: operatorCount,
		mode: "insert",
	};
};
