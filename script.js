// Expense Tracker: plain JavaScript, data saved in localStorage.

const STORAGE_KEY = "expense-tracker-data";
let transactions = loadTransactions();

// ---- Grab elements ----
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const errorEl = document.getElementById("error");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");
const breakdownEl = document.getElementById("breakdown");

// ---- Storage ----
function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// ---- Helpers ----
function formatMoney(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

// ---- Add and delete ----
function addTransaction() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (!title) return showError("Enter a description.");
  if (!amount || amount <= 0) return showError("Enter an amount greater than 0.");
  if (!date) return showError("Pick a date.");

  transactions.push({
    id: Date.now(),
    title,
    amount,
    type: typeInput.value,
    category: categoryInput.value,
    date
  });

  saveTransactions();
  titleInput.value = "";
  amountInput.value = "";
  showError("");
  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  render();
}

function showError(message) {
  errorEl.textContent = message;
}

// ---- Rendering ----
function render() {
  renderSummary();
  renderList();
  renderBreakdown();
}

function renderSummary() {
  let income = 0;
  let expense = 0;
  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  document.getElementById("income").textContent = formatMoney(income);
  document.getElementById("expense").textContent = formatMoney(expense);
  document.getElementById("balance").textContent = formatMoney(income - expense);
}

function renderList() {
  const typeFilter = filterType.value;
  const categoryFilter = filterCategory.value;

  const visible = transactions
    .filter(t => typeFilter === "all" || t.type === typeFilter)
    .filter(t => categoryFilter === "all" || t.category === categoryFilter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  listEl.innerHTML = "";
  emptyEl.classList.toggle("hidden", visible.length > 0);

  visible.forEach(t => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between gap-3 bg-white rounded-xl border border-ink/10 px-4 py-3";

    const left = document.createElement("div");
    left.className = "min-w-0";
    const name = document.createElement("p");
    name.className = "font-semibold truncate";
    name.textContent = t.title;
    const meta = document.createElement("p");
    meta.className = "text-sm text-ink/60";
    meta.textContent = t.category + ", " + formatDate(t.date);
    left.append(name, meta);

    const right = document.createElement("div");
    right.className = "flex items-center gap-3 shrink-0";
    const amount = document.createElement("span");
    amount.className = "font-bold " + (t.type === "income" ? "text-teal" : "text-rust");
    amount.textContent = (t.type === "income" ? "+" : "-") + formatMoney(t.amount);
    const del = document.createElement("button");
    del.type = "button";
    del.className = "text-sm text-ink/50 hover:text-rust underline";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete " + t.title);
    del.addEventListener("click", () => deleteTransaction(t.id));
    right.append(amount, del);

    li.append(left, right);
    listEl.appendChild(li);
  });
}

function renderBreakdown() {
  const totals = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  breakdownEl.innerHTML = "";

  if (entries.length === 0) {
    const p = document.createElement("p");
    p.className = "text-sm text-ink/60";
    p.textContent = "Add an expense to see where your money goes.";
    breakdownEl.appendChild(p);
    return;
  }

  const max = entries[0][1];
  entries.forEach(([category, total]) => {
    const row = document.createElement("div");
    const label = document.createElement("div");
    label.className = "flex justify-between text-sm mb-1";
    const name = document.createElement("span");
    name.textContent = category;
    const value = document.createElement("span");
    value.className = "font-semibold";
    value.textContent = formatMoney(total);
    label.append(name, value);

    const track = document.createElement("div");
    track.className = "h-2 bg-ink/10 rounded-full overflow-hidden";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = Math.round((total / max) * 100) + "%";
    track.appendChild(fill);

    row.append(label, track);
    breakdownEl.appendChild(row);
  });
}

function fillCategoryFilter() {
  Array.from(categoryInput.options).forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.value;
    filterCategory.appendChild(o);
  });
}

// ---- Events ----
document.getElementById("add-btn").addEventListener("click", addTransaction);
document.getElementById("form").addEventListener("keydown", e => {
  if (e.key === "Enter") addTransaction();
});
filterType.addEventListener("change", renderList);
filterCategory.addEventListener("change", renderList);
document.getElementById("clear-btn").addEventListener("click", () => {
  if (transactions.length && confirm("Delete all transactions? This cannot be undone.")) {
    transactions = [];
    saveTransactions();
    render();
  }
});

// ---- Start ----
dateInput.value = todayISO();
fillCategoryFilter();
render();
