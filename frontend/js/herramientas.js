import { getToken, getMyUser, getTools, createTool } from "./utils.js";

function addTool(token) {
    Swal.fire({
        title: "Añadir herramienta",
        theme: "dark",
        html: `
            <input id = "swal-name" placeholder = "nombre de herramienta">
            <select id = "swal-state" placeholder = "Estado de la herramienta">
                <option value = "malo">Malo</option>
                <option value = "normal" selected>Normal</option>
                <option value = "muy_bueno">Muy bueno</option>
            </select>
            <select id = "swal-available" placeholder = "Herramientas disponibles">
                <option value = "true" selected>Disponible</option>
                <option value = "false">No disponible</option>
            </select>
            <input id = "swal-quantity" placeholder = "Cantidad de herramientas">
            <input id = "swal-brand" placeholder = "Marca de la herramienta">
            <input id = "swal-section" placeholder = "Sección de la herramienta">
            <input id = "swal-serialized" placeholder = "Serialización de la herramienta">

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
            return {
                name,
                state,
                available,
                quantity,
                brand,
                section,
                serialized
            }
        }
    }).then(async function (result){
        if(result.isConfirmed){
            const newTool = result.value;
            const response = await createTool(newTool, token);
            if(response.status == "error"){
                Swal.fire({
                    title : "ERROR",
                    theme : "dark",
                    text : "Faltó completar campos",
                    icon : "warning"
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
    
    if(myUserData.payload.role === "user"){
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

        nameCell.textContent = tool.name
        stateCell.textContent = tool.state
        available.textContent = tool.available
        quantity.textContent = tool.quantity
        brand.textContent = tool.brand
        section.textContent = tool.section
        serialized.textContent = tool.serialized

        row.append(nameCell, stateCell, available, quantity, brand, section, serialized);

        toolsList.appendChild(row);
    });

    //agregar herramienta nueva
    const buttonAddTool = document.getElementById("buttonAddTool");
    buttonAddTool.addEventListener("click", function () {
        addTool(token);
    })
}

main();