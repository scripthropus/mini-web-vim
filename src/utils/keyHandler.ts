import type {
	CursorPosition,
	EditorState,
	KeyEvent,
	Mode,
} from "../types/editor";
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
		return await handleNormalMode(e, editorState);
	}

	if (editorState.mode === "insert") {
		return await handleInsertMode(e, editorState);
	}

	return editorState;
};

const handleInsertMode = async (
	e: KeyEvent,
	editorState: EditorState,
): Promise<EditorState> => {
	switch (e.key) {
		case "Escape":
			return { ...editorState, mode: "normal" };

		case "Enter":
			return { ...splitAtCursor(editorState) };

		case "Backspace":
			return {
				...editorState,
				textState: deleteChar(editorState.textState),
			};

		case "(":
			return automaticBracketInsertion(e.key, editorState);

		case "{":
			return automaticBracketInsertion(e.key, editorState);

		case "[":
			return automaticBracketInsertion(e.key, editorState);

		case '"':
			return autoQuotePairing(e.key, editorState);

		case "'":
			return autoQuotePairing(e.key, editorState);

		case "Space":
			return {
				...editorState,
				textState: insertString(e.key, editorState.textState),
			};

		default:
			return editorState;
	}
};

const handleNormalMode = async (
	e: KeyEvent,
	editorState: EditorState,
): Promise<EditorState> => {
	switch (editorState.pendingOperator) {
		case "d":
			switch (e.key) {
				case "d":
					return ddCommand(editorState);

				default:
					if (e.key === "Escape") {
						return { ...editorState, pendingOperator: "" };
					}
					return editorState;
			}

		case "y":
			switch (e.key) {
				case "y":
					await copyLineToClipboard(editorState);
					return { ...editorState, pendingOperator: "" };

				default:
					if (e.key === "Escape") {
						return { ...editorState, pendingOperator: "" };
					}
					return editorState;
			}

		case "":
			switch (e.key) {
				case "Escape":
					return { ...editorState, pendingOperator: "" };

				case "0": {
					const col: Partial<CursorPosition> = { col: 0 };
					return updateCursor(editorState, col);
				}

				case "a": {
					const newCol: Partial<CursorPosition> = {
						col: Math.min(
							editorState.textState.cursor.col + 1,
							editorState.textState.buffer[editorState.textState.cursor.row]
								.length,
						),
					};
					const updates = {
						cursor: newCol,
						mode: "insert" as Mode,
					};

					return updateEditorState(editorState, updates);
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
					return { ...editorState, pendingOperator: "y" };

				case "d":
					return { ...editorState, pendingOperator: "d" };

				case "A": {
					const newCol = Math.max(
						0,
						editorState.textState.buffer[editorState.textState.cursor.row]
							.length,
					);
					const updates = {
						cursor: {
							col: newCol,
						},
						mode: "insert" as Mode,
					};
					return updateEditorState(editorState, updates);
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
					const updates = {
						cursor: {
							row: lastRowIndex,
							col: newCol,
						},
					};
					return updateEditorState(editorState, updates);
				}

				case "O":
					return insertNewLineAbove(editorState);

				default:
					return editorState;
			}

		default:
			return editorState;
	}
};

const updateCursor = (
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

const updateEditorState = (
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
