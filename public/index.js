const socket = io();

socket.on('productCatalog', (data) => renderprods(data));

let renderprods = (data) => {
    if (data.products.length > 0) {
        let table =`
        <table>
            <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Thumbnail</th>
            </tr>`;
        let html = data.products.map(e => `
            <tr>
                <td>${e.title}</td>
                <td>$ ${e.price}</td>
                <td><img src="${e.thumbnail}" width="50" height="33"></td>
            </tr>`
        ).join(' ');
        document.getElementById('table').innerHTML = table + html + `</table>`;
        document.getElementById('productCatalog').innerHTML = '';
    } else {
        let html = `<div class="error" style="padding:2em;text-align:center">No hay productos</div>`;
        document.getElementById('productCatalog').innerHTML = html;
    }
}


function createProd(form) {
    console.log("Nuevo producto agregado!");
    let newProduct = {
        title: document.getElementById('title').value,
        price: parseFloat(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value
    }
    document.getElementById('title').value = "";
    document.getElementById('price').value = "";
    document.getElementById('thumbnail').value = "";
    socket.emit('newProduct', newProduct)
    return false;
}


socket.on('mensajes', (data) => render(data));

let render = (data) => {
    let html = data.map((e,i)=>`
        <div>
            <strong class="bluetext">${e.autor}</strong>
            <span class="browntext">[${e.date}]: </span>
            <em class="greentext">${e.texto}</em>
        </div>
    `).join(' ');
    document.getElementById("mensajes").innerHTML = html;
}

function enviarMensaje(e){
    let date = new Date();
    date = date.toLocaleString('es-AR');
    let envio = {
        autor: document.getElementById('usuario').value,
        texto: document.getElementById('texto').value,
        date: date,
    }
    document.getElementById('usuario').disabled = true;
    texto: document.getElementById('texto').value = '';
    socket.emit('nuevo-mensaje', envio);
    return false;
}