import { getLocalUser, logOutUser, getUser} from "./utils.js"

const navLogOut = document.getElementById("logOut");
const navAdmin = document.getElementById("admin");

navLogOut.addEventListener("click", function(){
    logOutUser();
})


document.addEventListener("DOMContentLoaded", async function(){
    const localUser = getLocalUser();
    const navLogin = document.getElementById("login");

    if(localUser.isLogged === true ){
        navLogin.classList.add("ocultar-nav")       
        const user = await getUser(localUser.userId);
        if(user.role === "user"){
            navAdmin.classList.add("ocultar-nav")
        }
    }else{
        navLogOut.classList.add("ocultar-nav")
        navAdmin.classList.add("ocultar-nav")
    }
})



