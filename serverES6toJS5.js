const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3030;

const objProductos = [];
const objMensajes = [];


app.use(express.static('./public'));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "./views/layouts",
        partialsDir: "./views/partials"
    })
);
    
    app.set('views', './views'); // especifica el directorio de vistas
    app.set('view engine', 'hbs'); // registra el motor de plantillas
    

http.listen(PORT, () => console.log(`escuchando desde servidor. http://localhost:${PORT}/`) );

io.on ('connection', (socket) => {
    console.log('Usuario conectado');

    socket.emit('productCatalog', { products: objProductos});
    socket.on('newProduct', (data) => {
        objProductos.push({ id: objProductos.length + 1, ...data });
        console.log(objProductos);
        io.sockets.emit('productCatalog', { products: objProductos});
    });

    socket.emit('mensajes', objMensajes);
    socket.on('nuevo-mensaje', (data)=>{
        objMensajes.push(data);
        io.sockets.emit('mensajes', objMensajes);
    });

});

app.get('/', (req,res)=>{
    res.render('products', { products: objProductos })
});