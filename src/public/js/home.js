
  socket = io()

//  socket.emit('message', "comunicandome desde webSocket home")

  socket.on("products", data => {

    const productsList = document.getElementById("productsList");

    productsList.innerHTML = '';

    data.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <h2>${product.title}</h2>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>ID:</strong> ${product.id}</p>
            <br>
        `;

        productsList.appendChild(productElement);
    });

 })
 
//  socket.on("productsA", data => {
//     console.log("recibidos", data);

//      const productsList = document.getElementById("productsList");

//      productsList.innerHTML = '';

//      data.forEach(product => {
//          const productElement = document.createElement('div');
//          productElement.classList.add('product');

//          productElement.innerHTML = `
//              <h2>${product.title}</h2>
//              <p><strong>Descripción:</strong> ${product.description}</p>
//              <p><strong>Código:</strong> ${product.code}</p>
//              <p><strong>Precio:</strong> $${product.price}</p>
//              <p><strong>Stock:</strong> ${product.stock}</p>
//              <p><strong>Categoría:</strong> ${product.category}</p>
//              <p><strong>ID:</strong> ${product.id}</p>
//              </br>
//         `;

//          productsList.appendChild(productElement);
//      });

//  })
