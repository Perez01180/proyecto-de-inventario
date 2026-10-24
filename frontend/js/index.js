import { getMyUser, getToken, deleteSession, getUsers, getTools, getOrders, createOrder, getOrderById, completeOrderById } from "./utils.js";
//Se arregló de sumar la cantidad si se añade otra herramienta en el pedido y falta completar el boton de completar pedido
async function completeOrder(id, token) {
    const orderData = await getOrderById(id, token);
    const toolsData = orderData.payload.tools
    console.log(toolsData)

    Swal.fire({
        title: "Completar pedido",
        theme: "dark",
        html: `
            <div class="row g-3 text-start p-5">
                ${toolsData.map(function (tool) {
            return `
                        <div class = "col-12 row">
                            <div class = "col-6 ">
                                <p class="form-control">${tool.name}</p> 
                            </div>
                            
                            <div class = "col-6">
                                <p  class="form-control">${tool.quantityOrder}</p>
                            </div>
                        </div>
                        `
        })
            }


            </div>
        
        `,
        showConfirmButton: true,
        showCancelButton: true,

    }).then(async function (result) {
        if (result.isConfirmed) {
            const response = await completeOrderById(id, token);
            window.location = "/index.html"
            console.log(response)
        }
    })

}


async function createTableOrders(token) {
    const orders = await getOrders(token);
    const ordersList = document.getElementById("ordersList");
    let finalOrdersList = ""
    orders.payload.forEach(function (order) {
        let rowTable = ""
        order.tools.forEach(function (tool) {
            rowTable += `
                <tr>
                    <td class="ps-3 text-light">${tool.name}</td>
                    <td class="text-center text-muted">${tool.brand}</td>
                    <td class="text-end text-muted pe-3">${tool.quantityOrder}</td>
                    <td class="text-end text-light fw-medium pe-3">${tool.state}</td>
                </tr>
            `
        })
        finalOrdersList += `
            <div class="accordion-item mb-3 border border-secondary shadow">
                <h2 class="accordion-header" id="heading${order.id}">
                    <button class="accordion-button collapsed py-3" type="button" data-bs-toggle="collapse"
                        data-bs-target="#pedido${order.id}" aria-expanded="true" aria-controls="pedido${order.id}">

                        <div class="d-flex gap-4 align-items-center w-100 pe-3 text-light-emphasis">
                            <p class="mb-0 text-light">${order.user.name}</p>
                            <p class="mb-0">-</p>
                            <p class="mb-0">${order.teacher.name}</p>
                            <p class="mb-0">-</p>
                            <p class="mb-0 text-info fw-semibold">${order.state}</p>
                            <p class="mb-0">-</p>
                            <p class="mb-0">${order.createdAt}</p>
                        </div>
                    </button>
                </h2>
                
                <div id="pedido${order.id}" class="accordion-collapse collapse" aria-labelledby="heading${order.id}"
                    data-bs-parent="#ordersList">
                    <div class="accordion-body bg-body-tertiary border-top border-secondary">
                        <h6 class="mb-3 text-muted">Detalle del pedido : </h6>
                        <div id="tabla${order.id}" class="table-responsive shadow-sm mb-3 rounded border border-secondary">
                            <table class="table table-dark table-hover align-middle mb-0"
                                style="--bs-table-bg: var(--bs-body-bg);">
                                <thead
                                    class="table-group-divider border-secondary text-light-emphasis small text uppercase">
                                    <tr>
                                        <th scope="col" class="ps-3">Herramienta</th>
                                        <th scope="col" class="text-center">Marca</th>
                                        <th scope="col" class="text-end pe-3">Cantidad</th>
                                        <th scope="col" class="text-end pe-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody class="table-group-divider border-secondary">
                                    ${rowTable}
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex justify-content-between align-items-center pt-2">
                            <button class="btn btn-sm btn-outline-light complete-order-btn" data-id="${order.id}">Completar pedido</button>
                        </div>
                        
                    </div>
                </div>

            </div>
        `
    })
    ordersList.innerHTML = finalOrdersList
    ordersList.querySelectorAll(".complete-order-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            completeOrder(button.dataset.id, token);
        });
    });

    const collapseElementList = ordersList.querySelectorAll('.collapse');
    collapseElementList.forEach(collapseEl => {
        new bootstrap.Collapse(collapseEl, { toggle: false });
    });
}

async function addOrder(token) {
    const usersList = await getUsers(token);
    const toolsList = await getTools(token);
    const selectedTools = [];

    Swal.fire({
        title: "Añadir herramienta",
        theme: "dark",
        html: `
            <div class="row g-3 text-start">
                <div class="col-12">
                    <label class="form-label text-secondary" for="swal-teacher"  >Nombre del profesor</label>
                    <input id = "swal-teacher" class="form-control" list= "usersList" placeholder = "nombre...">
                    <datalist id = "usersList" >
                        ${usersList.map(function (user) {
            return `<option value="${user.name} ${user.lastname}"></option>`
        }).join("")}
                    </datalist>
                </div>
                <div class="col-12">
                    <label class="form-label text-secondary" for="swal-tool"  >Nombre de la herramienta</label>
                    <input id = "swal-tool" class="form-control" list= "toolsList" placeholder = "nombre...">
                    <datalist id = "toolsList" >
                        ${toolsList.payload.map(function (tool) {
            return `<option value="${tool.name}"></option>`
        }).join("")}
                    </datalist>
                    <label class = "form-label mt-3"> Cantidad </label>
                    <input id="quantity" type="number" class="form-control" min = "1" value = "1">
                    <button id ="addTool" type = "button" class="btn btn-primary mt-3" > Agregar herramienta </button>
                    <div id = "selectedTools" class = "mt-3">
                    
                    </div>

                </div>

                
            </div>
        `,
        showConfirmButton: true,
        showCancelButton: true,

        ConfirmButtonText: "Crear pedido",
        cancelButtonText: "cancelar",
        didOpen: function () {
            document.getElementById("addTool").addEventListener("click", function () {
                const name = document.getElementById("swal-tool").value;
                const quantity = Number(document.getElementById("quantity").value);
                const tool = toolsList.payload.find(function (tooldata) {
                    return tooldata.name === name
                })
                const foundTool = selectedTools.findIndex(function (tooldata) {
                    return tooldata.toolId === tool.id
                })
                if (foundTool === -1) {
                    selectedTools.push({
                        toolId: tool.id,
                        quantityOrder: quantity
                    })
                } else {
                    selectedTools[foundTool].quantityOrder += quantity
                }
                const divSelectedTools = document.getElementById("selectedTools")
                divSelectedTools.innerHTML = "";

                selectedTools.forEach(function (tooldata) {
                    const tool = toolsList.payload.find(function (t) {
                        return t.id === tooldata.toolId
                    })
                    divSelectedTools.innerHTML +=
                        `
                    <p class = "border-bottom py-2">${tool.name} - x ${tooldata.quantityOrder}</p>
                    `
                })



            })
        },

        preConfirm: function () {
            const fullName = document.getElementById("swal-teacher").value;
            const teacher = usersList.find(function (user) {
                return `${user.name} ${user.lastname}` === fullName
            })
            return {
                teacherId: teacher.id,
                tools: selectedTools,
                state: "pendiente"
            }
        }

    }).then(async function (result) {
        if (result.isConfirmed) {
            const newOrder = result.value;
            const response = await createOrder(newOrder, token)

            if (response.status == "error") {
                Swal.fire({
                    title: "ERROR",
                    theme: "dark",
                    text: "Faltó completar campos",
                    icon: "warning"
                })
                return;
            }
            window.location = "/index.html";


        }
    })

}

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

        createTableOrders(token);
    }

    const buttonAddOrder = document.getElementById("buttonAddOrder");
    buttonAddOrder.addEventListener("click", function () {
        addOrder(token);
    })
}
main();