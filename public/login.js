const loginForm = document.getElementById("login-form")
loginForm.addEventListener("submit", handleLogin)

function handleLogin(e) {
    e.preventDefault()
    const username = loginForm[0].value
    const tempPin = loginForm[1].value
    const pin = new Hashes.MD5().hex(tempPin)
    const loginUser = {username, pin}
    axios.post("/user/login", loginUser)
    .then(response => {
        const data = response.data
        const message = data.message
        console.log(message)
        if (message == "Invalid username") {
            alert("You need to register first")
        } else if (message == "Invalid pin") {
            alert("Pin entered is invalid")
        } else if (message == "Success") {
            const userData = data.user
            console.log(userData)
            localStorage.setItem("currentUser", JSON.stringify(userData))
            window.location.href = "index.html"
        }
    })
    .catch(err => console.log(err))
}