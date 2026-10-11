import { getMyUser, getToken, deleteSession, getOrders } from "./utils.js";

async function createTableOrders(token) {
    const orders = await getOrders(token);
    console.log(orders);
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
                            <button class="btn btn-sm btn-outline-light">Completar pedido</button>
                        </div>
                        
                    </div>
                </div>

            </div>
        `
    })
    ordersList.innerHTML = finalOrdersList
    const collapseElementList = ordersList.querySelectorAll('.collapse');
    collapseElementList.forEach(collapseEl => {
        new bootstrap.Collapse(collapseEl, { toggle: false });
    });
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
}
main();