const express = require("express");
const { redirect } = require("express/lib/response");
const {Router} = express;
const router = Router();

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
  if (array) {
    array.forEach(element => {
      if (element.id>biggestId) {
        biggestId = element.id;
      }
    });
  }
  biggestId++
  const producto = new Producto(biggestId,nombre,stock,precio)
  array.push(producto)
}

let arrayProductos = [ 
  new Producto(1,"hotwheels",20,250),
  new Producto(2,"max-steel",5,900),
  new Producto(3,"woody",10,1275)
]

module.exports = arrayProductos;
module.exports = router;

router.get("/",(req,res)=>{
  res.render("get", {arrayProductos:arrayProductos});
})

router.get("/get",(req,res)=>{
  res.render("get", {arrayProductos:arrayProductos});
})

router.get("/productoRandom",(req,res)=>{
  const numRandom = Math.floor(Math.random() * arrayProductos.length);
  res.send(arrayProductos[numRandom])
})

router.put("/:id",(req,res)=>{
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

router.delete("/:id",(req,res)=>{
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

router.post("/",(req,res)=>{
  const {nombre,stock,precio} = req.body
  addProducto(nombre,stock,precio,arrayProductos) 
  res.redirect('/');
})