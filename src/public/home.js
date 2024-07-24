socket = io()

const listContainer = document.querySelector(".listContainer")

socket.on("showList", (list) => {
    console.log(list)
    listContainer.innerHTML = ""
    list.forEach(e => {
        const div = document.createElement("div")
        div.classList.add("container")
        div.id = e.id
        const innerDiv = document.createElement("div")
        innerDiv.classList.add("innerContainer")
        const title = document.createElement("p")
        title.innerText = e.title
        const description = document.createElement("p")
        description.innerText = e.description
        const price = document.createElement("p")
        price.innerText = `Precio: $${e.price}`
        const category = document.createElement("p")
        category.innerText = `Categoría: ${e.category}`
        const stock = document.createElement("p")
        stock.innerText = `Stock: ${e.stock}`
        const status = document.createElement("p")
        status.innerText = `Estado: ${e.status ? "disponible" : "no disponible"}`
        const code = document.createElement("p")
        code.innerText = `Código: ${e.code}`

        div.appendChild(title)
        innerDiv.appendChild(description)
        innerDiv.appendChild(price)
        innerDiv.appendChild(category)
        innerDiv.appendChild(stock)
        innerDiv.appendChild(status)
        innerDiv.appendChild(code)
        div.appendChild(innerDiv)
        listContainer.appendChild(div)

    })
})