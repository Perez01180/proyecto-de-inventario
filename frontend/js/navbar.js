import { getMyUser, deleteToken, getUser, getToken, getRole} from "./utils.js"

const navLogOut = document.getElementById("logOut");
const navAdmin = document.getElementById("admin");
const navLogin = document.getElementById("login");

navLogOut.addEventListener("click", function(){
    deleteToken();
    window.location = "/index.html";
})

const token = getToken();
const role = getRole();

if(token){
    navLogin.classList.add("ocultar-nav")       
    navLogOut.classList.remove("nav-loading")
    if(role === "user"){
        navAdmin.classList.add("ocultar-nav")
    }else{
        navAdmin.classList.remove("nav-loading")    
    }
}else{
    navLogin.classList.remove("nav-loading")
    navLogOut.classList.add("ocultar-nav")
    navAdmin.classList.add("ocultar-nav")
}