const history = [];

export function addHistoryEntry(entry) {
  const full = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ts: new Date().toISOString(), ...entry };
  history.unshift(full);
  if (history.length > 1000) history.pop();
  return full;
}

export function getHistory() {
  return history;
}

export function clearHistory() {
  history.length = 0;
}


