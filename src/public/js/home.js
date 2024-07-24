const socket = io()  

// socket.on('newProduct', (product) => {
//     // Lógica para agregar el nuevo producto a la lista
//     const ul = document.querySelector('ul');
//     const li = document.createElement('li');
//     li.innerHTML = 
//         `<div>
//             <p>Nombre ${product.title}</p>
//             <p>Descripcion: ${product.description}</p>
//             <p>Codigo ${product.code}</p>
//             <p>Precio: $${product.price}</p>
//             <p>En stock: ${product.stock} unidades</p>
//             <p>Categoria: ${product.category}</p>
//             <button class="agregar">Agregar producto</button>
//         </div>`;
//     ul.appendChild(li);
// });



// let user;
// let chatBox = document.getElementById('chatBox')

// Swal.fire({
//     title:"identificate",
//     input:"text",
//     text: "tu nombre",
//     inputValidator: (value) => {
//         return !value && "Necesitas identrificarte"
//     },
//     allowOutsideClick: false
// }).then(result => {
//     user = result.value
//     console.log(user)
// })

// chatBox.addEventListener("keyup", e => {
//     if(e.key === "Enter"){
//         if(chatBox.value.trim().length>0){
//             socket.emit("message",  {user: user, message: chatBox.value}
//             )
//             console.log(chatBox.value)
//             chatBox.value= ""
//         }
//      }
// })
    
// socket.on("messageLogs", data =>{
//     let log = document.getElementById("messageLogs")
//     let messages = ""
//     data.forEach(message => {
//         messages = messages + `${message.user} dice: ${message.message} </br>` 
//     });
//     log.innerHTML = messages
// })

