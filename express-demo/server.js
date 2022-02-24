const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const fs = require("fs");
const { loadavg } = require("os");
const container = require("./container")

console.log(container);
const contenedor = new container("./chat.txt")

const PORT = process.env.PORT || 8080
const handlebars = require("express-handlebars")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/static", express.static(path.join(__dirname, 'public')))

class Producto{
  constructor(id,nombre,stock,precio){
    this.id=id;
    this.nombre=nombre;
    this.stock=stock;
    this.precio=precio;
  }
}

function addProducto(nombre,stock,precio,array) {
  let biggestId = 0;
  if (array.length) {
    array.forEach(element => {
      if (element.id>biggestId) {
        biggestId = element.id;
      }
    });
  }
  biggestId++
  const producto = new Producto(biggestId,nombre,stock,precio)
  array.push(producto)
  return producto;
}

let arrayProductos = [ 
  new Producto(1,"hotwheels",20,250),
  new Producto(2,"max-steel",5,900),
  new Producto(3,"woody",10,1275)
]

let messages = [];

app.get("/productos",(req,res)=>{
  res.render("get", {arrayProductos:arrayProductos});
})

app.get("/productos/get",(req,res)=>{
  res.render("get", {arrayProductos:arrayProductos});
})

app.get("/productos/productoRandom",(req,res)=>{
  const numRandom = Math.floor(Math.random() * arrayProductos.length);
  res.send(arrayProductos[numRandom])
})

app.put("/productos/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayProductos.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  const {nombre,stock,precio} = req.body
  if (nombre) {
    producto.nombre = nombre
  }
  if (stock) {
    producto.stock = stock
  }
  if (precio) {
    producto.precio = precio
  }
  res.sendStatus(200)
})

app.delete("/:id",(req,res)=>{
  const {id} = req.params
  const producto = arrayProductos.find(m=> m.id == id)
  if (!producto) {
    res.status(404).send({
      error:"Producto no encontrado"
    })
    return
  }
  const index = arrayProductos.indexOf(producto)
  arrayProductos.splice(index,1)
  res.sendStatus(200)
})

server.listen(PORT, ()=>{
  console.log(`escuchando ${PORT}`);
})
io.on('connection', (socket) => {
  console.log(`an user connected: ${socket.id}`)
  arrayProductos.forEach(element => {
    socket.emit("producto",element)
  });
  contenedor.getAll()
  .then((data)=>{
    messages=data
    socket.emit('messages', messages);
  })
  
  socket.on("aniadirProducto",(nombre,stock,precio)=>{
    const element = addProducto(nombre,stock,precio,arrayProductos)
    io.sockets.emit("producto",element)
  })

  socket.on('new-message',data => {
    messages.push(data);
    contenedor.save(data)
    io.sockets.emit('messages', messages);
});
  
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

server.on("error",(err)=>{
  console.log(`Error: ${err}`);
})