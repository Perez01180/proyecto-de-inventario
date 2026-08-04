import { getMyUser, getToken } from "./utils.js";


async function main() {
    const token = getToken();
    if (token) {
        const dataUser = await getMyUser(token);
       
        const mainIndex = document.getElementById("main-index");
        const p = document.createElement("p");
        p.innerText = "bienvenido " + dataUser.username + " Tu rol es " + dataUser.role;

        mainIndex.appendChild(p);
       
    }
}
main();