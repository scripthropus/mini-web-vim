import type { EditorState, KeyEvent } from "../types/editor";
import { moveCursor } from "./cursorOperations";
import {
	deleteChar,
	deleteCharAtCursor,
	insertChar,
	insertNewLineBelow,
} from "./textOperations";

export const handleKeyEvent = (
	e: KeyEvent,
	editorState: EditorState,
): EditorState => {
	if (editorState.mode === "normal") {
		switch (e.key) {
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
      
      case "y":
        if(editorState.pendingOperator === "y"){
          const copyToClipboard = async()=> {
            const cursorRow = editorState.textState.cursor.row;
            const line = editorState.textState.buffer[cursorRow];
            await navigator.clipboard.writeText(line);
          }
          copyToClipboard();
        }
        if(editorState.pendingOperator === ""){
          return { ...editorState, pendingOperator: "y"};
        }

        return { ...editorState, pendingOperator: ""};

			default:
				return editorState;
		}
	}

	if (editorState.mode === "insert") {
		if (e.key === "Escape") {
			return { ...editorState, mode: "normal" };
		}

		if (e.key === "Enter") {
			return { ...insertNewLineBelow(editorState) };
		}

		if (e.key === "Backspace") {
			return {
				...editorState,
				textState: deleteChar(editorState.textState),
			};
		}

		if (e.key.length === 1 || e.key === "Space") {
			return {
				...editorState,
				textState: insertChar(e.key, editorState.textState),
			};
		}
	}

	return editorState;
};
