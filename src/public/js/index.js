// document.addEventListener("DOMContentLoaded", () => {
const socket = io()

//1
socket.emit('message', "comunicandome desde webSocket index")

const formulario = document.getElementById("formulario")

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const code = document.getElementById('code').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;
        const category = document.getElementById('category').value;

        if (event){
            //2
            socket.emit('productForm', {title,
                description,
                code,
                price,
                stock,
                category});
            console.log("enviado al socket")
        }

    // formulario.reset()
});

//3
socket.on("products", data => {

    const productsList = document.getElementById("productsList");

    productsList.innerHTML = '';

    data.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <p><strong>Nombre:</strong> ${product.title}</p>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>ID:</strong> ${product.id}</p>
             <button class="delete-button" data-id="${product.id}">Eliminar Producto</button>
        `;

        productsList.appendChild(productElement);
    });

    
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            //4
            socket.emit("deleteProduct", productId);
            console.log("producto eliminado con el id", productId);

        });
    });
});

// })
