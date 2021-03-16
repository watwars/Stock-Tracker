
let currentUser = JSON.parse(localStorage.getItem("currentUser"))

window.onload = () => {
  if (!currentUser) {
      window.location.href = "index.html"
  }
  showInterests();
  document.getElementById("settings-user").innerHTML = currentUser.username;
}

function showInterests() {
  let interests = currentUser.interests
  let interestsDiv = document.getElementById("interests")
  let interestedStocks = interests.sort()
  interestedStocks.forEach(i => {
      const newItem = document.createElement("li")
      let newDiv = document.createElement("div");
      newDiv.classList.add("sinterest");
      let newSpan = document.createElement("span");
      newSpan.innerHTML = i;
      newDiv.appendChild(newSpan);
      let newBtn = document.createElement("button");
      newBtn.innerHTML = "Remove";
      newBtn.onclick = handleRemoveInterest;
      newBtn.classList.add("removeinterest");
      newBtn.classList.add("btn")
      newBtn.classList.add("btn-warning")
      newDiv.appendChild(newBtn);
      newItem.appendChild(newDiv);
      interestsDiv.appendChild(newItem)
  })
}

function handleRemoveInterest() {
  let stockToRemove = this.parentNode.firstChild.innerHTML;
  axios.put(`/user/${currentUser.username}/delete`, {interests: stockToRemove})
  .then(() => {
    console.log("success")
    let newUser = {
      username: currentUser.username,
      pin: currentUser.pin,
      id: currentUser.id,
      interests: currentUser.interests.filter(stock => stock != stockToRemove)
    }
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    window.location.reload();
  })
}



const addInterestForm = document.getElementById("add-interest")
addInterestForm.addEventListener("submit", handleAutoComplete)

// Part of code to run the spinner
const spinner = document.getElementById("spinner");
function showSpinner() {
  spinner.classList.add("spinner-show")
}

function hideSpinner() {
  spinner.classList.remove("spinner-show")
}

function handleAutoComplete(e) {
  e.preventDefault()
  let stocks = []
  let userInput = addInterestForm[0].value
  if (userInput.length == 0) {
    alert("You did not input anything")
    return;
  }

  let url = `https://finnhub.io/api/v1/search?q=${userInput}&token=c0pin1n48v6rvej4n2dg`
  showSpinner();
  axios.get(url)
  .then(response => {
      hideSpinner();
      let obtainedStocks = response.data
      let results = obtainedStocks.result 
      if (results.length == 0) {
        alert("We have not find any stocks that match your input");
        addInterestForm[0].value = ""
        let potentialInterests = document.getElementById("potential-interests")
        removeAllChildNodes(potentialInterests);
        return;
      }
      for (let i = 0; i < Math.min(obtainedStocks.count, 5); i++) {
          let newStock = `${results[i].displaySymbol}, ${results[i].description}`
          stocks.push(newStock)
      }
      addInterestForm[0].value = ""
      showPotentialStocks(stocks)
  })
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

async function showPotentialStocks(stocks) {
    let potentialInterests = document.getElementById("potential-interests")
    await removeAllChildNodes(potentialInterests);
    const message = document.createElement("p")
    message.innerHTML = "Click on one of the following stock to add to your interest list"
    message.classList.add("pmessage")
    potentialInterests.appendChild(message)
    for (let i = 0; i < stocks.length; i++) {
      let newBtn = document.createElement("button")
      newBtn.innerHTML= stocks[i]
      newBtn.classList.add("pstock")
      newBtn.onclick = handleSubmit
      potentialInterests.appendChild(newBtn)
    }
}

function handleSubmit() {
  let newSymbol = this.innerHTML.split(",")[0];
  if (currentUser.interests.includes(newSymbol)) {
    alert("This stock is already in your interest list");
    return;
  }
  if (currentUser.interests.length >= 30) {
    alert("You have reached the limit of 30 stocks in your interests list!");
    return;
  }
  console.log(newSymbol)
  axios.put(`/user/${currentUser.username}/add`, {interests: newSymbol})
  .then(() => {
    console.log("success")
    currentUser.interests.push(newSymbol)
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    window.location.reload();
  })
}

// Code for deleting account
const deleteBtn = document.getElementById("delete-account")
deleteBtn.addEventListener("click", handleDeleteAccount)
function handleDeleteAccount() {
    let confirmation = confirm("Do you want to really delete your account. Your account will not be recoverable")
    if (confirmation) {
        axios.delete(`/user/${currentUser.username}`)
        .then(user => {
            const message = user.data.message;
            if (message == "Deleted") {
                alert(`The account with username ${currentUser.username} has been successfully deleted`)
                localStorage.clear()
                window.location.href = "index.html"
            }
        })
    }
}