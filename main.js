// Capturar elementos del DOM
const contenedor = document.getElementById('container');
const productosDiv = document.getElementById('productos');
const carritoDiv = document.getElementById('carrito');
const totalDiv = document.getElementById('total');


/* funcion asincrona */
async function cargarProductos() {
  try {
    const respuesta = await fetch ('productos.JSON');
    if (!respuesta.ok) {
      throw new Error('No pudimos conectar con el servidor')
    }
    const data = await respuesta.json();
    productos = data;
    mostrarProductos()
  } catch (error) {
    console.error('algo salió mal', error);
  }
}



let carrito = [];
let productos = []; 

// Mostrar productos en la tienda
function mostrarProductos() {
  
  productos.forEach( (producto) => {

    const productoDiv = document.createElement('div');

    productoDiv.classList.add('producto');

    productoDiv.innerHTML = 
    `<img src="img/${producto.imagen}" alt="producto zapatilla" class="fotoZapa">
    <p>${producto.nombre} - $${producto.precio}</p>
    <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>`;

    productosDiv.appendChild(productoDiv);
    
  });
}

// Agregar producto al carrito
/* function agregarAlCarrito(productId) {
  
  const producto = productos.find((p) => p.id === productId);
  carrito.push(producto);
  guardarCarritoEnLocalStorage();
  mostrarCarrito();
} */



// Agregar producto al carrito
function agregarAlCarrito(productId) {
  const producto = productos.find((p) => p.id === productId);
  const productoEnCarrito = carrito.find((p) => p.id === productId);

  if (productoEnCarrito) {
      // Si el producto ya está en el carrito, incrementa su cantidad existente
      productoEnCarrito.cantidad++;
  } else {
      // Si no, agrega el producto al carrito con su cantidad inicial
      producto.cantidad = 1; // Inicializar cantidad en el producto
      carrito.push(producto);
  }

  guardarCarritoEnLocalStorage();
  mostrarCarrito();
}  





// Mostrar productos en el carrito
function mostrarCarrito() {

  carritoDiv.innerHTML = ''; // esto es para limpiar el contenido antes de agregar los productos (importante);

  carrito.forEach((item, index) => {

    const itemDiv = document.createElement('div');


    itemDiv.classList.add('item-carrito');

    itemDiv.innerHTML = `<img src="img/${item.imagen}" alt="producto zapatilla" class="fotoZapa2">
    <p>${item.nombre}</p><p>$${item.precio}</p> 
    <div class='divCantidad'><button onclick="decrementarCantidad(${item.id})">-</button>
    <p>x ${item.cantidad} = $${item.precio * item.cantidad}</p>
    <button onclick="incrementarCantidad(${item.id})">+</button></div>
    <button onclick="eliminarDelCarrito(${index})">Eliminar</button> `; 

    carritoDiv.appendChild(itemDiv);

  });

 

  mostrarTotal();
  mostrarBoton();
}


// Incrementar cantidad de producto en el carrito
function incrementarCantidad(productId) {
  const productoEnCarrito = carrito.find((p) => p.id === productId);
  if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
      guardarCarritoEnLocalStorage();
      mostrarCarrito();
  }
}

// Decrementar cantidad de producto en el carrito
function decrementarCantidad(productId) {
  const productoEnCarrito = carrito.find((p) => p.id === productId);
  if (productoEnCarrito) {
      if (productoEnCarrito.cantidad > 1) {
          productoEnCarrito.cantidad--;
      } else {
          const index = carrito.indexOf(productoEnCarrito);
          carrito.splice(index, 1);
      }
      guardarCarritoEnLocalStorage();
      mostrarCarrito();
  }
}


// boton de comprar
function mostrarBoton() {

  if (!document.getElementById('botonCompra') && carrito.length > 0) {

  const botonCompra = document.createElement('button');
  botonCompra.textContent = 'Comprar';
  botonCompra.id = 'botonCompra';
  botonCompra.className = 'botonCompra';

  botonCompra.addEventListener('click', () => { 
    alert('Su pedido esta siendo despachado');

    vaciarCarrito();
    localStorage.removeItem('carrito');
  });

  contenedor.appendChild(botonCompra);

  } else if (carrito.length === 0 && document.getElementById('botonCompra')) {
    document.getElementById('botonCompra').remove();
    
  }
}


  
// Eliminar producto del carrito
function eliminarDelCarrito(index) {

  carrito.splice(index, 1);

  mostrarCarrito(); //actualiza carrito
  guardarCarritoEnLocalStorage() //actualiza storage

}



// Vaciar carrito de compras
function vaciarCarrito() {

  carrito = [];

  mostrarCarrito();  //actualiza carrito
  localStorage.removeItem('carrito'); //actualiza storage
}


// Mostrar total de la compra
function mostrarTotal() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  totalDiv.innerHTML = `Total: $${total}`;
  // Agregar clase CSS para extender el margen
  totalDiv.classList.add('total-margin');  

}



// Guardar carrito en localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito DESDE localStorage
function cargarCarritoDeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      mostrarCarrito();
  }
}



// Inicializar cargar los productos
cargarProductos()

//traer info del localstorage al carrito si es que hay
cargarCarritoDeLocalStorage();











