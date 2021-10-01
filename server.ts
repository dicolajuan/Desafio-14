import express from "express";
import Handlebars from 'express-handlebars';

const app = express();
const handlebars = Handlebars;
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT:number = 3030;

const objProductos:Array<object> = [];
const objMensajes:Array<object> = [];
 
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
    

http.listen(PORT, () => console.log(`escuchando desde servidor. http://localhost:${PORT}/`) )

io.on ('connection', (socket: any) => {
    console.log('Usuario conectado');

    socket.emit('productCatalog', { products: objProductos});
    socket.on('newProduct', (data: object) => {
        objProductos.push({ id: objProductos.length + 1, ...data });
        console.log(objProductos);
        io.sockets.emit('productCatalog', { products: objProductos});
    });

    socket.emit('mensajes', objMensajes);
    socket.on('nuevo-mensaje', (data:object)=>{
        objMensajes.push(data);
        io.sockets.emit('mensajes', objMensajes);
    });

});

app.get('/', (req: any,res: any)=>{
    res.render('products', { products: objProductos })
});