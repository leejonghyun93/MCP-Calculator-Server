import express from "express";
import cors from "cors";
import { z } from "zod";
import { addHistoryEntry, getHistory, clearHistory } from "./historyStore.js";
import { parseNaturalLanguageExpression } from "./nlParser.js";

const app = express();
app.use(cors());
app.use(express.json());

const CalcParams = z.object({
  op: z.enum(["add", "sub", "mul", "div"]).describe("operation"),
  a: z.number().describe("first operand"),
  b: z.number().describe("second operand"),
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/history", (req, res) => {
  res.json({ items: getHistory() });
});

app.delete("/api/history", (req, res) => {
  clearHistory();
  res.status(204).end();
});

app.post("/api/calc", (req, res) => {
  const parsed = CalcParams.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_input" });
  }
  const { op, a, b } = parsed.data;
  if (op === "div" && b === 0) {
    return res.status(400).json({ error: "division_by_zero" });
  }
  const result =
    op === "add" ? a + b : op === "sub" ? a - b : op === "mul" ? a * b : a / b;
  const entry = addHistoryEntry({
    type: "calc",
    op,
    a,
    b,
    result,
  });
  res.json({ result, entry });
});

app.post("/api/nl-calc", (req, res) => {
  const { query } = req.body || {};
  if (typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "invalid_query" });
  }
  const parsed = parseNaturalLanguageExpression(query);
  if (!parsed.ok) {
    return res.status(400).json({ error: "unrecognized_expression" });
  }
  const { op, a, b, normalized } = parsed;
  if (op === "div" && b === 0) {
    return res.status(400).json({ error: "division_by_zero" });
  }
  const result = op === "add" ? a + b : op === "sub" ? a - b : op === "mul" ? a * b : a / b;
  const entry = addHistoryEntry({ type: "nl-calc", op, a, b, result, query, normalized });
  res.json({ result, entry });
});

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
});


