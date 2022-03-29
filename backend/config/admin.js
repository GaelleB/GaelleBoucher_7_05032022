const db = require("../models");
const bcrypt = require("bcrypt");
// Création du compte admin
function setAdmin(req, res) {
    db.User.findOne({ where: { email: "admin@mail.com" } || { pseudo: "admin" } })
        .then((user) => {
        if (!user) {
            bcrypt
            .hash("Moderator", 10)
            .then((hash) => {
                const admin = db.User.create({
                pseudo: "admin",
                email: "admin@mail.com",
                password: hash,
                admin: true,
                })
                .then((admin) => {
                    console.log({
                        admin,
                        message: `Votre compte admin est bien créé ${admin.pseudo} !`,
                    });
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
            })
            .catch((error) => {
                res.status(500).send({ error });
            });
        } else {
            console.log({ message: "Le compte admin est déjà créé" });
        }
        })
        .catch((error) => {
        console.log({ error });
        });
}
module.exports = setAdmin();