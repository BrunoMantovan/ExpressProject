const loginBtn = document.querySelector("#loginBtn")
const nombre = document.querySelector("#name")
const apellido = document.querySelector("#lastname")
const edad = document.querySelector("#age")
const email = document.querySelector("#email")
const password = document.querySelector("#password")

const user ={
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    password: "",
}

const handleChange = (e) => {
    const {name, value} = e.target
    user[name] = name === "edad" ? parseInt(value) : value
}

nombre.addEventListener("input", handleChange)
apellido.addEventListener("input", handleChange)
edad.addEventListener("input", handleChange)
email.addEventListener("input", handleChange)
password.addEventListener("input", handleChange)

loginBtn.addEventListener("click", async()=>{
    try {
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        if(response.status === 200 || response.status < 300){
            window.location.href = "/login"
        }
    }catch(e){
        console.log("error". e)
    }
})