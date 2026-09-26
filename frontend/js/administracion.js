import { getToken, getMyUser, getUsers, updateUserRole, deleteUser, updateUserById } from "./utils.js";

function confirmDeleteUser(id, token) {
    Swal.fire({
        title: "Eliminar usuario",
        theme: "dark",
        text: "¿Estás seguro de querer eliminar a este usuario?",
        icon: "warning",
        showCancelButton: true,

    }).then(async function (result) {
        if (result.isConfirmed) {
            await deleteUser(id, token);
            window.location = "/administracion.html";
        }
    })
}

function confirmRoleChange(user, role, token) {
    Swal.fire({
        title: "Modificar rol del usuario",
        theme: "dark",
        text: "¿Estás seguro de cambiarle el rol a este usuario?",
        icon: "warning",
        showCancelButton: true,

    }).then(async function (result) {
        if (result.isConfirmed) {
            await updateUserRole(user.id, role.value, token);
            window.location = "/administracion.html";
            return;
        }
        role.value = user.role;
    })

}

function modifyUser(user, token) {
    Swal.fire({
        title: "Editar usuario",
        theme: "dark",
        html: `
                            <div class="row g-3">
                                <div class="col-6" >
                                    <input id = "swal-name" class="form-control" placeholder="nombre..." value = ${user.name} >
                                </div>
                                <div class="col-6">
                                    <input id = "swal-lastname" class="form-control" placeholder="apellido..." value = ${user.lastname} >
                                </div>
                                <div class="col-6">
                                    <input id = "swal-dni" class="form-control" placeholder="123456789" value = ${user.dni} >
                                </div>
                                <div class="col-6">
                                    <input id = "swal-username" class="form-control" placeholder="nombre del usuario" value = ${user.username} >
                                </div>
                                <div class="col-12">
                                    <input id = "swal-password" class="form-control" placeholder = "Nueva contraseña" >
                                </div>
                            </div>
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

    }).then(async function (result) {
        if (result.isConfirmed) {
            const updates = result.value;

            const response = await updateUserById(user.id, updates, token);
            window.location = "/administracion.html";

        } else if (result.isDenied) {
            confirmDeleteUser(user.id, token);
        }
    })
}

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

    //se inserta columna de acción solo para el superadmin
    if (myUserData.payload.role === "superadmin") {
        const adminTr = document.getElementById("admin-tr")
        adminTr.innerHTML += ` <th>acción</th> `
    }

    users.map((user) => {
        const row = document.createElement("tr");
        const usernameCell = document.createElement("td");
        const roleCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const lastnameCell = document.createElement("td");
        usernameCell.textContent = user.username;
        nameCell.textContent = user.name;
        lastnameCell.textContent = user.lastname;
        if (user.role === "superadmin") {
            roleCell.textContent = user.role
            row.append(usernameCell, roleCell, nameCell, lastnameCell);
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
                const modifyButton = document.createElement("button");
                modifyButton.textContent = "Modificar";
                modifyButton.className = "btn btn-secondary mx-3"

                modifyButton.addEventListener("click", function () { modifyUser(user, token) });
                actionCell.appendChild(modifyButton);
            }


            roleCell.appendChild(roleSelect);

            row.append(usernameCell, roleCell, nameCell, lastnameCell, actionCell);

            roleSelect.addEventListener("change", async function (event) {
                confirmRoleChange(user, roleSelect, token);

            });
        }

        usersList.appendChild(row);

    });
}
main();