const socket = io()
const productosTabla = $("#productosTabla")
const aniadirProducto = document.querySelector("#aniadirProducto")

aniadirProducto.addEventListener("click", (e) => {
  e.preventDefault()
  $("#enviar").value = "";
  if($("#nombre")[0].value.length &&
  $("#stock")[0].value.length &&
  $("#precio")[0].value.length){
    socket.emit("aniadirProducto", 
    $("#nombre")[0].value,
    $("#stock")[0].value,
    $("#precio")[0].value)
  }
})

socket.on("producto",(element)=>{
  if (element) {
    const tbody = $("#tbody")
    $("#noHayProductos").css("display", "none")
      tbody.append(
      `<tr>
      <th>${element.id}</th>
      <td>${element.nombre}</td>
      <td>${element.stock}</td>
      <td>${element.precio}</td>
      </tr>`)
    productosTabla.fadeIn()
  }
})

function render(data) {
  const html = data.map((elem, index) => {
      return(`<div class="w-100 m-0 p-0 d-flex flex-wrap">
          <strong class="m-0 p-0" style="color:blue">${elem.author}</strong>
          <p class="m-0 p-0" style="color:brown">${elem.date}</p>:
          <em class="m-0 p-0">${elem.text}</em> </div>`)
  }).join(" ");
  document.getElementById('messages').innerHTML = html;
}

socket.on('messages', function(data) { render(data); });

function addMessage(e) {
  const mensaje = {
      author: document.getElementById('username').value,
      text: document.getElementById('texto').value,
      date: conseguirFecha()
  };
  socket.emit('new-message', mensaje);
  return false;
}

function conseguirFecha(){
  const fecha = new Date();
  const day = String(fecha.getDate()).padStart(2, '0');
  const month = fecha.getMonth()+1;
  const year = fecha.getFullYear();
  const hour = fecha.getHours();
  const minute = fecha.getMinutes();
  const second = fecha.getSeconds();

  return `[${day}/${month}/${year}/  ${hour}:${minute}:${second}:]`
}