const API_BASE = "http://localhost:8080/api/v2";

export async function getUser(id) {
    const response = await fetch(API_BASE + "/users/" + id,{
        method : "get",
        headers : {
            "Authorization" : "Bearer " + token,
            "content-type" : "application/json"
        }
    });
    const user = await response.json();
    return user;
}

export async function getUsers(token){
    const response = await fetch(API_BASE + "/users/",{
        method : "get",
        headers : {
            "Authorization" : "Bearer " + token,
            "content-type" : "application/json"
        }
    });
    const data = await response.json();
    return data.users;
}

export async function updateUserRole(id, role, token){
    const response = await fetch(API_BASE + "/users/" + id + "/role", {
        method: "put",
        headers : {
            "Authorization" : "Bearer " + token,
            "content-type" : "application/json",
        },
        body : JSON.stringify({ role })
    });
    const data = await response.json();
    return data;
}

export async function deleteUser(id, token){
    const response = await fetch(API_BASE + "/users/" + id, {
        method :  "delete",
        headers : {
            "Authorization" : "Bearer " + token,
            "content-type" : "application/json",
        }      
    });
    const data = await response.json();
    return data; 
}

export async function login(username, password){
    const response = await fetch(API_BASE + "/auth/login",{
        method : "post",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({ username, password })
    });
    const data = await response.json();
    return data;
}

export async function register(name, lastname, dni, username, password){
    const response = await fetch(API_BASE + "/auth/register",{
        method : "post",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({ name, lastname, dni, username, password })
    });
    const data = await response.json();
    return data;
}

export function saveSession(token, role){
    localStorage.setItem("userToken", token);
    localStorage.setItem("userRole", role);
}

export function getToken(){
    const token = localStorage.getItem("userToken");
    return token;
}

export function getRole(){
    const role = localStorage.getItem("userRole");
    return role;
}

export async function getMyUser(token){
    const response = await fetch(API_BASE + "/users/me", {
        method : "get",
        headers : { 
            "Authorization" : "Bearer " + token,
            "Content-Type" : "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export function deleteSession(){
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    
}