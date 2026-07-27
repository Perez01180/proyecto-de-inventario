import { getUser, getLocalUser, getUsers, updateUserRole, deleteUser } from "./utils.js";

async function main() {
    const localUser = getLocalUser();
    const userLogged = await getUser(localUser.userId);

    if (userLogged.role === "user") {
        window.location.href = "/index.html";
    }

    const users = await getUsers();
    //capturamos la etiqueta que va a contener la lista de users
    const usersList = document.getElementById("usersList");

    usersList.innerHTML = "";

    users.map((user) => {
        const row = document.createElement("tr");
        const usernameCell = document.createElement("td");
        const roleCell = document.createElement("td");
        usernameCell.textContent = user.username;
        if (user.role === "superadmin") {
            roleCell.textContent = user.role
            row.append(usernameCell, roleCell);
        } else {
            const actionCell = document.createElement("td");
            const roleSelect = document.createElement("select");
            const userOption = document.createElement("option");
            const adminOption = document.createElement("option");
            const saveButton = document.createElement("button");
            userOption.value = "user";
            userOption.textContent = "Usuario";
            adminOption.value = "admin";
            adminOption.textContent = "Administrador";

            roleSelect.append(userOption, adminOption);
            roleSelect.value = user.role;

            saveButton.addEventListener("click", async function () {
                await updateUserRole(user.id, roleSelect.value);
                window.location = "/administracion.html"
            });

            saveButton.className = "btn btn-primary"
            saveButton.textContent = "guardar"

            if(userLogged.role === "superadmin"){
                //boton eliminar
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "eliminar"
                deleteButton.className = "btn btn-danger mx-3"
                deleteButton.addEventListener("click", async function(){
                    await deleteUser(user.id);
                    window.location = "/administracion.html"
                })
                actionCell.appendChild(deleteButton);
            }

            roleCell.appendChild(roleSelect);
                     
            actionCell.appendChild(saveButton);
            row.append(usernameCell, roleCell, actionCell);
        }

        usersList.appendChild(row);

    });
}
main();