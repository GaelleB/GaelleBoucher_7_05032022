const models = require('../models/');

// Création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        userId: req.body.userId,
        content: req.body.content,
        postId: req.body.postId
    };
    models.Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé !" }))
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'un commentaire
exports.getOneComment = (req, res) => {
    const postId = req.params.id;
    models.Comment.findOne({
        where: { id: postId},
        include: [
            {
                model: models.User,
                as: "User",
                attributes: [ "prenom", "nom"],
            },
            {
                model : models.Post,
                as: "Post",
                attributes: [ "title", "content"],
            }
        ]
    })
    .then(comment => res.status(200).json(comment))
    .catch(error => res.status(400).json({error}));
};

// Affichage de tous les commentaires
exports.getAllComments = (req, res, next) => {
    models.Comment.findAll({
        include: [
            {
                model: models.User,
                as: "User",
                attributes: [ "prenom", "nom"],
            },
            {
                model : models.Post,
                as: "Post",
                attributes: [ "title", "content"],
            }
        ],
        order: [["createdAt", "DESC"]],
    })
    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

// Suppression d'un commentaire
exports.deleteComment = (req, res) => {
    models.Comment.findOne({
        where: { id: req.params.id },
        include: [{ model : models.User }],
    })
    .then(Comment => {
        if (Comment.userId || role === 0) 
        {
            models.Comment.destroy({ where: { id: req.params.id } })
            res.status(200).json({message : 'Commentaire supprimé !'})
        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};