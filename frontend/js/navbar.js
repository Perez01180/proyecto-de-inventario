import { getMyUser, deleteToken, getUser, getToken} from "./utils.js"

const navLogOut = document.getElementById("logOut");
const navAdmin = document.getElementById("admin");
const navLogin = document.getElementById("login");

navLogOut.addEventListener("click", function(){
    deleteToken();
    window.location = "/index.html";
})


document.addEventListener("DOMContentLoaded", async function(){
    const token = getToken();
    const navLogin = document.getElementById("login");
    
    if(token){
        navLogin.classList.add("ocultar-nav")       
        navLogOut.classList.remove("nav-loading")
        const user = await getMyUser(token);
        if(user.role === "user"){
            navAdmin.classList.add("ocultar-nav")
        }else{
            navAdmin.classList.remove("nav-loading")    
        }
    }else{
        navLogin.classList.remove("nav-loading")
        navLogOut.classList.add("ocultar-nav")
        navAdmin.classList.add("ocultar-nav")
    }
})



