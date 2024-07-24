

socket = io()

const listContainer = document.querySelector(".listContainer")
const addButton = document.querySelector(".addButton")
const updateButton = document.querySelector(".updateButton")
const deleteButton = document.querySelector(".deleteButton")

socket.on("error", (error) => {
    Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        allowOutsideClick: false,
    })
})
function changeDom(list){
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
}
socket.on("showList", (list) => {
    console.log(list)
    changeDom(list)
})
socket.on("addedProduct", (list) => {
    console.log(list)
    changeDom(list)
})

function addProduct() {
    const title = document.querySelector("#title").value
    const code = document.querySelector("#code").value
    const description = document.querySelector("#description").value
    const price = parseFloat(document.querySelector("#price").value)
    const category = document.querySelector("#category").value
    const stock = parseInt(document.querySelector("#stock").value)
    const id = document.querySelector("#id").value

    const product = {
        title,
        code,
        description,
        price,
        category,
        stock,
        status: true,
        thumbnails: []
    }
    if (title === "" || code === "" || description === "" || price === 0 || category === "" || stock === 0) {
        return Swal.fire({
            title: "Error",
            text: "Faltan campos o tienen valores incorrectos",
            allowOutsideClick: false,
        })
    }
    console.log(product)
    socket.emit("addProduct", product)
}

function updateProduct() {
    const title = document.querySelector("#title2").value
    const code = document.querySelector("#code2").value
    const description = document.querySelector("#description2").value
    const price = parseFloat(document.querySelector("#price2").value)
    const category = document.querySelector("#category2").value
    const stock = parseInt(document.querySelector("#stock2").value)
    const id = document.querySelector("#id").value
    
    if (id === "") {
        return Swal.fire({
            title: "Error",
            text: "ID es obligatorio para actualizar un producto",
            allowOutsideClick: false,
        });
    }
    let status;
    if (isNaN(stock)) {
        status = undefined;
    } else if (stock > 0) {
        status = true;
    } else if (stock === 0) {
        status = false;
    }
    const product = {
        id,
        updatedProduct: {
            title,
            ...(code && { code }),
            ...(description && { description }),
            ...(price && !isNaN(price) && price > 0 && { price }),
            ...(category && { category }),
            ...(stock && !isNaN(stock) && { stock }),
            ...(status !== undefined && { status })
        }
    };
    socket.emit("updateProduct", product)
}

function deleteProduct() {
    const id = document.querySelector("#id2").value
    if (id === "") {
        return Swal.fire({
            title: "Error",
            text: "ID es obligatorio para eliminar un producto",
            allowOutsideClick: false,
        });
    }
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
    }).then((result) => {
        if (result.isConfirmed) {
            socket.emit("deleteProduct", id)
        }
    })
}

addButton.addEventListener("click", () => {
    addProduct()
})
updateButton.addEventListener("click", () => {
    updateProduct()
})
deleteButton.addEventListener("click", () => {
    deleteProduct()
})