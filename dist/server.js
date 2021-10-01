"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var app = (0, express_1.default)();
var handlebars = express_handlebars_1.default;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 3030;
var objProductos = [];
var objMensajes = [];
app.use(express_1.default.static('./public'));
app.engine("hbs", handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: "./views/layouts",
    partialsDir: "./views/partials"
}));
app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas
http.listen(PORT, function () { return console.log("escuchando desde servidor. http://localhost:" + PORT + "/"); });
io.on('connection', function (socket) {
    console.log('Usuario conectado');
    socket.emit('productCatalog', { products: objProductos });
    socket.on('newProduct', function (data) {
        objProductos.push(__assign({ id: objProductos.length + 1 }, data));
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
