import type { EditorState, KeyEvent, Mode, TextState } from "../types/editor";
import { moveCursor } from "./cursorOperations";
import { deleteChar, insertChar, insertNewLineBelow } from "./textOperations";

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

			case "o":
				return insertNewLineBelow(textState);

			default:
				return { textState, mode: "normal" };
		}
	}

	if (mode === "insert") {
		if (e.key === "Escape") {
			return { textState, mode: "normal" };
		}

		if (e.key === "Enter") {
			return { ...insertNewLineBelow(textState), mode: "insert" };
		}

		if (e.key === "Backspace") {
			return {
				textState: deleteChar(textState),
				mode: "insert",
			};
		}

		if (e.key.length === 1 || e.key === "Space") {
			return {
				textState: insertChar(e.key, textState),
				mode: "insert",
			};
		}
	}

	return { textState, mode: "insert" };
};
