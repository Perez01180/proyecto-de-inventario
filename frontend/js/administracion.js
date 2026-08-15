import { getToken, getMyUser, getUsers, updateUserRole, deleteUser } from "./utils.js";

async function main() {
    const token = getToken();
    const myUserData = await getMyUser(token);

    if (myUserData.status === "error" || myUserData.payload.role == "user") {
        window.location.href = "/index.html";
    }

    const users = await getUsers(token);
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
            userOption.value = "user";
            userOption.textContent = "Usuario";
            adminOption.value = "admin";
            adminOption.textContent = "Administrador";

            roleSelect.append(userOption, adminOption);
            roleSelect.value = user.role;

            if (myUserData.payload.role === "superadmin" && (user.role === "user" || user.role === "admin")) {
                //boton eliminar
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "eliminar"
                deleteButton.className = "btn btn-danger mx-3"
                deleteButton.addEventListener("click", async function () {

                    const deleteConfirm = confirm("Estás seguro de querer eliminar a este usuario?");
                    if (deleteConfirm === true) {
                        await deleteUser(user.id, token);
                        window.location = "/administracion.html"
                    }
                })

                //actionCell.appendChild(deleteButton);
                const modifyButton = document.createElement("button");
                modifyButton.textContent = "Modificar";
                modifyButton.className = "btn btn-secondary mx-3"
                modifyButton.addEventListener("click", async function () {
                    Swal.fire({
                        title: "Editar usuario",
                        theme: "dark",
                        html: `
                            <input id = "swal-name" value = ${user.name} >
                            <input id = "swal-lastname" value = ${user.lastname} >
                            <input id = "swal-dni" value = ${user.dni} >
                            <input id = "swal-username" value = ${user.username} >
                            <input id = "swal-password" >
                       `,
                        showConfirmButton: true,
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Guardar cambios",
                        denyButtonText: "eliminar usuario",
                        cancelButtonText: "cancelar",
                        preConfirm: function () {
                            const name = document.getElementById("swal-name").value;
                            const lastname = document.getElementById("swal-lastname").value;
                            const dni = document.getElementById("swal-dni").value;
                            const username = document.getElementById("swal-username").value;
                            const password = document.getElementById("swal-password").value;
                            return {
                                name,
                                lastname,
                                dni,
                                username,
                                password
                            }
                        }

                    }).then(function (result) {
                        if (result.isConfirmed) {
                            console.log(result.value)
                        }else if(result.isDenied){
                            console.log("eliminar usuario");
                        }else{
                            console.log("operación cancelada")
                        }
                    })
                })

                actionCell.appendChild(modifyButton);
            }


            roleCell.appendChild(roleSelect);

            row.append(usernameCell, roleCell, actionCell);

            roleSelect.addEventListener("change", async function (event) {
                const updateRoleConfirm = confirm("Estás seguro de querer cambiarle el rol a este usuario?");
                if (updateRoleConfirm === true) {
                    await updateUserRole(user.id, roleSelect.value, token);
                    window.location = "/administracion.html"
                }

            });
        }

        usersList.appendChild(row);

    });
}
main();