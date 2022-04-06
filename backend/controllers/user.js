const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config()

const models = require('../models')
const User = models.User;

// Enregistrement d'un compte
exports.signup = (req, res, next) => {
    // Crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création d'un nouvel utilisteur (mail + mot de passe)
        const user = new User({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
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
                userId: user._id,
                // Encode un nouveau token grâce à jswonwebtoken
                token: jwt.sign(
                    { userId: user._id },
                    'SECRET_TOKEN',
                    { expiresIn: '6h' } // Reconnexion dans 6h
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Modification de l'utilisateur
exports.updateUser = (req, res) => {
    User.findOne({ where: { id: req.body.userId } })
        .then(user => {
            if(req.body.oldPassword && req.body.newPassword) {
                bcrypt.compare(req.body.oldPassword, user.password)
                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({ error: 'Le mot de passe saisi ne correspond pas au mot de passe actuel'})
                        } else {
                            bcrypt.hash(req.body.newPassword, 10)
                                .then(newHash => {
                                    User.update(
                                        { password: newHash },
                                        { where: { id: req.body.userId } }
                                    );
                                    res.status(201).json({ message: 'Mot de passe modifié'})
                                })
                                .catch(error => res.status(500).json({ error }))
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }
            if(req.body.lastname && req.body.lastname != user.lastname) {
                User.update(
                    { lastname: req.body.lastname},
                    { where: { id: req.body.userId } }
                );
                res.status(201).json({ message: 'Nom modifié'})
            };
            if(req.body.firstname && req.body.firstname != user.firstname) {
                User.update(
                    { firstname: req.body.firstname},
                    { where: { id: req.body.userId } }
                );
                res.status(201).json({ message: 'Prénom modifié'})
            };
        })
        .catch(error => res.status(500).json({ error }));
};

// Suppression de l'utilisateur
exports.deleteUser = (req, res, next) => {
    User.findOne ({ where: { id:  req.params.id } })
        .then(user => {
            if(user!= null){
                if (user.image != null) {
                    const filename = user.image.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) {
                            console.log("Error");
                        }
                    });
                } 
                User.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                .catch(error =>{ console.log(error); res.status(400).json({ message : error.message })});
            }
            else{ console.log("Utilisateur non trouvé");
                res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
            }
        } ).catch(error => {  res.status(500).json({ message : error.message }) })
};

// Récupération d'un utilisateur
exports.getOneUser = (req, res) => {
    const userId = req.params.id;
    User.findOne({
        attributes: ['id', 'email', 'nom', 'prenom', 'image'],
        where: { id: userId }
    }).then((user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
        }
    }).catch(err => res.status(500).json({ err }))
};

// Récupération de tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    console.log("get all users" + JSON.stringify(req.body));
    User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(400).json(error))
};