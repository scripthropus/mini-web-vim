import type {
	CursorPosition,
	EditorState,
	Mode,
	TextState,
} from "../types/editor";

export const updateCursor = (
	editorState: EditorState,
	newCursor: Partial<CursorPosition>,
): EditorState => {
	return {
		...editorState,
		textState: {
			...editorState.textState,
			cursor: { ...editorState.textState.cursor, ...newCursor },
		},
	};
};

export const updateEditorState = (
	editorState: EditorState,
	updates: { cursor?: Partial<CursorPosition>; mode?: Mode },
): EditorState => {
	return {
		...editorState,
		...(updates.mode && { mode: updates.mode }),
		textState: {
			...editorState.textState,
			...(updates.cursor && {
				cursor: { ...editorState.textState.cursor, ...updates.cursor },
			}),
		},
	};
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

export const automaticBracketInsertion = (
	bracket: string,
	editorState: EditorState,
): EditorState => {
	let rightBracket = "";
	switch (bracket) {
		case "{":
			rightBracket = "}";
			break;
		case "(":
			rightBracket = ")";
			break;
		case "[":
			rightBracket = "]";
			break;
	}

	const brackets = bracket + rightBracket;
	const textState = insertString(brackets, editorState.textState);
	const cursor = textState.cursor;
	const newEditorState: EditorState = {
		...editorState,
		textState: {
			...textState,
			cursor: {
				...cursor,
				col: cursor.col - 1,
			},
		},
	};

	return newEditorState;
};

export const autoQuotePairing = (
	quote: string,
	editorState: EditorState,
): EditorState => {
	const quotes = quote + quote;
	const textState = insertString(quotes, editorState.textState);
	const newEditorState: EditorState = {
		...editorState,
		textState: {
			...textState,
			cursor: {
				...textState.cursor,
				col: textState.cursor.col - 1,
			},
		},
	};

	return newEditorState;
};

export const splitAtCursor = (editorState: EditorState): EditorState => {
	const { buffer, cursor } = editorState.textState;
	const currentLine = buffer[cursor.row];
	const left = currentLine.slice(0, cursor.col);
	const newLine = currentLine.slice(cursor.col);

	const newBuffer = [...buffer].toSpliced(cursor.row + 1, 0, newLine);
	newBuffer[cursor.row] = left;
	const newTextState: TextState = {
		buffer: newBuffer,
		cursor: {
			row: cursor.row + 1,
			col: 0,
		},
	};

	return { ...editorState, textState: newTextState };
};

export const deleteCurrentAndNextLine = (
	editorState: EditorState,
): EditorState => {
	const { buffer, cursor } = editorState.textState;
	const row = cursor.row;
	const col = cursor.col;
	const upperRowLen = buffer[row - 1 >= 0 ? row - 1 : 0].length;
	const newCol = Math.min(upperRowLen, col);

	const len = buffer.length - 1;

	if (row < len) {
		const newBuffer = buffer.toSpliced(row, 2);
		const textState: TextState = {
			buffer: newBuffer,
			cursor: { row: row - 1, col: newCol },
		};
		const newState: EditorState = {
			...editorState,
			textState: textState,
			pendingOperator: "",
		};
		return newState;
	}
	if (row === len) {
		const newBuffer = buffer.toSpliced(row, 1);
		const textState: TextState = {
			buffer: newBuffer,
			cursor: { row: row - 1, col: newCol },
		};
		const newState: EditorState = {
			...editorState,
			textState: textState,
			pendingOperator: "",
		};
		return newState;
	}
	return editorState;
};

export const deleteCurrentAndPreviousLine = (
	editorState: EditorState,
): EditorState => {
	const { buffer, cursor } = editorState.textState;
	const row = cursor.row;
	const col = cursor.col;
	const upperRowLen = buffer[row - 1 >= 0 ? row - 1 : 0].length;
	const newCol = Math.min(upperRowLen, col);

	if (row === 0) {
		return editorState;
	}
	const newBuffer = buffer.toSpliced(row - 1, 2);
	const textState: TextState = {
		buffer: newBuffer,
		cursor: { row: row - 2, col: newCol },
	};
	const newState: EditorState = {
		...editorState,
		textState: textState,
		pendingOperator: "",
	};

	return newState;
};

export const dlCommand = (editorState: EditorState): EditorState => {
	const newState: EditorState = {
		...editorState,
		textState: deleteCharAtCursor(editorState.textState),
		pendingOperator: "",
	};

	return newState;
};

export const dhCommand = (editorState: EditorState): EditorState => {
	const cursor = editorState.textState.cursor;
	const newCursor = {
		...cursor,
		col: cursor.col - 2 >= 0 ? cursor.col - 1 : 0,
	};
	const textState: TextState = {
		...editorState.textState,
		cursor: newCursor,
	};

	const newState: EditorState = {
		...editorState,
		textState: deleteCharAtCursor(textState),
		pendingOperator: "",
	};

	return newState;
};
export const deleteToLineStart = (editorState: EditorState): EditorState => {
	return editorState;
};

export const shiftRight = (editorState: EditorState): EditorState => {
	const textState: TextState = {
		...editorState.textState,
		cursor: {
			...editorState.textState.cursor,
			col: 0,
		},
	};
	const shiftedCol = editorState.textState.cursor.col + 2;
	const newTextState = insertString("  ", textState);
	newTextState.cursor.col = shiftedCol;

	return { ...editorState, textState: newTextState, pendingOperator: "" };
};

export const shiftLeft = (editorState: EditorState): EditorState => {
	const { buffer, cursor } = editorState.textState;
	let newLine = buffer[cursor.row];
	if (buffer[cursor.row][0] === " " && buffer[cursor.row][1] === " ") {
		newLine = buffer[cursor.row].slice(2);
		buffer[cursor.row] = newLine;
		const newCursor = {
			row: cursor.row,
			col: Math.max(cursor.col - 2, 0),
		};

		return {
			...editorState,
			textState: {
				buffer: buffer,
				cursor: newCursor,
			},
			pendingOperator: "",
		};
	}

	if (buffer[cursor.row][0] === " ") {
		newLine = buffer[cursor.row].slice(1);
		buffer[cursor.row] = newLine;
		const newCursor = {
			row: cursor.row,
			col: Math.max(cursor.col - 1, 0),
		};

		return {
			...editorState,
			textState: {
				buffer: buffer,
				cursor: newCursor,
			},
			pendingOperator: "",
		};
	}
	return editorState;
};

export const moveToNextWord = (editorState: EditorState): EditorState => {
	const { textState } = editorState;
	const { buffer, cursor } = textState;

	let { row, col } = cursor;

	if (row >= buffer.length) {
		return editorState;
	}

	let currentLine = buffer[row];

	const isWordChar = (char: string): boolean => {
		return /[a-zA-Z0-9_]/.test(char);
	};

	const isWhitespace = (char: string): boolean => {
		return /\s/.test(char);
	};

	const getCharType = (char: string): "word" | "space" | "punct" => {
		if (isWordChar(char)) return "word";
		if (isWhitespace(char)) return "space";
		return "punct";
	};

	if (col >= currentLine.length) {
		if (row + 1 < buffer.length) {
			row++;
			col = 0;
			currentLine = buffer[row];

			while (col < currentLine.length && isWhitespace(currentLine[col])) {
				col++;
			}

			return updateCursor(editorState, { row, col });
		}
		return editorState;
	}

	const currentCharType = getCharType(currentLine[col]);

	while (
		col < currentLine.length &&
		getCharType(currentLine[col]) === currentCharType
	) {
		col++;
	}

	while (col < currentLine.length && isWhitespace(currentLine[col])) {
		col++;
	}

	if (col >= currentLine.length) {
		if (row + 1 < buffer.length) {
			row++;
			col = 0;
			currentLine = buffer[row];

			while (col < currentLine.length && isWhitespace(currentLine[col])) {
				col++;
			}
		} else {
			col = Math.max(0, currentLine.length - 1);
		}
	}

	return updateCursor(editorState, { row, col });
};

export const moveToPreviousWord = (editorState: EditorState): EditorState => {
	const { textState } = editorState;
	const { buffer, cursor } = textState;

	let { row, col } = cursor;

	if (row < 0 || row >= buffer.length) {
		return editorState;
	}

	let currentLine = buffer[row];

	const isWordChar = (char: string): boolean => {
		return /[a-zA-Z0-9_]/.test(char);
	};

	const isWhitespace = (char: string): boolean => {
		return /\s/.test(char);
	};

	const getCharType = (char: string): "word" | "space" | "punct" => {
		if (isWordChar(char)) return "word";
		if (isWhitespace(char)) return "space";
		return "punct";
	};

	if (col <= 0) {
		if (row - 1 >= 0) {
			row--;
			currentLine = buffer[row];
			col = currentLine.length;
		} else {
			return editorState;
		}
	}

	if (col > currentLine.length) {
		col = currentLine.length;
	}

	while (col > 0 && isWhitespace(currentLine[col - 1])) {
		col--;
	}

	if (col === 0) {
		if (row - 1 >= 0) {
			row--;
			currentLine = buffer[row];
			col = currentLine.length;

			while (col > 0 && isWhitespace(currentLine[col - 1])) {
				col--;
			}

			if (col > 0) {
				const charType = getCharType(currentLine[col - 1]);
				while (col > 0 && getCharType(currentLine[col - 1]) === charType) {
					col--;
				}
			}
		}

		return updateCursor(editorState, { row, col });
	}

	const prevCharType = getCharType(currentLine[col - 1]);

	while (col > 0 && getCharType(currentLine[col - 1]) === prevCharType) {
		col--;
	}

	return updateCursor(editorState, { row, col });
};
