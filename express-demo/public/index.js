const socket = io()
const productosContainer = $("#productosContainer")

socket.on("productos",(mensajito)=>{
  console.log(mensajito);
})