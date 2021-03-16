
const registerForm = document.getElementById("register-form")
registerForm.addEventListener("submit", handleRegister)


function handleRegister(e) {
    e.preventDefault()
    const username = registerForm[0].value
    const tempPin = registerForm[1].value
    const pin = new Hashes.MD5().hex(tempPin)
    const newUser = {username, pin, "interests": ["AAPL"]}
    
    axios.post("/user", newUser)
    .then(response => {
        const data = response.data
        if (data.err){
            alert("Username Already Taken")
        } else {
            localStorage.setItem("currentUser", JSON.stringify(newUser))
            window.location.href = "index.html"
        }
    })
    .catch(err => console.log(err))
}


