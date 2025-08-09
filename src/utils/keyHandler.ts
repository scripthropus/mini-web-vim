import type { EditorState, KeyEvent } from "../types/editor";
import {
	copyLineToClipboard,
	ddCommand,
	readClipboardAndInsert,
} from "./clipboard";
import { moveCursor } from "./cursorOperations";
import {
	automaticBracketInsertion,
	autoQuotePairing,
	deleteChar,
	deleteCharAtCursor,
	insertNewLineAbove,
	insertNewLineBelow,
	insertString,
	splitAtCursor,
} from "./textOperations";

export const handleKeyEvent = async (
	e: KeyEvent,
	editorState: EditorState,
): Promise<EditorState> => {
	if (editorState.mode === "normal") {
		switch (e.key) {
			case "0": {
				const row = editorState.textState.cursor.row;
				const newCursor = { row: row, col: 0 };
				return {
					...editorState,
					textState: {
						...editorState.textState,
						cursor: newCursor,
					},
				};
			}

			case "a": {
				const newCol = Math.min(
					editorState.textState.cursor.col + 1,
					editorState.textState.buffer[editorState.textState.cursor.row].length,
				);
				return {
					...editorState,
					textState: {
						...editorState.textState,
						cursor: { ...editorState.textState.cursor, col: newCol },
					},
					mode: "insert",
				};
			}

			case "i":
				return { ...editorState, mode: "insert" };

			case "j":
				return {
					...editorState,
					textState: moveCursor(editorState.textState, "down"),
				};

			case "k":
				return {
					...editorState,
					textState: moveCursor(editorState.textState, "up"),
				};

			case "h":
				return {
					...editorState,
					textState: moveCursor(editorState.textState, "left"),
				};

			case "l":
				return {
					...editorState,
					textState: moveCursor(editorState.textState, "right"),
				};

			case "o":
				return insertNewLineBelow(editorState);

			case "x":
				return {
					...editorState,
					textState: deleteCharAtCursor(editorState.textState),
				};

			case "p":
				return readClipboardAndInsert(editorState);

			case "y":
				if (editorState.pendingOperator === "y") {
					copyLineToClipboard(editorState);
				}
				if (editorState.pendingOperator === "") {
					return { ...editorState, pendingOperator: "y" };
				}

				return { ...editorState, pendingOperator: "" };

			case "d":
				if (editorState.pendingOperator === "") {
					return { ...editorState, pendingOperator: "d" };
				}
				if (editorState.pendingOperator === "d") {
					return ddCommand(editorState);
				}
				return editorState;

			case "A": {
				const row = editorState.textState.cursor.row;
				const newCol = Math.max(0, editorState.textState.buffer[row].length);
				return {
					...editorState,
					textState: {
						...editorState.textState,
						cursor: { ...editorState.textState.cursor, col: newCol },
					},
					mode: "insert",
				};
			}

			case "G": {
				const lastRowIndex = Math.max(
					0,
					editorState.textState.buffer.length - 1,
				);
				const lastRowLength = Math.max(
					0,
					editorState.textState.buffer[lastRowIndex].length - 1,
				);
				const col = editorState.textState.cursor.col;
				const newCol = col > lastRowLength ? lastRowLength : col;
				return {
					...editorState,
					textState: {
						...editorState.textState,
						cursor: { row: lastRowIndex, col: newCol },
					},
				};
			}

			case "O":
				return insertNewLineAbove(editorState);

			default:
				return editorState;
		}
	}

	if (editorState.mode === "insert") {
		if (e.key === "Escape") {
			return { ...editorState, mode: "normal" };
		}

		if (e.key === "Enter") {
			return { ...splitAtCursor(editorState) };
		}

		if (e.key === "Backspace") {
			return {
				...editorState,
				textState: deleteChar(editorState.textState),
			};
		}

		if (e.key === "(") {
			return automaticBracketInsertion(e.key, editorState);
		}

		if (e.key === "{") {
			return automaticBracketInsertion(e.key, editorState);
		}

		if (e.key === "[") {
			return automaticBracketInsertion(e.key, editorState);
		}

		if (e.key === '"') {
			return autoQuotePairing(e.key, editorState);
		}

		if (e.key === "'") {
			return autoQuotePairing(e.key, editorState);
		}

		if (e.key.length === 1 || e.key === "Space") {
			return {
				...editorState,
				textState: insertString(e.key, editorState.textState),
			};
		}
	}

	return editorState;
};
