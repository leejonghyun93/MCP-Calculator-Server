// Very simple NL parser for arithmetic in English and Korean
// Supports forms like: "2 + 3", "2 plus 3", "2 times 3", "10 divided by 2"
// Korean: "2 더하기 3", "10 나누기 2", "5 곱하기 6", "7 빼기 4"

const patterns = [
  // symbol-based
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*\+\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "add" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*-\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "sub" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*[xX*]\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "mul" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*\/\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "div" },
  // english words
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*(?:plus|add)\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "add" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*(?:minus|subtract|less)\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "sub" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*(?:times|multiply|multiplied by)\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "mul" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*(?:divide|divided by|over)\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "div" },
  // korean words
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*더하기\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "add" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*빼기\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "sub" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*곱하기\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "mul" },
  { re: /^(?<a>-?\d+(?:\.\d+)?)\s*나누기\s*(?<b>-?\d+(?:\.\d+)?)$/i, op: "div" },
];

export function parseNaturalLanguageExpression(query) {
  const text = String(query).trim().toLowerCase();
  for (const p of patterns) {
    const m = text.match(p.re);
    if (m && m.groups) {
      const a = Number(m.groups.a);
      const b = Number(m.groups.b);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const normalized = `${a} ${p.op === "add" ? "+" : p.op === "sub" ? "-" : p.op === "mul" ? "*" : "/"} ${b}`;
      return { ok: true, op: p.op, a, b, normalized };
    }
  }
  return { ok: false };
}


