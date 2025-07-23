import type { CursorPosition } from "../types/editor";

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
