export type Mode = "normal" | "insert" | "visual";
export type Direction = "up" | "down" | "left" | "right";

export interface TextState {
	buffer: string[];
	cursor: CursorPosition;
}

export interface CursorPosition {
	row: number;
	col: number;
}

export interface EditorState {
	textState: TextState;
	mode: Mode;
}

export interface KeyEvent {
	key: string;
	type: string;
	preventDefault(): void;
	stopPropagation(): void;
}
