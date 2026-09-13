import { getMyUser, getToken, deleteSession } from "./utils.js";


async function main() {
    const token = getToken();
    if (token) {
        const dataUser = await getMyUser(token);
        if (dataUser.status === "error") {
            Swal.fire({
                title: "Token invalido o vencido",
                theme: "dark",
                icon: "error"
            }).then(function () {
                deleteSession();
                window.location = "/index.html"
            })

        }

        const mainIndex = document.getElementById("main-index");
        const p = document.createElement("p");
        p.innerText = "bienvenido " + dataUser.payload.username + " Tu rol es " + dataUser.payload.role;

        mainIndex.appendChild(p);

    }
}
main();