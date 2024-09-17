const loginBtn = document.querySelector("#loginBtn")
const email = document.querySelector("#email")
const password = document.querySelector("#password")

const user ={
    email: "",
    password: "",
}

const handleChange = (e) => {
    const {name, value} = e.target
    user[name] = value
}

email.addEventListener("input", handleChange)
password.addEventListener("input", handleChange)

loginBtn.addEventListener("click", async()=>{
    try {
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        if(response.status === 200 || response.status < 300){
            window.location.href = "/perfil"
        }
    }catch(e){
        console.log("error". e)
    }
})