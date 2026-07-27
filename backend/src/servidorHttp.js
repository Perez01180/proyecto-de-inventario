import http from "http";

const app = http.createServer(function(request, response){
    if(request.url === "/products"){
        response.end("lista de productos");
    }
});

app.listen(8080, function(){
    console.log("servidor iniciado correctamente en el puerto 8080")
});

/*
//funcion tradicional
function myFuncion () {

}

//funcion flecha
const otraFuncion = () => {

}
*/