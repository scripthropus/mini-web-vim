import { test, expect} from "vitest";
import { insertString, deleteCharAtCursor, moveToNextWord, moveToPreviousWord} from "../src/utils/textOperations.ts";
import { EditorState, TextState } from "../src/types/editor.ts";
import { ddCommand } from "../src/utils/clipboard.ts";

test("文字を挿入することができる", () => {
const textState: TextState = {
  buffer: ["line1", "line2", "line3"],
  cursor: { row: 1, col: 1}
};

  const expected: TextState = { buffer: ["line1", "laine2", "line3"],
  cursor: { row: 1, col: 2}
  }
  
  expect(insertString( "a", textState)).toStrictEqual(expected);
})

test("カーソル上の文字を消すことができる", () => {
  const textState: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 1}
  };

  const expected : TextState = {
    buffer: ["line1", "lne2", "line3"],
    cursor: { row: 1, col: 1}
  };
  expect(deleteCharAtCursor(textState)).toStrictEqual(expected);
});

test("文字を削除する際にカーソルが文字列の終端であったらカーソル位置が一つ前へ移動する", () => {
  const textState: TextState = {
    buffer: ["line1", "line2", "line3"],
    cursor: { row: 1, col: 4}
  };

  const expected : TextState = {
    buffer: ["line1", "line", "line3"],
    cursor: { row: 1, col: 3}
  };
  expect(deleteCharAtCursor(textState)).toStrictEqual(expected);
});

test("単語の途中から次の単語の先頭へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world test"],
      cursor: { row: 0, col: 2 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world test"],
      cursor: { row: 0, col: 6 }
    }
  };
  
  expect(moveToNextWord(editorState)).toStrictEqual(expected);
});

test("単語境界から次の単語へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world"],
      cursor: { row: 0, col: 5 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world"],
      cursor: { row: 0, col: 6 }
    }
  };
  
  expect(moveToNextWord(editorState)).toStrictEqual(expected);
});

test("記号から次の単語へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello-world test"],
      cursor: { row: 0, col: 5 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello-world test"],
      cursor: { row: 0, col: 6 }
    }
  };
  
  expect(moveToNextWord(editorState)).toStrictEqual(expected);
});

test("連続する空白をスキップして次の単語へ", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello   world"],
      cursor: { row: 0, col: 5 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello   world"],
      cursor: { row: 0, col: 8 }
    }
  };
  
  expect(moveToNextWord(editorState)).toStrictEqual(expected);
});

test("行末で次の行の最初の単語へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello", "world test"],
      cursor: { row: 0, col: 4 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello", "world test"],
      cursor: { row: 1, col: 0 }
    }
  };
  
  expect(moveToNextWord(editorState)).toStrictEqual(expected);
});

test("最後の行の最後の単語で移動しない", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello", "world"],
      cursor: { row: 1, col: 4 } 
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  expect(moveToNextWord(editorState)).toStrictEqual(editorState);
});

test("単語の途中から前の単語の先頭へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world test"],
      cursor: { row: 0, col: 8 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world test"],
      cursor: { row: 0, col: 6 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});

test("単語の先頭から前の単語の先頭へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world test"],
      cursor: { row: 0, col: 6 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world test"],
      cursor: { row: 0, col: 0 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});

test("空白の中から前の単語の先頭へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello   world test"],
      cursor: { row: 0, col: 7 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello   world test"],
      cursor: { row: 0, col: 0 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});

test("記号から前の単語へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello-world test"],
      cursor: { row: 0, col: 6 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello-world test"],
      cursor: { row: 0, col: 5 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});

test("行頭で前の行の最後の単語へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world", "test line"],
      cursor: { row: 1, col: 0 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world", "test line"],
      cursor: { row: 0, col: 6 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});

test("単語の途中で前の行へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world", "test line"],
      cursor: { row: 1, col: 2 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world", "test line"],
      cursor: { row: 1, col: 0 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});

test("最初の行の最初の単語で移動しない", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world", "test line"],
      cursor: { row: 0, col: 0 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(editorState);
});

test("空の行から前の行の最後の単語へ移動", () => {
  const editorState: EditorState = {
    textState: {
      buffer: ["hello world", "", "test"],
      cursor: { row: 1, col: 0 }
    },
    mode: "normal",
    pendingOperator: "",
    operatorCount: 1
  };
  
  const expected = {
    ...editorState,
    textState: {
      buffer: ["hello world", "", "test"],
      cursor: { row: 0, col: 6 }
    }
  };
  
  expect(moveToPreviousWord(editorState)).toStrictEqual(expected);
});