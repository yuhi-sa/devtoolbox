export interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  which: number;
}

export interface CommonKey {
  label: string;
  key: string;
  code: string;
  keyCode: number;
}

export const COMMON_KEYS: CommonKey[] = [
  { label: "Enter", key: "Enter", code: "Enter", keyCode: 13 },
  { label: "Space", key: " ", code: "Space", keyCode: 32 },
  { label: "Escape", key: "Escape", code: "Escape", keyCode: 27 },
  { label: "Tab", key: "Tab", code: "Tab", keyCode: 9 },
  { label: "Backspace", key: "Backspace", code: "Backspace", keyCode: 8 },
  { label: "Delete", key: "Delete", code: "Delete", keyCode: 46 },
  { label: "Arrow Up", key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  { label: "Arrow Down", key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  { label: "Arrow Left", key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  { label: "Arrow Right", key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  { label: "Shift (Left)", key: "Shift", code: "ShiftLeft", keyCode: 16 },
  { label: "Shift (Right)", key: "Shift", code: "ShiftRight", keyCode: 16 },
  { label: "Control (Left)", key: "Control", code: "ControlLeft", keyCode: 17 },
  { label: "Alt (Left)", key: "Alt", code: "AltLeft", keyCode: 18 },
  { label: "Meta (Left)", key: "Meta", code: "MetaLeft", keyCode: 91 },
  { label: "CapsLock", key: "CapsLock", code: "CapsLock", keyCode: 20 },
  { label: "Home", key: "Home", code: "Home", keyCode: 36 },
  { label: "End", key: "End", code: "End", keyCode: 35 },
  { label: "Page Up", key: "PageUp", code: "PageUp", keyCode: 33 },
  { label: "Page Down", key: "PageDown", code: "PageDown", keyCode: 34 },
  { label: "F1", key: "F1", code: "F1", keyCode: 112 },
  { label: "F2", key: "F2", code: "F2", keyCode: 113 },
  { label: "F3", key: "F3", code: "F3", keyCode: 114 },
  { label: "F4", key: "F4", code: "F4", keyCode: 115 },
  { label: "F5", key: "F5", code: "F5", keyCode: 116 },
  { label: "F6", key: "F6", code: "F6", keyCode: 117 },
  { label: "F7", key: "F7", code: "F7", keyCode: 118 },
  { label: "F8", key: "F8", code: "F8", keyCode: 119 },
  { label: "F9", key: "F9", code: "F9", keyCode: 120 },
  { label: "F10", key: "F10", code: "F10", keyCode: 121 },
  { label: "F11", key: "F11", code: "F11", keyCode: 122 },
  { label: "F12", key: "F12", code: "F12", keyCode: 123 },
  { label: "A", key: "a", code: "KeyA", keyCode: 65 },
  { label: "B", key: "b", code: "KeyB", keyCode: 66 },
  { label: "C", key: "c", code: "KeyC", keyCode: 67 },
  { label: "0", key: "0", code: "Digit0", keyCode: 48 },
  { label: "1", key: "1", code: "Digit1", keyCode: 49 },
  { label: "2", key: "2", code: "Digit2", keyCode: 50 },
];

export function extractKeyInfo(event: {
  key: string;
  code: string;
  keyCode: number;
  which: number;
}): KeyInfo {
  return {
    key: event.key,
    code: event.code,
    keyCode: event.keyCode,
    which: event.which,
  };
}

export function searchCommonKeys(query: string): CommonKey[] {
  if (!query.trim()) return COMMON_KEYS;
  const q = query.toLowerCase().trim();
  return COMMON_KEYS.filter(
    (k) =>
      k.label.toLowerCase().includes(q) ||
      k.key.toLowerCase().includes(q) ||
      k.code.toLowerCase().includes(q) ||
      k.keyCode.toString().includes(q)
  );
}
