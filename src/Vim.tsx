import { useState } from "react";
import type { Mode, TextState } from "./types/editor";
import { handleKeyEvent } from "./utils/keyHandler";

function Vim() {
	const [textState, setTextState] = useState<TextState>({
		buffer: ["line1", "line2", "line3"],
		cursor: { row: 1, col: 1 },
	});
	const [mode, setMode] = useState<Mode>("normal");

	const handleKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		const result = handleKeyEvent(e, textState, mode);
		setTextState(result.textState);
		setMode(result.mode);
	};

	const renderLine = (line: string, rowIndex: number) => (
		<div key={rowIndex} style={{ minHeight: "1.2em" }}>
			{line.split("").map((char, colIndex) => {
				const isCursor =
					rowIndex === textState.cursor.row &&
					colIndex === textState.cursor.col;
				return (
					<span
						key={colIndex}
						style={{
							backgroundColor: isCursor ? "#ffffff" : "transparent",
							color: isCursor ? "#000000" : "#00ff00",
						}}
					>
						{char}
					</span>
				);
			})}
			{textState.cursor.row === rowIndex &&
				(line.length === 0 || textState.cursor.col >= line.length) && (
					<span
						style={{
							backgroundColor: "#ffffff",
							color: "#000000",
							width: "8px",
							display: "inline-block",
						}}
					>
						&nbsp;
					</span>
				)}
		</div>
	);

	return (
		<>
			<div>Mode: {mode}</div>
			<div
				tabIndex={0}
				onKeyDown={handleKeyDown}
				style={{
					padding: "10px",
					fontFamily: "monospace",
					backgroundColor: "#000000",
				}}
			>
				{textState.buffer.map(renderLine)}
			</div>
		</>
	);
}

export default Vim;
