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
    models.Comment.findByPk(req.params.id)
    .then(comment => res.status(200).json(comment))
    .catch(error => res.status(400).json({error}));
};

// Affichage de tous les commentaires
exports.getAllComments = (req, res) => {
    models.Comment.findAll({  
        
    })
    .then(comment => res.status(200).json(comment))
    .catch(error => res.status(400).json({error}))
};

// Suppression d'un commentaire
exports.deleteComment = (req, res) => {
    models.Comment.findOne({
        where: { postId: req.body.postId },
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