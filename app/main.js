// Capturar elementos del DOM
const contenedor = document.getElementById('container');
const productosDiv = document.getElementById('productos');
const carritoDiv = document.getElementById('carrito');
const totalDiv = document.getElementById('total');

/* funcion asincrona conexion json */
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
let total = 0;

// Mostrar productos en la tienda
function mostrarProductos() {
  
  productos.forEach( (producto) => {

    const productoDiv = document.createElement('div');

    productoDiv.classList.add('producto');

    productoDiv.innerHTML = 
    `<img src="img/${producto.imagen}" alt="producto zapatilla" class="fotoZapa">
    <p class='marcaZapa'>${producto.nombre} - u$d:${producto.precio}</p>
    <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>`;

    productosDiv.appendChild(productoDiv);
    
  });
}

// Agregar producto al carrito
function agregarAlCarrito(productId) {
  const producto = productos.find((p) => p.id === productId);
  const productoEnCarrito = carrito.find((p) => p.id === productId);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    producto.cantidad = 1; // Inicializar cantidad en el producto
    carrito.push(producto);
  }

  guardarCarritoEnLocalStorage();
  mostrarCarrito();
}  

// Mostrar productos en el carrito
function mostrarCarrito() {

  carritoDiv.innerHTML = '';

  carrito.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('row');
    itemDiv.classList.add('item-carrito');

    itemDiv.innerHTML = `<div class='col-12 col-md-4 divProducto'><img src="img/${item.imagen}" alt="producto zapatilla" class="fotoZapa2">
    <p>${item.nombre}</p><p>u$d:${item.precio}</p> </div>
    <div class='col-12 col-md-8 divCantidad'><div class='increment'><button class='btnCantidad' onclick="decrementarCantidad(${item.id})">-</button>
    <p>x ${item.cantidad} = u$d:${item.precio * item.cantidad}</p>
    <button class='btnCantidad' onclick="incrementarCantidad(${item.id})">+</button></div>
    <button class='btnEliminar' onclick="eliminarDelCarrito(${index})">Eliminar</button></div>`; 

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

      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

      let carritoHTML = '';
      carrito.forEach(item => {
        carritoHTML += `
        <div class="item-compra">
        <p>${item.nombre} - u$s:${item.precio} x ${item.cantidad} = u$d${item.precio * item.cantidad}</p>
        </div>
        `;
      });
     
      container.innerHTML = `<div class='containerPago'>
      <h2 class='saludoCompra'>Gran elección!</h2>
      <p>El total de su compra es de u$d:${total}</p>
      <div class='compra'>${carritoHTML}</div>
      <div class="formularioContainer">
        <h2 class='saludoCompra'>Ingrese aquí los datos de su tarjeta</h2>
        <img class='fotoPago' src='img/tarjetas.png'>
        <form id="purchase-form">
          <div class="form-group">
            <label for="firstName">Nombre:</label>
            <input type="text" id="firstName" name="firstName" value="Coder" class="imputPago">
          </div>
          <div class="form-group">
            <label for="lastName">Apellido:</label>
            <input type="text" id="lastName" name="lastName" value="House" class="imputPago">
          </div>
          <div class="form-group">
            <label for="creditCardNumber">Número de Tarjeta de Crédito:</label>
            <input type="text" id="creditCardNumber" name="creditCardNumber" value="1234 5678 9012 3456" class="imputPago">
          </div>
          <button id=botonPagar type="button" class="btn-submit" onclick='confirmarPago()'>Pagar</button>
        </form>
      </div></div> `;
      /* direccionar contenedor de facturacion al centro de la pantalla */ 
      const facturacion = document.getElementById('container');
      if(facturacion) {
        facturacion.scrollIntoView({block: 'center'})
      }

    });

    contenedor.appendChild(botonCompra);       

  } else if (carrito.length === 0 && document.getElementById('botonCompra')) {
  document.getElementById('botonCompra').remove(); 
  }
}

/* boton pagar */
function confirmarPago() {
  sweetAlert(); 
  vaciarCarrito();
  localStorage.removeItem('carrito');
  
}

function sweetAlert() {
  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Gracias por tu compra!",
    showConfirmButton: false,
    timer: 2000
  });
  setTimeout(() => {
    window.location.href = window.location.href;
  }, 2000);
  
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
  mostrarCarrito(); //actualiza carrito
  localStorage.removeItem('carrito'); //actualiza storage
}

// Mostrar total de la compra
function mostrarTotal() {
  total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  totalDiv.innerHTML = `Total: u$d:${total}`;
  let navTotal = document.getElementById('montoTotal'); 
  navTotal.textContent = `Total: u$d:${total}`;

  let cantidadNav = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  let contadorCantidad = document.getElementById('navCantidad');
  contadorCantidad.textContent = `${cantidadNav}`;

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











