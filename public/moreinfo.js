let currentInterest = JSON.parse(localStorage.getItem("currentInterests"));

window.onload = () => {
    document.getElementById("stock-name").innerHTML = currentInterest;
    fetchRecommendations(currentInterest);
    fetchNews(currentInterest);
}

const strongSellColor = "#813231";
const sellColor = "#f45b5b";
const holdColor = "#b98b1d";
const buyColor = "#2cb954";
const strongBuyColor = "#186f37";

function fetchRecommendations(stock) {
    if (localStorage.getItem(`${stock}r`)) {
        const recommendations = JSON.parse(localStorage.getItem(`${stock}r`));
        showBar(recommendations);
    } else {
        axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${stock}&token=c0pin1n48v6rvej4n2dg`)
        .then(data => {
            let recommendations = data.data[0];
            localStorage.setItem(`${stock}r`, JSON.stringify(recommendations));
            showBar(recommendations);
        })
    }
}

function showBar(recommendations) {
    const totalWidth = 1000;
    document.getElementById("recommendation-name").innerHTML = currentInterest;
    document.getElementById("recommendation-date").innerHTML = recommendations.period;
    const sell = Number(recommendations.sell);
    const strongSell = Number(recommendations.strongSell);
    const strongBuy = Number(recommendations.strongBuy);
    const buy = Number(recommendations.buy);
    const hold = Number(recommendations.hold);

    const total = sell + strongSell + strongBuy + buy + hold;
    let sellWidth = Math.floor(sell / total * totalWidth)
    let strongSellWidth = Math.floor(strongSell / total * totalWidth)
    let holdWidth = Math.floor(hold / total * totalWidth)
    let buyWidth = Math.floor(buy / total * totalWidth)
    let strongBuyWidth = totalWidth - sellWidth - strongSellWidth - holdWidth - buyWidth;
    createBar(strongSell, strongSellColor, strongSellWidth)
    createBar(sell, sellColor, sellWidth);
    createBar(hold, holdColor, holdWidth);
    createBar(buy, buyColor, buyWidth);
    createBar(strongBuy, strongBuyColor, strongBuyWidth)
}

function createBar(num, color, length) {
    let bar = document.getElementById("bar");
    let newBar = document.createElement("div");
    newBar.classList.add("ind-bar");
    newBar.innerHTML = num;
    newBar.style.width = length + "px";
    newBar.style.backgroundColor = color;
    bar.appendChild(newBar)
}

function formatDate(date) {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    let string = `${year}-${month}-${day}`;
    return string;
}

function obtainDate(n) {
    let currentDate = new Date()
    let currentString = formatDate(currentDate);
    
    let pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - n);
    let pastString = formatDate(pastDate);

    let dates = [pastString, currentString]
    console.log(dates)
    return dates;
}

function fetchNews(stock) {
    let dates = obtainDate(3);
    let today = dates[1];
    let past = dates[0];

    if (localStorage.getItem(`${stock}news`)) {
        const news = JSON.parse(localStorage.getItem(`${stock}news`));
        console.log(news)
        displayNews(news);
    } else {
        axios.get(`https://finnhub.io/api/v1/company-news?symbol=${stock}&from=${past}&to=${today}&token=c0pin1n48v6rvej4n2dg`)
        .then(response => {
            console.log(response)
            news = response.data.slice(0, Math.min(response.data.length, 11));
            console.log(news)
            if (news.length == 0) {
                document.getElementById("news-title").innerHTML =  "No news to show for this stock"
                return;
            }
            document.getElementById("news-title").innerHTML =  "Recent News"
            localStorage.setItem(`${stock}news`, JSON.stringify(news))
            displayNews(news);
        })
    }
}

function displayNews(news) {
    for (let i = 0; i < news.length; i++) {
        createNewsElement(news[i]);
    }
}

const newsDiv = document.getElementById("news");
function createNewsElement(item) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("news-card");

    let photo = document.createElement("img");
    photo.src = item.image;

    let right = document.createElement("p")
    right.classList.add("right")
    right.innerHTML = `<a href=${item.url}><div><small>${item.source}</small><br><span>${item.headline}</span>
    <p>${item.summary}</p></div></a>`

    console.log(right)
    newDiv.appendChild(photo);
    newDiv.appendChild(right);
    console.log(newDiv)
    newsDiv.appendChild(newDiv);
}