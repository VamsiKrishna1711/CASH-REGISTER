// Global variables
let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

const cashInput = document.getElementById("cash");
const btn = document.getElementById("purchase-btn");
const changeDiv = document.getElementById("change-due");
const currencyDisplay = document.getElementById("currency-display");

// Display cash drawer on load
function displayCashDrawer() {
    currencyDisplay.innerHTML = cid.map(([name, amount]) => 
        `<div class="currency-item">
            <span class="currency-name">${name}</span>
            <span class="currency-amount">$${amount.toFixed(2)}</span>
        </div>`
    ).join('');
}

displayCashDrawer();

// Currency values
const currencyUnits = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
};

btn.addEventListener("click", () => {
    let cash = Number(cashInput.value);

    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cash === price) {
        changeDiv.textContent = "No change due - customer paid with exact cash";
        return;
    }

    let changeNeeded = cash - price;
    let totalCID = cid.reduce((sum, curr) => sum + curr[1], 0).toFixed(2);

    if (Number(totalCID) < changeNeeded) {
        changeDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    let changeArr = [];
    let drawer = JSON.parse(JSON.stringify(cid)).reverse(); // highest to lowest

    for (let [unit, amount] of drawer) {
        let unitValue = currencyUnits[unit];
        let toReturn = 0;

        while (changeNeeded >= unitValue && amount > 0) {
            changeNeeded = (changeNeeded - unitValue).toFixed(2);
            amount -= unitValue;
            toReturn += unitValue;
        }

        if (toReturn > 0) {
            changeArr.push([unit, Number(toReturn.toFixed(2))]);
        }
    }

    if (changeNeeded > 0) {
        changeDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    let changeTotal = changeArr.reduce((sum, curr) => sum + curr[1], 0).toFixed(2);

    if (Number(totalCID) === Number(changeTotal)) {
        changeDiv.innerHTML = "<strong>Status: CLOSED</strong><br>" + changeArr.map(c => `${c[0]}: $${c[1]}`).join("<br>");
    } else {
        changeDiv.innerHTML = "<strong>Status: OPEN</strong><br>" + changeArr.map(c => `${c[0]}: $${c[1]}`).join("<br>");
    }
    displayCashDrawer();
});
