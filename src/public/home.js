
socket = io()

const listContainer = document.querySelector(".listContainer")

socket.on("showList", (list) => {
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


document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('.btn');

    let cartId;

    try {
        const response = await fetch('http://localhost:8080/api/carts/user');
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        
        if (data.carrito) {
            cartId = data.carrito._id;
            console.log("ID del carrito:", cartId);
        } else if (response.status === 404) {
            console.log("No se encontró un carrito, se creará uno nuevo");
            // Aquí podrías hacer otra solicitud para crear un nuevo carrito si es necesario
        } else {
            console.error('Respuesta inesperada:', data);
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-pid');
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error:', errorText);
                    alert('Error: ' + errorText);
                    return;
                }

                const result = await response.json();
                alert(result.mensaje);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});