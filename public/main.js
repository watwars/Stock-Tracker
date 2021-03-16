const landing = document.getElementById("landing");
const main = document.getElementById("main");
const logoutBtn = document.getElementById("logout")
logoutBtn.addEventListener("click", handleLogout)

let currentUser = JSON.parse(localStorage.getItem("currentUser"))

window.onload = () => {
    setView()
    // test()
}

// Part of code to run the spinner
const spinner = document.getElementById("spinner");
function showSpinner() {
  spinner.classList.add("spinner-show")
}

function hideSpinner() {
  spinner.classList.remove("spinner-show")
}


function setView() {
    if (currentUser) {
        main.style.display = "initial"
        manageCurrentUser();
        showStocks();
    } else {
        landing.style.display = "flex"
    }
}

function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload()
}

function manageCurrentUser() {
    document.getElementById("currentUsername").innerHTML = currentUser.username
    // localStorage.setItem("currentInterests", "AAPL");
}

function setCurrentInterest() {
    console.log(this.innerHTML)
    localStorage.setItem("currentInterests", JSON.stringify(this.innerHTML))
}

let table = document.getElementById("show-stocks");
function displayStocks(i) {
    return showStockHelper(100)
    .then(v => {
        if (JSON.parse(sessionStorage.getItem(i))) {
            makeTable(JSON.parse(sessionStorage.getItem(i)), i);
        } else {
            axios.get(`https://finnhub.io/api/v1/quote?symbol=${i}&token=c0pin1n48v6rvej4n2dg`)
            .then(res => {
                let info = res.data;
                sessionStorage.setItem(i, JSON.stringify(info));
                makeTable(info, i);
            })
        }
    })
}
function makeTable(info, i) {
    let newTr = document.createElement("tr");
    let std = document.createElement("td");
    let slink = document.createElement("a");
    slink.href = "show-stocks.html"
    // slink.href = "#";
    slink.innerHTML = i;
    slink.onclick = setCurrentInterest;
    std.appendChild(slink);
    let pctd = document.createElement("td");
    pctd.innerHTML = info.pc.toFixed(2);
    let otd = document.createElement("td");
    otd.innerHTML = info.o.toFixed(2);
    let ltd = document.createElement("td");
    ltd.innerHTML = info.l.toFixed(2);
    let htd = document.createElement("td");
    htd.innerHTML = info.h.toFixed(2);
    let ctd = document.createElement("td");
    ctd.innerHTML = info.c.toFixed(2);
    let changetd = document.createElement("td");
    let change = (info.c - info.pc) / info.pc * 100;
    if (change < 0) {
        changetd.style.color = "red"
        changetd.innerHTML = change.toFixed(2) + "%"
    } else {
        changetd.style.color = "green"
        changetd.innerHTML = "+" + change.toFixed(2) + "%"
    }
    newTr.appendChild(std)
    newTr.appendChild(pctd)
    newTr.appendChild(otd)
    newTr.appendChild(ltd)
    newTr.appendChild(htd)
    newTr.appendChild(ctd)
    newTr.appendChild(changetd)
    table.appendChild(newTr);
}
function showStockHelper(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function showStocks() {
    let interests = currentUser.interests.sort();
    console.log(interests)
    for (let i = 0; i < interests.length; i++) {
        await displayStocks(interests[i])
    }
}

document.getElementById("fetch-new").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.reload();
})

