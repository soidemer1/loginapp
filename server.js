const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.log("Error al conectar MySQL:", err);
        return;
    }

    console.log("Conectado a MySQL");
});

const bcrypt = require("bcrypt");

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hash],
        (err) => {

            if (err) {
                return res.json({
                    message: "Error o usuario ya existe"
                });
            }

            res.json({
                message: "Usuario registrado correctamente"
            });
        }
    );

});


const session = require("express-session");

app.use(session({
    secret: "clave_secreta_loginapp",
    resave: false,
    saveUninitialized: false
}));

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
            if (err) {
                return res.json({ success: false, message: "Error en el servidor" });
            }

            if (results.length === 0) {
                return res.json({ success: false, message: "Usuario no encontrado" });
            }

            const user = results[0];
            const bcrypt = require("bcrypt");
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.json({ success: false, message: "Contraseña incorrecta" });
            }

            req.session.userId = user.id;
            req.session.username = user.username;

            res.json({ success: true, message: "Login correcto" });
        }
    );
});



app.get("/check-session", (req, res) => {

    if (req.session.userId) {

        return res.json({
            loggedIn: true
        });

    }

    res.json({
        loggedIn: false
    });

});


app.post("/save-phone", (req, res) => {

    if (!req.session.userId) {
        return res.json({
            success: false,
            message: "No autorizado"
        });
    }

    const { phone } = req.body;

    db.query(
        "UPDATE users SET phone = ? WHERE id = ?",
        [phone, req.session.userId],
        (err) => {

            if (err) {
                return res.json({
                    success: false,
                    message: "Error al guardar"
                });
            }

            res.json({
                success: true,
                message: "Teléfono guardado"
            });

        }
    );

});

app.post("/save-favorites", (req, res) => {

    if (!req.session.userId) {
        return res.json({
            success: false
        });
    }

    const { favorites } = req.body;

    db.query(
        "UPDATE users SET favorite_numbers = ? WHERE id = ?",
        [favorites, req.session.userId],
        (err) => {

            if (err) {
                return res.json({
                    success: false
                });
            }

            res.json({
                success: true
            });

        }
    );

});


app.get("/admin/users", (req, res) => {

    if (
        !req.session.username ||
        req.session.username !== "anthony.remediosa78@gmail.com"
    ) {
        return res.status(403).json({
            error: "Acceso denegado"
        });
    }

    db.query(
        `
        SELECT
            username,
            phone,
            favorite_numbers,
            created_at
        FROM users
        `,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: "Error servidor"
                });
            }

            res.json(results);

        }
    );

});


app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login.html");

    });

});


app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});