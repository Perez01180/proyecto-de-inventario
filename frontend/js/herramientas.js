import { getToken, getMyUser, getTools, createTool, updateToolByID, deleteTool } from "./utils.js";

function confirmDeleteTool(id, token) {
    Swal.fire({
        title: "Eliminar herramienta",
        theme: "dark",
        text: "¿Estás seguro de querer eliminar esta herramienta?",
        icon: "warning",
        showCancelButton: true,

    }).then(async function (result) {
        if (result.isConfirmed) {
            await deleteTool(id, token);
            window.location = "/herramientas.html";
        }
    })

}

async function modifyTool(tool, token) {
    Swal.fire({
        title: "Editar herramienta",
        theme: "dark",
        html: `
            <div class="row g-3 text-start">
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-name"  >Nombre de la herramienta</label>
                    <input id = "swal-name" class="form-control" value = ${tool.name} placeholder = "nombre de herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-state">Estado</label>
                    <select id = "swal-state" class="form-select" value = ${tool.state} placeholder = "Estado de la herramienta">
                        <option value = "malo">Malo</option>
                        <option value = "normal">Normal</option>
                        <option value = "muy_bueno">Muy bueno</option>
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-available">Herramienta</label>
                    <select id = "swal-available" class="form-select" value = ${tool.available} placeholder = "Herramientas disponibles">
                        <option value = "true">Disponible</option>
                        <option value = "false">No disponible</option>
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-quantity">Cantidad</label>
                    <input id = "swal-quantity" class="form-control" value = ${tool.quantity} placeholder = "Cantidad de herramientas">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-brand">Marca</label>
                    <input id = "swal-brand" class="form-control" value = ${tool.brand} placeholder = "Marca de la herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-section">Sección</label>
                    <input id = "swal-section" class="form-control" value = ${tool.section} placeholder = "Sección de la herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-serialized">Serialización</label>
                    <input id = "swal-serialized" class="form-control" value = ${tool.serialized} placeholder = "Serialización de la herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-consumable">Consumible</label>
                    <select id = "swal-consumable" class="form-select" value = ${tool.consumable} placeholder = "Consumible">
                        <option value = "true">Es consumible</option>
                        <option value = "false" selected>No es consumible</option>
                    </select>
                </div>
            </div>
        `,
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        denyButtonText: "eliminar herramienta",
        cancelButtonText: "cancelar",
        preConfirm: function () {
            const name = document.getElementById("swal-name").value;
            const state = document.getElementById("swal-state").value;
            const available = document.getElementById("swal-available").value;
            const quantity = document.getElementById("swal-quantity").value;
            const brand = document.getElementById("swal-brand").value;
            const section = document.getElementById("swal-section").value;
            const serialized = document.getElementById("swal-serialized").value;
            const consumable = document.getElementById("swal-consumable").value;
            return {
                name,
                state,
                available,
                quantity,
                brand,
                section,
                serialized,
                consumable
            }
        }
    }).then(async function (result){
        if(result.isConfirmed){
            const updatesTool = result.value;
            const response = await updateToolByID(tool.id, updatesTool, token);
            window.location = "/herramientas.html"
        } else if(result.isDenied){
            confirmDeleteTool(tool.id, token);
        }

    })
}

function addTool(token) {
    Swal.fire({
        title: "Añadir herramienta",
        theme: "dark",
        html: `
            <div class="row g-3 text-start">
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-name"  >Nombre de la herramienta</label>
                    <input id = "swal-name" class="form-control" placeholder = "nombre de herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-state">Estado</label>
                    <select id = "swal-state" class="form-select" placeholder = "Estado de la herramienta">
                        <option value = "malo">Malo</option>
                        <option value = "normal" selected>Normal</option>
                        <option value = "muy_bueno">Muy bueno</option>
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-available">Herramienta</label>
                    <select id = "swal-available" class="form-select" placeholder = "Herramientas disponibles">
                        <option value = "true" selected>Disponible</option>
                        <option value = "false">No disponible</option>
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-quantity">Cantidad</label>
                    <input id = "swal-quantity" class="form-control" placeholder = "Cantidad de herramientas">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-brand">Marca</label>
                    <input id = "swal-brand" class="form-control" placeholder = "Marca de la herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-section">Sección</label>
                    <input id = "swal-section" class="form-control" placeholder = "Sección de la herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-serialized">Serialización</label>
                    <input id = "swal-serialized" class="form-control" placeholder = "Serialización de la herramienta">
                </div>
                <div class="col-6">
                    <label class="form-label text-secondary" for="swal-consumable">Consumible</label>
                    <select id = "swal-consumable" class="form-select" placeholder = "Consumible">
                        <option value = "true">Es consumible</option>
                        <option value = "false" selected>No es consumible</option>
                    </select>
                </div>
            </div>
        `,
        showConfirmButton: true,
        showCancelButton: true,

        ConfirmButtonText: "Registrar herramienta",
        cancelButtonText: "cancelar",
        preConfirm: function () {
            const name = document.getElementById("swal-name").value;
            const state = document.getElementById("swal-state").value;
            const available = document.getElementById("swal-available").value;
            const quantity = document.getElementById("swal-quantity").value;
            const brand = document.getElementById("swal-brand").value;
            const section = document.getElementById("swal-section").value;
            const serialized = document.getElementById("swal-serialized").value;
            const consumable = document.getElementById("swal-consumable").value;
            return {
                name,
                state,
                available,
                quantity,
                brand,
                section,
                serialized,
                consumable
            }
        }
    }).then(async function (result) {
        if (result.isConfirmed) {
            const newTool = result.value;
            const response = await createTool(newTool, token);
            if (response.status == "error") {
                Swal.fire({
                    title: "ERROR",
                    theme: "dark",
                    text: "Faltó completar campos",
                    icon: "warning"
                })
                return;
            }

            window.location = "/herramientas.html";
        }
    })
}


async function main() {
    const token = getToken();
    const myUserData = await getMyUser(token);
    const buttonNewTool = document.getElementById("buttonNewTool");

    if (myUserData.status === "error") {
        window.location.href = "/index.html";
    }

    if (myUserData.payload.role === "user") {
        buttonNewTool.classList.add("d-none")
    }

    const tools = await getTools(token);
    //Capturamos la etiqueta que va contener la lista de herramientas
    const toolsList = document.getElementById("toolsList");

    toolsList.innerHTML = "";

    tools.payload.map((tool) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const stateCell = document.createElement("td");
        const available = document.createElement("td");
        const quantity = document.createElement("td");
        const brand = document.createElement("td");
        const section = document.createElement("td");
        const serialized = document.createElement("td");
        const consumable = document.createElement("td");
        const actionCell = document.createElement("td");

        nameCell.textContent = tool.name
        stateCell.textContent = tool.state
        available.textContent = tool.available
        quantity.textContent = tool.quantity
        brand.textContent = tool.brand
        section.textContent = tool.section
        serialized.textContent = tool.serialized
        consumable.textContent = tool.consumable

        if (myUserData.payload.role === "superadmin" || myUserData.payload.role === "admin") {
            const modifyButton = document.createElement("button");
            modifyButton.textContent = "Modificar";
            modifyButton.className = "btn btn-secondary mx-3";
            modifyButton.addEventListener("click", function () { modifyTool(tool, token) });
            actionCell.appendChild(modifyButton);
        }


        row.append(nameCell, stateCell, available, quantity, brand, section, serialized, consumable, actionCell);

        toolsList.appendChild(row);
    });

    //agregar herramienta nueva
    const buttonAddTool = document.getElementById("buttonAddTool");
    buttonAddTool.addEventListener("click", function () {
        addTool(token);
    })
}

main();