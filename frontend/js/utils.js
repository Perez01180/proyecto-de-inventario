export async function getUser(id) {
    const response = await fetch("http://localhost:8080/user/" + id);
    const user = await response.json();
    return user;
}

function saveLocalUser(){
    localStorage.setItem("usuario-logueado", JSON.stringify({
        isLogged : false,
        userId : null
    }))
}

export function logOutUser(){
    localStorage.clear("usuario-logueado");
    window.location = "/index.html"
}

export function getLocalUser(){
    const userData = localStorage.getItem("usuario-logueado");
    if(!userData){
        saveLocalUser();
        return {
            isLogged : false,
            userId : null
        }
    }
    const localUser = JSON.parse(userData);
    return localUser;
}

export async function getUsers(){
    const response = await fetch("http://localhost:8080/users/");
    const data = await response.json();
    return data.users;
}

export async function updateUserRole(id, role){
    const response = await fetch("http://localhost:8080/user/" + id + "/role", {
        method: "put",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({ role })
    });
    const data = await response.json();
    return data;
}

export async function deleteUser(id){
    const response = await fetch("http://localhost:8080/user/" + id, {
        method :  "delete"       
    });
    const data = await response.json();
    return data; 
}