let balance = 10000;
let portfolio = {};
let transactionLog = [];
let chart; // Declare globally


const stocks = [
  { name: "TCS", price: 2500 },
  { name: "Infosys", price: 1500 },
  { name: "Reliance", price: 2100 },
  { name: "Goldman Sachs", price: 2000 }
];

function updateBalance() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function updatePortfolio() {
  const portfolioList = document.getElementById("portfolio");
  portfolioList.innerHTML = "";

  for (let stock in portfolio) {
    const li = document.createElement("li");
    li.textContent = `${stock}: ${portfolio[stock]} shares`;
    portfolioList.appendChild(li);
  }

  if (Object.keys(portfolio).length === 0) {
    portfolioList.innerHTML = "<li>No stocks owned yet.</li>";
  }
  renderChart();

}

function renderStocks() {
  const stockList = document.getElementById("stock-list");
  stockList.innerHTML = "";

  stocks.forEach(stock => {
    const div = document.createElement("div");
    div.className = "stock-item";
    div.innerHTML = `
      <span><strong>${stock.name}</strong> - ₹${stock.price}</span>
      <div>
        <button onclick="buyStock('${stock.name}', ${stock.price})">Buy</button>
        <button onclick="sellStock('${stock.name}', ${stock.price})">Sell</button>
      </div>
    `;
    stockList.appendChild(div);
  });
}

function buyStock(name, price) {
  if (balance >= price) {
    balance -= price;
    portfolio[name] = (portfolio[name] || 0) + 1;
    const timestamp = new Date().toLocaleString();
    transactionLog.unshift(`[${timestamp}] Bought 1 share of ${name} at ₹${price}`);
    updateBalance();
    updatePortfolio();
    updateTransactionLog();
  } else {
    alert("Insufficient balance!");
  }
}


function sellStock(name, price) {
  if (portfolio[name] && portfolio[name] > 0) {
    balance += price;
    portfolio[name]--;
    const timestamp = new Date().toLocaleString();
    transactionLog.unshift(`[${timestamp}] Sold 1 share of ${name} at ₹${price}`);
    if (portfolio[name] === 0) delete portfolio[name];
    updateBalance();
    updatePortfolio();
    updateTransactionLog();
  } else {
    alert("You don't own this stock!");
  }
}


function updateTransactionLog() {
  const log = document.getElementById("transaction-log");
  log.innerHTML = "";
  transactionLog.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    log.appendChild(li);
  });
}

// 🌙 Dark Mode Support
const toggle = document.getElementById("darkModeToggle");
const isDark = localStorage.getItem("darkMode") === "true";

if (isDark) {
  document.body.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

function renderChart() {
  const ctx = document.getElementById('portfolioChart').getContext('2d');
  const labels = Object.keys(portfolio);
  const data = Object.values(portfolio);

  if (chart) chart.destroy(); // Destroy old chart to prevent duplicates

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Shares Owned',
        data: data,
        backgroundColor: [
          '#0d6efd', '#20c997', '#fd7e14', '#dc3545', '#6f42c1'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

// Initialize
updateBalance();
renderStocks();
updatePortfolio();
updateTransactionLog();
