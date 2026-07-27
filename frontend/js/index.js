import { getUser, getLocalUser } from "./utils.js";


async function main() {
    const localUser = getLocalUser();
    if (localUser.isLogged === true) {
        const dataUser = await getUser(localUser.userId);

        const mainIndex = document.getElementById("main-index");
        const p = document.createElement("p");
        p.innerText = "bienvenido " + dataUser.username + " Tu rol es " + dataUser.role;

        mainIndex.appendChild(p);
    }
}
main();