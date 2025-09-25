import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Bridge to reuse calculator/text/time logic similarly to MCP tools
const CalcParams = z.object({ op: z.enum(["add", "sub", "mul", "div"]), a: z.number(), b: z.number() });
const TextParams = z.object({ mode: z.enum(["upper", "lower"]), text: z.string() });

function runCalc({ op, a, b }) {
  if (op === "div" && b === 0) {
    return { error: "division_by_zero" };
  }
  const result = op === "add" ? a + b : op === "sub" ? a - b : op === "mul" ? a * b : a / b;
  return { result };
}

function runTime() {
  return { now: new Date().toISOString() };
}

function runText({ mode, text }) {
  const transformed = mode === "upper" ? text.toUpperCase() : text.toLowerCase();
  return { transformed };
}

// Optionally spin up MCP stdio server side-by-side (not strictly required to serve REST)
async function startMcpIfNeeded() {
  try {
    const server = new McpServer({ name: "my-mcp-server-bridge", version: "1.0.0" });
    // Re-register the same tools to keep behavior aligned
    const NumParams = z.object({ a: z.number(), b: z.number() });
    server.tool("add", "", NumParams, async ({ a, b }) => ({ content: [{ type: "text", text: String(a + b) }] }));
    server.tool("sub", "", NumParams, async ({ a, b }) => ({ content: [{ type: "text", text: String(a - b) }] }));
    server.tool("mul", "", NumParams, async ({ a, b }) => ({ content: [{ type: "text", text: String(a * b) }] }));
    server.tool("div", "", NumParams, async ({ a, b }) => {
      if (b === 0) return { isError: true, content: [{ type: "text", text: "0으로 나눌 수 없습니다." }] };
      return { content: [{ type: "text", text: String(a / b) }] };
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP stdio bridge running (server-express.js)");
  } catch (e) {
    console.error("Failed to start MCP bridge:", e);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// POST /calculate { op, a, b }
app.post("/calculate", (req, res) => {
  const parsed = CalcParams.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const out = runCalc(parsed.data);
  if (out.error) return res.status(400).json(out);
  res.json(out);
});

// GET /time
app.get("/time", (req, res) => {
  res.json(runTime());
});

// POST /text/convert { mode, text }
app.post("/text/convert", (req, res) => {
  const parsed = TextParams.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  res.json(runText(parsed.data));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express REST API listening on http://localhost:${PORT}`);
});

// Optionally start MCP bridge (leave running on stdio for integration with MCP hosts)
startMcpIfNeeded();


