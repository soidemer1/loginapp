async function registrar() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const datos = await respuesta.json();

    document.getElementById("mensaje").innerText =
        datos.message;

    if (datos.message === "Usuario registrado correctamente") {

        setTimeout(() => {

            window.location.href = "/login.html";

        }, 2000);

    }
}