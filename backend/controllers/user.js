const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config()

const models = require('../models')
const User = models.User;

// Regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

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
exports.modifyUser = (req, res, next) => {
    console.log("modif info users" + JSON.stringify(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwt.getUserId(headerAuth);
    const role = jwt.getRoleUser(headerAuth);
    const email = req.body.email
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const image = req.file ? `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}` : null;
    User.findOne({
        attributes: ['id', 'email', 'nom', 'prenom', 'image'],
        where: { id: userId }
    })
        .then(user => {
            if(userId === user.id || role === 0) {
                if(image != null) {
                    const filename = user.image.split('/images/profiles')[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if(error){
                            console.log("Echec de suppression de l'image : " + error);
                        } else {
                            console.log("Image supprimée avec succès !");
                        };
                    });
                };
                // Mise à jour du profile
                user.update({
                    email: (email ? email : user.email),
                    nom: (nom ? nom : user.nom),
                    prenom: (prenom ? prenom : user.prenom),
                    image: (image ? image : user.image)
                })
                .then(user => {
                    if(userId === user.id || role === 0){
                        return res.status(201).json(user)
                    } else {
                        res.status(500).json({ 'erreur': 'Impossible de mettre à jour le profil de l\'utilisateur' })
                    }
                })
                .catch(() => {
                    res.status(500).json({ 'erreur': 'Impossible de mettre à jour l\'utilisateur' })
                });
            } else {
                res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
            }
        })
        .catch(() => {
            res.status(500).json({ 'erreur': 'Impossible de vérifier l\'utilisateur' })
        })
}

// Modification du mot de passe
exports.modifyPassword = (req, res, next) => {
    console.log("modif password" + JSON.stringify(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwt.getUserId(headerAuth);
    const role = jwt.getRoleUser(headerAuth);
    User.findOne ({ where: { id: userId } })
        .then(user => {
            if(userId === user.id || role === 0) {
            controle.log('oldPasword   ' + req.body.oldPassword),
            controle.log('new pssaword    ' + user.password)
            bcrypt.compare(req.body.oldPassword, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json("Mot de passe actuel incorrect");
                    }
                    if (!schema.validate(req.body.password)) {
                        return res.status(401).json('Le nouveau mot de passe doit avoir une longueur de 3 à 50 caractères avec au moins un chiffre, une minuscule, une majuscule !!!')
                    }
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const newPassword = {
                                password: hash
                            };
                            user.update(newPassword, { where: { id: req.params.id } })
                            console.log('newpass   ' + newPassword)
                                .then(() => { res.status(201).json({ message: 'Mot de passe modifié !' }) })
                                .catch(() => res.status(400).json({message: "imposible de modifier le mot de passe" }));
                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        }})
        .catch(error => res.status(500).json({ error }));
}

// Suppression de l'utilisateur
exports.deleteUser = (req, res, next) => {
    User.findOne ({ where: { id:  req.params.id } })
        .then(user => {
            if(user!= null){
                if (user.image != null) {
                    const filename = user.image.split('/images/profiles/')[1];
                    fs.unlink(`images/profiles/${filename}`, (error) => {});
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

// Affichage d'un utilisateur
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
}

// Affichage de tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(400).json(error))
};