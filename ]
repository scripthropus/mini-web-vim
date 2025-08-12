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
	deleteCurrentAndNextLine,
	deleteCurrentAndPreviousLine,
	dhCommand,
	dlCommand,
	insertNewLineAbove,
	insertNewLineBelow,
	insertString,
	splitAtCursor,
	updateCursor,
	updateEditorState,
} from "./textOperations";

type CommandHandler = (
	editorState: EditorState,
) => Promise<EditorState> | EditorState;

const insertModeCommands: Record<string, CommandHandler> = {
	Escape: (state) => ({ ...state, mode: "normal" }),
	Enter: (state) => ({ ...splitAtCursor(state) }),
	Backspace: (state) => ({
		...state,
		textState: deleteChar(state.textState),
	}),
	"(": (state) => automaticBracketInsertion("(", state),
	"{": (state) => automaticBracketInsertion("{", state),
	"[": (state) => automaticBracketInsertion("[", state),
	'"': (state) => autoQuotePairing('"', state),
	"'": (state) => autoQuotePairing("'", state),
	Space: (state) => ({
		...state,
		textState: insertString(" ", state.textState),
	}),
};

const normalModeCommands: Record<string, CommandHandler> = {
	Escape: (state) => ({ ...state, pendingOperator: "" }),

	"0": (state) => updateCursor(state, { col: 0 }),

	a: (state) => {
		const newCol = Math.min(
			state.textState.cursor.col + 1,
			state.textState.buffer[state.textState.cursor.row].length,
		);
		return updateEditorState(state, {
			cursor: { col: newCol },
			mode: "insert",
		});
	},

	i: (state) => ({ ...state, mode: "insert" }),

	j: (state) => ({
		...state,
		textState: moveCursor(state.textState, "down"),
	}),

	k: (state) => ({
		...state,
		textState: moveCursor(state.textState, "up"),
	}),

	h: (state) => ({
		...state,
		textState: moveCursor(state.textState, "left"),
	}),

	l: (state) => ({
		...state,
		textState: moveCursor(state.textState, "right"),
	}),

	o: (state) => insertNewLineBelow(state),

	x: (state) => ({
		...state,
		textState: deleteCharAtCursor(state.textState),
	}),

	p: (state) => readClipboardAndInsert(state),

	y: (state) => ({ ...state, pendingOperator: "y" }),

	d: (state) => ({ ...state, pendingOperator: "d" }),

	A: (state) => {
		const newCol = Math.max(
			0,
			state.textState.buffer[state.textState.cursor.row].length,
		);
		return updateEditorState(state, {
			cursor: { col: newCol },
			mode: "insert",
		});
	},

	G: (state) => {
		const lastRowIndex = Math.max(0, state.textState.buffer.length - 1);
		const lastRowLength = Math.max(
			0,
			state.textState.buffer[lastRowIndex].length - 1,
		);
		const col = state.textState.cursor.col;
		const newCol = col > lastRowLength ? lastRowLength : col;
		return updateEditorState(state, {
			cursor: { row: lastRowIndex, col: newCol },
		});
	},

	O: (state) => insertNewLineAbove(state),
};

const pendingOperatorCommands: Record<
	string,
	Record<string, CommandHandler>
> = {
	d: {
		d: (state) => ddCommand(state),
		j: (state) => deleteCurrentAndNextLine(state),
		k: (state) => deleteCurrentAndPreviousLine(state),
		l: (state) => dlCommand(state),
		h: (state) => dhCommand(state),
		Escape: (state) => ({ ...state, pendingOperator: "" }),
	},
	y: {
		y: async (state) => {
			await copyLineToClipboard(state);
			return { ...state, pendingOperator: "" };
		},
		Escape: (state) => ({ ...state, pendingOperator: "" }),
	},
};

export const handleKeyEvent = async (
	e: KeyEvent,
	editorState: EditorState,
): Promise<EditorState> => {
	if (editorState.mode === "insert") {
		return handleInsertMode(e, editorState);
	}

	if (editorState.mode === "normal") {
		return await handleNormalMode(e, editorState);
	}

	return editorState;
};

const handleInsertMode = async (
	e: KeyEvent,
	editorState: EditorState,
): Promise<EditorState> => {
	const handler = insertModeCommands[e.key];
	return handler ? handler(editorState) : editorState;
};

const handleNormalMode = async (
	e: KeyEvent,
	editorState: EditorState,
): Promise<EditorState> => {
	if (editorState.pendingOperator) {
		const operatorCommands =
			pendingOperatorCommands[editorState.pendingOperator];
		if (operatorCommands) {
			const handler = operatorCommands[e.key];
			if (handler) {
				return await handler(editorState);
			}
		}
		return editorState;
	}

	const handler = normalModeCommands[e.key];
	return handler ? await handler(editorState) : editorState;
};
