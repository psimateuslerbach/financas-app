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

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        atendimentos: d.atendimentos || [],
        gastosFixos: d.gastosFixos || [],
        gastosAleatorios: d.gastosAleatorios || [],
      };
    }
  } catch (e) {}
  return { atendimentos: [], gastosFixos: [], gastosAleatorios: [] };
}
let data = loadData();
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

const now = new Date();
let state = { tab: "receita", year: now.getFullYear(), month: now.getMonth(), editingId: null };

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
  return (item.meses && item.meses[key]) || { numSessoes: 0, pago: false };
}
function setMes(item, key, patch) {
  if (!item.meses) item.meses = {};
  item.meses[key] = { ...getMes(item, key), ...patch };
}
function isActiveIn(p, mk) {
  return !p.inactiveFrom || mk < p.inactiveFrom;
}
function receitaTotals(items) {
  const mk = monthKey(state.year, state.month);
  let recebido = 0, aReceber = 0;
  items.forEach((p) => {
    if (!isActiveIn(p, mk)) return;
    const m = getMes(p, mk);
    const total = p.valorSessao * m.numSessoes;
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
      const total = p.valorSessao * rec.numSessoes;
      if (rec.pago) recebido += total; else aReceber += total;
    });
    return { m, label, recebido, aReceber };
  });
}

function currentList() {
  if (state.tab === "receita") return data.atendimentos;
  if (state.tab === "fixos") return data.gastosFixos;
  return data.gastosAleatorios;
}

function listFor(tab) {
  if (tab === "receita") {
    const mk = monthKey(state.year, state.month);
    return data.atendimentos.filter((p) => isActiveIn(p, mk)).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }
  if (tab === "fixos") {
    return [...data.gastosFixos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }
  return data.gastosAleatorios.filter((x) => inCurrentMonth(x.data)).sort((a, b) => b.data.localeCompare(a.data) || a.createdAt - b.createdAt);
}

function totals() {
  const { recebido, aReceber } = receitaTotals(data.atendimentos);
  const fixos = data.gastosFixos.reduce((s, x) => s + x.valor, 0);
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
  $("add-btn").classList.toggle("hidden", state.tab === "anual" || state.tab === "economias");
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
  $("datebar").classList.toggle("hidden", state.tab === "fixos");
  $("month-label").textContent = state.tab === "anual" ? String(state.year) : `${MONTHS[state.month]} de ${state.year}`;
}

function renderTodayChip() {
  $("today-btn").textContent = state.tab === "anual" ? "Este ano" : "Este mês";
}

function stat(v, l) { return `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`; }

function renderStats(items) {
  const wrap = document.createElement("div");
  if (state.tab === "receita") {
    const { recebido, aReceber } = receitaTotals(items);
    const n = items.length;
    wrap.className = "stats";
    wrap.innerHTML = stat(money(recebido), "Recebido") + stat(money(aReceber), "A receber") + stat(String(n), n === 1 ? "Paciente" : "Pacientes");
  } else if (state.tab === "fixos") {
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
  if (state.tab === "receita") return '<div class="t">Nenhum paciente cadastrado</div><div class="s">Toque em "Novo" para adicionar o primeiro</div>';
  if (state.tab === "fixos") return '<div class="t">Nenhum gasto fixo cadastrado</div><div class="s">Aluguel, internet, assinaturas...</div>';
  return '<div class="t">Nenhum gasto neste mês</div><div class="s">Toque em "Novo" para adicionar</div>';
}

function renderEntry(item) {
  const el = document.createElement("div");
  el.className = "entry";
  let left, value;
  if (state.tab === "receita") {
    const m = getMes(item, monthKey(state.year, state.month));
    value = item.valorSessao * m.numSessoes;
    el.classList.toggle("paid", m.pago);
    left = `
      <button class="entry-check ${m.pago ? "on" : ""}" data-check type="button">✓</button>
      <div class="entry-body">
        <div class="entry-name">${escapeHtml(item.nome)}</div>
        <div class="entry-date">${money(item.valorSessao)} × ${m.numSessoes} ${m.numSessoes === 1 ? "sessão" : "sessões"}</div>
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
  el.addEventListener("click", () => openSheet(item));
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
  const main = $("main-content");
  main.innerHTML = "";
  if (state.tab === "anual") {
    renderAnual(main);
    return;
  }
  if (state.tab === "economias") {
    renderEconomias(main);
    return;
  }
  const items = listFor(state.tab);
  main.appendChild(renderStats(items));
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = emptyMessage();
    main.appendChild(empty);
    return;
  }
  const list = document.createElement("div");
  items.forEach((item) => list.appendChild(renderEntry(item)));
  main.appendChild(list);
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

function renderEconomias(main) {
  const t = totals();
  const statsWrap = document.createElement("div");
  statsWrap.className = "stats";
  statsWrap.innerHTML = stat(money(t.receita), "Receita") + stat(money(t.fixos), "Gastos fixos") + stat(money(t.aleatorios), "Gastos aleatórios");
  main.appendChild(statsWrap);

  const isProfit = t.saldo >= 0;
  const card = document.createElement("div");
  card.className = "result-card";
  card.innerHTML = `
    <div class="rl">${isProfit ? "Lucro" : "Déficit"} de ${MONTHS[state.month]}</div>
    <div class="rv ${isProfit ? "pos" : "neg"}">${money(Math.abs(t.saldo))}</div>
  `;
  main.appendChild(card);
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

function openSheet(item) {
  state.editingId = item ? item.id : null;
  $("f-nome").value = item ? item.nome : "";
  $("delete-btn").classList.toggle("hidden", !item);

  if (state.tab === "receita") {
    const mk = monthKey(state.year, state.month);
    const m = item ? getMes(item, mk) : { numSessoes: 0, pago: false };
    $("sheet-title").textContent = item ? "Editar paciente" : "Novo paciente";
    $("label-nome").textContent = "Paciente";
    $("f-nome").placeholder = "Nome do paciente";
    $("field-receita-valores").classList.remove("hidden");
    $("field-valor").classList.add("hidden");
    $("field-data").classList.add("hidden");
    $("field-repeat").classList.add("hidden");
    $("field-encerrar").classList.remove("hidden");
    $("f-valor-sessao").value = item ? String(item.valorSessao).replace(".", ",") : "";
    $("label-sessoes").textContent = `Sessões em ${MONTHS[state.month]}`;
    $("f-sessoes").value = String(m.numSessoes);
    $("f-encerrar").value = item ? (item.inactiveFrom || "") : "";
  } else {
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

  if (state.tab === "receita") {
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
        setMes(item, mk, { numSessoes });
        if (encerrar) item.inactiveFrom = encerrar; else delete item.inactiveFrom;
      }
    } else {
      const item = { id: uid(), nome, valorSessao, meses: {}, createdAt: Date.now() };
      setMes(item, mk, { numSessoes });
      if (encerrar) item.inactiveFrom = encerrar;
      list.push(item);
    }
  } else {
    const valor = parseValor($("f-valor").value);
    if (isNaN(valor) || valor < 0) { $("f-valor").focus(); return; }
    const hasDate = FIELDS[state.tab].hasDate;
    if (state.editingId) {
      const item = list.find((x) => x.id === state.editingId);
      if (item) {
        item.nome = nome;
        item.valor = valor;
        if (hasDate) item.data = $("f-data").value || defaultDateForAdd();
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

$("tab-switch").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tab]");
  if (!btn) return;
  state.tab = btn.dataset.tab;
  render();
});
$("nav-back").addEventListener("click", () => (state.tab === "anual" ? navYear(-1) : navMonth(-1)));
$("nav-fwd").addEventListener("click", () => (state.tab === "anual" ? navYear(1) : navMonth(1)));
$("today-btn").addEventListener("click", goToday);
$("add-btn").addEventListener("click", () => openSheet(null));
$("cancel-btn").addEventListener("click", closeSheet);
$("save-btn").addEventListener("click", saveEntry);
$("delete-btn").addEventListener("click", deleteEntry);
$("entry-sheet").addEventListener("click", (e) => { if (e.target.id === "entry-sheet") closeSheet(); });

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
