const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const User = require('../models/user')
const Post = require('../models/post')

// REGEX
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

// Enregistrement d'un compte
exports.signup = (req, res, next) => {
    // Crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création d'un nouvel utilisteur (mail + mot de passe)
        const user = new User({
            email: email,
            password: hash,
            nom: nom,
            prenom: prenom,
            image: req.body.image || "",
            role: 1
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
    User.findOne({ email: req.body.email })
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
                    { expiresIn: '24h' } // Reconnexion dans 24h
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Suppression utilisateur
exports.deleteUser = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwt.getUserId(headerAuth);
    const role = jwt.getRoleUser(headerAuth);

    if (userId == req.params.id || role == 0) {

       // User.findOne({ where: { id: req.params.id } })
        User.findOne({ where: { id:  req.params.id } })
            .then(user => {
               // console.log("user FindOne    " + user.id)
                if(user!= null){

                    if (user.image != null) {
                        const filename = user.image.split('/images/profiles/')[1];
                        fs.unlink(`images/profiles/${filename}`, (error) => {
                           // console.log(error.message);
                            });
                    } 

                    User.destroy({ where: { id: req.params.id } })
                   // User.destroy({ where: { id: user.id } })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                    .catch(error =>{ console.log(error); res.status(400).json({ message : error.message })});
            
                }
               else{  console.log("user not found");
                res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
               }
             } ).catch(error => {  res.status(500).json({ message : error.message }) })

    } else {
        res.status(403).json({ message: 'Action non autorisé !' });
    }
    };


////// DISPLAY ONE USER

exports.getOneUser = (req, res, next) => {
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


////// DISPLAY ALL USERS

exports.getAllUsers = (req, res, next) => {
    console.log("get all users" + JSON.stringify(req.body));
    User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(400).json(error))
};

////// MODIFY USER AND UPDATE
exports.modifyUser = (req, res, next) => {
    console.log("modif info users" + JSON.stringify(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

    const email = req.body.email
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const image = req.file ? `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}` : null;
   // const image = `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`;
   
    
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

                // UPDATE PROFILE, new info
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
                        res.status(500).json({ 'erreur': 'Impossible de mettre a jour le profil de l\'utilisateur' })
                    }
                })
                .catch(() => {
                    res.status(500).json({ 'erreur': 'impossible de mettre à jour l\'utilisateur' })
                });
            } else {
                res.status(404).json({ 'erreur': 'Utilisateur introuvable !' })
            }
        })
        .catch(() => {
            res.status(500).json({ 'erreur': 'impossible de vérifier l\'utilisateur' })
        })
    
}


//MODIFY PASSWORD
exports.modifyPassword = (req, res, next) => {
    console.log("modif password" + JSON.stringify(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

User.findOne({ where: { id: userId } })
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
                                .catch(() => res.status(400).json({message: "imposible de modifier mot de pass" }));

                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        }})
        .catch(error => res.status(500).json({ error }));
}