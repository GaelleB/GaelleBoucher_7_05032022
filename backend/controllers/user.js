const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config()

// Models
const models = require('../models')
const User = models.User;

// Enregistrement d'un compte
exports.signup = (req, res, next) => {
    // Crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création d'un nouvel utilisateur (mail + mot de passe)
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: hash
        });
        // Enregistrement de l'utilisateur 
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
    })
    // Erreur server
    .catch(error => res.status(500).json({ error }));
};

// Connexion au compte
exports.login = (req, res, next) => {
    console.log(req.body.email)
    console.log(req.body.password)
    User.findOne ({  where: { email: req.body.email } })
        .then(user => {
            console.log(user)
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparaison du mot de passe entré avec celui enregistré
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Contient l'identifiant de l'utilisateur et un token
            res.status(200).json({ 
                userId: user.id,
                // Encode un nouveau token grâce à jswonwebtoken
                token: jwt.sign(
                    { userId: user.id },
                    'SECRET_TOKEN',
                    { expiresIn: '24h' } // Reconnexion dans 24h
                )
            });
            console.log(user._id)
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Affichage d'un utilisateur
exports.getOneUser = (req, res) => {
    models.User.findByPk(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({error}))
};

// Affichage de tous les utilisateurs
exports.getAllUsers = (req, res) => {
    models.Post.findAll({  
        order: [["id", "DESC"]],
    })
    .then( user => res.status(200).json(user))
    .catch( error => res.status(400).json({error}))
};

// Modification de l'utilisateur
exports.modifyUser = (req, res, next) => {
    const userId = req.params.id;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const role = req.body.role;

    models.User.findOne({
        where: { id: userId },
    })
    .then((user) => {
        user.update({
            nom: nom,
            prenom: prenom,
            email: email,
            role: role,
        })
        .then((user) => {
            if (user) return res.status(201).json(user);
            else return res
            .status(500)
            .json({ error: "Mise à jour du profil impossible" });
        })
        .catch(() => {
            res.status(500).json({ error: "Mise à jour impossible" });
        });
    })
    .catch(() => res.status(500).json({ error: "Vérification impossible" }));
};

// Gestion de l'image
exports.uploadImage = (req, res, next) => {
    const userId = req.user.userId;
    
    models.User.findOne({
        where: { id: userId },
    })
        .then((user) => {
        if (user.image !== null) {
        const filename = user.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            user.update(
            {
                image: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            },
            { where: { id: userId } }
        )
            .then(() =>
                res.status(200).json({ message: "Photo de profil mise à jour !" })
            )
            .catch((error) =>
                res.status(400).json({ error: "Modification impossible" })
            );
        })
        } else{
            user.update(
            {
                image: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            },
            { where: { id: userId } }
        )
            .then(() =>
                res.status(200).json({ message: "Photo de profil mise à jour !" })
            )
            .catch((error) =>
                res.status(400).json({ error: "Modification impossible" })
            );
        }
    })
    .catch((error) => {
        res.status(500).json({ error: "Vérification impossible" });
    });
};

// Suppression de l'utilisateur
exports.deleteUser = (req, res, next) => {
    User.findOne ({ where: { id:  req.params.id } })
        .then(user => {
            if(user!= null){
                if (user.image != null) {
                    const filename = user.image.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (error) => {});
                } 
                User.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                .catch(error =>{ console.log(error); res.status(400).json({ message : error.message })});
            }
            else{  console.log("user not found");
                res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
            }
        } ).catch(error => {  res.status(500).json({ message : error.message }) })
};