async function verificarSesion() {

    const respuesta = await fetch("/check-session");

    const datos = await respuesta.json();

    if (!datos.loggedIn) {
        window.location.href = "/login.html";
    }

}

verificarSesion();

async function guardarTelefono() {

    const phone =
        document.getElementById("phone").value;

    const respuesta = await fetch("/save-phone", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phone
        })
    });

    const datos = await respuesta.json();

    document.getElementById("phoneMessage")
        .innerText = datos.message;

    if (datos.success) {

        document.getElementById("phoneSection")
            .style.display = "none";

        document.getElementById("favoritesSection")
            .style.display = "block";
    }
}

async function guardarFavoritos() {

    const favorites =
        document.getElementById("favorites").value;

    const respuesta = await fetch("/save-favorites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            favorites
        })
    });

    const datos = await respuesta.json();

    if (datos.success) {

        document.body.innerHTML = `
            <h1>Gracias.</h1>
            <p>Tu información fue recibida.</p>
        `;
    }
}