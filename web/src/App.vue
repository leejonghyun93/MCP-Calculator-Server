<template>
  <div class="container">
    <div class="stack">
      <h1>Calculator (MCP HTTP)</h1>
      <div class="card stack">
        <input class="screen" v-model="expr" placeholder="e.g. 2 + 3 or 10 / 2" />
        <div class="grid">
          <button class="btn" @click="append('7')">7</button>
          <button class="btn" @click="append('8')">8</button>
          <button class="btn" @click="append('9')">9</button>
          <button class="btn" @click="append('/')">/</button>

          <button class="btn" @click="append('4')">4</button>
          <button class="btn" @click="append('5')">5</button>
          <button class="btn" @click="append('6')">6</button>
          <button class="btn" @click="append('*')">*</button>

          <button class="btn" @click="append('1')">1</button>
          <button class="btn" @click="append('2')">2</button>
          <button class="btn" @click="append('3')">3</button>
          <button class="btn" @click="append('-')">-</button>

          <button class="btn" @click="append('0')">0</button>
          <button class="btn" @click="append('.')">.</button>
          <button class="btn btn-danger" @click="clearAll">C</button>
          <button class="btn" @click="append('+')">+</button>
        </div>

        <div class="row">
          <button class="btn btn-accent" @click="equals">=</button>
          <button class="btn" @click="fetchTime">시간</button>
        </div>

        <div class="row">
          <input class="screen" v-model="text" placeholder="텍스트 변환 입력" />
          <button class="btn" @click="toUpper">UPPER</button>
          <button class="btn" @click="toLower">lower</button>
        </div>

        <div class="stack">
          <div>결과: <strong>{{ result }}</strong></div>
          <div>현재시간: <strong>{{ now }}</strong></div>
          <div>변환: <strong>{{ converted }}</strong></div>
        </div>
      </div>
    </div>
  </div>
  </template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const BASE = "http://localhost:8787";
const expr = ref("");
const text = ref("");
const result = ref("");
const now = ref("");
const converted = ref("");

function append(ch) { expr.value += ch; }
function clearAll() { expr.value = ""; result.value = ""; }

async function equals() {
  const m = expr.value.match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return;
  const a = Number(m[1]);
  const sym = m[2];
  const b = Number(m[3]);
  const op = sym === "+" ? "add" : sym === "-" ? "sub" : sym === "*" ? "mul" : "div";
  // Call MCP HTTP-like endpoint
  const { data } = await axios.post(`${BASE}/tool`, { name: op, input: { a, b } });
  // The HTTP server returns { content: [{ type: 'text', text: '...' }] }
  result.value = data?.content?.[0]?.text ?? "";
}

async function fetchTime() {
  // Use the /tool with name "now" if available; else fallback to express time endpoint
  try {
    const { data } = await axios.post(`${BASE}/tool`, { name: "now", input: {} });
    now.value = data?.content?.[0]?.text ?? "";
  } catch {
    try {
      const { data } = await axios.get("http://localhost:3001/time");
      now.value = data?.now ?? "";
    } catch {}
  }
}

async function toUpper() {
  const { data } = await axios.post("http://localhost:3001/text/convert", { mode: "upper", text: text.value });
  converted.value = data?.transformed ?? "";
}

async function toLower() {
  const { data } = await axios.post("http://localhost:3001/text/convert", { mode: "lower", text: text.value });
  converted.value = data?.transformed ?? "";
}
</script>

<style scoped>
h1 { margin: 0; }
</style>

<template>
  <div class="container">
    <div class="stack">
      <h1>Modern Calculator</h1>
      <div class="card stack">
        <input class="screen" v-model="display" placeholder="Enter expression or use buttons" />
        <div class="grid">
          <button class="btn" @click="append('7')">7</button>
          <button class="btn" @click="append('8')">8</button>
          <button class="btn" @click="append('9')">9</button>
          <button class="btn" @click="append('/')">/</button>

          <button class="btn" @click="append('4')">4</button>
          <button class="btn" @click="append('5')">5</button>
          <button class="btn" @click="append('6')">6</button>
          <button class="btn" @click="append('*')">*</button>

          <button class="btn" @click="append('1')">1</button>
          <button class="btn" @click="append('2')">2</button>
          <button class="btn" @click="append('3')">3</button>
          <button class="btn" @click="append('-')">-</button>

          <button class="btn" @click="append('0')">0</button>
          <button class="btn" @click="append('.')">.</button>
          <button class="btn btn-danger" @click="clearAll">C</button>
          <button class="btn" @click="append('+')">+</button>
        </div>

        <div class="row">
          <button class="btn btn-accent" @click="equals">=</button>
          <button class="btn" @click="aiCalc">AI 계산</button>
        </div>
      </div>

      <div class="card stack">
        <div class="row">
          <h2 style="margin:0">History</h2>
          <button class="btn btn-danger" @click="clearHistory">Clear</button>
        </div>
        <div class="history">
          <div v-for="item in history" :key="item.id" class="history-item">
            {{ item.ts }} • {{ label(item) }} = <strong>{{ item.result }}</strong>
          </div>
        </div>
      </div>

    </div>
  </div>
  </template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:4000").replace(/\/$/, "");

const display = ref("");
const history = ref([]);

async function refreshHistory() {
  const { data } = await axios.get(`${API_BASE}/api/history`);
  history.value = data.items || [];
}

function append(ch) { display.value += ch; }
function clearAll() { display.value = ""; }

function label(item) {
  const op = item.op === "add" ? "+" : item.op === "sub" ? "-" : item.op === "mul" ? "*" : "/";
  if (item.type === "nl-calc") return `${item.normalized}`;
  return `${item.a} ${op} ${item.b}`;
}

async function equals() {
  const m = display.value.match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return;
  const a = Number(m[1]);
  const sym = m[2];
  const b = Number(m[3]);
  const op = sym === "+" ? "add" : sym === "-" ? "sub" : sym === "*" ? "mul" : "div";
  const { data } = await axios.post(`${API_BASE}/api/calc`, { op, a, b });
  display.value = String(data.result);
  await refreshHistory();
}

async function aiCalc() {
  if (!display.value.trim()) return;
  const { data } = await axios.post(`${API_BASE}/api/nl-calc`, { query: display.value });
  display.value = String(data.result);
  await refreshHistory();
}

onMounted(() => { refreshHistory(); });
</script>

<style scoped>
h1 { margin: 0; }
h2 { margin: 0 0 8px 0; }
</style>


