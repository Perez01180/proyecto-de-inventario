import { deleteSession } from "./utils.js"

const navLogOut = document.getElementById("logOut");
navLogOut.addEventListener("click", function(){
    deleteSession();
    window.location = "/index.html";
})

