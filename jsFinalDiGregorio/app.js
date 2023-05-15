//queda pendiente ->vender x cantidad y al eliminar solo dejar marca (con '.metodo()' para no eliminar registro)
const losProductos = [];
class unProducto {
    constructor(nombre, precio, stock){
        this.nombre = String(nombre).toLowerCase();
        this.precio = Number(precio);
        this.stock = Number(stock);
        this.vendido = false;
        this.ventas = 0;
    }
    vender(){
        this.vendido = true;
        this.stock--;
        this.ventas++;
        let valorIva = this.precio * 0.21;
    }
}
function replacer(key, value) {
    if (typeof value === 'function') {
        return value.toString();
    }
    return value;
}
function reviver(key, value) {
    if (typeof value === 'string') {
        const regex = /^function\s*([\w$]+)?\s*\(([\w\s,]*)\)\s*\{([\w\W]*?)\}$/;
        const parts = regex.exec(value);
        if (parts) {
            return new Function(parts[2], parts[3]);
        }
    }
    return value;
}
if (localStorage.getItem('myObj') === null) {
    swal({
        title: 'Sin datos!',
        text: 'Agrego 5 registros iniciales',
        icon: 'warning'
    });
    //Productos iniciales agregados con push y unshift
    let prod1 = new unProducto('virulana', 150, 43);
    let prod2 = new unProducto('ACEITE', 740, 21);
    let prod3 = new unProducto('ZANAHORIA', 30, 62);
    let prod4 = new unProducto('limón', 25, 88);
    let prod5 = new unProducto('vinagre', 432, 50);
    losProductos.push(prod1, prod3, prod5, prod4);
    losProductos.unshift(prod2);    
} else {
    swal({
        title: 'BD existente',
        text: 'Leyendo datos disponibles',
        icon: 'success'
    });
    //localStorage tiene datos y los traigo
    const serializedObjFromLocalStorage = localStorage.getItem('myObj');
    const objFromLocalStorage = JSON.parse(serializedObjFromLocalStorage, reviver());
    //guardo cada item del array
    objFromLocalStorage.forEach(item => {
        const producto = new unProducto(item.nombre, item.precio, item.stock);
        producto.vendido = item.vendido;
        producto.ventas = item.ventas;
        losProductos.push(producto);
    });    
}
//funciones sobre los datos/constructor/DOM
function imprimirProductos() {
    limpiarPantalla();
    let mostrarProductos = document.getElementById("mostrarProductos");
    for (let i = 0; i < losProductos.length; i++) {
        let li = document.createElement("li")
        li.innerHTML = `Item: ${losProductos[i].nombre} precio: $ ${losProductos[i].precio} stock: # ${losProductos[i].stock} vendido: ${losProductos[i].vendido} ventas:# ${losProductos[i].ventas}.`
        if (i % 2 == 0) {
            li.classList.add("grey"); // cambiar el color de cada linea
        } else {
            li.classList.add("cyan"); // cambiar el color de cada linea
       }
        mostrarProductos.appendChild(li)    
    }
}
function sumarUnProducto(e) {
    e.preventDefault();
    let nombre = e.currentTarget.nombre.value;
    let precio = e.currentTarget.precio.value;
    let stock = e.currentTarget.stock.value;
    let nuevoProducto = new unProducto(nombre, precio, stock);
    losProductos.push(nuevoProducto);
    limpiarPantalla();
    salvarProductos();
    swal({
        title: 'Producto agregado',
        text: `Agregado ${nombre.toUpperCase()}, valor $ ${precio} por ${stock} unidades.`,
    });
    e.currentTarget.nombre.value = "";
    e.currentTarget.precio.value = "";
    e.currentTarget.stock.value = "";
}
function salvarProductos() {
    swal ({
        title: 'Guardando datos!',
        text: 'Espere un momento ...',
        icon: 'success',
    });
    const serializedObj = JSON.stringify(losProductos, replacer());
    localStorage.setItem('myObj', serializedObj);
}
function limpiarPantalla() {
    let mostrarProductos = document.getElementById("mostrarProductos")
    mostrarProductos.innerHTML = "";
}
function ubicarProducto(e) { 
    e.preventDefault();
    limpiarPantalla();
    let nombre = document.getElementById("buscarProducto").nombre.value;
    let prod = losProductos.find((campo)=> campo.nombre === nombre);
    let mostrarProductos = document.getElementById("mostrarProductos");
    if (prod) {
        swal({
            title: "Producto encontrado",
            text: `Producto: ${prod.nombre}, precio: ${prod.precio}, stock: ${prod.stock}.`
        });
        let li = document.createElement("li");
        li.innerHTML = `Item: ${prod.nombre} precio: $ ${prod.precio} stock: # ${prod.stock} vendido: ${prod.vendido} ventas: # ${prod.ventas}.`;
        mostrarProductos.appendChild(li);
    } else {
        swal({
            text: "El producto no existe",
            icon: "error",
            button: "Aceptar"
        });
        let li = document.createElement("li");
        li.innerHTML = `No se encontro el producto: ${nombre}.`;
        mostrarProductos.appendChild(li);
    }
    document.getElementById("buscarProducto").nombre.value = "";
}
function mostrarResumen() {
    limpiarPantalla();
    let mostrarProductos = document.getElementById("mostrarProductos");
    cantVentas = losProductos.reduce((acum, valActual) =>  acum + valActual.ventas, 0);
    sumaVentas = losProductos.reduce((acum, valActual) =>  acum + (valActual.ventas * valActual.precio), 0);
    unidadesEnStock = losProductos.reduce((acum, valActual) =>  acum + valActual.stock, 0);
    valorDeExistencias = losProductos.reduce((acum, valActual) => acum + (valActual.precio * valActual.stock), 0);
    productosVendidos = losProductos.filter(sell => sell.vendido == true);
    swal({
        title: "Resumen de Ventas/Existencias",
        text: `Ventas totales: $ ${sumaVentas} - Valor de existencias: $ ${valorDeExistencias}.`,
        button: "Aceptar"
    });
    let li = document.createElement("li");
    li.innerHTML = `Unidades vendidas:# ${cantVentas} - Ventas: $ ${sumaVentas} - Existencias:# ${unidadesEnStock} - Valorizacion: $ ${valorDeExistencias}.`;
    mostrarProductos.appendChild(li);
}
function sellProducto(e){
    e.preventDefault();
    limpiarPantalla();
    let nombre = document.getElementById("venderProducto").nombre.value;
    let prod = losProductos.find((campo)=> campo.nombre === nombre);
    let mostrarProductos = document.getElementById("mostrarProductos");
    if (prod) {
        swal({
            title: `Esta a punto de vender: ${prod.nombre}. `,
            text: "Al aceptar no se puede deshacer",
            icon: "warning",
            buttons: true,
          })
          .then((willSell) => {
            if (willSell) {
              // espacio para detectar el index del array
              let index = losProductos.indexOf(prod);
              //espacio para ejecutar el metodo de vender
              losProductos[index].vender();
              salvarProductos();
              swal(`Felicitaciones! Vendio ya ${prod.ventas} unidades de ${prod.nombre}.`, {
                icon: "success",
              });
            } else {
              swal("Operacion de venta CANCELADA!");
            }
          });
        let li = document.createElement("li");
        li.innerHTML = `Item: ${prod.nombre} precio: $ ${prod.precio} stock: # ${prod.stock} vendido: ${prod.vendido} ventas: # ${prod.ventas}.`;
        mostrarProductos.appendChild(li);
    } else {
        swal({
            text: "El producto no existe",
            icon: "error",
            button: "Aceptar"
        });
        let li = document.createElement("li");
        li.innerHTML = `No se encontro el producto: ${nombre}.`;
        mostrarProductos.appendChild(li);
    }
    document.getElementById("venderProducto").nombre.value = "";
}
function deleteProducto(e){
    e.preventDefault();
    limpiarPantalla();
    let nombre = document.getElementById("eliminarProducto").nombre.value;
    let prod = losProductos.find((campo)=> campo.nombre === nombre);
    let mostrarProductos = document.getElementById("mostrarProductos");
    if (prod) {
        swal({
            title: `Esta a punto de eliminar: ${prod.nombre.toUpperCase()}. `,
            text: "Al aceptar no se puede deshacer",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDel) => {
            if (willDel) {
              // espacio para detectar el index y eliminar del array
              let index = losProductos.indexOf(prod);
              losProductos.splice(index,1);
              salvarProductos();
              swal(`Index ${index} elimina ${prod.nombre.toUpperCase()} quita ${prod.ventas} ventas y ${prod.stock} unidades de stock.`, {
                icon: "success",
              });
            } else {
              swal("Operacion de venta CANCELADA!");
              limpiarPantalla();
            }
          });
        let li = document.createElement("li");
        li.innerHTML = `ELIMINA: ${prod.nombre.toUpperCase()} precio: $ ${prod.precio} stock: # ${prod.stock} vendido: ${prod.vendido} ventas: # ${prod.ventas}.`;
        mostrarProductos.appendChild(li);
    } else {
        swal({
            text: "El producto no existe",
            icon: "error",
            button: "Aceptar"
        });
        let li = document.createElement("li");
        li.innerHTML = `No se encontro el producto: ${nombre}.`;
        mostrarProductos.appendChild(li);
    }
    document.getElementById("eliminarProducto").nombre.value = "";
}
//funcionalidades del DOM
const listarProductos = document.getElementById("listarProductos");
listarProductos.addEventListener("click", imprimirProductos);
const agregarUnProducto = document.getElementById("agregarUnProducto");
agregarUnProducto.addEventListener("submit", sumarUnProducto);
const guardarProductos = document.getElementById("guardarProductos");
guardarProductos.addEventListener("click", salvarProductos);
const verResumen = document.getElementById("verResumen");
verResumen.addEventListener("click", mostrarResumen);
const limpiarProductos = document.getElementById("limpiarProductos");
limpiarProductos.addEventListener("click", limpiarPantalla);
const buscarProducto = document.getElementById("buscarProducto");
buscarProducto.addEventListener("submit", ubicarProducto);
const venderProducto = document.getElementById("venderProducto");
venderProducto.addEventListener("submit", sellProducto);
const eliminarProducto = document.getElementById("eliminarProducto");
eliminarProducto.addEventListener("submit", deleteProducto);