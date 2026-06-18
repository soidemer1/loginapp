async function cargarUsuarios() {

    const respuesta =
        await fetch("/admin/users");

    const usuarios =
        await respuesta.json();

    const tabla =
        document.getElementById("tablaUsuarios");

    tabla.innerHTML = "";

    usuarios.forEach(usuario => {

        tabla.innerHTML += `
            <tr>
                <td>${usuario.username}</td>
                <td>${usuario.phone || ""}</td>
                <td>${usuario.favorite_numbers || ""}</td>
                <td>${usuario.created_at}</td>
            </tr>
        `;

    });

}

cargarUsuarios();