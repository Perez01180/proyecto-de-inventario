import { getToken, getMyUser, getUsers, updateUserRole, deleteUser } from "./utils.js";

async function main() {
    const token = getToken();
    const myUser = await getMyUser(token);

    if (myUser.role === "user") {
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
                const updateRoleConfirm = confirm("Estás seguro de querer cambiarle el rol a este usuario?");
                if(updateRoleConfirm === true){
                    await updateUserRole(user.id, roleSelect.value, token);
                    window.location = "/administracion.html"
                }               
            });

            saveButton.className = "btn btn-primary"
            saveButton.textContent = "guardar"

            if(myUser.role === "superadmin" && (user.role === "user" || user.role === "admin")){
                //boton eliminar
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "eliminar"
                deleteButton.className = "btn btn-danger mx-3"
                deleteButton.addEventListener("click", async function(){
                    
                    const deleteConfirm = confirm("Estás seguro de querer eliminar a este usuario?");
                    if (deleteConfirm === true){
                        await deleteUser(user.id, token);
                        window.location = "/administracion.html"
                    }
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