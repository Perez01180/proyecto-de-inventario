const API_BASE = "http://localhost:8080/api/v2";

export async function getUser(id) {
    const response = await fetch(API_BASE + "/users/" + id);
    const user = await response.json();
    return user;
}

export async function getUsers(){
    const response = await fetch(API_BASE + "/users/");
    const data = await response.json();
    return data.users;
}

export async function updateUserRole(id, role){
    const response = await fetch(API_BASE + "/users/" + id + "/role", {
        method: "put",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({ role })
    });
    const data = await response.json();
    return data;
}

export async function deleteUser(id){
    const response = await fetch(API_BASE + "/users/" + id, {
        method :  "delete"       
    });
    const data = await response.json();
    return data; 
}

export async function login(username, password){
    const response = await fetch (API_BASE + "/auth/login",{
        method : "post",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({ username, password })
    });
    const data = await response.json();
    return data;
}