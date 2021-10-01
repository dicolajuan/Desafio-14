'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var express = require('express');
var handlebars = require('express-handlebars');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3030;

var objProductos = [];
var objMensajes = [];

app.use(express.static('./public'));

app.engine("hbs", handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: "./views/layouts",
    partialsDir: "./views/partials"
}));

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas


http.listen(PORT, function () {
    return console.log('escuchando desde servidor. http://localhost:' + PORT + '/');
});

io.on('connection', function (socket) {
    console.log('Usuario conectado');

    socket.emit('productCatalog', { products: objProductos });
    socket.on('newProduct', function (data) {
        objProductos.push(_extends({ id: objProductos.length + 1 }, data));
        console.log(objProductos);
        io.sockets.emit('productCatalog', { products: objProductos });
    });

    socket.emit('mensajes', objMensajes);
    socket.on('nuevo-mensaje', function (data) {
        objMensajes.push(data);
        io.sockets.emit('mensajes', objMensajes);
    });
});

app.get('/', function (req, res) {
    res.render('products', { products: objProductos });
});
