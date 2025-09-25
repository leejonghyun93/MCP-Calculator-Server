const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const expr = ref("");
    const result = ref("0");
    const history = ref([]);
    const API_BASE = "http://localhost:8787";

    function pushHistory(entry) {
      history.value.unshift({ id: Date.now() + Math.random().toString(36).slice(2, 6), ts: new Date().toLocaleString(), ...entry });
      if (history.value.length > 100) history.value.pop();
    }

    function append(v) {
      expr.value += v;
    }

    function clearAll() {
      expr.value = "";
      result.value = "0";
    }

    function backspace() {
      expr.value = expr.value.slice(0, -1);
    }

    function safeEval(input) {
      const allowed = /^[\d+\-*/().\s]*$/;
      if (!allowed.test(input)) throw new Error("Invalid characters");
      const fn = new Function(`return (${input})`);
      const out = fn();
      if (typeof out !== "number" || !Number.isFinite(out)) throw new Error("Invalid result");
      return out;
    }

    function parseBinaryExpression(s) {
      const m = String(s).trim().match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
      if (!m) return null;
      const a = Number(m[1]);
      const sym = m[2];
      const b = Number(m[3]);
      const op = sym === "+" ? "add" : sym === "-" ? "sub" : sym === "*" ? "mul" : "div";
      return { a, b, op };
    }

    async function equals() {
      if (!expr.value.trim()) return;
      const parsed = parseBinaryExpression(expr.value);
      if (!parsed) {
        result.value = "Invalid";
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/calculate`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(parsed),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Request failed");
        result.value = String(data.result);
        pushHistory({ expr: expr.value, result: result.value });
      } catch (e) {
        result.value = "Error";
      }
    }

    function onKey(e) {
      const k = e.key;
      if ((k >= '0' && k <= '9') || k === '.' || k === '(' || k === ')') {
        append(k);
      } else if (k === '+' || k === '-' || k === '*' || k === '/') {
        append(k);
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault();
        equals();
      } else if (k === 'Backspace') {
        backspace();
      } else if (k === 'Escape') {
        clearAll();
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', onKey);
    });

    return { expr, result, history, append, clearAll, backspace, equals };
  },
  template: `
    <div class="container">
      <div class="shell" role="application" aria-label="Calculator">
        <div class="header">
          <div class="title">Vue 3 Calculator</div>
        </div>
        <div class="screen">
          <div class="expr" aria-live="polite">{{ expr }}</div>
          <div class="result" aria-live="polite">{{ result }}</div>
        </div>
        <div class="keys">
          <button class="danger" @click="clearAll">C</button>
          <button class="op" @click="append('(')">(</button>
          <button class="op" @click="append(')')">)</button>
          <button class="op" @click="append('/')">÷</button>

          <button @click="append('7')">7</button>
          <button @click="append('8')">8</button>
          <button @click="append('9')">9</button>
          <button class="op" @click="append('*')">×</button>

          <button @click="append('4')">4</button>
          <button @click="append('5')">5</button>
          <button @click="append('6')">6</button>
          <button class="op" @click="append('-')">−</button>

          <button @click="append('1')">1</button>
          <button @click="append('2')">2</button>
          <button @click="append('3')">3</button>
          <button class="op" @click="append('+')">+</button>

          <button class="wide" @click="backspace">⌫</button>
          <button @click="append('0')">0</button>
          <button @click="append('.')">.</button>
          <button class="accent" @click="equals">=</button>
        </div>
      </div>
      <div class="history card">
        <div class="history-title">History</div>
        <div class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item">
            <span class="history-ts">{{ item.ts }}</span>
            <span class="history-expr">{{ item.expr }}</span>
            <span class="history-eq">=</span>
            <span class="history-res">{{ item.result }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
}).mount('#app');


