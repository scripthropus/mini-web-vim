import { useState } from "react";
import type { EditorState } from "./types/editor";
import { handleKeyEvent } from "./utils/keyHandler";

const STYLES = {
	cursor: {
		backgroundColor: "#ffffff",
		color: "#000000",
	},
	normalText: {
		color: "#00ff00",
	},
	emptyCursor: {
		backgroundColor: "#ffffff",
		color: "#000000",
		width: "8px",
		display: "inline-block" as const,
	},
	editor: {
		padding: "10px",
		fontFamily: "monospace",
		backgroundColor: "#000000",
	},
	line: {
		minHeight: "1.2em",
		whiteSpace: "pre" as const,
	},
};

interface CharProps {
	char: string;
	isCursor: boolean;
}

const Char = ({ char, isCursor }: CharProps) => (
	<span style={isCursor ? STYLES.cursor : STYLES.normalText}>{char}</span>
);

const EmptyCursor = () => <span style={STYLES.emptyCursor}>&nbsp;</span>;

interface LineProps {
	line: string;
	rowIndex: number;
	cursorRow: number;
	cursorCol: number;
}

const Line = ({ line, rowIndex, cursorRow, cursorCol }: LineProps) => {
	const isCursorRow = rowIndex === cursorRow;
	const shouldShowEmptyCursor =
		isCursorRow && (line.length === 0 || cursorCol >= line.length);

	return (
		<div style={STYLES.line}>
			{line.split("").map((char, colIndex) => (
				<Char
					key={colIndex}
					char={char}
					isCursor={isCursorRow && colIndex === cursorCol}
				/>
			))}
			{shouldShowEmptyCursor && <EmptyCursor />}
		</div>
	);
};

function Vim() {
	const [editorState, setEditorState] = useState<EditorState>({
		textState: {
			buffer: ["line1", "line2", "line3"],
			cursor: { row: 1, col: 1 },
		},
		mode: "normal",
		pendingOperator: "",
		operatorCount: 1,
	});

	const handleKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		const newState = handleKeyEvent(e, editorState);
		setEditorState(newState);
	};

	return (
		<>
			<div>Mode: {editorState.mode}</div>
			<div tabIndex={0} onKeyDown={handleKeyDown} style={STYLES.editor}>
				{editorState.textState.buffer.map((line, rowIndex) => (
					<Line
						key={rowIndex}
						line={line}
						rowIndex={rowIndex}
						cursorRow={editorState.textState.cursor.row}
						cursorCol={editorState.textState.cursor.col}
					/>
				))}
			</div>
		</>
	);
}

export default Vim;
