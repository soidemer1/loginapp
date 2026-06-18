async function iniciarSesion() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const datos = await respuesta.json();

    document.getElementById("mensaje").innerText = datos.message;

    if (datos.success) {
        window.location.href = "/dashboard.html";
    }
}