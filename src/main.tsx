import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Vim from "./Vim.tsx";

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<StrictMode>
			<Vim />
		</StrictMode>,
	);
}
