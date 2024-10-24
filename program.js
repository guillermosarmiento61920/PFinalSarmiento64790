// definicion de los productos. base de datos con Class
class Producto {
    constructor(nombre, precio, index) {
        this.nombre = nombre;
        this.precio = precio;
        this.index = index;
    }
}

const productos = [
    new Producto("Vino + Gaseosa", 5100, 1),
    new Producto("Vino + Jugo", 4675, 2),
    new Producto("Gaseosa", 2000, 3),
    new Producto("Jugo", 1500, 4),
    new Producto("Vino", 4000, 5),
    new Producto("Cerveza", 3000, 6),
];

// para generar array de productos en el htmll
const visualProductos = (arregloProductos) => {
    const seccProductos = document.getElementById(`seccProductos`)
    seccProductos.innerHTML = ""

    // para generar visualizacion de arreglo de productos
    arregloProductos.forEach(({ nombre, precio, index }) => {
        seccProductos.innerHTML += `
        <div class="col" id="promo${index}">
            <h3>${nombre}</h3>
            <img src="./assets/img/${nombre}.jpg" class="fotoProducto" alt="${nombre}">
            <p>$${precio}</p>
            <form>
                <label for="cantidad${index}">Cantidad:</label>
                <input id="cantidad${index}" placeholder="Ingrese cantidad" required type="text" name="cant">
            </form>
            <button id="boton${index}" class="boton">Agregar</button>
        </div>`;
    });

    // Asignar evento de clic al botón posterior a HTML
    arregloProductos.forEach(({ precio, nombre, index }) => {
        const boton = document.getElementById(`boton${index}`);
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let cantidadProd = Number(document.getElementById(`cantidad${index}`).value);

            // validar que la cantidad sea entero postiivo
            if (isNaN(cantidadProd) || cantidadProd <= 0) {
                Swal.fire({
                    title: "Ingresaste una cantidad invalida",
                    icon: "error"
            });
            } else {
                actualizarCarrito(cantidadProd, precio, nombre);
            }
        });
    });
}

// llamo a la funcion para mostrar en HTML
visualProductos(productos)

// el total del carro empieza vacio
let cantidadCarrito = 0
let precioCarrito = 0

const botonPagar = document.getElementById(`btnPagar`);
const mostrarBotonPagar = () => {
    if (precioCarrito > 0) {
        botonPagar.classList.remove(`ocultar`);
    } else {
        botonPagar.classList.add(`ocultar`);
    }
}

// funcioanmiento boton pagar
botonPagar.addEventListener("click", () => {
    const usuario = document.getElementById(`inputUsuario`).value;
    const contrasena = document.getElementById(`inputContra`).value;
    const usuarioValido = verificarUsuario(usuario, contrasena); // Verificar si el usuario es válido

    if (usuarioValido && precioCarrito > 0) {
        mensajePago.innerHTML = `<p>Pago realizado con éxito. Gracias por su compra.</p>`;
        // Aquí se puede añadir el flujo de pago o limpiar el carrito si es necesario
    } else if (!usuarioValido) {
        mensajePago.innerHTML = `<p>Debe iniciar sesión para realizar el pago. Por favor, introduzca sus datos.</p>`;
    }
});

// Función para actualizar el carrito
const actualizarCarrito = (cantidad, precio, nombre) => {
    const totalesCarrito = document.getElementById(`totalesCarrito`);
    const totalFinal = document.getElementById(`totalFinal`);

    // sumar la cantidad de productos
    cantidadCarrito += cantidad;
    precioCarrito += cantidad * precio;

    // crea un nuevo elemento agregado al carrito
    const nuevoProducto = document.createElement(`div`);
    nuevoProducto.classList.add(`productoCarrito`);

    const botonEliminar = document.createElement(`button`);
    botonEliminar.innerText = "Eliminar";
    botonEliminar.classList.add("botonEliminar");

    // eliminar producto del carrito
    botonEliminar.addEventListener("click", () => {
        eliminarDelCarrito(cantidad, precio, nuevoProducto);
    });

    // anadir nuevo prudcot
    nuevoProducto.innerHTML = `${nombre}: ${cantidad} x $${precio} = $${cantidad * precio}`;
    nuevoProducto.appendChild(botonEliminar);
    totalesCarrito.appendChild(nuevoProducto);

    Toastify({
        text: `Agregaste producto ${nombre}`,
        duration: 1000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "green",
          opacity: "0.8"
        },
        onClick: function(){}
      }).showToast();

    // Mostrar el total general enel carrito
    totalFinal.innerHTML = `
    <div class="subrayado"> Total del carrito: $${precioCarrito} </div>`;

    mostrarBotonPagar();
}

// funcion para eliminar los products
const eliminarDelCarrito = (cantidad, precio, productoElemento) => {

    cantidadCarrito -= cantidad;
    precioCarrito -= cantidad * precio;

    productoElemento.remove();

    // Actualiza el total
    const totalFinal = document.getElementById(`totalFinal`);
    totalFinal.innerHTML = `
    <div class="subrayado"> Total del carrito: $${precioCarrito} </div>`;

    mostrarBotonPagar();
};

const btnOcultar = document.getElementById(`btnOcultar`)

btnOcultar.addEventListener("click", () => {
    const productosCarrito = document.querySelectorAll(`.productoCarrito`); // Solo los productos
    productosCarrito.forEach(producto => {
        producto.classList.toggle(`ocultar`);
    });

    if (productosCarrito[0].classList.contains(`ocultar`)) {
        btnOcultar.innerText = "Mostrar Productos";
    } else {
        btnOcultar.innerText = "Ocultar Productos";
    }
})

// empiezo con la definicion de usuarios
// para obtener la base de datos de usuarios desde localStorage
const obtenerUsuarios = () => {
    const usuarios = localStorage.getItem(`usuariosDB`);
    return usuarios ? JSON.parse(usuarios) : [];
};

// guardar la base de datos de usuarios
const guardarUsuarios = (usuarios) => {
    localStorage.setItem(`usuariosDB`, JSON.stringify(usuarios));
};

if (!localStorage.getItem('usuariosDB')) {
    guardarUsuarios([]);
}

console.log('Usuarios en localStorage:', obtenerUsuarios());

// exitencia de usuarios. retorna true si existen ambos
const verificarUsuario = (usuario, contrasena) => {
    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find(user => user.usuario === usuario);

    if (usuarioEncontrado && usuarioEncontrado.contrasena === contrasena) {
        return true;
    }
    return false;
};

// para agregar un nuevo usuario
const agregarUsuario = (usuario, contrasena) => {
    const usuarios = obtenerUsuarios();
    usuarios.push({ usuario, contrasena });
    guardarUsuarios(usuarios);
};

document.getElementById(`loginForm`).addEventListener(`submit`, (e) => {
    e.preventDefault();

    const usuario = document.getElementById(`inputUsuario`).value;
    const contrasena = document.getElementById(`inputContra`).value;
    const mensaje = document.getElementById(`mensaje`);
    const loginButton = document.querySelector(`#loginForm button`);

    if (usuario === "" || contrasena === "") {
        mensaje.innerHTML = "Usuario o contrasena vacio"
        return;
    }

    if (verificarUsuario(usuario, contrasena)) {
        mensaje.innerHTML = `Usuario: ${usuario}`;
        loginButton.innerHTML = "LogOff";

        // para cambiar comportamiento de boton login
        loginButton.removeEventListener("click", loginHandler);
        loginButton.addEventListener("click", logOffHandler);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Bienvenido ${usuario}`,
            showConfirmButton: false,
            timer: 1500
          });

    } else {
        agregarUsuario(usuario, contrasena);
        mensaje.innerHTML = `Nuevo usuario "${usuario}" registrado`;

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Usuario "${usuario}" registrado con éxito`,
            showConfirmButton: false,
            timer: 1500
        });

        // para mantener el flujo del boton login
        document.getElementById(`inputUsuario`).value = "";
        document.getElementById(`inputContra`).value = "";
    }
});

// funciones para manejar el logoff
const logOffHandler = (e) => {
    e.preventDefault();
    const mensaje = document.getElementById(`mensaje`);
    const loginButton = document.querySelector(`#loginForm button`);

    mensaje.innerHTML = "";
    document.getElementById(`inputUsuario`).value = "";
    document.getElementById(`inputContra`).value = "";
    loginButton.innerHTML = "Login";

//   devolver funcion original
    loginButton.removeEventListener("click", logOffHandler);
    loginButton.addEventListener("click", loginHandler);
};

// Función original para manejar el evento de Login
const loginHandler = (e) => {
    e.preventDefault();
};
// fin definicion de usuarios

// Llamo a la función para mostrar productos en HTML
visualProductos(productos);

const repartJson = []
const listaRepart = document.getElementById("repartJson")

async function mejoresRepart() {
    listaRepart.innerHTML = ""
    try {
        const datosJSON = await fetch("repartidores.json")
        const resultadosJson = await datosJSON.json()

        resultadosJson.forEach(element => {
            repartJson.push(element)
        });

        repartJson.sort((a, b) => b.entregas - a.entregas);
        
        for (let i = 0; i < 3; i++) {
            const repartidor = repartJson[i];
            const li = document.createElement("li");
            li.innerText = `${repartidor.repartidor} con ${repartidor.entregas} entregas, trabajando de ${repartidor.iniTurno}hs a ${repartidor.finTurno}hs`;
            listaRepart.appendChild(li);
        }
    } catch (error) {
        error.innerText = error
        listaRepart.innerHTML = "Se ha producido un error"
    }
}

mejoresRepart()