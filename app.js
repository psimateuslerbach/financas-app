function $(id) { return document.getElementById(id); }
function pad(n) { return String(n).padStart(2, "0"); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function isoDate(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

const STORAGE_KEY = "financas-mateus-v1";
const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
function money(n) { return BRL.format(n || 0); }
function parseValor(raw) {
  const cleaned = String(raw || "").replace(/[^\d,.-]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? NaN : n;
}

const IMPORT_PACIENTES = [
  { nome:"Alexandre", valorSessao:500, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:100},"2025-02":{numSessoes:1,pago:true,valorSessao:200},"2025-03":{numSessoes:1,pago:true,valorSessao:150},"2025-04":{numSessoes:1,pago:true,valorSessao:250},"2025-05":{numSessoes:1,pago:true,valorSessao:280},"2025-06":{numSessoes:1,pago:true,valorSessao:280},"2025-07":{numSessoes:1,pago:true,valorSessao:350},"2025-08":{numSessoes:1,pago:true,valorSessao:350},"2025-09":{numSessoes:1,pago:true,valorSessao:280},"2025-10":{numSessoes:1,pago:true,valorSessao:210},"2025-11":{numSessoes:1,pago:true,valorSessao:280},"2025-12":{numSessoes:1,pago:true,valorSessao:280},"2026-02":{numSessoes:1,pago:true,valorSessao:300},"2026-03":{numSessoes:1,pago:true,valorSessao:400},"2026-04":{numSessoes:1,pago:true,valorSessao:500},"2026-05":{numSessoes:1,pago:true,valorSessao:340},"2026-06":{numSessoes:1,pago:false,valorSessao:500}} },
  { nome:"Ana Júlia", valorSessao:280, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:150},"2025-02":{numSessoes:1,pago:true,valorSessao:200},"2025-03":{numSessoes:1,pago:true,valorSessao:150},"2025-04":{numSessoes:1,pago:true,valorSessao:250},"2025-05":{numSessoes:1,pago:true,valorSessao:200},"2025-06":{numSessoes:1,pago:true,valorSessao:240},"2025-07":{numSessoes:1,pago:true,valorSessao:300},"2025-08":{numSessoes:1,pago:true,valorSessao:240},"2025-09":{numSessoes:1,pago:true,valorSessao:200},"2025-10":{numSessoes:1,pago:true,valorSessao:240},"2025-11":{numSessoes:1,pago:true,valorSessao:200},"2025-12":{numSessoes:1,pago:false,valorSessao:180},"2026-02":{numSessoes:1,pago:true,valorSessao:210},"2026-03":{numSessoes:1,pago:true,valorSessao:280},"2026-04":{numSessoes:1,pago:true,valorSessao:350},"2026-05":{numSessoes:1,pago:true,valorSessao:280},"2026-06":{numSessoes:1,pago:false,valorSessao:280}} },
  { nome:"Arthur", valorSessao:1000, meses:{"2025-10":{numSessoes:1,pago:true,valorSessao:200},"2025-11":{numSessoes:1,pago:true,valorSessao:800},"2025-12":{numSessoes:1,pago:false,valorSessao:1000}}, inactiveFrom:"2026-01" },
  { nome:"Bruno", valorSessao:120, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:300},"2025-02":{numSessoes:1,pago:true,valorSessao:320},"2025-03":{numSessoes:1,pago:true,valorSessao:240},"2025-04":{numSessoes:1,pago:true,valorSessao:300},"2025-05":{numSessoes:1,pago:true,valorSessao:240},"2025-06":{numSessoes:1,pago:true,valorSessao:120}}, inactiveFrom:"2025-07" },
  { nome:"Carlos", valorSessao:240, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:260},"2025-02":{numSessoes:1,pago:true,valorSessao:160},"2025-03":{numSessoes:1,pago:true,valorSessao:160},"2025-04":{numSessoes:1,pago:true,valorSessao:200},"2025-05":{numSessoes:1,pago:true,valorSessao:260},"2025-06":{numSessoes:1,pago:true,valorSessao:260},"2025-07":{numSessoes:1,pago:true,valorSessao:160},"2025-08":{numSessoes:1,pago:true,valorSessao:160},"2025-09":{numSessoes:1,pago:true,valorSessao:160},"2025-10":{numSessoes:1,pago:true,valorSessao:160},"2025-11":{numSessoes:1,pago:true,valorSessao:260},"2025-12":{numSessoes:1,pago:true,valorSessao:200},"2026-01":{numSessoes:1,pago:true,valorSessao:120},"2026-03":{numSessoes:1,pago:true,valorSessao:240},"2026-04":{numSessoes:1,pago:true,valorSessao:300},"2026-05":{numSessoes:1,pago:true,valorSessao:240},"2026-06":{numSessoes:1,pago:false,valorSessao:240}} },
  { nome:"Danielle", valorSessao:200, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:100},"2025-02":{numSessoes:1,pago:true,valorSessao:75},"2025-03":{numSessoes:1,pago:true,valorSessao:75},"2025-04":{numSessoes:1,pago:true,valorSessao:125},"2025-05":{numSessoes:1,pago:true,valorSessao:120},"2025-06":{numSessoes:1,pago:true,valorSessao:120},"2025-07":{numSessoes:1,pago:true,valorSessao:150},"2025-08":{numSessoes:1,pago:true,valorSessao:120},"2025-09":{numSessoes:1,pago:true,valorSessao:120},"2025-10":{numSessoes:1,pago:true,valorSessao:120},"2025-11":{numSessoes:1,pago:true,valorSessao:120},"2025-12":{numSessoes:1,pago:false,valorSessao:90},"2026-02":{numSessoes:1,pago:true,valorSessao:90},"2026-03":{numSessoes:1,pago:true,valorSessao:200},"2026-04":{numSessoes:1,pago:true,valorSessao:250},"2026-05":{numSessoes:1,pago:true,valorSessao:200},"2026-06":{numSessoes:1,pago:false,valorSessao:200}} },
  { nome:"Emily", valorSessao:60, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:60}}, inactiveFrom:"2025-02" },
  { nome:"Jasmine", valorSessao:200, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:120},"2025-07":{numSessoes:1,pago:true,valorSessao:160},"2025-08":{numSessoes:1,pago:true,valorSessao:160},"2025-09":{numSessoes:1,pago:true,valorSessao:160},"2025-10":{numSessoes:1,pago:true,valorSessao:160},"2025-11":{numSessoes:1,pago:true,valorSessao:160},"2025-12":{numSessoes:1,pago:true,valorSessao:160},"2026-03":{numSessoes:1,pago:true,valorSessao:160},"2026-04":{numSessoes:1,pago:true,valorSessao:160},"2026-05":{numSessoes:1,pago:true,valorSessao:160},"2026-06":{numSessoes:1,pago:false,valorSessao:200}} },
  { nome:"Márcio", valorSessao:160, meses:{"2025-02":{numSessoes:1,pago:true,valorSessao:100},"2025-03":{numSessoes:1,pago:true,valorSessao:100},"2025-04":{numSessoes:1,pago:true,valorSessao:75},"2025-05":{numSessoes:1,pago:true,valorSessao:100},"2025-06":{numSessoes:1,pago:true,valorSessao:75},"2025-07":{numSessoes:1,pago:true,valorSessao:125},"2025-08":{numSessoes:1,pago:true,valorSessao:100},"2025-09":{numSessoes:1,pago:true,valorSessao:100},"2025-10":{numSessoes:1,pago:true,valorSessao:125},"2025-11":{numSessoes:1,pago:true,valorSessao:100},"2025-12":{numSessoes:1,pago:true,valorSessao:75},"2026-01":{numSessoes:1,pago:true,valorSessao:75},"2026-02":{numSessoes:1,pago:true,valorSessao:75},"2026-03":{numSessoes:1,pago:true,valorSessao:100},"2026-04":{numSessoes:1,pago:true,valorSessao:200},"2026-05":{numSessoes:1,pago:true,valorSessao:160},"2026-06":{numSessoes:1,pago:false,valorSessao:160}} },
  { nome:"Matheus", valorSessao:850, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:600},"2025-02":{numSessoes:1,pago:true,valorSessao:700},"2025-03":{numSessoes:1,pago:true,valorSessao:700},"2025-04":{numSessoes:1,pago:true,valorSessao:700},"2025-05":{numSessoes:1,pago:true,valorSessao:700},"2025-06":{numSessoes:1,pago:true,valorSessao:700},"2025-07":{numSessoes:1,pago:true,valorSessao:700},"2025-08":{numSessoes:1,pago:true,valorSessao:700},"2025-09":{numSessoes:1,pago:true,valorSessao:600},"2025-10":{numSessoes:1,pago:true,valorSessao:700},"2025-11":{numSessoes:1,pago:true,valorSessao:700},"2025-12":{numSessoes:1,pago:true,valorSessao:700},"2026-01":{numSessoes:1,pago:true,valorSessao:850},"2026-03":{numSessoes:1,pago:true,valorSessao:850},"2026-04":{numSessoes:1,pago:true,valorSessao:850}}, inactiveFrom:"2026-05" },
  { nome:"Samuel", valorSessao:200, meses:{"2025-02":{numSessoes:1,pago:true,valorSessao:400},"2025-03":{numSessoes:1,pago:true,valorSessao:200}}, inactiveFrom:"2025-04" },
  { nome:"Ton", valorSessao:160, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:160}}, inactiveFrom:"2025-02" },
  { nome:"Valerie", valorSessao:240, meses:{"2025-01":{numSessoes:1,pago:true,valorSessao:260},"2025-02":{numSessoes:1,pago:true,valorSessao:260},"2025-03":{numSessoes:1,pago:true,valorSessao:260},"2025-04":{numSessoes:1,pago:true,valorSessao:260},"2025-05":{numSessoes:1,pago:true,valorSessao:320},"2025-06":{numSessoes:1,pago:true,valorSessao:240}}, inactiveFrom:"2025-07" },
];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        atendimentos: d.atendimentos || [],
        receitasAvulsas: d.receitasAvulsas || [],
        gastosFixos: d.gastosFixos || [],
        gastosAleatorios: d.gastosAleatorios || [],
      };
    }
  } catch (e) {}
  return {
    atendimentos: IMPORT_PACIENTES.map((p) => ({ id: uid(), createdAt: Date.now(), ...p })),
    receitasAvulsas: [],
    gastosFixos: [],
    gastosAleatorios: [],
  };
}
let data = loadData();
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

const now = new Date();
let state = { tab: "receita", year: now.getFullYear(), month: now.getMonth(), editingId: null, receitaTipo: "paciente" };

function monthKey(y, m) { return `${y}-${pad(m + 1)}`; }
function inCurrentMonth(dateStr) { return !!dateStr && dateStr.slice(0, 7) === monthKey(state.year, state.month); }
function fmtDay(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}
function defaultDateForAdd() {
  if (state.year === now.getFullYear() && state.month === now.getMonth()) return isoDate(now);
  return `${state.year}-${pad(state.month + 1)}-01`;
}
function addMonths(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1 + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(Math.min(d, lastDay))}`;
}

function getMes(item, key) {
  const m = (item.meses && item.meses[key]) || {};
  return {
    numSessoes: m.numSessoes || 0,
    pago: !!m.pago,
    valorSessao: m.valorSessao != null ? m.valorSessao : item.valorSessao,
  };
}
function setMes(item, key, patch) {
  if (!item.meses) item.meses = {};
  const cur = item.meses[key] || {};
  item.meses[key] = { ...cur, ...patch };
}
function isActiveIn(p, mk) {
  if (p.activeFrom && mk < p.activeFrom) return false;
  if (p.inactiveFrom && mk >= p.inactiveFrom) return false;
  return true;
}
function avulsosTotalFor(mk) {
  return data.receitasAvulsas.filter((x) => x.data && x.data.slice(0, 7) === mk).reduce((s, x) => s + x.valor, 0);
}
function receitaTotals(items) {
  const mk = monthKey(state.year, state.month);
  let recebido = 0, aReceber = 0;
  items.forEach((p) => {
    if (!isActiveIn(p, mk)) return;
    const m = getMes(p, mk);
    const total = m.valorSessao * m.numSessoes;
    if (m.pago) recebido += total; else aReceber += total;
  });
  return { recebido, aReceber };
}
function anualRows(year) {
  return MONTHS.map((label, m) => {
    const mk = monthKey(year, m);
    let recebido = 0, aReceber = 0;
    data.atendimentos.forEach((p) => {
      if (!isActiveIn(p, mk)) return;
      const rec = getMes(p, mk);
      const total = rec.valorSessao * rec.numSessoes;
      if (rec.pago) recebido += total; else aReceber += total;
    });
    recebido += avulsosTotalFor(mk);
    return { m, label, recebido, aReceber };
  });
}
function fixosTotalFor(mk) {
  return data.gastosFixos.filter((x) => isActiveIn(x, mk)).reduce((s, x) => s + x.valor, 0);
}
function gastosAnualRows(year) {
  return MONTHS.map((label, m) => {
    const mk = monthKey(year, m);
    const fixosMensal = fixosTotalFor(mk);
    const aleatorios = data.gastosAleatorios.filter((x) => x.data && x.data.slice(0, 7) === mk).reduce((s, x) => s + x.valor, 0);
    return { m, label, fixos: fixosMensal, aleatorios, total: fixosMensal + aleatorios };
  });
}
function economiaRows(year) {
  const receitas = anualRows(year);
  const gastos = gastosAnualRows(year);
  return MONTHS.map((label, m) => ({ m, label, saldo: receitas[m].recebido - gastos[m].total }));
}
function isYearTab(tab) { return tab === "anual" || tab === "gastosanuais" || tab === "economias"; }

function currentList() {
  if (state.tab === "receita") return state.receitaTipo === "avulso" ? data.receitasAvulsas : data.atendimentos;
  if (state.tab === "fixos") return data.gastosFixos;
  return data.gastosAleatorios;
}

function listFor(tab) {
  const mk = monthKey(state.year, state.month);
  if (tab === "receita") {
    return data.atendimentos.filter((p) => isActiveIn(p, mk)).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }
  if (tab === "fixos") {
    return data.gastosFixos.filter((x) => isActiveIn(x, mk)).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }
  return data.gastosAleatorios.filter((x) => inCurrentMonth(x.data)).sort((a, b) => b.data.localeCompare(a.data) || a.createdAt - b.createdAt);
}

function totals() {
  const mk = monthKey(state.year, state.month);
  const { recebido: recebidoPacientes, aReceber } = receitaTotals(data.atendimentos);
  const recebido = recebidoPacientes + avulsosTotalFor(mk);
  const fixos = fixosTotalFor(mk);
  const aleatorios = data.gastosAleatorios.filter((x) => inCurrentMonth(x.data)).reduce((s, x) => s + x.valor, 0);
  const gastos = fixos + aleatorios;
  return { receita: recebido, aReceber, fixos, aleatorios, gastos, saldo: recebido - gastos };
}

const FIELDS = {
  fixos: { title: "gasto fixo", nomeLabel: "Descrição do gasto", nomePlaceholder: "Ex: Aluguel do consultório", hasDate: false },
  aleatorios: { title: "gasto", nomeLabel: "Descrição do gasto", nomePlaceholder: "Ex: Material de escritório", hasDate: true },
};

function render() {
  document.body.className = `tab-${state.tab}`;
  renderResumo();
  renderTabSwitch();
  renderDatebar();
  renderTodayChip();
  renderMain();
  $("add-btn").classList.toggle("hidden", isYearTab(state.tab));
}

function renderResumo() {
  if (state.tab === "anual") {
    const rows = anualRows(state.year);
    const totalAno = rows.reduce((s, r) => s + r.recebido, 0);
    const aReceberAno = rows.reduce((s, r) => s + r.aReceber, 0);
    $("resumo-hi").textContent = `Receitas de ${state.year}`;
    const saldoEl = $("resumo-saldo");
    saldoEl.textContent = money(totalAno);
    saldoEl.classList.add("pos");
    saldoEl.classList.remove("neg");
    $("resumo-sub").textContent = `A receber ${money(aReceberAno)}`;
    return;
  }
  if (state.tab === "gastosanuais") {
    const rows = gastosAnualRows(state.year);
    const totalAno = rows.reduce((s, r) => s + r.total, 0);
    const aleatoriosAno = rows.reduce((s, r) => s + r.aleatorios, 0);
    $("resumo-hi").textContent = `Gastos de ${state.year}`;
    const saldoEl = $("resumo-saldo");
    saldoEl.textContent = money(totalAno);
    saldoEl.classList.remove("pos", "neg");
    $("resumo-sub").textContent = `Fixos ${money(rows[0].fixos)}/mês · Aleatórios ${money(aleatoriosAno)} no ano`;
    return;
  }
  if (state.tab === "economias") {
    const rows = economiaRows(state.year);
    const totalAno = rows.reduce((s, r) => s + r.saldo, 0);
    const isProfit = totalAno >= 0;
    $("resumo-hi").textContent = `${isProfit ? "Lucro" : "Déficit"} de ${state.year}`;
    const saldoEl = $("resumo-saldo");
    saldoEl.textContent = money(Math.abs(totalAno));
    saldoEl.classList.toggle("pos", isProfit);
    saldoEl.classList.toggle("neg", !isProfit);
    const mesesLucro = rows.filter((r) => r.saldo >= 0).length;
    $("resumo-sub").textContent = `${mesesLucro} de 12 meses no lucro`;
    return;
  }
  const t = totals();
  $("resumo-hi").textContent = `Resumo de ${MONTHS[state.month]}`;
  const saldoEl = $("resumo-saldo");
  saldoEl.textContent = money(t.saldo);
  saldoEl.classList.toggle("pos", t.saldo >= 0);
  saldoEl.classList.toggle("neg", t.saldo < 0);
  $("resumo-sub").textContent = `Receita ${money(t.receita)} · Gastos ${money(t.gastos)}`;
}

function renderTabSwitch() {
  document.querySelectorAll("#tab-switch button").forEach((b) => b.classList.toggle("on", b.dataset.tab === state.tab));
}

function renderDatebar() {
  $("month-label").textContent = isYearTab(state.tab) ? String(state.year) : `${MONTHS[state.month]} de ${state.year}`;
}

function renderTodayChip() {
  $("today-btn").textContent = isYearTab(state.tab) ? "Este ano" : "Este mês";
}

function stat(v, l) { return `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`; }

function renderStats(items) {
  const wrap = document.createElement("div");
  if (state.tab === "fixos") {
    const total = items.reduce((s, x) => s + x.valor, 0);
    wrap.className = "stats cols-2";
    wrap.innerHTML = stat(money(total), "Total mensal") + stat(String(items.length), items.length === 1 ? "Gasto fixo" : "Gastos fixos");
  } else {
    const total = items.reduce((s, x) => s + x.valor, 0);
    const maior = items.reduce((m, x) => Math.max(m, x.valor), 0);
    wrap.className = "stats";
    wrap.innerHTML = stat(money(total), "Total do mês") + stat(String(items.length), items.length === 1 ? "Gasto" : "Gastos") + stat(money(maior), "Maior gasto");
  }
  return wrap;
}

function emptyMessage() {
  if (state.tab === "fixos") return '<div class="t">Nenhum gasto fixo cadastrado</div><div class="s">Aluguel, internet, assinaturas...</div>';
  return '<div class="t">Nenhum gasto neste mês</div><div class="s">Toque em "Novo" para adicionar</div>';
}

function renderEntry(item) {
  const el = document.createElement("div");
  el.className = "entry";
  let left, value;
  if (state.tab === "receita") {
    const m = getMes(item, monthKey(state.year, state.month));
    value = m.valorSessao * m.numSessoes;
    el.classList.toggle("paid", m.pago);
    left = `
      <button class="entry-check ${m.pago ? "on" : ""}" data-check type="button">✓</button>
      <div class="entry-body">
        <div class="entry-name">${escapeHtml(item.nome)}</div>
        <div class="entry-date">${money(m.valorSessao)} × ${m.numSessoes} ${m.numSessoes === 1 ? "sessão" : "sessões"}</div>
      </div>
    `;
  } else {
    const sub = item.data ? `<div class="entry-date">${fmtDay(item.data)}</div>` : "";
    value = item.valor;
    left = `
      <div class="entry-body">
        <div class="entry-name">${escapeHtml(item.nome)}</div>
        ${sub}
      </div>
    `;
  }
  el.innerHTML = `<div class="entry-left">${left}</div><div class="entry-value">${money(value)}</div>`;
  el.addEventListener("click", () => openSheet(item, state.tab === "receita" ? "paciente" : undefined));
  if (state.tab === "receita") {
    el.querySelector("[data-check]").addEventListener("click", (e) => {
      e.stopPropagation();
      togglePago(item);
    });
  }
  return el;
}

function togglePago(item) {
  const mk = monthKey(state.year, state.month);
  setMes(item, mk, { pago: !getMes(item, mk).pago });
  saveData();
  render();
}

function renderMain() {
  renderTabInto($("main-content"), state.tab);
}

function renderTabInto(container, tab) {
  const savedTab = state.tab;
  state.tab = tab;
  container.innerHTML = "";
  if (tab === "anual") {
    renderAnual(container);
  } else if (tab === "gastosanuais") {
    renderGastosAnuais(container);
  } else if (tab === "economias") {
    renderEconomias(container);
  } else if (tab === "receita") {
    renderReceita(container);
  } else {
    const items = listFor(tab);
    container.appendChild(renderStats(items));
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.innerHTML = emptyMessage();
      container.appendChild(empty);
    } else {
      const list = document.createElement("div");
      items.forEach((item) => list.appendChild(renderEntry(item)));
      container.appendChild(list);
    }
  }
  state.tab = savedTab;
}

function sectionLabel(text) {
  const el = document.createElement("div");
  el.className = "section-label";
  el.textContent = text;
  return el;
}

function renderReceita(container) {
  const mk = monthKey(state.year, state.month);
  const pacientes = listFor("receita");
  const avulsos = data.receitasAvulsas
    .filter((x) => x.data && x.data.slice(0, 7) === mk)
    .sort((a, b) => b.data.localeCompare(a.data) || a.createdAt - b.createdAt);

  const { recebido: recebidoPacientes, aReceber } = receitaTotals(pacientes);
  const recebido = recebidoPacientes + avulsos.reduce((s, x) => s + x.valor, 0);

  const statsWrap = document.createElement("div");
  statsWrap.className = "stats";
  statsWrap.innerHTML = stat(money(recebido), "Recebido") + stat(money(aReceber), "A receber") + stat(String(pacientes.length), pacientes.length === 1 ? "Paciente" : "Pacientes");
  container.appendChild(statsWrap);

  container.appendChild(sectionLabel("Pacientes"));
  if (!pacientes.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = '<div class="t">Nenhum paciente cadastrado</div><div class="s">Toque em "Novo" para adicionar o primeiro</div>';
    container.appendChild(empty);
  } else {
    const list = document.createElement("div");
    pacientes.forEach((item) => list.appendChild(renderEntry(item)));
    container.appendChild(list);
  }

  container.appendChild(sectionLabel("Receitas avulsas"));
  if (!avulsos.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = '<div class="t">Nenhuma receita avulsa neste mês</div><div class="s">Toque em "Novo" → Outro</div>';
    container.appendChild(empty);
  } else {
    const list = document.createElement("div");
    avulsos.forEach((item) => list.appendChild(renderAvulsoEntry(item)));
    container.appendChild(list);
  }
}

function renderAvulsoEntry(item) {
  const el = document.createElement("div");
  el.className = "entry";
  const sub = item.data ? `<div class="entry-date">${fmtDay(item.data)}</div>` : "";
  el.innerHTML = `
    <div class="entry-left">
      <div class="entry-body">
        <div class="entry-name">${escapeHtml(item.nome)}</div>
        ${sub}
      </div>
    </div>
    <div class="entry-value">${money(item.valor)}</div>
  `;
  el.addEventListener("click", () => openSheet(item, "avulso"));
  return el;
}

function renderAnual(main) {
  const rows = anualRows(state.year);
  const totalAno = rows.reduce((s, r) => s + r.recebido, 0);
  const aReceberAno = rows.reduce((s, r) => s + r.aReceber, 0);
  const statsWrap = document.createElement("div");
  statsWrap.className = "stats";
  statsWrap.innerHTML = stat(money(totalAno), "Total do ano") + stat(money(totalAno / 12), "Média mensal") + stat(money(aReceberAno), "A receber");
  main.appendChild(statsWrap);
  const list = document.createElement("div");
  rows.forEach((r) => list.appendChild(renderMonthRow(r)));
  main.appendChild(list);
}

function renderGastosAnuais(main) {
  const rows = gastosAnualRows(state.year);
  const totalAno = rows.reduce((s, r) => s + r.total, 0);
  const statsWrap = document.createElement("div");
  statsWrap.className = "stats";
  statsWrap.innerHTML = stat(money(totalAno), "Total do ano") + stat(money(totalAno / 12), "Média mensal") + stat(money(rows[0].fixos), "Fixos mensal");
  main.appendChild(statsWrap);
  const list = document.createElement("div");
  rows.forEach((r) => list.appendChild(renderGastoMonthRow(r)));
  main.appendChild(list);
}

function renderEconomias(main) {
  const rows = economiaRows(state.year);
  const totalAno = rows.reduce((s, r) => s + r.saldo, 0);
  const mesesLucro = rows.filter((r) => r.saldo >= 0).length;
  const isProfitYear = totalAno >= 0;
  const statsWrap = document.createElement("div");
  statsWrap.className = "stats";
  statsWrap.innerHTML = stat(money(Math.abs(totalAno)), isProfitYear ? "Lucro do ano" : "Déficit do ano") + stat(String(mesesLucro), mesesLucro === 1 ? "Mês no lucro" : "Meses no lucro") + stat(String(12 - mesesLucro), (12 - mesesLucro) === 1 ? "Mês no déficit" : "Meses no déficit");
  main.appendChild(statsWrap);
  const list = document.createElement("div");
  rows.forEach((r) => list.appendChild(renderEconomiaMonthRow(r)));
  main.appendChild(list);
}

function renderMonthRow(r) {
  const el = document.createElement("div");
  el.className = "entry";
  const label = r.label.charAt(0).toUpperCase() + r.label.slice(1);
  const sub = r.aReceber > 0 ? `<div class="entry-date">A receber: ${money(r.aReceber)}</div>` : "";
  el.innerHTML = `
    <div class="entry-left">
      <div class="entry-body">
        <div class="entry-name">${label}</div>
        ${sub}
      </div>
    </div>
    <div class="entry-value">${money(r.recebido)}</div>
  `;
  el.addEventListener("click", () => {
    state.tab = "receita";
    state.month = r.m;
    render();
  });
  return el;
}

function renderGastoMonthRow(r) {
  const el = document.createElement("div");
  el.className = "entry";
  const label = r.label.charAt(0).toUpperCase() + r.label.slice(1);
  el.innerHTML = `
    <div class="entry-left">
      <div class="entry-body">
        <div class="entry-name">${label}</div>
        <div class="entry-date">Fixos ${money(r.fixos)} · Aleatórios ${money(r.aleatorios)}</div>
      </div>
    </div>
    <div class="entry-value">${money(r.total)}</div>
  `;
  el.addEventListener("click", () => {
    state.tab = "aleatorios";
    state.month = r.m;
    render();
  });
  return el;
}

function renderEconomiaMonthRow(r) {
  const el = document.createElement("div");
  el.className = "entry static";
  const label = r.label.charAt(0).toUpperCase() + r.label.slice(1);
  const isProfit = r.saldo >= 0;
  el.innerHTML = `
    <div class="entry-left">
      <div class="entry-body">
        <div class="entry-name">${label}</div>
        <div class="entry-date">${isProfit ? "Lucro" : "Déficit"}</div>
      </div>
    </div>
    <div class="entry-value ${isProfit ? "pos" : "neg"}">${money(Math.abs(r.saldo))}</div>
  `;
  return el;
}

function openSheet(item, tipo) {
  state.editingId = item ? item.id : null;
  state.receitaTipo = tipo || "paciente";
  $("f-nome").value = item ? item.nome : "";
  $("delete-btn").classList.toggle("hidden", !item);
  $("field-fixo-periodo").classList.add("hidden");

  if (state.tab === "receita") {
    $("field-receita-tipo").classList.toggle("hidden", !!item);
    document.querySelectorAll("#field-receita-tipo button").forEach((b) => b.classList.toggle("on", b.dataset.tipo === state.receitaTipo));

    if (state.receitaTipo === "avulso") {
      $("sheet-title").textContent = item ? "Editar receita avulsa" : "Nova receita avulsa";
      $("label-nome").textContent = "Descrição";
      $("f-nome").placeholder = "Ex: Consulta avulsa, palestra...";
      $("field-receita-valores").classList.add("hidden");
      $("field-encerrar").classList.add("hidden");
      $("field-repeat").classList.add("hidden");
      $("field-valor").classList.remove("hidden");
      $("f-valor").value = item ? String(item.valor).replace(".", ",") : "";
      $("field-data").classList.remove("hidden");
      $("f-data").value = item ? item.data : defaultDateForAdd();
    } else {
      const mk = monthKey(state.year, state.month);
      const m = item ? getMes(item, mk) : { numSessoes: 0, pago: false, valorSessao: 0 };
      $("sheet-title").textContent = item ? "Editar paciente" : "Novo paciente";
      $("label-nome").textContent = "Paciente";
      $("f-nome").placeholder = "Nome do paciente";
      $("field-receita-valores").classList.remove("hidden");
      $("field-valor").classList.add("hidden");
      $("field-data").classList.add("hidden");
      $("field-repeat").classList.add("hidden");
      $("field-encerrar").classList.remove("hidden");
      $("f-valor-sessao").value = item ? String(m.valorSessao).replace(".", ",") : "";
      $("label-sessoes").textContent = `Sessões em ${MONTHS[state.month]}`;
      $("f-sessoes").value = String(m.numSessoes);
      $("f-encerrar").value = item ? (item.inactiveFrom || "") : "";
    }
  } else {
    $("field-receita-tipo").classList.add("hidden");
    const f = FIELDS[state.tab];
    $("sheet-title").textContent = item ? `Editar ${f.title}` : `Novo ${f.title}`;
    $("label-nome").textContent = f.nomeLabel;
    $("f-nome").placeholder = f.nomePlaceholder;
    $("field-receita-valores").classList.add("hidden");
    $("field-encerrar").classList.add("hidden");
    $("field-valor").classList.remove("hidden");
    $("f-valor").value = item ? String(item.valor).replace(".", ",") : "";
    $("field-data").classList.toggle("hidden", !f.hasDate);
    $("f-data").value = item ? item.data : (f.hasDate ? defaultDateForAdd() : "");
    const showRepeat = state.tab === "aleatorios" && !item;
    $("field-repeat").classList.toggle("hidden", !showRepeat);
    if (showRepeat) $("f-repeat").value = "1";
    if (state.tab === "fixos") {
      $("field-fixo-periodo").classList.remove("hidden");
      $("f-inicio").value = item ? (item.activeFrom || "") : "";
      $("f-fim").value = item ? (item.inactiveFrom || "") : "";
    }
  }
  $("entry-sheet").classList.remove("hidden");
  $("f-nome").focus();
}

function closeSheet() {
  $("entry-sheet").classList.add("hidden");
  state.editingId = null;
}

function saveEntry() {
  const nome = $("f-nome").value.trim();
  if (!nome) { $("f-nome").focus(); return; }
  const list = currentList();

  if (state.tab === "receita" && state.receitaTipo === "avulso") {
    const valor = parseValor($("f-valor").value);
    if (isNaN(valor) || valor < 0) { $("f-valor").focus(); return; }
    const dataVal = $("f-data").value || defaultDateForAdd();
    if (state.editingId) {
      const item = list.find((x) => x.id === state.editingId);
      if (item) { item.nome = nome; item.valor = valor; item.data = dataVal; }
    } else {
      list.push({ id: uid(), nome, valor, data: dataVal, createdAt: Date.now() });
    }
  } else if (state.tab === "receita") {
    const valorSessao = parseValor($("f-valor-sessao").value);
    const numSessoes = Math.max(0, parseInt($("f-sessoes").value, 10) || 0);
    if (isNaN(valorSessao) || valorSessao < 0) { $("f-valor-sessao").focus(); return; }
    const mk = monthKey(state.year, state.month);
    const encerrar = $("f-encerrar").value;
    if (state.editingId) {
      const item = list.find((x) => x.id === state.editingId);
      if (item) {
        item.nome = nome;
        item.valorSessao = valorSessao;
        setMes(item, mk, { numSessoes, valorSessao });
        if (encerrar) item.inactiveFrom = encerrar; else delete item.inactiveFrom;
      }
    } else {
      const item = { id: uid(), nome, valorSessao, meses: {}, createdAt: Date.now() };
      setMes(item, mk, { numSessoes, valorSessao });
      if (encerrar) item.inactiveFrom = encerrar;
      list.push(item);
    }
  } else {
    const valor = parseValor($("f-valor").value);
    if (isNaN(valor) || valor < 0) { $("f-valor").focus(); return; }
    const hasDate = FIELDS[state.tab].hasDate;
    const inicio = state.tab === "fixos" ? $("f-inicio").value : "";
    const fim = state.tab === "fixos" ? $("f-fim").value : "";
    if (state.editingId) {
      const item = list.find((x) => x.id === state.editingId);
      if (item) {
        item.nome = nome;
        item.valor = valor;
        if (hasDate) item.data = $("f-data").value || defaultDateForAdd();
        if (state.tab === "fixos") {
          if (inicio) item.activeFrom = inicio; else delete item.activeFrom;
          if (fim) item.inactiveFrom = fim; else delete item.inactiveFrom;
        }
      }
    } else if (state.tab === "aleatorios") {
      const baseDate = $("f-data").value || defaultDateForAdd();
      const repeat = Math.max(1, parseInt($("f-repeat").value, 10) || 1);
      for (let i = 0; i < repeat; i++) {
        list.push({ id: uid(), nome, valor, data: addMonths(baseDate, i), createdAt: Date.now() + i });
      }
    } else {
      const item = { id: uid(), nome, valor, createdAt: Date.now() };
      if (hasDate) item.data = $("f-data").value || defaultDateForAdd();
      if (state.tab === "fixos") {
        if (inicio) item.activeFrom = inicio;
        if (fim) item.inactiveFrom = fim;
      }
      list.push(item);
    }
  }
  saveData();
  closeSheet();
  render();
}

function deleteEntry() {
  if (!state.editingId) return;
  if (!confirm("Excluir este registro?")) return;
  const list = currentList();
  const idx = list.findIndex((x) => x.id === state.editingId);
  if (idx !== -1) list.splice(idx, 1);
  saveData();
  closeSheet();
  render();
}

function navMonth(delta) {
  let m = state.month + delta;
  let y = state.year;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  state.month = m;
  state.year = y;
  render();
}

function navYear(delta) {
  state.year += delta;
  render();
}

function goToday() {
  state.year = now.getFullYear();
  state.month = now.getMonth();
  render();
}

const TAB_ORDER = ["receita", "anual", "fixos", "aleatorios", "gastosanuais", "economias"];
let swipe = null;
let swipeAnimating = false;

function onSwipeStart(e) {
  if (swipeAnimating || e.touches.length !== 1 || !$("entry-sheet").classList.contains("hidden")) return;
  const t = e.touches[0];
  swipe = { startX: t.clientX, startY: t.clientY, dragging: false, dir: 0, dx: 0, targetTab: null, incoming: null };
}

function onSwipeMove(e) {
  if (!swipe) return;
  const t = e.touches[0];
  const dx = t.clientX - swipe.startX;
  const dy = t.clientY - swipe.startY;
  if (!swipe.dragging) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dy) >= Math.abs(dx)) { swipe = null; return; }
    const idx = TAB_ORDER.indexOf(state.tab);
    const dir = dx < 0 ? 1 : -1;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= TAB_ORDER.length) { swipe = null; return; }
    swipe.dragging = true;
    swipe.dir = dir;
    swipe.targetTab = TAB_ORDER[targetIdx];
    const incoming = document.createElement("main");
    incoming.className = "incoming";
    incoming.style.transform = `translateX(${dir * 100}%)`;
    $("swipe-viewport").appendChild(incoming);
    renderTabInto(incoming, swipe.targetTab);
    swipe.incoming = incoming;
  }
  e.preventDefault();
  swipe.dx = dx;
  const width = $("swipe-viewport").clientWidth || 1;
  const pct = Math.max(-1, Math.min(1, dx / width)) * 100;
  $("main-content").style.transform = `translateX(${pct}%)`;
  swipe.incoming.style.transform = `translateX(${swipe.dir * 100 + pct}%)`;
}

function onSwipeEnd() {
  if (!swipe) { swipe = null; return; }
  if (!swipe.dragging) { swipe = null; return; }
  const main = $("main-content");
  const width = $("swipe-viewport").clientWidth || 1;
  const passed = Math.abs(swipe.dx) > width * 0.3;
  const targetTab = swipe.targetTab;
  const incoming = swipe.incoming;
  swipeAnimating = true;
  main.style.transition = "transform .22s cubic-bezier(.22,1,.36,1)";
  incoming.style.transition = "transform .22s cubic-bezier(.22,1,.36,1)";
  if (passed) {
    main.style.transform = `translateX(${swipe.dir * -100}%)`;
    incoming.style.transform = "translateX(0%)";
  } else {
    main.style.transform = "translateX(0%)";
    incoming.style.transform = `translateX(${swipe.dir * 100}%)`;
  }
  setTimeout(() => {
    main.style.transition = "";
    main.style.transform = "";
    incoming.remove();
    swipeAnimating = false;
    if (passed) {
      state.tab = targetTab;
      render();
    }
  }, 220);
  swipe = null;
}

$("swipe-viewport").addEventListener("touchstart", onSwipeStart, { passive: true });
$("swipe-viewport").addEventListener("touchmove", onSwipeMove, { passive: false });
$("swipe-viewport").addEventListener("touchend", onSwipeEnd);
$("swipe-viewport").addEventListener("touchcancel", onSwipeEnd);

$("tab-switch").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tab]");
  if (!btn) return;
  state.tab = btn.dataset.tab;
  render();
});
$("nav-back").addEventListener("click", () => (isYearTab(state.tab) ? navYear(-1) : navMonth(-1)));
$("nav-fwd").addEventListener("click", () => (isYearTab(state.tab) ? navYear(1) : navMonth(1)));
$("today-btn").addEventListener("click", goToday);
$("add-btn").addEventListener("click", () => openSheet(null, state.tab === "receita" ? "paciente" : undefined));
$("cancel-btn").addEventListener("click", closeSheet);
$("save-btn").addEventListener("click", saveEntry);
$("delete-btn").addEventListener("click", deleteEntry);
$("entry-sheet").addEventListener("click", (e) => { if (e.target.id === "entry-sheet") closeSheet(); });
$("field-receita-tipo").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tipo]");
  if (!btn) return;
  openSheet(null, btn.dataset.tipo);
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
