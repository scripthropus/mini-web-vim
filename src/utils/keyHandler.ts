import type { EditorState, KeyEvent, Mode, TextState } from "../types/editor";
import { moveCursor } from "./cursorOperations";
import { deleteChar, insertChar } from "./textOperations";

export const handleKeyEvent = (
	e: KeyEvent,
	textState: TextState,
	mode: Mode,
): EditorState => {
	if (mode === "normal") {
		switch (e.key) {
			case "i":
				return { textState, mode: "insert" };

			case "j":
				return { textState: moveCursor(textState, "down"), mode };

			case "k":
				return { textState: moveCursor(textState, "up"), mode };

			case "h":
				return { textState: moveCursor(textState, "left"), mode };

			case "l":
				return { textState: moveCursor(textState, "right"), mode };

			default:
				return { textState, mode: "normal" };
		}
	}

	if (mode === "insert") {
		if (e.key === "Escape") {
			return { textState, mode: "normal" };
		}

		if (e.key === "Backspace") {
			const row = textState.cursor.row;
			const line = textState.buffer[row];
			const newLine = deleteChar(line, textState.cursor);
			const newBuffer = [...textState.buffer];
			newBuffer[row] = newLine;

			return {
				textState: {
					...textState,
					buffer: newBuffer,
					cursor: { ...textState.cursor, col: textState.cursor.col - 1 },
				},
				mode: "insert",
			};
		}

		const row = textState.cursor.row;
		const line = textState.buffer[row];
		const newLine = insertChar(line, e.key, textState.cursor);
		const newBuffer = [...textState.buffer];
		newBuffer[row] = newLine;

		return {
			textState: {
				...textState,
				buffer: newBuffer,
				cursor: { ...textState.cursor, col: textState.cursor.col + 1 },
			},
			mode: "insert",
		};
	}

	return { textState, mode: "normal" };
};
