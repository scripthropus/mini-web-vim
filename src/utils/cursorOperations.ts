import type { Direction, TextState } from "../types/editor";

export const moveCursor = (
	state: TextState,
	direction: Direction,
): TextState => {
	const { buffer, cursor } = state;

	switch (direction) {
		case "up":
			if (cursor.row > 0) {
				const posRow = state.cursor.row;
				const posCol = state.cursor.col;
				const nextCol =
					posCol < state.buffer[posRow - 1].length - 1
						? posCol
						: state.buffer[posRow - 1].length - 1;
				return { ...state, cursor: { row: cursor.row - 1, col: nextCol } };
			}
			return state;

		case "down":
			if (cursor.row < buffer.length - 1) {
				const posRow = state.cursor.row;
				const posCol = state.cursor.col;
				const nextCol =
					posCol < state.buffer[posRow + 1].length - 1
						? posCol
						: state.buffer[posRow + 1].length - 1;
				return { ...state, cursor: { row: cursor.row + 1, col: nextCol } };
			}
			return state;

		case "left":
			if (cursor.col > 0) {
				return { ...state, cursor: { ...cursor, col: cursor.col - 1 } };
			}
			return state;

		case "right": {
			const currentLine = buffer[cursor.row] || "";
			if (cursor.col < currentLine.length - 1) {
				return { ...state, cursor: { ...cursor, col: cursor.col + 1 } };
			}
			return state;
		}

		default:
			return state;
	}
};
