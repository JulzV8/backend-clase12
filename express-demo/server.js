const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const app = express()
const server = http.createServer(app)
const io = new Server(server)

const PORT = process.env.PORT || 8080
const productosRouter = require('./routes/productos')
const {productos} = require('./routes/productos')

console.log(productos);
const handlebars = require("express-handlebars")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/productos/",productosRouter)
app.use("/static", express.static(path.join(__dirname, 'public')))

server.listen(PORT, ()=>{
  console.log(`escuchando ${PORT}`);
})
const mensajito = "jajajajxd"
io.on('connection', (socket) => {
  console.log(`an user connected: ${socket.id}`)
  io.sockets.emit("new", "un nuevo usuario se conecto")
  socket.emit("productos",mensajito)
})


app.engine("jev",handlebars.engine({
  extname: ".jev",
  defaultLayout: "index.jev",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views"
}));

app.set('views','./views');
app.set('view engine','jev');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))
// app.get("/",(req,res)=>{
//   res.render("main");
// })

server.on("error",(err)=>{
  console.log(`Error: ${err}`);
})