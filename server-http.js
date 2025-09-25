import express from "express";
import cors from "cors";
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

const CalcParams = z.object({
  op: z.enum(["add", "sub", "mul", "div"]),
  a: z.number(),
  b: z.number(),
});

function calculate({ op, a, b }) {
  if (op === "div" && b === 0) return { error: "division_by_zero" };
  const result = op === "add" ? a + b : op === "sub" ? a - b : op === "mul" ? a * b : a / b;
  return { result };
}

const ROOT_HTML = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Express HTTP Calculator</title>
    <style>
      body { font-family: ui-sans-serif, system-ui; padding: 24px; }
      .card { max-width: 560px; margin: 0 auto; border: 1px solid #ddd; padding: 16px; border-radius: 10px; }
      input, button, select { padding: 8px; font-size: 16px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>HTTP Calculator</h2>
      <div>
        <input id="a" type="number" placeholder="a" />
        <select id="op">
          <option value="add">+</option>
          <option value="sub">-</option>
          <option value="mul">*</option>
          <option value="div">/</option>
        </select>
        <input id="b" type="number" placeholder="b" />
        <button id="calcBtn">=</button>
      </div>
      <div id="result" style="margin-top:8px; font-weight:bold;"></div>
    </div>
    <script>
      document.getElementById('calcBtn').onclick = async () => {
        const a = Number(document.getElementById('a').value);
        const b = Number(document.getElementById('b').value);
        const op = document.getElementById('op').value;
        const r = await fetch('/api/calculate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op, a, b }) });
        const j = await r.json();
        document.getElementById('result').textContent = j.result ?? j.error ?? '';
      };
    </script>
  </body>
</html>`;

app.get("/", (req, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.send(ROOT_HTML);
});

app.post("/api/calculate", (req, res) => {
  const parsed = CalcParams.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const out = calculate(parsed.data);
  if (out.error) return res.status(400).json(out);
  res.json(out);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(PORT, () => {
  console.error(`Express HTTP server on http://localhost:${PORT}`);
});


